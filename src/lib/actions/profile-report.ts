"use server";

import { contactSchema } from "@/lib/validations/contact.schema";
import { createClient } from "@/lib/supabase/server";

export type ReportProfileResult =
  | { success: true }
  | { success: false; message: string };

export async function reportProfile(input: {
  username: string;
  reporterName: string;
  reporterEmail: string;
  message: string;
}): Promise<ReportProfileResult> {
  const parsed = contactSchema.safeParse({
    name: input.reporterName,
    email: input.reporterEmail,
    subject: `Denúncia de perfil: @${input.username}`,
    message: input.message,
  });

  if (!parsed.success) {
    return { success: false, message: "Verifique os campos e tente novamente." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);

  if (error) {
    return {
      success: false,
      message: "Não foi possível enviar a denúncia. Tente novamente.",
    };
  }

  return { success: true };
}
