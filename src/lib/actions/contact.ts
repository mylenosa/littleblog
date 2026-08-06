"use server";

import { contactSchema, type ContactInput } from "@/lib/validations/contact.schema";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);

  if (error) {
    return {
      success: false,
      message: "Não foi possível enviar sua mensagem. Tente novamente.",
    };
  }

  return { success: true };
}
