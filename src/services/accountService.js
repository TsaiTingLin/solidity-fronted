import { ethers } from 'ethers';

// 連接到本地 Hardhat 節點
const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_NETWORK_URL);

// 初始化帳戶數組
let accounts = [];

// 初始化帳戶
const initializeAccounts = async () => {
    try {
        // 清空現有帳戶數組
        accounts = [];

        // 獲取 Hardhat 節點上的測試帳戶
        const wallets = await provider.listAccounts();


        // 使用 Set 儲存唯一地址
        const uniqueAddresses = new Set();

        // 臨時數組儲存處理好的帳戶
        const tempAccounts = [];

        // 處理帳戶
        for (let i = 0; i < wallets.length; i++) {
            const wallet = await provider.getSigner(i);
            const address = await wallet.getAddress();

            // 轉換為小寫以確保一致性
            const lowerAddress = address.toLowerCase();

            // 如果地址已存在，跳過
            if (uniqueAddresses.has(lowerAddress)) {
                continue;
            }

            // 添加到已處理集合
            uniqueAddresses.add(lowerAddress);

            // 使用地址作為標籤，格式化為更易讀的形式
            const label = `帳戶 ${tempAccounts.length + 1} (${address.slice(0, 6)}...${address.slice(-4)})`;

            // 添加到臨時數組
            tempAccounts.push({
                label: label,
                address: address,
                signer: wallet
            });
        }

        // 更新全局帳戶數組
        accounts = tempAccounts;

        return accounts;
    } catch (error) {
        console.error('初始化帳戶失敗:', error);
        throw error;
    }
};

// 獲取帳戶列表（已確保唯一性）
const getAccounts = () => {
    return accounts;
};

// 通過索引獲取帳戶
const getAccount = (index) => {
    if (index >= 0 && index < accounts.length) {
        return accounts[index];
    }
    return null;
};

// 通過地址獲取帳戶
const getAccountByAddress = (address) => {
    const lowerAddress = address.toLowerCase();
    return accounts.find(account => account.address.toLowerCase() === lowerAddress);
};

export {
    initializeAccounts,
    getAccounts,
    getAccount,
    getAccountByAddress
};