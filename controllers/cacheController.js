

const database = require('../DB/db');
let contractOwnerBasedData = database.contractOwnerBasedData
let contractBasedData = database.contractBasedData
let ownerBasedData = database.ownerBasedData
exports.getNFTsbyContract = (req, res) => {
    console.log(contractBasedData[req.params.address]);
    res.send(contractBasedData[req.params.address]);
};

exports.getNFTsByContractAndUser = (req, res) => {
    res.send(contractOwnerBasedData[req.params.address + "-" + req.params.userWallet]);
};

exports.getNFTsByUser = (req, res) => {
    res.send(ownerBasedData[req.params.userWallet]);
};

exports.addContract = (req, res) => {
    contractAddress = req.body.address;

}