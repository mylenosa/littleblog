"use server";

import { contactSchema, type ContactInput } from "@/lib/validations/contact.schema";

export type ContactActionResult =
  | { success: true }
  | { success: false; message: string };

export async function submitContactMessage(
  input: ContactInput
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "Verifique os campos e tente novamente." };
  }

  return { success: true };
}
