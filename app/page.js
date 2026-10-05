import Glow from "../components/Glow";
import Presence from "../components/Presence";
import ViewCounter from "../components/ViewCounter";
import { config as c } from "../lib/config";
import { bento as b } from "../lib/bento";
export default function Home() {
  const open = c.commissionsOpen;
  return (
    <main className="bento">
      <a className="cpill" href={`mailto:${c.contact.email}`}>CONTACT</a>
      <Presence id={c.discordId} />
      <Glow className="s5">
        <div className="lab">{b.role}</div><h1 className="name">{b.name}</h1><p className="mut">{b.about}</p>
      </Glow>
      <Glow className="s7">
        <div className="lab">Tools I use</div>
        {[0, 1, 2].map(r => { const l = [...b.tools.slice(r * 2), ...b.tools.slice(0, r * 2)];
          return <div key={r} className={"mq" + (r % 2 ? " rev" : "")}><div className="tr">{[...l, ...l].map((t, i) => <span key={i} className="tc"><i />{t}</span>)}</div></div>; })}
      </Glow>
      <Glow className="s3">
        <div className="lab">Connect</div>
        {c.buttons.map(x => <a key={x.label} className="cl" href={x.url} target="_blank" rel="noopener noreferrer">{x.label}<span>→</span></a>)}
      </Glow>
      <Glow className="s3">
        <div className="lab">Work status</div>
        <span className={"avail" + (open ? "" : " no")}><i />{open ? "Available for projects" : "Not taking projects"}</span>
      </Glow>
      <Glow className="s6">
        <div className="lab">Completed projects</div><div className="big">{b.completed.title}</div><p className="mut">{b.completed.text}</p><ViewCounter />
      </Glow>
      <Glow className="s12"><div className="lab">Mindset</div><div className="quote">&ldquo;{b.mindset}&rdquo;</div></Glow>
    </main>
  );
}
