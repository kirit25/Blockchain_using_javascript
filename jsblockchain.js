const SHA256 = require("crypto-js/sha256")

class Transaction{
    constructor(fromAddress , toAddress , amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block{
    constructor(timestamp,transaction,previosHash=''){
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previosHash = previosHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        // we will be using SHA256 cryptographic function to generate the hash of this block
        return SHA256(this.timestamp+this.previosHash+JSON.stringify(this.transaction)+this.nonce).toString();
    }

    mineNewBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty +1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        } 
        console.log("A new block was mined with hash "+ this.hash);
    }
}
class Blockchain{
    constructor(){
        // the first variable of the array will be the genisos block, created manually
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransaction = [];
        this.miningReward = 10;
    }
    createGenesisBlock(){
        return new Block("23/05/2021", "this is the genesis block","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1]
    }
    minePendingTransaction(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransaction, this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("Block mined successfully");

        this.chain.push(block);
        this.pendingTransaction = [
            new Transaction(null,miningRewardAddress,this.miningReward)
        ];

    }
    createTransaction(transaction){
        this.pendingTransaction.push(transaction);
    }
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transaction){
                if(trans.fromAddress === address){
                    balance = balance-trans.amount;
                }
                if(trans.toAddress === address){
                    balance = balance+trans.amount;
                }
            }
        }
        return balance;
    }
    // addBlock(newBlock){
        // newBlock.previosHash = this.getLatestBlock().hash;
        // newBlock.mineNewBlock(this.difficulty)
        // this.chain.push(newBlock);
        //new block object
        //the hash of the previous block
        //calculate the hash of current block
    
    checkBlockValid(){
        for (let i=1; i< this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.previosHash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previosHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }

}
// // creating two new blocks
// let block1 = new Block(1, "24/05/2021",{mybalance: 100});
// let block2 = new Block(2,"25/05/2021",{mybalance: 50});

// //create a new block chain
// let myBlockChain = new Blockchain();

// // adding the new blocks to the block chain
// console.log("the first block creation");
// myBlockChain.addBlock(block1);
// console.log("this second block creation")
// myBlockChain.addBlock(block2);
// console.log(JSON.stringify(myBlockChain,null,4));
let  bittyCoin = new Blockchain();
transaction1 = new Transaction("Tom", "Jerry", 100)
bittyCoin.createTransaction();

transaction2 = new Transaction("jerry", "Tom", 30)
bittyCoin.createTransaction();

console.log("started mining by the miner...")
bittyCoin.minePendingTransaction("donald")

console.log("balance for tom is:"+bittyCoin.getBalanceOfAddress("tom"));
console.log("balance for jerry is:"+bittyCoin.getBalanceOfAddress("jerry"));
console.log("balance for miner is:"+bittyCoin.getBalanceOfAddress("donald"));

// console.log(JSON.stringify(myBlockChain,null,4));
// console.log("Validation check for the block chain before hacking:" +myBlockChain.checkBlockValid());

// myBlockChain.chain[1].data = {mybalance : 5000};
// console.log(JSON.stringify(myBlockChain,null,4));
// console.log("Validation check for block chain after hacking:" +myBlockChain.checkBlockValid());