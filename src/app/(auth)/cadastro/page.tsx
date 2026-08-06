import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/forms/signup-form";

export const metadata: Metadata = {
  title: "Cadastrar",
};

export default function CadastroPage() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Criar conta</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Entrar
        </Link>
        .
      </p>
      <SignupForm />
    </>
  );
}
