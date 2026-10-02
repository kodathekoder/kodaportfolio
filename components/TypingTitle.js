"use client";
import { useEffect } from "react";
// Types K, Ko, Kod... then slowly deletes, then loops.
export default function TypingTitle({ text }) {
  useEffect(() => {
    let i = 1, dir = 1, t;
    const tick = () => {
      document.title = text.slice(0, i);
      let delay = dir === 1 ? 250 : 400;          // typing speed / delete speed (ms)
      if (dir === 1 && i === text.length) { dir = -1; delay = 1500; }
      else if (dir === -1 && i === 1) { dir = 1; delay = 700; }
      else i += dir;
      t = setTimeout(tick, delay);
    };
    tick();
    return () => clearTimeout(t);
  }, [text]);
  return null;
}
