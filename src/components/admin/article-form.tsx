"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  articleFormSchema,
  type ArticleFormInput,
} from "@/lib/validations/article-form.schema";
import { createArticle, deleteArticle, updateArticle } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";

export function ArticleForm({
  mode,
  originalSlug,
  defaultValues,
}: {
  mode: "create" | "edit";
  originalSlug?: string;
  defaultValues: ArticleFormInput;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormInput>({
    resolver: zodResolver(articleFormSchema),
    defaultValues,
  });

  const coverImageUrl = watch("coverImageUrl");
  const content = watch("content");

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) {
      setValue("slug", slugify(event.target.value));
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}`;

    const { error } = await supabase.storage
      .from("article-covers")
      .upload(path, file);

    if (error) {
      toast.error("Não foi possível enviar a imagem.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("article-covers").getPublicUrl(path);
    setValue("coverImageUrl", data.publicUrl);
    setUploading(false);
  }

  async function onSubmit(data: ArticleFormInput) {
    const result =
      mode === "create"
        ? await createArticle(data)
        : await updateArticle(originalSlug!, data);

    if (result.success) {
      toast.success(mode === "create" ? "Artigo criado." : "Artigo atualizado.");
      router.push("/admin");
    } else {
      toast.error(result.message);
    }
  }

  async function handleDelete() {
    if (!originalSlug) return;
    setIsDeleting(true);
    const result = await deleteArticle(originalSlug);
    setIsDeleting(false);

    if (result.success) {
      toast.success("Artigo excluído.");
      router.push("/admin");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          aria-invalid={!!errors.title}
          {...register("title", { onChange: handleTitleChange })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          aria-invalid={!!errors.slug}
          {...register("slug", { onChange: () => setSlugTouched(true) })}
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">Resumo</Label>
        <Textarea
          id="summary"
          rows={2}
          aria-invalid={!!errors.summary}
          {...register("summary")}
        />
        {errors.summary && (
          <p className="text-sm text-destructive">{errors.summary.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="authorName">Autor</Label>
          <Input
            id="authorName"
            aria-invalid={!!errors.authorName}
            {...register("authorName")}
          />
          {errors.authorName && (
            <p className="text-sm text-destructive">{errors.authorName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publishedAt">Data de publicação</Label>
          <Input
            id="publishedAt"
            type="date"
            aria-invalid={!!errors.publishedAt}
            {...register("publishedAt")}
          />
          {errors.publishedAt && (
            <p className="text-sm text-destructive">{errors.publishedAt.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input id="tags" aria-invalid={!!errors.tags} {...register("tags")} />
        {errors.tags && (
          <p className="text-sm text-destructive">{errors.tags.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cover">Imagem de capa</Label>
        <Input id="cover" type="file" accept="image/*" onChange={handleFileChange} />
        {uploading && (
          <p className="text-sm text-muted-foreground">Enviando imagem...</p>
        )}
        {coverImageUrl && (
          <div className="relative mt-1 aspect-video w-full max-w-xs overflow-hidden rounded-lg border border-border">
            <Image
              src={coverImageUrl}
              alt="Pré-visualização da capa"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Conteúdo (Markdown)</Label>
        <Tabs defaultValue="editar">
          <TabsList>
            <TabsTrigger value="editar">Editar</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editar">
            <Textarea
              id="content"
              rows={16}
              className="font-mono text-sm"
              aria-invalid={!!errors.content}
              {...register("content")}
            />
          </TabsContent>
          <TabsContent value="preview">
            <div className="prose prose-neutral min-h-40 max-w-none rounded-lg border border-border p-4 dark:prose-invert">
              <ReactMarkdown>{content || "*Nada para mostrar ainda.*"}</ReactMarkdown>
            </div>
          </TabsContent>
        </Tabs>
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button type="submit" disabled={isSubmitting || uploading}>
          {isSubmitting
            ? "Salvando..."
            : mode === "create"
              ? "Publicar artigo"
              : "Salvar alterações"}
        </Button>

        {mode === "edit" && (
          <AlertDialog>
            <AlertDialogTrigger render={<Button type="button" variant="outline" />}>
              Excluir artigo
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir artigo?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Comentários e favoritos
                  associados a este artigo deixarão de fazer sentido.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </form>
  );
}
