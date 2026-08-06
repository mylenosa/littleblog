import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Entrar</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="text-primary hover:underline">
          Cadastre-se
        </Link>
        .
      </p>
      <LoginForm />
    </>
  );
}
