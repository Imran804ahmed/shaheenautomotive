"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

export type ManagedImage = {
  key: string; title: string; section: string; src: string; alt: string; original: string;
  width: number; height: number; fit: "cover" | "contain";
  actualWidth: number | null; actualHeight: number | null; bytes: number | null;
  currentVersion: string | null; revision: number; updatedAt: number | null;
  history: { id: string; src: string; alt: string; width: number; height: number; date: number; name: string }[];
};

const displayDate = (seconds: number) => new Date(seconds * 1000).toISOString().slice(0, 16).replace("T", " ") + " UTC";
const extensions = ".jpg,.jpeg,.png,.webp,.avif";

function Photo({ src, alt, fit = "contain" }: { src: string; alt: string; fit?: "cover" | "contain" }) {
  return (
    <span className="home-photo">
      {src ? <Image src={src} alt={alt} fill unoptimized sizes="(max-width: 760px) 100vw, 360px" style={{ objectFit: fit }} /> : <span>No image configured</span>}
    </span>
  );
}

function ImageDialog({ image, mode, close, finish }: {
  image: ManagedImage; mode: "edit" | "preview"; close: () => void; finish: (message: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [alt, setAlt] = useState(image.alt);
  const [crop, setCrop] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => { dialog.current?.showModal(); }, []);

  function choose(next: File | undefined) {
    if (!next) return;
    if (next.size > 8 * 1024 * 1024 || !/\.(jpe?g|png|webp|avif)$/i.test(next.name)) {
      setFile(null);
      setPreview("");
      setError("Choose a JPEG, PNG, WebP or AVIF file up to 8 MB.");
      return;
    }
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setError("");
  }

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function save(action: "replace" | "alt" | "original" | "restore", version?: string) {
    if ((action === "original" || action === "restore") && !window.confirm("Restore this image on the homepage?")) return;
    if (action === "replace" && !window.confirm("Publish this replacement on the homepage?")) return;
    const data = new FormData();
    data.set("key", image.key);
    data.set("revision", String(image.revision));
    data.set("action", action);
    data.set("alt", alt);
    if (crop) data.set("crop", "1");
    if (version) data.set("version", version);
    if (file && action === "replace") data.set("file", file);
    setError("");
    setProgress(0);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/homepage-images/");
    xhr.responseType = "json";
    xhr.timeout = 60000;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) setProgress(Math.round(event.loaded / event.total * 100));
    };
    function fail(message: string) {
      setProgress(null);
      setError(message);
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) finish(xhr.response?.message ?? "Homepage image saved.");
      else fail(xhr.response?.message ?? "The image could not be saved. Please try again.");
    };
    xhr.onerror = xhr.ontimeout = () => fail("The image upload did not finish. Please try again.");
    xhr.send(data);
  }

  const busy = progress !== null;
  return (
    <dialog ref={dialog} className="home-image-dialog" aria-labelledby="home-image-dialog-title" onCancel={(event) => {
      event.preventDefault();
      if (!busy) close();
    }}>
      <div className="admin-heading">
        <h2 id="home-image-dialog-title">{image.title}</h2>
        <button type="button" onClick={close} disabled={busy}>{mode === "preview" ? "Close" : "Cancel"}</button>
      </div>
      <div className="home-compare">
        <div><p>Current image</p><Photo src={image.src} alt={image.alt} /></div>
        {preview && <div><p>Replacement preview</p><div style={{ aspectRatio: `${image.width}/${image.height}`, position: "relative" }}>
          <Image src={preview} alt="Selected replacement" fill unoptimized sizes="300px" style={{ objectFit: crop ? "cover" : "contain" }} />
        </div></div>}
      </div>
      {mode === "edit" && (
        <form className="admin-form" onSubmit={(event) => { event.preventDefault(); save(file ? "replace" : "alt"); }}>
          <p>Recommended {image.width} × {image.height} px. JPEG, PNG, WebP or AVIF, up to 8 MB.</p>
          <label className="home-drop" onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
            event.preventDefault();
            if (!busy) choose(event.dataTransfer.files[0]);
          }}>
            Drop an image here or browse
            <input type="file" accept={extensions} disabled={busy} onChange={(event) => choose(event.target.files?.[0])} />
            {file && <span>{file.name}</span>}
          </label>
          {image.fit === "cover" && <label className="admin-check"><input type="checkbox" checked={crop} disabled={busy} onChange={(event) => setCrop(event.target.checked)} /> Center crop to the recommended ratio</label>}
          <label>Alternative text<input value={alt} maxLength={300} disabled={busy} onChange={(event) => setAlt(event.target.value)} /></label>
          <button disabled={busy || (!file && alt === image.alt)}>Save changes</button>
          {image.revision > 0 && <button type="button" disabled={busy} onClick={() => save("original")}>Restore original image</button>}
          {image.history.length > 0 && (
            <details>
              <summary>Replacement history</summary>
              <ul className="admin-list">
                {image.history.map((version) => (
                  <li key={version.id}>
                    <a href={version.src} target="_blank" rel="noreferrer">{displayDate(version.date)} · {version.name} · {version.width} × {version.height}</a>
                    {version.id === image.currentVersion ? <span>Current</span> :
                      <button type="button" disabled={busy} onClick={() => save("restore", version.id)}>Restore version</button>}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </form>
      )}
      {busy && <p role="status">{progress === 100 ? "Processing image…" : "Uploading…"} <progress value={progress} max={100} aria-label="Upload progress" /></p>}
      {error && <p role="alert" className="admin-notice">{error}</p>}
    </dialog>
  );
}

export function ImageManager({ images }: { images: ManagedImage[] }) {
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<{ key: string; mode: "edit" | "preview" }>();
  const [notice, setNotice] = useState("");
  const [refreshing, refresh] = useTransition();
  const router = useRouter();
  const filtered = images.filter((image) => `${image.title} ${image.section}`.toLowerCase().includes(query.trim().toLowerCase()));
  const sections = [...new Set(filtered.map(({ section }) => section))];
  const selected = images.find(({ key }) => key === selection?.key);

  return (
    <>
      <label>Search images by name or section<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      {!filtered.length && <p>No images match this search.</p>}
      {sections.map((section) => (
        <section key={section}>
          <h2>{section}</h2>
          <div className="admin-media-grid home-image-grid">
            {filtered.filter((image) => image.section === section).map((image) => (
              <article key={image.key} className="admin-card">
                <Photo src={image.src} alt={image.alt} fit={image.fit} />
                <h3>{image.title}</h3>
                <dl>
                  <div><dt>Recommended</dt><dd>{image.width} × {image.height} px · {(image.width / image.height).toFixed(2)}:1</dd></div>
                  <div><dt>Current</dt><dd>{image.actualWidth ? `${image.actualWidth} × ${image.actualHeight} px` : "—"}{image.bytes ? ` · ${Math.ceil(image.bytes / 1024)} KB` : ""}</dd></div>
                  <div><dt>Alt text</dt><dd>{image.alt || "Decorative image"}</dd></div>
                  <div><dt>Updated</dt><dd>{image.updatedAt ? displayDate(image.updatedAt) : "Original image"}</dd></div>
                </dl>
                <div className="admin-inline">
                  <button type="button" disabled={refreshing} onClick={() => { setNotice(""); setSelection({ key: image.key, mode: "edit" }); }}>Replace image</button>
                  {image.src && <button type="button" onClick={() => setSelection({ key: image.key, mode: "preview" })}>Preview</button>}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
      {selected && selection && <ImageDialog image={selected} mode={selection.mode} close={() => setSelection(undefined)} finish={(message) => {
        setSelection(undefined);
        setNotice(message);
        refresh(() => router.refresh());
      }} />}
    </>
  );
}
