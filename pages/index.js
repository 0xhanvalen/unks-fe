import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEthers } from "../contexts/EthersProviderContext";
import { useState, useEffect } from "react";
import { UNKSContract } from "../contract/contract";

export default function Home() {
  const { isUpdating, provider, signer, address, connectProvider } =
    useEthers();

  const [amountToMint, setAmountToMint] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contract, setContract] = useState(null);

  const handleChange = (e) => {
    let val = e.target.value;
    if (val <= 4 && val > 0) {
      setAmountToMint(val);
    }
  };

  async function getContract() {
    if (!!provider && !!address) {
      let network = await provider.getNetwork();
      let tempContract = UNKSContract(network.chainId, provider, signer);
      setContract(tempContract);
    }
  }

  useEffect(() => {
    getContract();
  }, [address, provider]);

  const publicMint = async () => {
    const transaction = contract?.write?.publicMint(amountToMint, {
      value: ethers.utils.parseEther(`${amountToMint * 0.03}`),
    });
    setIsModalOpen(true);
    const receipt = transaction.wait();
    if (receipt?.status === 1) {
      alert("Minted :3");
    }
    setIsModalOpen(false);
  };

  const allowListMint = async () => {
    const transaction = contract?.write?.allowlistMint(amountToMint, {
      value: ethers.utils.parseEther(`${amountToMint * 0.03}`),
    });
    setIsModalOpen(true);
    const receipt = transaction.wait();
    if (receipt?.status === 1) {
      alert("Minted :3");
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        style={{
          width: `100vw`,
          height: `100vh`,
          backgroundImage: `url(/AQUA.png)`,
          position: `fixed`,
        }}
      >
        <div
          style={{
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
          }}
        >
          <h2
            style={{
              color: `white`,
              backgroundColor: `#255C99`,
              padding: `0 1em`,
              fontFamily: `'Permanent Marker', cursive`,
              display: `block`,
              width: `fit-content`,
              fontSize: `10vh`,
              marginBottom: `0.5ex`,
            }}
          >
            UNKS
          </h2>
          <h3
            style={{
              color: `white`,
              backgroundColor: `#255C99`,
              padding: `0 1em`,
              fontFamily: `'Permanent Marker', cursive`,
              display: `block`,
              width: `fit-content`,
              fontSize: `5vh`,
              margin: `0 auto`,
            }}
          >
            official mint site
          </h3>
          <div
            style={{
              color: `#DDF8F0`,
              backgroundColor: `#1D9A75`,
              padding: `1ex 1em`,
              fontFamily: `'Fredoka One', cursive`,
              display: `block`,
              width: `fit-content`,
              maxWidth: `70ch`,
              margin: `1rem auto`,
              textAlign: `center`,
            }}
          >
            <p>Here's the deal:</p>
            <p>
              If you're on the unklist (you know who you are), you can start
              minting on August 28th at 10AM PST.
            </p>
            <p>
              If you're not unklisted, you gotta wait for 24 hours after that.
            </p>
            <p>The mint price is 0.03 ethereum each.</p>
            <p>You can only mint up to 4 per wallet.</p>
            {address && (
              <>
                <div
                  style={{
                    backgroundColor: `#DDF8F0`,
                    height: `2px`,
                    width: `80%`,
                    margin: `0 auto`,
                  }}
                ></div>
                <p>
                  Your currently connected wallet is: <br /> {address}
                </p>
                {Date.now() >= 1661695200000 && (
                  <>
                    <input
                      type="number"
                      value={amountToMint}
                      onChange={(e) => handleChange(e)}
                    />
                    <button onClick={() => publicMint()}>Mint Unks</button>
                  </>
                )}
                {console.log(Date.now(), " 1661608800 ", "1661695200")}
                {Date.now() >= 1661608800000 && Date.now() < 1661695200000 && (
                  <>
                    <input
                      type="number"
                      value={amountToMint}
                      onChange={(e) => handleChange(e)}
                    />
                    <button onClick={() => allowListMint()}>Mint Unks</button>
                  </>
                )}
              </>
            )}
            {!address && (
              <button onClick={() => connectProvider()}>Connect Wallet</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
