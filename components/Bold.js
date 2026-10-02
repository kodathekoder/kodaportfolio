export default function Bold({ text }) {
  return text.split("**").map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p));
}
