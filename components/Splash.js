"use client";
import { useEffect, useState } from "react";
export default function Splash() {
  const [s, setS] = useState("in");
  useEffect(() => { try { if (sessionStorage.getItem("entered")) setS("gone"); } catch {} }, []);
  const enter = () => {
    try { sessionStorage.setItem("entered", "1"); } catch {}
    setS("out"); window.dispatchEvent(new Event("music-start")); setTimeout(() => setS("gone"), 600);
  };
  if (s === "gone") return null;
  return <div className={"splash" + (s === "out" ? " out" : "")} onClick={enter}><b>click to enter</b></div>;
}
