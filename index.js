require('dotenv').config()
const { ethers } = require('ethers');
const express = require("express");
const { createClient } =require('redis');

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});
const app = express();


const provider = new ethers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/83583UM3t8cuQevA8zUWcDT5CQ52Wc4O');
const erc721ABI = require('./ERC721ABI.json').ABI;

let contractOwnerBasedData = {}
let tokenIdBasedData = {}
let contractBasedData = {}
let ownerBasedData = {} 

const handleTX = async (contract, contractAddress, to , tokenId, event) => {
    let tokenURI;
    if(tokenId){
        const tokenIdString = tokenId.toString()
        tokenURI = await contract.tokenURI(tokenId);
        if (!contractOwnerBasedData[contractAddress + "-" + to]) {
            contractOwnerBasedData[contractAddress + "-" + to] = []
        }
        contractOwnerBasedData[contractAddress + "-" + to].push({"owner": to, "tokenId": tokenIdString, "tokenURI" : tokenURI });
        if(!tokenIdBasedData[contractAddress + "-" + tokenId]){
            tokenIdBasedData[contractAddress + "-" + tokenId] = []
        }
        tokenIdBasedData[contractAddress + "-" + tokenId].push({"owner" : to, "tokenId" : tokenIdString , "tokenURI" : tokenURI});
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



const subScribe = async (contractAddress = "0x2ac3C692f8cd4e87Bd46Ddf471EAAe59291D8b74") =>{
    const contract = new ethers.Contract(contractAddress, erc721ABI, provider);
    const filter = contract.filters['Transfer']();
    const events = await contract.queryFilter(filter, 0, 'latest');
    const users = new Set();
    events.forEach(async event => {
        handleTX(contract, contractAddress, event.args.to, event.args.tokenId, event);
    });
    contract.on('Transfer', handleTX());

}

subScribe();





// TODO: break the file into router.js and controller.js
app.get('/', (req, res) => {
    res.send("Hello world");
})
app.get('/getAll/:address', (req, res) => {
    console.log(contractBasedData[req.params.address]);
    res.send(contractBasedData[req.params.address]);
});





app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), () => {
    console.log("Listening to port 8080");
})