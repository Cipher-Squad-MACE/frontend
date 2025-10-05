import "../styles/globals.css";
if (typeof window !== "undefined") {
  window.addEventListener("error", e => console.log("React Error", e.message));
}

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
