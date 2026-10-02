"use client";
import { useEffect, useState } from "react";
const COLORS = { online: "#22c55e", idle: "#f59e0b", dnd: "#ef4444", offline: "#6b7280" };
const fmt = ms => { const s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600);
  return (h ? String(h).padStart(2, "0") + ":" : "") + String(Math.floor(s / 60) % 60).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
export default function DiscordCard({ id }) {
  const [d, setD] = useState(null);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    let alive = true;
    const load = () => fetch(`https://api.lanyard.rest/v1/users/${id}`).then(r => r.json()).then(j => alive && j.success && setD(j.data)).catch(() => {});
    load(); const a = setInterval(load, 15000), b = setInterval(() => setNow(Date.now()), 1000);
    return () => { alive = false; clearInterval(a); clearInterval(b); };
  }, [id]);
  if (!d) return <div className="card"><div className="who"><div className="av" /><b>Loading...</b></div></div>;
  const u = d.discord_user;
  const avatar = u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png";
  const act = d.activities.find(a => a.type === 0) || d.activities.find(a => a.type === 2);
  const img = !act ? null : act.type === 2 && act.assets?.large_image?.startsWith("spotify:") ? `https://i.scdn.co/image/${act.assets.large_image.slice(8)}`
    : act.application_id && act.assets?.large_image && !act.assets.large_image.startsWith("mp:") ? `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.large_image}.png` : null;
  return (
    <div className="card">
      <div className="who">
        <div className="avw"><img src={avatar} alt="" className="av" /><i className="sdot" style={{ background: COLORS[d.discord_status] }} /></div>
        <b>{u.username}</b>
      </div>
      {act && <div className="act">
        {img ? <img src={img} alt="" className="ico" /> : <div className="ico" />}
        <div><b>{act.type === 2 ? act.details : act.name}</b>
          <small>{act.type === 2 ? act.state : act.timestamps?.start ? `${fmt(now - act.timestamps.start)} elapsed` : act.details || ""}</small></div>
      </div>}
    </div>
  );
}
