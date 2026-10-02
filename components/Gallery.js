"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Gallery({ sections }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  useEffect(() => setPw(sessionStorage.getItem("pw") || ""), []);
  const login = () => { const v = prompt("Admin password"); if (v) { sessionStorage.setItem("pw", v); setPw(v); } };
  const logout = () => { sessionStorage.removeItem("pw"); setPw(""); };
  async function upload(section, files) {
    for (const f of files) {
      const fd = new FormData(); fd.append("file", f); fd.append("section", section); fd.append("password", pw);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      if (!r.ok) { alert(await r.text()); if (r.status === 401) logout(); break; }
    }
    router.refresh();
  }
  async function del(url) {
    if (!confirm("Delete this image?")) return;
    const r = await fetch("/api/delete", { method: "POST", body: JSON.stringify({ url, password: pw }) });
    if (!r.ok) return alert(await r.text());
    router.refresh();
  }
  return (<>
    {sections.map(s => (
      <section key={s.name}>
        <div className="sh"><h2>{s.name}</h2><hr />
          {pw && <label className="btn sm">+ Add images<input type="file" accept="image/*" multiple hidden onChange={e => upload(s.name, e.target.files)} /></label>}
        </div>
        <div className="grid">
          {s.images.map(im => (
            <div key={im.url} className="tile">
              <img src={im.url} alt="" loading="lazy" />
              {pw && <div className="ctl"><button onClick={() => navigator.clipboard.writeText(im.url)}>Copy link</button><button onClick={() => del(im.url)}>Delete</button></div>}
            </div>
          ))}
        </div>
      </section>
    ))}
    <button className="admin" onClick={pw ? logout : login}>{pw ? "Log out" : "Admin"}</button>
  </>);
}
