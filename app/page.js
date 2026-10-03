import Link from "next/link";
import DiscordCard from "../components/DiscordCard";
import ViewCounter from "../components/ViewCounter";
import Bold from "../components/Bold";
import { config as c } from "../lib/config";
export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="left">
          <DiscordCard id={c.discordId} />
          <Link href="/portfolio" className="btn">View Portfolio →</Link>
        </div>
        <div className="right">
          {c.bio.map((t, i) => <p key={i}><Bold text={t} /></p>)}
          <ViewCounter />
        </div>
      </section>
      <section className="contact">
        <h2>{c.contact.title}</h2>
        <p className="muted">{c.contact.sub}</p>
        <div className="row">
          <div className="card pill"><div className="ico round">✉</div><div><small>Email Me</small><b>{c.contact.email}</b></div></div>
          <div className="card pill"><div className="ico round">💬</div><div><small>Discord Username</small><b>{c.contact.discord}</b></div></div>
        </div>
      </section>
    </main>
  );
}
