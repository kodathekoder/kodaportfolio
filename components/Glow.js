"use client";
import Link from "next/link";
export default function Glow({ href, className = "", children }) {
  const mv = e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", e.clientX - r.left + "px"); e.currentTarget.style.setProperty("--my", e.clientY - r.top + "px"); };
  const P = { className: "bc " + className, onMouseMove: mv };
  return href ? <Link href={href} {...P}>{children}</Link> : <div {...P}>{children}</div>;
}
