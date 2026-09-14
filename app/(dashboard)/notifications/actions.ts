"use server";

import { notificationService } from "@/lib/services/notifications";
import { revalidatePath } from "next/cache";

export async function getNotificationsAction() {
  return await notificationService.getNotifications();
}

export async function markAsReadAction(id: string) {
  await notificationService.markAsRead(id);
  revalidatePath("/notifications");
  revalidatePath("/");
}

export async function markAllAsReadAction() {
  await notificationService.markAllAsRead();
  revalidatePath("/notifications");
  revalidatePath("/");
}
