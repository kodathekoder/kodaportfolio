import Bold from "../components/Bold";
import ViewCounter from "../components/ViewCounter";
import DiscordCard from "../components/DiscordCard";
import PortfolioSection from "../components/PortfolioSection";
import { config as c } from "../lib/config";
export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <main>
      <section className="hero"><DiscordCard id={c.discordId} buttons={c.buttons} /></section>
      <section className="about">
        {c.bio.map((t, i) => <p key={i}><Bold text={t} /></p>)}
        <ViewCounter />
      </section>
      <PortfolioSection />
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
