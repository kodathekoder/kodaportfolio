"use client";
import { useEffect, useRef, useState } from "react";
const nice = p => decodeURIComponent(p.split("/").pop()).replace(/^\d+-/, "").replace(/\.[^.]+$/, "");
export default function MusicPlayer() {
  const a = useRef(null);
  const [t, setT] = useState([]), [i, setI] = useState(0), [on, setOn] = useState(false), [err, setErr] = useState("");
  useEffect(() => { fetch("/api/list?prefix=music/").then(r => r.json()).then(j => setT(j.files || [])).catch(() => {}); }, []);
  if (!t.length) return null;
  const play = () => { setErr(""); a.current.play().then(() => setOn(true)).catch(e => { setOn(false); setErr(e.message); }); };
  const go = d => { setI(x => (x + d + t.length) % t.length); setTimeout(play, 50); };
  const toggle = () => { if (on) { a.current.pause(); setOn(false); } else play(); };
  return (
    <div className="music">
      <audio ref={a} src={t[i].url} preload="auto" onEnded={() => go(1)} onError={() => { setOn(false); setErr("Can't play this file. Try an mp3."); }} />
      <button onClick={() => go(-1)} aria-label="Previous">⏮</button>
      <button onClick={toggle} aria-label="Play or pause">{on ? "⏸" : "▶"}</button>
      <button onClick={() => go(1)} aria-label="Next">⏭</button>
      <span>{err || nice(t[i].pathname)}</span>
    </div>
  );
}
