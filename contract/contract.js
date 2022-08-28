import {ethers} from "ethers";
import { UNKSABI } from "./UNKSABI";

export const UNKSContract = (chainID, provider, signer) => {
    let contractAddress;
    
    if (chainID == "0x1") {
        contractAddress = "0x68c5c7e6dBD563EE3E55153302Dc9A202024f4Ce";
    }
    
    // if (chainID == "0x64") {
    //     contractAddress = "0x28baAB260cC2963a4A0d084cDBE8Af6CC5cC960C";
    // }

    if (typeof contractAddress == "undefined") {
        alert("You must change your chain to mainnet");
        return null;
    }

    const read = new ethers.Contract(contractAddress, UNKSABI, provider);
    const write = new ethers.Contract(contractAddress, UNKSABI, signer);
    return {read, write};
}