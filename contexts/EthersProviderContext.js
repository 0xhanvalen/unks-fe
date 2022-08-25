import { useState, useContext, createContext } from "react";
import { ethers } from "ethers";
import { useEffectOnce } from "react-use";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

export const EthersContext = createContext(null);

export const EthersContextFC = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectProvider = async () => {
    setIsUpdating(true);
    const providerOptions = getProviderOptions();

    const web3modal = new Web3Modal({ providerOptions });

    const instance = await web3modal.connect();
    const tempProvider = new ethers.providers.Web3Provider(instance);
    const tempSigner = tempProvider.getSigner();
    const tempAddress = await tempSigner.getAddress();
    setProvider(tempProvider);
    setSigner(tempSigner);
    setAddress(tempAddress);
  };

  useEffectOnce(() => {
    window?.ethereum?.on("accountsChanged", (accounts) => {
        setAddress(accounts[0]);
    })
  })

  return (
    <EthersContext.Provider
      value={{ connectProvider, isUpdating, provider, signer, address }}
    >
      {children}
    </EthersContext.Provider>
  );
};

export const useEthers = () => {
  const { isUpdating, provider, signer, address, connectProvider } =
    useContext(EthersContext);
  return { isUpdating, provider, signer, address, connectProvider };
};

const addNetworkProviders = (chainData) => {
  const allProviders = {};
  if (!chainData) {
    // this will fire if window.ethereum exists, but the user is on the wrong chain
    return false;
  }

  const providersToAdd = chainData.providers;

  if (providersToAdd.includes("walletconnect")) {
    allProviders.walletconnect = {
      network: chainData.network,
      package: WalletConnectProvider,
      options: {
        rpc: {
          1: `https://mainnet.infura.io/v3/9044d022c0f14ecc956da8c71ccdd523`,
          100: `https://rpc.gnosischain.com`,
        },
      },
    };
  }

  return allProviders;
};

export const attemptInjectedChainData = () => {
  return isInjected()
    ? chainByID(`${window.ethereum?.chainId}`)
    : chainByID("0x1");
};

const isInjected = () => {
  if (window.ethereum?.chainId) {
    return true;
  }
};

export const getProviderOptions = () =>
  addNetworkProviders(attemptInjectedChainData());

export const supportedChains = {
  "0x1": {
    name: "Ethereum Mainnet",
    short_name: "eth",
    chain: "ETH",
    network: "mainnet",
    network_id: 1,
    chain_id: "0x1",
    providers: ["walletconnect"],
    // , 'portis', 'fortmatic'
    rpc_url: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_RPC_KEY}`,
    block_explorer: "https://etherscan.io",
  },
  "0x64": {
    name: "xDAI Chain",
    short_name: "xdai",
    chain: "xDAI",
    network: "xdai",
    network_id: 100,
    chain_id: "0x64",
    providers: ["walletconnect"],
    // , 'portis',
    rpc_url: "https://rpc.gnosischain.com",
    block_explorer: "https://blockscout.com/poa/xdai",
  },
};

export const chainByID = (chainID) => {
  return supportedChains[chainID];
};

export const chainByNetworkId = (networkId) => {
  const idMapping = {
    1: supportedChains["0x1"],
    100: supportedChains["0x64"],
  };

  return idMapping[networkId];
};
