import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEthers } from "../contexts/EthersProviderContext";

export default function Home() {
  const { isUpdating, provider, signer, address, connectProvider } =
    useEthers();

  return <>{address}
  <button onClick={() => connectProvider()}>Connect</button></>;
}
