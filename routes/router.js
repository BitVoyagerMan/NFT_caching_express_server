const express = require('express');
const router = express.Router();

const cacheController = require('../controllers/cacheController');

router.get('/getAll/:address', cacheController.getNFTsbyContract);
router.get('/getAll/:address/:userWallet', cacheController.getNFTsByContractAndUser);
router.get('/getWalletNFTs/:userWallet', cacheController.getNFTsByUser);
router.post('/subscribe', cacheController.addContract);
module.exports = router;
