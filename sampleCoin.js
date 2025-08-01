const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2023", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  // checks if the chain is valid
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// creating instance
let sampleCoin = new Blockchain();
sampleCoin.addBlock(new Block(1, "01/02/2023", { amount: 4 }));
sampleCoin.addBlock(new Block(2, "01/03/2023", { amount: 10 }));

// checks if blockchain is valid
console.log("Is blockchain valid? " + sampleCoin.isChainValid());

// tampering the blockchain
sampleCoin.chain[1].data = { amount: 100 };
sampleCoin.chain[1].hash = sampleCoin.chain[1].calculateHash(); // re-checking validity
console.log(
  "Is blockchain valid after tampering? " + sampleCoin.isChainValid()
);

// console.log(JSON.stringify(sampleCoin, null, 4));

// to do:
