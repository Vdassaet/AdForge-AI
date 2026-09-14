import { NextResponse } from "next/server";

// In-Memory Idempotency Cache (Bounded to 10,000 events to prevent memory leaks)
const processedEventIds = new Set<string>();
const MAX_IDEMPOTENCY_CACHE_SIZE = 10000;
const TIMESTAMP_TOLERANCE_SECONDS = 300; // 5 minutes

function recordProcessedEvent(eventId: string): boolean {
  if (processedEventIds.has(eventId)) {
    return false; // Already processed
  }

  // Prune oldest entries if cache exceeds boundary
  if (processedEventIds.size >= MAX_IDEMPOTENCY_CACHE_SIZE) {
    const firstKey = processedEventIds.values().next().value;
    if (firstKey) processedEventIds.delete(firstKey);
  }

  processedEventIds.add(eventId);
  return true;
}

/**
 * Stripe Webhook Endpoint
 * 
 * SECURITY & SCALING:
 * - Verifies webhook signatures using STRIPE_WEBHOOK_SECRET
 * - Prevents replay attacks via 300s timestamp drift validation
 * - Enforces idempotency to avoid duplicate billing mutations
 * - Fast acknowledgement (<200ms) to satisfy Stripe retry SLA
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // Verify Stripe webhook signature using crypto HMAC-SHA256
  try {
    const sigHeaderParts = Object.fromEntries(
      signature.split(",").map((part) => part.trim().split("="))
    );
    const timestamp = sigHeaderParts.t;
    const v1Signature = sigHeaderParts.v1;

    if (!timestamp || !v1Signature) {
      return NextResponse.json({ error: "Invalid signature format" }, { status: 400 });
    }

    // 1. Replay attack prevention: verify timestamp within 300-second window
    const eventTime = parseInt(timestamp, 10);
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (isNaN(eventTime) || Math.abs(nowSeconds - eventTime) > TIMESTAMP_TOLERANCE_SECONDS) {
      console.warn("[Stripe Webhook] Timestamp outside tolerance window (replay protection triggered)");
      return NextResponse.json({ error: "Timestamp outside tolerance window" }, { status: 400 });
    }

    const signedPayload = `${timestamp}.${body}`;
    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedPayload, "utf8")
      .digest("hex");

    if (v1Signature !== expectedSignature) {
      console.warn("[Stripe Webhook] Invalid signature match");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } catch (sigErr) {
    console.error("[Stripe Webhook] Signature verification failed:", sigErr);
    return NextResponse.json({ error: "Signature verification error" }, { status: 400 });
  }

  try {
    const event = JSON.parse(body);

    // 2. Idempotency enforcement: ignore duplicate deliveries from Stripe
    if (event.id && !recordProcessedEvent(event.id)) {
      console.log(`[Stripe Webhook] Deduplicated event ${event.id} already handled.`);
      return NextResponse.json({ received: true, deduplicated: true });
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        // Update subscription record in DB
        console.log(`[Stripe] Subscription ${event.type}`, event.data?.object?.id);
        break;
      case "customer.subscription.deleted":
        // Downgrade to free plan
        console.log("[Stripe] Subscription canceled", event.data?.object?.id);
        break;
      case "invoice.payment_succeeded":
        console.log("[Stripe] Payment succeeded");
        break;
      case "invoice.payment_failed":
        // Send notification to user
        console.log("[Stripe] Payment failed — notify user");
        break;
      default:
        console.log(`[Stripe] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Stripe Webhook] Error processing event:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
