"use client";
import { useEffect, useRef, useState } from "react";
const nice = p => decodeURIComponent(p.split("/").pop()).replace(/^\d+-/, "").replace(/\.[^.]+$/, "");
export default function MusicPlayer() {
  const a = useRef(null);
  const [t, setT] = useState([]), [i, setI] = useState(0), [on, setOn] = useState(false);
  useEffect(() => { fetch("/api/list?prefix=music/").then(r => r.json()).then(j => setT(j.files || [])).catch(() => {}); }, []);
  useEffect(() => { if (a.current && on) a.current.play().catch(() => setOn(false)); }, [i, on]);
  if (!t.length) return null;
  const go = d => { setI(x => (x + d + t.length) % t.length); setOn(true); };
  const toggle = () => { if (on) { a.current.pause(); setOn(false); } else { a.current.play().then(() => setOn(true)).catch(() => {}); } };
  return (
    <div className="music">
      <audio ref={a} src={t[i].url} onEnded={() => go(1)} />
      <button onClick={() => go(-1)} aria-label="Previous">⏮</button>
      <button onClick={toggle} aria-label="Play or pause">{on ? "⏸" : "▶"}</button>
      <button onClick={() => go(1)} aria-label="Next">⏭</button>
      <span>{nice(t[i].pathname)}</span>
    </div>
  );
}
