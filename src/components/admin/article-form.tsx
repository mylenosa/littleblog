"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Bold,
  Code,
  Film,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";
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
import { ArticleCover } from "@/components/articles/article-cover";
import { ArticleMeta } from "@/components/articles/article-meta";
import { TagBadge } from "@/components/articles/tag-badge";
import { MdxContent } from "@/components/articles/mdx-content";
import { PresetPicker } from "@/components/common/preset-picker";
import { ImageDropzone } from "@/components/common/image-dropzone";
import {
  isPresetValue,
  presetIdFromValue,
  presetValueFromId,
} from "@/lib/constants/image-presets";
import {
  articleFormSchema,
  parseTags,
  type ArticleFormInput,
} from "@/lib/validations/article-form.schema";
import { createArticle, deleteArticle, updateArticle } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";

const WORDS_PER_MINUTE = 200;

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

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
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormInput>({
    resolver: zodResolver(articleFormSchema),
    defaultValues,
  });

  const { ref: contentRegisterRef, ...contentField } = register("content");

  const coverImageUrl = watch("coverImageUrl");
  const content = watch("content");
  const title = watch("title");
  const summary = watch("summary");
  const authorName = watch("authorName");
  const publishedAt = watch("publishedAt");
  const tags = watch("tags");

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) {
      setValue("slug", slugify(event.target.value));
    }
  }

  async function uploadCoverFile(file: File) {
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
    setValue("coverImageUrl", data.publicUrl, { shouldDirty: true });
    setUploading(false);
  }

  function insertAtCursor(text: string) {
    const el = contentRef.current;
    const current = getValues("content") || "";
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? current.length;

    const next = current.slice(0, start) + text + current.slice(end);
    setValue("content", next, { shouldDirty: true });
    placeCursor(start + text.length);
  }

  async function handleInlineImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadingInlineImage(true);
    const supabase = createClient();
    const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}`;

    const { error } = await supabase.storage.from("article-media").upload(path, file);

    if (error) {
      toast.error("Não foi possível enviar a imagem.");
      setUploadingInlineImage(false);
      return;
    }

    const { data } = supabase.storage.from("article-media").getPublicUrl(path);
    insertAtCursor(`\n\n![](${data.publicUrl})\n\n`);
    setUploadingInlineImage(false);
  }

  function placeCursor(position: number) {
    requestAnimationFrame(() => {
      const el = contentRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(position, position);
    });
  }

  function wrapSelection(before: string, after: string, placeholder: string) {
    const el = contentRef.current;
    const current = getValues("content") || "";
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? current.length;
    const selected = current.slice(start, end) || placeholder;

    const next =
      current.slice(0, start) + before + selected + after + current.slice(end);
    setValue("content", next, { shouldDirty: true });
    placeCursor(start + before.length + selected.length + after.length);
  }

  function prefixLine(prefix: string) {
    const el = contentRef.current;
    const current = getValues("content") || "";
    const start = el?.selectionStart ?? current.length;
    const lineStart = current.lastIndexOf("\n", start - 1) + 1;

    const next = current.slice(0, lineStart) + prefix + current.slice(lineStart);
    setValue("content", next, { shouldDirty: true });
    placeCursor(start + prefix.length);
  }

  async function onSubmit(data: ArticleFormInput) {
    const result =
      mode === "create"
        ? await createArticle(data)
        : await updateArticle(originalSlug!, data);

    if (result.success) {
      toast.success(mode === "create" ? "Artigo criado." : "Artigo atualizado.");
      router.push("/admin/artigos");
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
      router.push("/admin/artigos");
    } else {
      toast.error(result.message);
    }
  }

  const previewTags = parseTags(tags || "");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Tabs defaultValue="editar">
        <TabsList>
          <TabsTrigger value="editar">Editar</TabsTrigger>
          <TabsTrigger value="visualizar">Visualizar artigo</TabsTrigger>
        </TabsList>

        <TabsContent value="editar" className="flex flex-col gap-5 pt-4">
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
            <Label htmlFor="slug">Slug (endereço da página)</Label>
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
                <p className="text-sm text-destructive">
                  {errors.publishedAt.message}
                </p>
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="cover">Imagem de capa</Label>
            <div className="max-w-sm">
              <ImageDropzone
                uploading={uploading}
                hasValue={!!coverImageUrl}
                preview={
                  <ArticleCover
                    slug="preview-capa"
                    src={coverImageUrl}
                    alt="Pré-visualização da capa"
                    className="w-full"
                  />
                }
                onFile={uploadCoverFile}
                onClear={() => setValue("coverImageUrl", "", { shouldDirty: true })}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Ou escolha uma imagem padrão:
            </p>
            <PresetPicker
              value={coverImageUrl && isPresetValue(coverImageUrl) ? presetIdFromValue(coverImageUrl) : undefined}
              onSelect={(id) =>
                setValue("coverImageUrl", presetValueFromId(id), { shouldDirty: true })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="content">Conteúdo</Label>
            <p className="text-xs text-muted-foreground">
              Use os botões abaixo pra formatar sem precisar saber a sintaxe.
              Selecione um trecho de texto antes de clicar, se quiser aplicar
              só nele. No botão de vídeo, troque o link de exemplo pelo link
              real do YouTube ou Vimeo.
            </p>
            <div className="rounded-t-lg border border-b-0 border-input bg-muted/50 shadow-sm">
              <div className="flex flex-wrap items-center gap-0.5 p-1.5">
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Negrito"
                    aria-label="Negrito"
                    onClick={() => wrapSelection("**", "**", "texto em negrito")}
                  >
                    <Bold />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Itálico"
                    aria-label="Itálico"
                    onClick={() => wrapSelection("_", "_", "texto em itálico")}
                  >
                    <Italic />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Riscado"
                    aria-label="Riscado"
                    onClick={() => wrapSelection("~~", "~~", "texto riscado")}
                  >
                    <Strikethrough />
                  </Button>
                </div>
                <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Título"
                    aria-label="Título"
                    onClick={() => prefixLine("# ")}
                  >
                    <Heading1 />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Subtítulo"
                    aria-label="Subtítulo"
                    onClick={() => prefixLine("## ")}
                  >
                    <Heading2 />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Citação"
                    aria-label="Citação"
                    onClick={() => prefixLine("> ")}
                  >
                    <Quote />
                  </Button>
                </div>
                <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Lista"
                    aria-label="Lista"
                    onClick={() => prefixLine("- ")}
                  >
                    <List />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Lista numerada"
                    aria-label="Lista numerada"
                    onClick={() => prefixLine("1. ")}
                  >
                    <ListOrdered />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Código"
                    aria-label="Código"
                    onClick={() => wrapSelection("`", "`", "código")}
                  >
                    <Code />
                  </Button>
                </div>
                <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Link"
                    aria-label="Link"
                    onClick={() => wrapSelection("[", "](https://)", "texto do link")}
                  >
                    <LinkIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Inserir imagem"
                    aria-label="Inserir imagem"
                    disabled={uploadingInlineImage}
                    onClick={() => inlineImageInputRef.current?.click()}
                  >
                    <ImagePlus />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Incorporar vídeo (YouTube ou Vimeo)"
                    aria-label="Incorporar vídeo"
                    onClick={() =>
                      insertAtCursor(
                        "\n\n[Vídeo](https://www.youtube.com/watch?v=)\n\n"
                      )
                    }
                  >
                    <Film />
                  </Button>
                  <input
                    ref={inlineImageInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleInlineImageChange}
                  />
                </div>
                {uploadingInlineImage && (
                  <span className="px-2 text-xs text-muted-foreground">
                    Enviando imagem...
                  </span>
                )}
              </div>
            </div>
            <Textarea
              id="content"
              rows={16}
              className="rounded-t-none"
              aria-invalid={!!errors.content}
              {...contentField}
              ref={(el) => {
                contentRegisterRef(el);
                contentRef.current = el;
              }}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="visualizar" className="pt-4">
          <div className="rounded-lg border border-border p-4 sm:p-8">
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
              <div className="flex flex-wrap gap-1.5">
                {previewTags.length > 0 ? (
                  previewTags.map((tag) => <TagBadge key={tag} tag={tag} />)
                ) : (
                  <span className="text-sm text-muted-foreground">Sem tags ainda</span>
                )}
              </div>
              <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                {title || "Título do artigo"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {summary || "O resumo aparece aqui."}
              </p>
              <ArticleMeta
                authorName={authorName || "Autor"}
                publishedAt={publishedAt || new Date().toISOString().slice(0, 10)}
                readingTimeMinutes={estimateReadingTime(content || "")}
              />
              <ArticleCover
                slug={originalSlug ?? "preview"}
                src={coverImageUrl}
                alt={title}
                className="my-2"
              />
              <MdxContent source={content || "*O conteúdo aparece aqui.*"} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

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
