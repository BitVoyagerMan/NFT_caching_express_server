const express = require('express');
const router = express.Router();

const cacheController = require('../controllers/cacheController');

router.get('/getAll/:address', cacheController.getAllNFTsbyContract);
router.get('/getAll/:address/:userWallet', cacheController.getNFTsByContractAndUser);
router.post('/getWalletNFTs/:userWallet', cacheController.getNFTsByUser);

module.exports = router;
