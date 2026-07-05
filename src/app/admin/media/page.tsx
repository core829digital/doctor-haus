"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useAdminAuth } from "@/lib/admin/auth";
import { Upload, X, Image as ImageIcon, Loader2, Check, Copy, Trash2, Search } from "lucide-react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function AdminMedia() {
  const { token } = useAdminAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ name: string; status: UploadStatus; url?: string }[]>([]);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const mediaList = useQuery(api.media.list, { limit: 100 });
  const totalCount = useQuery(api.media.getCount);
  const removeMedia = useMutation(api.media.remove);

  const filtered = mediaList?.filter((m) =>
    m.originalName.toLowerCase().includes(search.toLowerCase()) ||
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (f) => f.type === "image/jpeg" || f.type === "image/png" || f.type === "image/webp"
      );
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const uploadAll = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setResults(files.map((f) => ({ name: f.name, status: "uploading" as UploadStatus })));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      if (token) formData.append("adminToken", token);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        setResults((prev) => {
          const copy = [...prev];
          copy[i] = { name: file.name, status: res.ok ? "success" : "error", url: data.url };
          return copy;
        });
      } catch {
        setResults((prev) => {
          const copy = [...prev];
          copy[i] = { name: file.name, status: "error" };
          return copy;
        });
      }
    }
    setUploading(false);
    setFiles([]);
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (mediaId: Id<"mediaFiles">, filename: string) => {
    await removeMedia({ mediaId });
    try {
      await fetch(`/api/upload/delete?filename=${filename}`, { method: "DELETE" });
    } catch {}
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });
  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Media</h1>
          <p className="text-white/40 text-sm mt-1">{totalCount ?? "—"} file caricati</p>
        </div>
      </div>

      {/* Upload area */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-green-500/30 transition-colors"
        >
          <Upload size={28} className="mx-auto mb-3 text-white/20" />
          <p className="text-white/60 text-sm">Trascina le immagini qui o clicca per selezionarle</p>
          <p className="text-white/20 text-xs mt-1">JPEG, PNG — convertite automaticamente in WebP</p>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleSelect} className="hidden" />
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2.5">
                <ImageIcon size={16} className="text-white/20 shrink-0" />
                <span className="flex-1 text-sm text-white/80 truncate">{f.name}</span>
                <span className="text-xs text-white/20">{(f.size / 1024).toFixed(0)} KB</span>
                <button onClick={() => removeFile(i)} className="text-white/20 hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={uploadAll}
              disabled={uploading}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-all flex items-center gap-2"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? "Caricamento in corso..." : `Carica ${files.length} file`}
            </button>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4 space-y-2">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-lg px-4 py-2.5 ${
                r.status === "success" ? "bg-green-500/5" : r.status === "error" ? "bg-red-500/5" : "bg-white/5"
              }`}>
                {r.status === "uploading" && <Loader2 size={14} className="animate-spin text-white/40" />}
                {r.status === "success" && <Check size={14} className="text-green-400" />}
                {r.status === "error" && <X size={14} className="text-red-400" />}
                <span className="flex-1 text-sm text-white/80 truncate">{r.name}</span>
                {r.status === "success" && <span className="text-xs text-green-400">WebP</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Cerca file..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-500/40"
            />
          </div>
          <span className="text-xs text-white/30">{filtered?.length ?? 0} risultati</span>
        </div>

        {!filtered ? (
          <div className="flex items-center justify-center py-16 text-white/20">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/20">
            <ImageIcon size={40} className="mb-3" />
            <p className="text-sm">Nessun file trovato</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((media) => (
              <div key={media._id} className="group bg-white/5 rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all">
                <div className="aspect-square relative bg-black/40">
                  <img
                    src={`/uploads/${media.filename}`}
                    alt={media.alt || media.originalName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleCopyUrl(`/uploads/${media.filename}`, media._id)}
                      className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
                      title="Copia URL"
                    >
                      {copiedId === media._id ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white" />}
                    </button>
                    <button
                      onClick={() => handleDelete(media._id, media.filename)}
                      className="bg-red-500/40 hover:bg-red-500/60 rounded-lg p-2 transition-colors"
                      title="Elimina"
                    >
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs text-white/80 truncate" title={media.originalName}>{media.originalName}</p>
                  <div className="flex items-center gap-2 text-[10px] text-white/30">
                    {media.width && media.height && <span>{media.width}×{media.height}</span>}
                    <span>{formatSize(media.size)}</span>
                  </div>
                  <p className="text-[10px] text-white/20">{formatDate(media.uploadedAt)}</p>
                  <p className="text-[10px] text-white/20 truncate font-mono">/uploads/{media.filename}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
