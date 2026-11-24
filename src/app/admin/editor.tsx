"use client";

import { useActionState, useState } from "react";

export type Value = string | number | boolean | null | Value[] | { [key: string]: Value };

function labelFor(key: string) {
  return key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`).replace(/^./, (letter) => letter.toUpperCase());
}

function entryLabel(value: Value, index: number) {
  if (typeof value === "string") return value.slice(0, 80) || `Item ${index + 1}`;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const key of ["title", "name", "label", "path", "alt", "slug"]) {
      if (typeof value[key] === "string" && value[key]) return String(value[key]).slice(0, 80);
    }
  }
  return `Item ${index + 1}`;
}

type MediaChoice = { url: string; name: string };
type FieldProps = {
  value: Value;
  sample: Value;
  label: string;
  change: (value: Value) => void;
  media: MediaChoice[];
};

const pageSize = 12;

function ArrayField({ value, sample, label, change, media }: FieldProps & { value: Value[] }) {
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("");
  const [requestedPage, setPage] = useState(0);
  const template = Array.isArray(sample) ? sample[0] ?? (label === "Photos" ? { src: "", alt: "" } : undefined) : undefined;
  const supportsVisibility = value.some((item) => item && typeof item === "object" && "visible" in item);
  const matches = value.map((item, index) => ({ item, index })).filter(({ item }) => {
    if (visibility && item && typeof item === "object" && "visible" in item &&
        item.visible !== (visibility === "visible")) return false;
    return !search || JSON.stringify(item).toLowerCase().includes(search.toLowerCase());
  });
  const lastPage = Math.max(0, Math.ceil(matches.length / pageSize) - 1);
  const page = Math.min(requestedPage, lastPage);

  function move(index: number, delta: number) {
    const items = [...value];
    [items[index], items[index + delta]] = [items[index + delta], items[index]];
    change(items);
  }

  function add() {
    if (template === undefined) return;
    setSearch("");
    setVisibility("");
    setPage(Math.floor(value.length / pageSize));
    change([...value, structuredClone(template)]);
  }

  return (
    <fieldset className="admin-fieldset">
      <legend>{label}</legend>
      {(value.length > 3 || search || supportsVisibility) && (
        <div className="admin-filters">
          <label>Find in {label.toLowerCase()}
            <input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} />
          </label>
          {supportsVisibility && (
            <label>Visibility
              <select value={visibility} onChange={(event) => { setVisibility(event.target.value); setPage(0); }}>
                <option value="">All</option><option value="visible">Visible</option><option value="hidden">Hidden</option>
              </select>
            </label>
          )}
        </div>
      )}
      {!matches.length && <p>{value.length ? "No items match these filters." : "No items."}</p>}
      {matches.slice(page * pageSize, (page + 1) * pageSize).map(({ item, index }) => (
        <details key={index} className="admin-editor-item">
          <summary>{entryLabel(item, index)}</summary>
          <div className="admin-inline">
            <button type="button" disabled={!index} onClick={() => move(index, -1)}>Move up</button>
            <button type="button" disabled={index === value.length - 1} onClick={() => move(index, 1)}>Move down</button>
            <button type="button" onClick={() => change(value.filter((_, position) => position !== index))}>Remove</button>
          </div>
          <Field value={item} sample={template ?? item} label={`Item ${index + 1}`} media={media} change={(next) => change(value.map((previous, position) => position === index ? next : previous))} />
        </details>
      ))}
      {lastPage > 0 && (
        <div className="admin-inline">
          <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page + 1} of {lastPage + 1}</span>
          <button type="button" disabled={page === lastPage} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
      {template !== undefined && <button type="button" onClick={add}>Add item</button>}
    </fieldset>
  );
}

function Field({ value, sample, label, change, media }: FieldProps) {
  if (Array.isArray(value)) return <ArrayField value={value} sample={sample} label={label} change={change} media={media} />;
  if (value && typeof value === "object") {
    const shape = sample && typeof sample === "object" && !Array.isArray(sample) ? sample : {};
    return (
      <fieldset className="admin-fieldset">
        <legend>{label}</legend>
        {Object.entries(value).map(([key, item]) => <Field key={key} label={labelFor(key)} value={item} sample={shape[key] ?? item} media={media} change={(next) => change({ ...value, [key]: next })} />)}
      </fieldset>
    );
  }
  if (typeof value === "boolean") return <label className="admin-check"><input type="checkbox" checked={value} onChange={(event) => change(event.target.checked)} /> {label}</label>;
  if (typeof value === "number") return <label>{label}<input type="number" step="any" required value={value} onChange={(event) => change(event.target.valueAsNumber)} /></label>;
  const image = /^(src|image|poster|logo|logo full|logo full light|mark|mark light|photo)$/i.test(label);
  return (
    <div className="admin-editor-value">
      <label>{label}
        {String(value ?? "").length > 105 || /description|intro|summary/i.test(label)
          ? <textarea value={value ?? ""} onChange={(event) => change(event.target.value)} rows={3} maxLength={6000} />
          : <input value={value ?? ""} onChange={(event) => change(event.target.value)} maxLength={6000} />}
      </label>
      {image && media.length > 0 && (
        <label>Choose an uploaded image
          <select value={media.some(({ url }) => url === value) ? String(value) : ""} onChange={(event) => { if (event.target.value) change(event.target.value); }}>
            <option value="">Choose an image</option>
            {media.map(({ url, name }) => <option key={url} value={url}>{name}</option>)}
          </select>
        </label>
      )}
      {image && typeof value === "string" && /^\/(?:images|media)\//.test(value) && <a href={value} target="_blank" rel="noreferrer">View image ↗</a>}
    </div>
  );
}

export function Editor({ initial, sample, revision, media, save, hasDraft }: {
  initial: Value; sample: Value; revision: number; media: { url: string; name: string }[]; hasDraft: boolean;
  save: (previous: string, form: FormData) => Promise<string>;
}) {
  const [value, setValue] = useState(initial);
  const [message, action, pending] = useActionState(save, "");
  return (
    <form action={action} className="admin-form">
      <input type="hidden" name="value" value={JSON.stringify(value)} />
      <input type="hidden" name="revision" value={revision} />
      <Field value={value} sample={sample} label="Fields" change={setValue} media={media} />
      <p role="status" className={message ? "admin-notice" : undefined}>{message}</p>
      <div className="admin-inline">
        <button name="intent" value="draft" disabled={pending}>Save draft</button>
        <button name="intent" value="publish" disabled={pending} onClick={(event) => { if (!window.confirm("Publish these changes on the public website?")) event.preventDefault(); }}>Publish changes</button>
        {hasDraft && <button name="intent" value="discard" disabled={pending} onClick={(event) => { if (!window.confirm("Discard the saved draft?")) event.preventDefault(); }}>Discard draft</button>}
      </div>
    </form>
  );
}
