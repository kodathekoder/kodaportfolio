"use client";
import { useEffect, useRef, useState } from "react";
const nice = p => decodeURIComponent(p.split("/").pop()).replace(/^\d+-/, "").replace(/\.[^.]+$/, "");
const mmss = s => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");
export default function MusicPlayer() {
  const a = useRef(null), want = useRef(false);
  const [t, setT] = useState([]), [i, setI] = useState(0), [on, setOn] = useState(false), [err, setErr] = useState("");
  const [vol, setVol] = useState(0.15), [pos, setPos] = useState(0), [dur, setDur] = useState(0);
  const play = () => { setErr(""); a.current?.play().then(() => setOn(true)).catch(e => { setOn(false); setErr(e.message); }); };
  useEffect(() => {
    const ld = () => fetch("/api/list?prefix=music/").then(r => r.json()).then(j => setT(j.files || [])).catch(() => {});
    const st = () => { want.current = true; play(); };
    ld(); window.addEventListener("music-changed", ld); window.addEventListener("music-start", st);
    return () => { window.removeEventListener("music-changed", ld); window.removeEventListener("music-start", st); };
  }, []);
  useEffect(() => { if (a.current) a.current.volume = vol; }, [vol, t.length]);
  useEffect(() => { if (want.current) play(); }, [i, t.length]);
  if (!t.length) return null;
  const go = d => {
    want.current = true;
    if (t.length === 1) { a.current.currentTime = 0; play(); } else setI(x => (x + d + t.length) % t.length);
  };
  const toggle = () => { if (on) { want.current = false; a.current.pause(); setOn(false); } else { want.current = true; play(); } };
  const seek = e => { const r = e.currentTarget.getBoundingClientRect(); if (dur) a.current.currentTime = ((e.clientX - r.left) / r.width) * dur; };
  return (<>
    <div className="mw">
      <audio ref={a} src={t[i].url} preload="auto" onEnded={() => go(1)} onTimeUpdate={() => setPos(a.current.currentTime)} onLoadedMetadata={() => setDur(a.current.duration)}
        onError={() => { setOn(false); setErr("Can't play this file. Try an mp3."); }} />
      <div className="lab">Now playing</div>
      <b className="mt">{err || nice(t[i].pathname)}</b>
      <div className="pb" onClick={seek}><i style={{ width: dur ? (pos / dur) * 100 + "%" : "0%" }} /></div>
      <div className="tm"><span>{mmss(pos)}</span><span>{mmss(dur)}</span></div>
      <div className="ct">
        <button onClick={() => go(-1)} aria-label="Previous">⏮</button>
        <button onClick={toggle} aria-label="Play or pause">{on ? "⏸" : "▶"}</button>
        <button onClick={() => go(1)} aria-label="Next">⏭</button>
      </div>
    </div>
    <div className="vol"><span className="lab">Volume</span><input type="range" min="0" max="1" step="0.05" value={vol} onChange={e => setVol(+e.target.value)} aria-label="Volume" /></div>
  </>);
}
