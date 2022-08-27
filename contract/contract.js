import {ethers} from "ethers";
import { UNKSABI } from "./UNKSABI";

export const UNKSContract = (chainID, provider, signer) => {
    let contractAddress;
    
    // if (chainID == "0x1") {
    //     contractAddress = MN_ADDRESS;
    // }
    
    if (chainID == "0x64") {
        contractAddress = "0x28baAB260cC2963a4A0d084cDBE8Af6CC5cC960C";
    }

    if (typeof contractAddress == "undefined") {
        alert("You must change your chain");
        return null;
    }

    const read = new ethers.Contract(contractAddress, UNKSABI, provider);
    const write = new ethers.Contract(contractAddress, UNKSABI, signer);
    return {read, write};
}