require('dotenv').config()
const { ethers } = require('ethers');
const express = require("express");
const app = express();


const provider = new ethers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/83583UM3t8cuQevA8zUWcDT5CQ52Wc4O');
const erc721ABI = [
    // {
    //     "anonymous": false,
    //     "inputs": [
    //         {
    //             "indexed": true,
    //             "internalType": "address",
    //             "name": "from",
    //             "type": "address"
    //         },
    //         {
    //             "indexed": true,
    //             "internalType": "address",
    //             "name": "to",
    //             "type": "address"
    //         },
    //         {
    //             "indexed": true,
    //             "internalType": "uint256",
    //             "name": "tokenId",
    //             "type": "uint256"
    //         }
    //     ],
    //     "name": "Transfer",
    //     "type": "event"
    // },
    {
        "inputs":[],"stateMutability":"nonpayable","type":"constructor"
    },
    {
        "anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"
    }
    ,
    {
        "anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"
    }
    ,
    {
        "anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"
    }
    ,
    {
        "inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"
    }
    ,
    {
        "inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"
    },
    {
        "inputs":[{"internalType":"string","name":"tokenURI","type":"string"}],"name":"createToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserNFTs","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"
    },
    {
        "inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"updateUsersNFTs","outputs":[],"stateMutability":"nonpayable","type":"function"
    }
];
let contractOwnerBasedData = {}
let tokenIdBasedData = {}
let contractBasedData = {}
let ownerBasedData = {} 

const contractAddress = "0x2ac3C692f8cd4e87Bd46Ddf471EAAe59291D8b74";
const contract = new ethers.Contract(contractAddress, erc721ABI, provider);
   
const addTransaction = async (from, to , tokenId, event) => {
    let tokenURI;
    if(tokenId){
        const tokenIdString = tokenId.toString()
        tokenURI = await contract.tokenURI(tokenId);
        //console.log("tokenURI", tokenURI);
        if (!contractOwnerBasedData[contractAddress + "-" + to]) {
            contractOwnerBasedData[contractAddress + "-" + to] = []
        }
        contractOwnerBasedData[contractAddress + "-" + to].push({"owner": to, "tokenId": tokenIdString, "tokenURI" : tokenURI });
        //console.log(contractOwnerBasedData);

        if(!tokenIdBasedData[contractAddress + "-" + tokenId]){
            tokenIdBasedData[contractAddress + "-" + tokenId] = []
        }
        tokenIdBasedData[contractAddress + "-" + tokenId].push({"owner" : to, "tokenId" : tokenIdString , "tokenURI" : tokenURI});
        //console.log(tokenIdBasedData);

        if(!contractBasedData[contractAddress]){
            contractBasedData[contractAddress] = []
        }
        contractBasedData[contractAddress].push({"owner" : to, "tokenId" : tokenIdString , "tokenURI" : tokenURI});
        //console.log(contractBasedData);

        if(!ownerBasedData[to]){
            ownerBasedData[to] = []
        }
        ownerBasedData[to].push({"owner" : to, "tokenId" : tokenIdString , "tokenURI" : tokenURI});
        //console.log(ownerBasedData);
    }
    
}
async function findAllUsers(eventName) {
    const filter = contract.filters[eventName]();
    const events = await contract.queryFilter(filter, 0, 'latest');
    //console.log(events)
    const users = new Set();
    events.forEach(async event => {
        addTransaction(event.args.from, event.args.to, event.args.tokenId, event);
    //const transactionHash = event.transactionHash; // Replace 'user' with the appropriate parameter name from your event
    //   const user = await provider.getTransaction(transactionHash); 
    //   //console.log(transactionHash);
    //   console.log(user.from)
    //   users.add(user);

    });
    
  }

findAllUsers('Transfer');

contract.on('Transfer', addTransaction());



















app.get('/', (req, res) => {
    res.send("Hello world");
})
app.get('/getAll/:address', (req, res) => {
    console.log(contractBasedData[req.params.address]);
    res.send(contractBasedData[req.params.address]);
});










app.set('port', process.env.PORT);
app.listen(app.get('port'), () => {
    console.log("Listening to port 8080");
})