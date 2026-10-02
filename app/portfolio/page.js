import { list } from "@vercel/blob";
import Gallery from "../../components/Gallery";
import { config as c } from "../../lib/config";
export const dynamic = "force-dynamic";
export default async function Portfolio() {
  const sections = [];
  for (const name of c.portfolio.sections) {
    let images = [];
    try { images = (await list({ prefix: `work/${name}/` })).blobs.map(b => ({ url: b.url })); } catch {}
    sections.push({ name, images });
  }
  const open = c.commissionsOpen;
  return (
    <main className="work">
      <header>
        <div><h1>{c.portfolio.title}</h1><p className="muted">{c.portfolio.sub}</p></div>
        <div className="card status">
          <b><i className={"dot " + (open ? "g" : "r")} />{open ? "Commissions Open" : "Commissions Closed"}</b>
          <small>{open ? "My commissions are currently open, message me!" : "My commissions are currently closed, check back soon!"}</small>
        </div>
      </header>
      <Gallery sections={sections} />
    </main>
  );
}
