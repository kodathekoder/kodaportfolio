import "./globals.css";
import { Inter } from "next/font/google";
import PageChrome from "../components/PageChrome";
import MusicPlayer from "../components/MusicPlayer";
import TypingTitle from "../components/TypingTitle";
import { config } from "../lib/config";
const inter = Inter({ subsets: ["latin"] });
export const metadata = { title: config.tabText };
export default function Layout({ children }) {
  return (<html lang="en"><body className={inter.className}><TypingTitle text={config.tabText} />{children}<PageChrome /><MusicPlayer /></body></html>);
}
