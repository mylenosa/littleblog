import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().trim().email("Informe um e-mail válido."),
  subject: z.string().trim().min(3, "Informe um assunto."),
  message: z
    .string()
    .trim()
    .min(10, "Escreva uma mensagem com pelo menos 10 caracteres.")
    .max(5000, "Mensagem muito longa."),
});

export type ContactInput = z.infer<typeof contactSchema>;
