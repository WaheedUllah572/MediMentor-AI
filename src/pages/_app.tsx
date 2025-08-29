// pages/_app.tsx
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next"; 
import "../styles/globals.css"; // keep your global styles

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

// ✅ Wrap with appWithTranslation so translations work everywhere
export default appWithTranslation(MyApp);
