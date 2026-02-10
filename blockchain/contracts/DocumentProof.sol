// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract DocumentProof {
    struct Proof {
        address uploader;
        uint256 timestamp;
    }

    mapping(string => Proof) private proofs;

    event ProofStored(string hash, address uploader, uint256 timestamp);

    function storeProof(string memory hash) public {
        require(proofs[hash].timestamp == 0, "Proof already exists");

        proofs[hash] = Proof({
            uploader: msg.sender,
            timestamp: block.timestamp
        });

        emit ProofStored(hash, msg.sender, block.timestamp);
    }

    function getProof(string memory hash)
        public
        view
        returns (bool exists, address uploader, uint256 timestamp)
    {
        Proof memory proof = proofs[hash];

        if (proof.timestamp == 0) {
            return (false, address(0), 0);
        }

        return (true, proof.uploader, proof.timestamp);
    }
}
