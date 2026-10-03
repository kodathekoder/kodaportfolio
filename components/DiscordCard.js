"use client";
import { useEffect, useState } from "react";
import { FaGithub, FaDiscord, FaEnvelope, FaLink, FaXTwitter, FaYoutube, FaTwitch, FaInstagram, FaTiktok, FaSpotify, FaBehance } from "react-icons/fa6";
const ICONS = { github: FaGithub, discord: FaDiscord, mail: FaEnvelope, link: FaLink, x: FaXTwitter, youtube: FaYoutube, twitch: FaTwitch, instagram: FaInstagram, tiktok: FaTiktok, spotify: FaSpotify, behance: FaBehance };
const COLORS = { online: "#22c55e", idle: "#f59e0b", dnd: "#ef4444", offline: "#6b7280" };
const NAMES = { online: "Online", idle: "Idle", dnd: "Do Not Disturb", offline: "Offline" };
const LABELS = { 0: "PLAYING", 1: "STREAMING", 2: "LISTENING", 3: "WATCHING", 5: "COMPETING" };
const HOUSES = { 64: "HypeSquad Bravery", 128: "HypeSquad Brilliance", 256: "HypeSquad Balance" };
const fmt = ms => { const s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600);
  return (h ? h + ":" + String(Math.floor(s / 60) % 60).padStart(2, "0") : Math.floor(s / 60)) + ":" + String(s % 60).padStart(2, "0"); };
export default function DiscordCard({ id, buttons = [] }) {
  const [d, setD] = useState(null), [now, setNow] = useState(Date.now()), [err, setErr] = useState("");
  useEffect(() => {
    if (!/^\d{15,}$/.test(String(id))) { setErr("Set discordId in lib/config.js to your numeric Discord user ID"); return; }
    let alive = true;
    const load = () => fetch(`https://api.lanyard.rest/v1/users/${id}`).then(r => r.json()).then(j => { if (!alive) return; if (j.success) { setD(j.data); setErr(""); } else setErr(j.error?.message || "Lanyard error"); }).catch(() => setErr("Couldn't reach Lanyard"));
    load(); const a = setInterval(load, 15000), b = setInterval(() => setNow(Date.now()), 1000);
    return () => { alive = false; clearInterval(a); clearInterval(b); };
  }, [id]);
  if (!d) return <div className="pc"><b>{err || "Loading..."}</b></div>;
  const u = d.discord_user, st = d.discord_status, col = COLORS[st];
  const avatar = u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128` : "https://cdn.discordapp.com/embed/avatars/0.png";
  const custom = d.activities.find(a => a.type === 4)?.state;
  const house = Object.entries(HOUSES).find(([b]) => u.public_flags & b)?.[1];
  const tag = custom || house;
  const sp = d.listening_to_spotify && d.spotify;
  const act = d.activities.find(a => a.type !== 4);
  let label, title, sub, img, since;
  if (sp) { label = "LISTENING ON SPOTIFY"; title = sp.song; sub = "by " + sp.artist; img = sp.album_art_url; since = sp.timestamps?.start; }
  else if (act) {
    label = LABELS[act.type] || "ACTIVITY"; title = act.name; sub = act.details || act.state || ""; since = act.timestamps?.start;
    const li = act.assets?.large_image;
    if (act.application_id && li && !li.startsWith("mp:") && !li.startsWith("spotify:")) img = `https://cdn.discordapp.com/app-assets/${act.application_id}/${li}.png`;
  }
  return (
    <div className="pc">
      <div className="pc-top">
        <div className="avw"><img src={avatar} alt="" className="av" /><i className="sdot" style={{ background: col }} /></div>
        <div className="pc-pills">
          <div><div className="pc-name">{u.global_name || u.username}</div><div className="pc-h">@{u.username}</div></div>
          <span className="tag" style={{ color: col, background: col + "1f", borderColor: col + "33" }}><i />{NAMES[st]}</span>
          {tag && <span className="tag">{tag}</span>}
        </div>
      </div>
      {buttons.length > 0 && <div className="pc-btns">{buttons.map(b => { const I = ICONS[b.icon] || FaLink;
        return <a key={b.label + b.url} href={b.url} target="_blank" rel="noopener noreferrer" title={b.label} aria-label={b.label}><I /></a>; })}</div>}
      {title && <div className="pc-act">
        <div className="pc-lab">{label}</div>
        <div className="pc-row">
          {img ? <img src={img} alt="" /> : <div className="ph" />}
          <div><b>{title}</b>{sub && <small>{sub}</small>}{since && <small>{fmt(now - since)} elapsed</small>}</div>
        </div>
      </div>}
    </div>
  );
}
