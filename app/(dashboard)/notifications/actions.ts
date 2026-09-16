"use server";

import { notificationService } from "@/lib/services/notifications";
import { revalidatePath } from "next/cache";
import { getAuthContext } from "@/lib/auth/auth-context";

export async function getNotificationsAction() {
  await getAuthContext(); // Auth guard
  return await notificationService.getNotifications();
}

export async function markAsReadAction(id: string) {
  await getAuthContext(); // Auth guard
  await notificationService.markAsRead(id);
  revalidatePath("/notifications");
  revalidatePath("/");
}

export async function markAllAsReadAction() {
  await getAuthContext(); // Auth guard
  await notificationService.markAllAsRead();
  revalidatePath("/notifications");
  revalidatePath("/");
}
