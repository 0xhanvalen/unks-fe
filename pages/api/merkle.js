const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

import { unklist } from "../../contract/unklist";

const nodes = unklist.map((addr) => keccak256(addr));
const tree = new MerkleTree(nodes, keccak256, { sortPairs: true });

export default async function handler(req, res) {
    const body = JSON.parse(req.body);
    const addressToCheck = body.address;
    try {
        let root, leaf, boolean, proof, hexProof;
        leaf = keccak256(addressToCheck);
        root = tree.getRoot().toString("hex");
        hexProof = tree.getHexProof(leaf);
        proof = tree.getProof(leaf);
        boolean = tree.verify(proof, leaf, root);
        res.status(200).json({hexProof, boolean});
    } catch (error) {
        console.error({error});
        res.status(500).json({error});
    }
}
