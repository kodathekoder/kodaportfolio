"use client";
import { usePathname, useRouter } from "next/navigation";
export default function PageChrome() {
  const path = usePathname(), router = useRouter();
  const home = path === "/";
  const back = () => (window.history.length > 1 ? router.back() : router.push("/"));
  return (<>
    {!home && <button className="back" onClick={back}>← Back</button>}
    <footer className="foot">koda was here :D - <a href="https://discord.gg/t4VYmx9D4C" target="_blank" rel="noopener noreferrer">Discord</a></footer>
  </>);
}
