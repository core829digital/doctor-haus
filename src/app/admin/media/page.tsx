"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useAdminAuth } from "@/lib/admin/auth";
import { Upload, X, Image as ImageIcon, Loader2, Check } from "lucide-react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function AdminMedia() {
  const { token } = useAdminAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ name: string; status: UploadStatus; url?: string; error?: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const newResults = files.map((f) => ({ name: f.name, status: "uploading" as UploadStatus }));
    setResults(newResults);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      if (token) formData.append("adminToken", token);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) {
          setResults((prev) => {
            const copy = [...prev];
            copy[i] = { name: file.name, status: "success", url: data.url };
            return copy;
          });
        } else {
          setResults((prev) => {
            const copy = [...prev];
            copy[i] = { name: file.name, status: "error", error: data.error ?? "Errore" };
            return copy;
          });
        }
      } catch {
        setResults((prev) => {
          const copy = [...prev];
          copy[i] = { name: file.name, status: "error", error: "Errore di rete" };
          return copy;
        });
      }
    }
    setUploading(false);
    setFiles([]);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold">Media</h1>
        <p className="text-white/40 text-sm mt-1">Carica e gestisci immagini (JPEG/PNG → WebP automatico)</p>
      </div>

      {/* Upload area */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-8">
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center cursor-pointer hover:border-green-500/30 transition-colors"
        >
          <Upload size={32} className="mx-auto mb-4 text-white/20" />
          <p className="text-white/60 text-sm">Trascina le immagini qui o clicca per selezionarle</p>
          <p className="text-white/20 text-xs mt-1">JPEG, PNG — convertite automaticamente in WebP</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleSelect}
            className="hidden"
          />
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2.5">
                <ImageIcon size={16} className="text-white/20" />
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

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-xs text-white/30 uppercase tracking-wider">Risultati</p>
            {results.map((r, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-lg px-4 py-2.5 ${
                r.status === "success" ? "bg-green-500/5" : r.status === "error" ? "bg-red-500/5" : "bg-white/5"
              }`}>
                {r.status === "uploading" && <Loader2 size={14} className="animate-spin text-white/40" />}
                {r.status === "success" && <Check size={14} className="text-green-400" />}
                {r.status === "error" && <X size={14} className="text-red-400" />}
                {r.status === "idle" && <span className="w-3.5" />}
                <span className="flex-1 text-sm text-white/80 truncate">{r.name}</span>
                {r.status === "success" && <span className="text-xs text-green-400">WebP</span>}
                {r.status === "error" && <span className="text-xs text-red-400">{r.error}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
