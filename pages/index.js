import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEthers } from "../contexts/EthersProviderContext";
import { useState, useEffect } from "react";
import { UNKSContract } from "../contract/contract";
import { ethers } from "ethers";
import SyncLoader from "react-spinners/SyncLoader";

export default function Home() {
  const { isUpdating, provider, signer, address, connectProvider } =
    useEthers();

  const [amountToMint, setAmountToMint] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnkMinted, setIsUnkMinted] = useState(false);
  const [contract, setContract] = useState(null);
  const [isAllowlist, setIsAllowlist] = useState(false);
  const [allowlistProof, setAllowlistProof] = useState(null);

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

  async function getMerkle() {
    if (!!address) {
      const stringedAddress = JSON.stringify({ address });
      const req = {
        method: "POST",
        body: stringedAddress,
      };
      const res = await fetch("/api/merkle", req);
      const jsonres = await res.json();
      console.log({ jsonres });
      setIsAllowlist(jsonres.boolean);
      setAllowlistProof(jsonres?.hexProof);
    }
  }

  useEffect(() => {
    console.log({ allowlistProof });
  }, [allowlistProof]);

  useEffect(() => {
    getContract();
    getMerkle();
  }, [address, provider]);

  const publicMint = async () => {
    const transaction = await contract?.write?.publicMint(amountToMint, {
      value: ethers.utils.parseEther(`${amountToMint * 0.03}`),
    });
    setIsModalOpen(true);
    const receipt = transaction.wait();
    if (receipt?.status === 1) {
      setIsUnkMinted(true);
    }
  };

  const allowListMint = async () => {
    const transaction = await contract?.write?.allowlistMint(
      amountToMint,
      allowlistProof,
      {
        value: ethers.utils.parseEther(`${amountToMint * 0.03}`),
      }
    );
    setIsModalOpen(true);
    console.log({ transaction });
    const receipt = transaction.wait();
    if (receipt?.status === 1) {
      setIsUnkMinted(true);
    }
  };

  return (
    <>
      <Head>
        <title>Unks Mint Site</title>
        <meta
          name="description"
          content="The official site for minting UNKS."
        />
      </Head>
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
            <p>Here&apos;s the deal:</p>
            <p>
              If you&apos;re on the unklist (you know who you are), you can
              start minting on August 28th at 10AM EST.
            </p>
            <p>
              If you&apos;re not unklisted, you gotta wait for 12 hours after
              that.
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
                {
                  Date.now() >= 1661738400000 && <>
                    <input
                      type="number"
                      value={amountToMint}
                      onChange={(e) => handleChange(e)}
                    />
                    <button onClick={() => publicMint()}>Mint Unks</button>
                  </>
                }
                {
                  Date.now() >= 1661695200000 && Date.now() < 1661738400000 && isAllowlist && (
                    <>
                      <input
                        type="number"
                        value={amountToMint}
                        onChange={(e) => handleChange(e)}
                      />
                      <button onClick={() => allowListMint()}>Mint Unks</button>
                    </>
                  )
                }
              </>
            )}
            {!address && (
              <button onClick={() => connectProvider()}>Connect Wallet</button>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <LoadingModal
          setIsModalOpen={setIsModalOpen}
          isUnkMinted={isUnkMinted}
        />
      )}
    </>
  );
}

const LoadingModal = (props) => {
  return (
    <>
      <div
        style={{
          backgroundColor: `rgba(0,0,0,0.2)`,
          width: `100vw`,
          height: `100vh`,
          position: `fixed`,
        }}
        onClick={props.setIsModalOpen(false)}
      ></div>
      <div
        style={{
          backgroundColor: `white`,
          width: `500px`,
          height: `500px`,
          padding: `2rem`,
          display: `grid`,
          placeItems: `center`,
          position: `fixed`,
          left: `50%`,
          top: `50%`,
          transform: `translateX(-50%) translateY(-50%)`,
        }}
      >
        <div
          style={{
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
          }}
        >
          <h3
            style={{
              color: `#255C99`,
              fontFamily: `'Permanent Marker', cursive`,
              display: `block`,
              width: `fit-content`,
              fontSize: `5vh`,
              margin: `0 auto`,
            }}
          >
            minting your unk...
          </h3>
          {!props?.isUnkMinted && (
            <>
              <br />
              <SyncLoader color="#255C99" />
            </>
          )}
          {props?.isUnkMinted && (
            <>
              <br />{" "}
              <a
                href="https://opensea.io/account"
                style={{
                  color: `#255C99`,
                  fontFamily: `'Permanent Marker', cursive`,
                  display: `block`,
                  width: `fit-content`,
                  fontSize: `5vh`,
                  margin: `0 auto`,
                  textDecoration: `underline`,
                }}
              >
                View Your Unks!
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
};
