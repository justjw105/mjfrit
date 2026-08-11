"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage } from "@/firebase/storage";
import {
  subscribeToAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  type BlogPostDoc,
  type BlogPostInput,
} from "@/lib/firestoreBlog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, X } from "lucide-react";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const BLANK_FORM: BlogPostInput = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  coverImageHint: "",
  tags: [],
  author: "Moriah Jane",
  published: false,
  publishedAt: "",
  updatedAt: new Date().toISOString().slice(0, 10),
};

export default function BlogDashboard() {
  const [posts, setPosts] = useState<BlogPostDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogPostInput>(BLANK_FORM);
  const [tagInput, setTagInput] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAllBlogPosts((data) => {
      setPosts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  function openCreateDialog() {
    setEditingDocId(null);
    setForm(BLANK_FORM);
    setSlugTouched(false);
    setTagInput("");
    setFormError(null);
    setDialogOpen(true);
  }

  function openEditDialog(post: BlogPostDoc) {
    setEditingDocId(post.docId);
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImageUrl: post.coverImageUrl,
      coverImageHint: post.coverImageHint,
      tags: post.tags,
      author: post.author,
      published: post.published,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
    });
    setSlugTouched(true);
    setTagInput("");
    setFormError(null);
    setDialogOpen(true);
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: slugTouched ? f.slug : slugify(title),
    }));
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setFormError(null);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const slugPart = form.slug || "post";
      const path = `blog-images/${slugPart}-${Date.now()}.${ext}`;
      const storageRef = ref(getFirebaseStorage(), path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm((f) => ({ ...f, coverImageUrl: url }));
    } catch (err) {
      console.error(err);
      setFormError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setFormError("Title, slug, and content are required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const payload: BlogPostInput = { ...form };
      if (payload.published && !payload.publishedAt) {
        payload.publishedAt = new Date().toISOString().slice(0, 10);
      }
      if (editingDocId) {
        await updateBlogPost(editingDocId, payload);
      } else {
        await createBlogPost(payload);
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setFormError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(post: BlogPostDoc) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    await deleteBlogPost(post.docId);
  }

  async function handleTogglePublished(post: BlogPostDoc, value: boolean) {
    await updateBlogPost(post.docId, {
      published: value,
      publishedAt: post.publishedAt || (value ? new Date().toISOString().slice(0, 10) : post.publishedAt),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold font-headline text-primary">Blog Posts</h2>
          <p className="text-muted-foreground text-sm">Write and publish studio journal entries.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading posts…</p>
      ) : posts.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-6 text-center text-muted-foreground">
          No posts yet. Click &quot;New Post&quot; to write your first one.
        </div>
      ) : (
        <div className="rounded-md border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.docId}>
                  <TableCell>
                    <div className="relative h-14 w-14 rounded-md overflow-hidden bg-muted">
                      {post.coverImageUrl && (
                        <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {post.title}
                    <div className="text-xs text-muted-foreground">{post.slug}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-[160px]">
                      {post.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {post.publishedAt || "Draft"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={post.published}
                      onCheckedChange={(checked) => handleTogglePublished(post, checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(post)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(post)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDocId ? "Edit Post" : "New Post"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm((f) => ({ ...f, slug: e.target.value }));
                  }}
                  placeholder="e.g. fusing-glass-frit-landscapes"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Photo</Label>
              <div className="flex items-center gap-4">
                {form.coverImageUrl && (
                  <div className="relative h-16 w-28 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image src={form.coverImageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </div>
              {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
            </div>

            <div className="space-y-2">
              <Label>Excerpt (shown on the blog list & search results)</Label>
              <Textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Content (Markdown — use **bold**, *italic*, # Heading, [link](url))</Label>
              <Textarea
                rows={12}
                className="font-mono text-sm"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="e.g. Techniques — press Enter"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {form.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1">
                    {t}
                    <button type="button" onClick={() => removeTag(t)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch
                checked={form.published}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, published: checked }))}
              />
              <Label>Published (visible on the public blog)</Label>
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || uploading}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
