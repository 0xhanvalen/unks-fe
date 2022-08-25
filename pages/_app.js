import "../styles/globals.css";
import { EthersContextFC } from "../contexts/EthersProviderContext";

function MyApp({ Component, pageProps }) {
  return (
    <EthersContextFC>
      <Component {...pageProps} />
    </EthersContextFC>
  );
}

export default MyApp;
