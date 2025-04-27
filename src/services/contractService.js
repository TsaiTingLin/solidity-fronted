import { ethers } from 'ethers';
import StockContractABI from '../contracts/StockContract.json';

// 從環境變量獲取合約地址和網絡 URL
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const networkUrl = import.meta.env.VITE_NETWORK_URL;

// 創建以太坊提供者
const provider = new ethers.JsonRpcProvider(networkUrl);

// 創建合約實例（用於讀取操作）
const contract = new ethers.Contract(
    contractAddress,
    StockContractABI.abi,
    provider
);

// 獲取剩餘庫存
const getRemainingStock = async () => {
    try {
        const result = await contract.getRemainingStock();
        return Number(result);
    } catch (error) {
        console.error('獲取剩餘庫存失敗:', error);
        throw error;
    }
};

// 獲取帳戶餘額
const getBalance = async (address) => {
    try {
        const result = await contract.getBalance(address);
        return Number(result);
    } catch (error) {
        console.error('獲取餘額失敗:', error);
        throw error;
    }
};

// 獲取交易歷史
const getTransactionHistory = async (address) => {
    try {
        const result = await contract.getTransactionHistory(address);
        return Number(result);
    } catch (error) {
        console.error('獲取交易歷史失敗:', error);
        throw error;
    }
};

// 購買股票
const buyStock = async (signer, amount) => {
    try {
        const contractWithSigner = contract.connect(signer);
        const tx = await contractWithSigner.buyStock(amount);
        await tx.wait();
        return tx;
    } catch (error) {
        console.error('購買股票失敗:', error);
        throw error;
    }
};

// 轉移股票
const transferStock = async (signer, to, amount) => {
    try {
        const contractWithSigner = contract.connect(signer);
        const tx = await contractWithSigner.transferStock(to, amount);
        await tx.wait();
        return tx;
    } catch (error) {
        console.error('轉移股票失敗:', error);
        throw error;
    }
};

export {
    getRemainingStock,
    getBalance,
    getTransactionHistory,
    buyStock,
    transferStock
};