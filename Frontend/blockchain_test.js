const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

class Block {
    constructor(index, timestamp, proof, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.proof = proof;
        this.previousHash = previousHash;
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.createBlock(1, '0');
    }

    createBlock(proof, previousHash) {
        const block = new Block(
            this.chain.length + 1,
            new Date().toString(),
            proof,
            previousHash
        );
        this.chain.push(block);
        return block;
    }

    getPreviousBlock() {
        return this.chain[this.chain.length - 1];
    }

    proofOfWork(previousProof) {
        let newProof = 1;
        let checkProof = false;

        while (!checkProof) {
            const hashOperation = crypto
                .createHash('sha256')
                .update((newProof ** 2 - previousProof ** 2).toString())
                .digest('hex');
            
            if (hashOperation.substring(0, 5) === '00000') {
                checkProof = true;
            } else {
                newProof++;
            }
        }

        return newProof;
    }

    hash(block) {
        const blockString = JSON.stringify(block);
        return crypto
            .createHash('sha256')
            .update(blockString)
            .digest('hex');
    }

    isChainValid(chain) {
        let previousBlock = chain[0];
        let blockIndex = 1;

        while (blockIndex < chain.length) {
            const block = chain[blockIndex];
            if (block.previousHash !== this.hash(previousBlock)) {
                return false;
            }

            const previousProof = previousBlock.proof;
            const proof = block.proof;
            const hashOperation = crypto
                .createHash('sha256')
                .update((proof ** 2 - previousProof ** 2).toString())
                .digest('hex');

            if (hashOperation.substring(0, 5) !== '00000') {
                return false;
            }

            previousBlock = block;
            blockIndex++;
        }

        return true;
    }
}

const app = express();
app.use(bodyParser.json());

const blockchain = new Blockchain();

// Mine a new block
app.get('/mine_block', (req, res) => {
    const previousBlock = blockchain.getPreviousBlock();
    const previousProof = previousBlock.proof;
    const proof = blockchain.proofOfWork(previousProof);
    const previousHash = blockchain.hash(previousBlock);
    const block = blockchain.createBlock(proof, previousHash);

    const response = {
        message: 'A block is MINED',
        index: block.index,
        timestamp: block.timestamp,
        proof: block.proof,
        previous_hash: block.previousHash
    };

    res.status(200).json(response);
});

// Get the full blockchain
app.get('/get_chain', (req, res) => {
    const response = {
        chain: blockchain.chain,
        length: blockchain.chain.length
    };
    res.status(200).json(response);
});

// Check if the blockchain is valid
app.get('/valid', (req, res) => {
    const valid = blockchain.isChainValid(blockchain.chain);
    if (valid) {
        res.status(200).json({ message: 'The Blockchain is valid.' });
    } else {
        res.status(200).json({ message: 'The Blockchain is not valid.' });
    }
});

// Run the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});