"use client";
import { useState, useEffect } from "react";
import { upload } from "@vercel/blob/client";
import { config } from "../../lib/config";
const TABS = [
  ...config.portfolio.sections.map(s => ({ label: s, prefix: `work/${s}/`, kind: "image" })),
  { label: "Private", kind: "private" },
  { label: "Music", prefix: "music/", kind: "music" },
];
const nice = p => decodeURIComponent(p.split("/").pop()).replace(/^\d+-/, "");
export default function Admin() {
  const [ok, setOk] = useState(null), [pw, setPw] = useState(""), [tab, setTab] = useState(0);
  const [files, setFiles] = useState([]), [msg, setMsg] = useState(""), [sure, setSure] = useState(null);
  const T = TABS[tab];
  const load = async () => {
    const r = await fetch(T.kind === "private" ? "/api/private" : `/api/list?prefix=${T.prefix}`);
    if (r.ok) setFiles((await r.json()).files); else { setFiles([]); setMsg(await r.text()); }
  };
  useEffect(() => { fetch("/api/auth").then(r => r.json()).then(j => setOk(j.admin)); }, []);
  useEffect(() => { if (ok) { setMsg(""); setSure(null); load(); } }, [ok, tab]);
  async function login(e) {
    e.preventDefault();
    const r = await fetch("/api/auth", { method: "POST", body: JSON.stringify({ password: pw }) });
    if (r.ok) { setOk(true); setPw(""); setMsg(""); } else setMsg("Wrong password");
  }
  async function logout() { await fetch("/api/auth", { method: "DELETE" }); setOk(false); setMsg(""); }
  async function add(list) {
    const fs = [...list];
    for (let n = 0; n < fs.length; n++) {
      setMsg(`Uploading ${n + 1} of ${fs.length}...`);
      try {
        if (T.kind === "private") {
          const fd = new FormData(); fd.append("file", fs[n]);
          const r = await fetch("/api/private", { method: "POST", body: fd });
          if (!r.ok) throw new Error(await r.text());
        } else await upload(`${T.prefix}${Date.now()}-${fs[n].name}`, fs[n], { access: "public", handleUploadUrl: "/api/upload" });
      } catch (e) { return setMsg("Upload failed: " + e.message); }
    }
    setMsg("Done"); load();
  }
  async function remove(f) {
    const r = await fetch(T.kind === "private" ? "/api/private" : "/api/delete", { method: T.kind === "private" ? "DELETE" : "POST", body: JSON.stringify({ url: f.url }) });
    setSure(null); if (!r.ok) return setMsg(await r.text());
    setMsg("Deleted"); load();
  }
  if (ok === null) return <main className="adm" />;
  if (!ok) return (
    <main className="adm"><form className="card login" onSubmit={login}>
      <h2>Admin</h2>
      <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} autoFocus />
      <button className="btn">Log in</button>{msg && <small className="err">{msg}</small>}
    </form></main>
  );
  return (
    <main className="adm">
      <div className="bar"><a href="/portfolio" className="muted">← Back to site</a><button className="lnk" onClick={logout}>Log out</button></div>
      <div className="tabs">{TABS.map((t, i) => <button key={t.label} className={i === tab ? "on" : ""} onClick={() => setTab(i)}>{t.label}</button>)}</div>
      <div className="sh"><h2>{T.label}</h2><hr />
        <label className="btn sm">+ Add {T.kind === "music" ? "songs" : "images"}<input hidden type="file" multiple accept={T.kind === "music" ? "audio/*" : "image/*"} onChange={e => { add(e.target.files); e.target.value = ""; }} /></label>
      </div>
      {T.kind === "private" && <p className="muted">Only you can see these while logged in. They have no public link.</p>}
      {msg && <p className="note">{msg}</p>}
      {files.length === 0 && <p className="muted">Nothing here yet. Add something above.</p>}
      <div className={T.kind === "music" ? "list" : "grid"}>
        {files.map(f => {
          const del = sure === f.url
            ? <><small>Delete?</small><button onClick={() => remove(f)}>Yes</button><button onClick={() => setSure(null)}>No</button></>
            : <button onClick={() => setSure(f.url)}>Delete</button>;
          const copy = T.kind !== "private" && <button onClick={() => { navigator.clipboard.writeText(f.url); setMsg("Link copied"); }}>Copy link</button>;
          return T.kind === "music"
            ? <div key={f.url} className="row2"><span>{nice(f.pathname)}</span><div>{copy}{del}</div></div>
            : <div key={f.url} className="tile"><img src={T.kind === "private" ? `/api/private?p=${encodeURIComponent(f.pathname)}` : f.url} alt="" /><div className="ctl on">{copy}{del}</div></div>;
        })}
      </div>
    </main>
  );
}
