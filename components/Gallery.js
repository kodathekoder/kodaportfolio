"use client";
import { useState, useEffect } from "react";
export default function Gallery({ sections }) {
  const [view, setView] = useState(null);
  useEffect(() => {
    const k = e => e.key === "Escape" && setView(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  return (<>
    {sections.map(s => (
      <section key={s.name}>
        <div className="sh"><h2>{s.name}</h2><hr /></div>
        <div className="grid">
          {s.images.map(im => (
            <div key={im.url} className="tile"><img src={im.url} alt="" loading="lazy" onClick={() => setView(im.url)} style={{ cursor: "zoom-in" }} /></div>
          ))}
        </div>
      </section>
    ))}
    {view && <div className="lb" onClick={() => setView(null)}><img src={view} alt="" /></div>}
  </>);
}
