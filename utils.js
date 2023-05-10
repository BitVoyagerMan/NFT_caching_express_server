
const database = require('./DB/db');
const { ethers } = require('ethers');
const erc721ABI = require('./ERC721ABI.json').ABI;
const provider = new ethers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/83583UM3t8cuQevA8zUWcDT5CQ52Wc4O');



// Instantiates a logging client

let contractOwnerBasedData = database.contractOwnerBasedData
let contractBasedData = database.contractBasedData
let ownerBasedData = database.ownerBasedData

const handleTX = async (contract, contractAddress, to , tokenId, event) => {
    let tokenURI;
    if(tokenId){
        const tokenIdString = tokenId.toString()
        tokenURI = await contract.tokenURI(tokenId);
        if (!contractOwnerBasedData[contractAddress + "-" + to]) {
            contractOwnerBasedData[contractAddress + "-" + to] = []
        }
        contractOwnerBasedData[contractAddress + "-" + to].push({"owner": to, "tokenId": tokenIdString, "tokenURI" : tokenURI });
        if(!contractBasedData[contractAddress]){
            contractBasedData[contractAddress] = []
        }
        contractBasedData[contractAddress].push({"owner" : to, "tokenId" : tokenIdString , "tokenURI" : tokenURI});
        if(!ownerBasedData[to]){
            ownerBasedData[to] = []
        }
        ownerBasedData[to].push({"owner" : to, "tokenId" : tokenIdString , "tokenURI" : tokenURI});
        
    }
    
}

// async function handleTransferEvents(contract, contractAddress) {
    
//   }

//let contract;
exports.subScribe = async (contractAddress = "0x2ac3C692f8cd4e87Bd46Ddf471EAAe59291D8b74") =>{
    const contract = new ethers.Contract(contractAddress, erc721ABI, provider);
    const filter = contract.filters['Transfer']();
    const events = await contract.queryFilter(filter, 0, 'latest');
    const users = new Set();
    console.log("contractAddress: "+ contractAddress);
    events.forEach(async event => {
        handleTX(contract, contractAddress, event.args.to, event.args.tokenId, event);
    });
    //await handleTransferEvents(contract, contractAddress);
    contract.on('Transfer', (from, to, tokenId, event) => {
        console.log("new transfer:" +to);
        handleTX(contract, contractAddress, to, tokenId, event);
    });
}

