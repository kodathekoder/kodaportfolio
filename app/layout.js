import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import AdminOverlay from "../components/AdminOverlay";
import PageChrome from "../components/PageChrome";
import MusicPlayer from "../components/MusicPlayer";
import TypingTitle from "../components/TypingTitle";
import { config } from "../lib/config";
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--mono" });
export const metadata = { title: config.tabText };
export default function Layout({ children }) {
  return (<html lang="en"><body className={`${mono.className} ${mono.variable}`}><TypingTitle text={config.tabText} />{children}<PageChrome /><MusicPlayer /><AdminOverlay /></body></html>);
}
