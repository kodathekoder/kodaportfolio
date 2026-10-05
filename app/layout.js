import "./globals.css";
import { Outfit } from "next/font/google";
import Splash from "../components/Splash";
import PageChrome from "../components/PageChrome";
import MusicPlayer from "../components/MusicPlayer";
import TypingTitle from "../components/TypingTitle";
import { config } from "../lib/config";
const font = Outfit({ subsets: ["latin"] });
export const metadata = { title: config.tabText };
export default function Layout({ children }) {
  return (<html lang="en"><body className={font.className}><Splash /><TypingTitle text={config.tabText} />{children}<PageChrome /><MusicPlayer /></body></html>);
}
