"use client";
import { useEffect, useRef, useState } from "react";
const nice = p => decodeURIComponent(p.split("/").pop()).replace(/^\d+-/, "").replace(/\.[^.]+$/, "");
export default function MusicPlayer() {
  const a = useRef(null), want = useRef(false);
  const [t, setT] = useState([]), [i, setI] = useState(0), [on, setOn] = useState(false), [err, setErr] = useState(""), [vol, setVol] = useState(0.15);
  const play = () => { setErr(""); a.current?.play().then(() => setOn(true)).catch(e => { setOn(false); setErr(e.message); }); };
  useEffect(() => {
    const ld = () => fetch("/api/list?prefix=music/").then(r => r.json()).then(j => setT(j.files || [])).catch(() => {});
    ld(); window.addEventListener("music-changed", ld);
    return () => window.removeEventListener("music-changed", ld);
  }, []);
  useEffect(() => { if (a.current) a.current.volume = vol; }, [vol, t.length]);
  useEffect(() => { if (want.current) play(); }, [i]);
  if (!t.length) return null;
  const go = d => {
    want.current = true;
    if (t.length === 1) { a.current.currentTime = 0; play(); } else setI(x => (x + d + t.length) % t.length);
  };
  const toggle = () => { if (on) { want.current = false; a.current.pause(); setOn(false); } else { want.current = true; play(); } };
  return (
    <div className="music">
      <audio ref={a} src={t[i].url} preload="auto" onEnded={() => go(1)} onError={() => { setOn(false); setErr("Can't play this file. Try an mp3."); }} />
      <button onClick={() => go(-1)} aria-label="Previous">⏮</button>
      <button onClick={toggle} aria-label="Play or pause">{on ? "⏸" : "▶"}</button>
      <button onClick={() => go(1)} aria-label="Next">⏭</button>
      <input type="range" min="0" max="1" step="0.05" value={vol} onChange={e => setVol(+e.target.value)} aria-label="Volume" />
      <span>{err || nice(t[i].pathname)}</span>
    </div>
  );
}
