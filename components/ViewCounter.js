"use client";
import { useEffect, useState } from "react";
export default function ViewCounter() {
  const [v, setV] = useState(null);
  useEffect(() => {
    let last = 0; try { last = +localStorage.getItem("viewed") || 0; } catch {}
    const count = Date.now() - last > 864e5; // counts a visitor once per 24h
    fetch("/api/views", { method: count ? "POST" : "GET" }).then(r => r.json()).then(j => {
      setV(j.views); if (count) try { localStorage.setItem("viewed", String(Date.now())); } catch {}
    }).catch(() => {});
  }, []);
  return <small className="views">Views: <b>{v === null ? "..." : v.toLocaleString()}</b></small>;
}
