"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { signOut, type User } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseAuth } from "@/firebase/auth";
import { getFirebaseStorage } from "@/firebase/storage";
import {
  subscribeToAllArtPieces,
  createArtPiece,
  updateArtPiece,
  deleteArtPiece,
  reorderArtPieces,
  isGalleryEmpty,
  seedGalleryFromStaticData,
  type ArtPieceDoc,
  type ArtPieceInput,
} from "@/lib/firestoreArt";
import { seedArtPieces } from "@/lib/artdata";
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
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, LogOut } from "lucide-react";

const BLANK_FORM: ArtPieceInput = {
  slug: "",
  title: "",
  imageUrl: "",
  imageHint: "",
  description: "",
  technicalDetails: "",
  price: 0,
  size: "",
  framedSize: "",
  unframedSize: "",
  alt: "",
  updatedAt: new Date().toISOString().slice(0, 10),
  order: 0,
  sold: false,
  visible: true,
};

export default function AdminDashboard({ user }: { user: User }) {
  const [pieces, setPieces] = useState<ArtPieceDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryEmpty, setGalleryEmpty] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [form, setForm] = useState<ArtPieceInput>(BLANK_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAllArtPieces((data) => {
      setPieces(data);
      setLoading(false);
      setGalleryEmpty(data.length === 0);
    });
    return () => unsubscribe();
  }, []);

  async function handleSeed() {
    setSeeding(true);
    try {
      await seedGalleryFromStaticData(seedArtPieces);
    } finally {
      setSeeding(false);
    }
  }

  function openCreateDialog() {
    setEditingDocId(null);
    setForm({ ...BLANK_FORM, order: pieces.length + 1 });
    setFormError(null);
    setDialogOpen(true);
  }

  function openEditDialog(piece: ArtPieceDoc) {
    setEditingDocId(piece.docId);
    setForm({
      slug: piece.slug,
      title: piece.title,
      imageUrl: piece.imageUrl,
      imageHint: piece.imageHint,
      description: piece.description,
      technicalDetails: piece.technicalDetails,
      price: piece.price,
      size: piece.size,
      framedSize: piece.framedSize ?? "",
      unframedSize: piece.unframedSize ?? "",
      alt: piece.alt,
      updatedAt: piece.updatedAt,
      order: piece.order,
      sold: piece.sold,
      visible: piece.visible,
    });
    setFormError(null);
    setDialogOpen(true);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setFormError(null);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const slugPart = form.slug || "piece";
      const path = `art-pieces/${slugPart}-${Date.now()}.${ext}`;
      const storageRef = ref(getFirebaseStorage(), path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      console.error(err);
      setFormError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.slug.trim() || !form.title.trim() || !form.imageUrl.trim()) {
      setFormError("Title, slug, and an image are required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editingDocId) {
        await updateArtPiece(editingDocId, form);
      } else {
        await createArtPiece(form);
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setFormError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(piece: ArtPieceDoc) {
    if (!confirm(`Delete "${piece.title}"? This cannot be undone.`)) return;
    await deleteArtPiece(piece.docId);
  }

  async function handleToggle(piece: ArtPieceDoc, field: "sold" | "visible", value: boolean) {
    await updateArtPiece(piece.docId, { [field]: value });
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= pieces.length) return;
    const reordered = [...pieces];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    await reorderArtPieces(reordered.map((p) => p.docId));
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Gallery Admin</h1>
          <p className="text-muted-foreground text-sm">Signed in as {user.email}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Piece
          </Button>
          <Button variant="outline" onClick={() => signOut(getFirebaseAuth())}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      {galleryEmpty && !loading && (
        <div className="rounded-md border border-dashed border-border p-6 text-center space-y-3">
          <p className="text-muted-foreground">
            No pieces in the gallery yet. Import the existing 10 pieces from the site, or add a new one.
          </p>
          <Button onClick={handleSeed} disabled={seeding} variant="secondary">
            {seeding ? "Importing…" : "Import Existing Gallery"}
          </Button>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading gallery…</p>
      ) : pieces.length > 0 ? (
        <div className="rounded-md border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Order</TableHead>
                <TableHead className="w-20">Photo</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pieces.map((piece, index) => (
                <TableRow key={piece.docId}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        disabled={index === 0}
                        onClick={() => handleMove(index, -1)}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        disabled={index === pieces.length - 1}
                        onClick={() => handleMove(index, 1)}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="relative h-14 w-14 rounded-md overflow-hidden bg-muted">
                      {piece.imageUrl && (
                        <Image src={piece.imageUrl} alt={piece.title} fill className="object-cover" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {piece.title}
                    <div className="text-xs text-muted-foreground">{piece.slug}</div>
                  </TableCell>
                  <TableCell>${piece.price}</TableCell>
                  <TableCell>
                    <Switch
                      checked={piece.sold}
                      onCheckedChange={(checked) => handleToggle(piece, "sold", checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={piece.visible}
                      onCheckedChange={(checked) => handleToggle(piece, "visible", checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(piece)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(piece)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDocId ? "Edit Piece" : "Add New Piece"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="e.g. dust-storm-fused-glass"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex items-center gap-4">
                {form.imageUrl && (
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image src={form.imageUrl} alt="Preview" fill className="object-cover" />
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
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Technical Details</Label>
              <Textarea
                rows={2}
                value={form.technicalDetails}
                onChange={(e) => setForm((f) => ({ ...f, technicalDetails: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price (USD)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Framed Size</Label>
                <Input
                  value={form.framedSize ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, framedSize: e.target.value }))}
                  placeholder="e.g. 20x14 inches"
                />
              </div>
              <div className="space-y-2">
                <Label>Unframed Size</Label>
                <Input
                  value={form.unframedSize ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, unframedSize: e.target.value }))}
                  placeholder="e.g. 18x12 inches"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Alt Text (for accessibility & SEO)</Label>
              <Textarea
                rows={2}
                value={form.alt}
                onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-8 pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.sold}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, sold: checked }))}
                />
                <Label>Sold</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.visible}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, visible: checked }))}
                />
                <Label>Visible in gallery</Label>
              </div>
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
