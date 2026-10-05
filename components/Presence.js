"use client";
import { useEffect, useState } from "react";
import Glow from "./Glow";
const COLORS = { online: "#22c55e", idle: "#f59e0b", dnd: "#ef4444", offline: "#6b7280" };
const NAMES = { online: "Online", idle: "Idle", dnd: "Do Not Disturb", offline: "Offline" };
const LABELS = { 0: "Playing", 1: "Streaming", 2: "Listening to", 3: "Watching", 5: "Competing in" };
export default function Presence({ id }) {
  const [d, setD] = useState(null), [err, setErr] = useState("");
  useEffect(() => {
    if (!/^\d{15,}$/.test(String(id))) { setErr("Set discordId in lib/config.js"); return; }
    let alive = true;
    const load = () => fetch(`https://api.lanyard.rest/v1/users/${id}`).then(r => r.json()).then(j => { if (!alive) return; if (j.success) { setD(j.data); setErr(""); } else setErr(j.error?.message || "Lanyard error"); }).catch(() => setErr("Couldn't reach Lanyard"));
    load(); const a = setInterval(load, 15000);
    return () => { alive = false; clearInterval(a); };
  }, [id]);
  if (!d) return <Glow className="s12 pres"><div><div className="lab">Discord presence</div><div className="mut">{err || "Loading..."}</div></div></Glow>;
  const u = d.discord_user, st = d.discord_status, sp = d.listening_to_spotify && d.spotify;
  const act = d.activities.find(a => a.type !== 4);
  const avatar = u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png";
  return (
    <Glow className="s12 pres">
      <div className="avw"><img src={avatar} alt="" className="av" /><i className="sdot" style={{ background: COLORS[st] }} /></div>
      <div className="pmain"><div className="lab">Discord presence</div><div className="pname">{u.global_name || u.username}</div><div className="mut">{NAMES[st]}</div></div>
      {(sp || act) && <div className="pact"><div className="lab">{sp ? "Listening to" : LABELS[act.type] || "Activity"}</div><div>{sp ? `${sp.song} · ${sp.artist}` : act.name}</div></div>}
    </Glow>
  );
}
