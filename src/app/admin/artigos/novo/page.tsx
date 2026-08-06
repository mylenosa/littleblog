import type { Metadata } from "next";
import { ArticleForm } from "@/components/admin/article-form";
import { getAuthState } from "@/lib/supabase/auth-state";

export const metadata: Metadata = {
  title: "Novo artigo",
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default async function NovoArtigoPage() {
  const { profile } = await getAuthState();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Novo artigo</h1>
      <ArticleForm
        mode="create"
        defaultValues={{
          title: "",
          slug: "",
          summary: "",
          content: "",
          tags: "",
          authorName: profile?.fullName ?? "",
          coverImageUrl: "",
          publishedAt: todayIso(),
        }}
      />
    </div>
  );
}
