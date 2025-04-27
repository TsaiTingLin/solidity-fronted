# 台積電股票管理系統 (TSMC Stock Management System)
這是一個使用 Hardhat 開發框架和 React 前端框架的以太坊智能合約應用。該應用允許用戶購買、轉移和查詢台積電股票的餘額和交易歷史。
## 專案結構
``` 
├── frontend/                 # React 前端應用
│   ├── src/
│   │   ├── App.jsx           # 主應用組件
│   │   ├── App.css           # 樣式表
│   │   ├── services/
│   │   │   ├── accountService.js  # 帳戶管理服務
│   │   │   └── contractService.js # 合約交互服務
│   ├── public/
│   └── package.json
├── .env                      # 環境變量
├── package.json              # 專案依賴
└── README.md                 # 專案說明
```

## 安裝步驟
### 1. 安裝ethers庫和智能合约交互
``` bash
npm install ethers
```

### 2. 合約部署
Hardhat 開發智能合約位於 StockContract.tar.gz 壓縮檔中。請依照以下步驟操作：

1. 下載並解壓縮 StockContract.tar.gz 檔案
2. 進入解壓縮後的智能合約專案目錄
3. 安裝依賴套件：
   ```bash
   npm install
   ```
4. 在智能合約專案中執行以下指令：
   ```bash
   npx hardhat compile  # 編譯 Solidity 智能合約代碼
   npx hardhat node     # 啟動本地測試區塊鏈（保持此終端窗口開啟）
   ```
5. 在新的終端窗口中，執行部署腳本：
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
6. 部署成功後，記下終端中顯示的合約地址
7. 複製生成的 `artifacts/contracts/StockContract.sol/StockContract.json` 檔案到本專案適當位置
8. 更新專案中的環境變數 `.env` 檔案，添加合約地址和網路連接資訊
   可以通過以下命令測試合約的函數是否成功：

   **查詢合約剩餘股票：**
   ```bash
   npx hardhat run scripts/queryStock.js --network localhost
   ```

   **購買股票（默認購買1股）：**
   ```bash
   npx hardhat run scripts/buyStock.js --network localhost
   ```

   **購買特定數量的股票：**
   ```bash
   npx hardhat run scripts/buyStock.js 1 --network localhost
   ```

   **轉移股票（從一個帳戶轉到另一個帳戶）：**
   ```bash
   npx hardhat run scripts/transferStock.js 0x發送方地址 0x接收方地址 1 --network localhost
   ```

   **查詢所有帳戶的股票餘額：**
   ```bash
   npx hardhat run scripts/queryAllAccount.js --network localhost
   ```

   **注意：** 請將「0x發送方地址」和「0x接收方地址」替換為實際的以太坊地址。
   在本地 Hardhat 網絡中，您可以使用 Hardhat 節點啟動時提供的預設測試帳戶。



### 3. 設置前端環境變量 `.env`
在專案根目錄中更新文件 `.env`
在這之前請先運行本地區塊鏈
``` 
VITE_CONTRACT_ADDRESS  # 部署的合約地址
VITE_NETWORK_URL # 本地 Hardhat 網絡 URL
```

## 4. 運行前端應用
``` bash
npm run dev
```
前端應用將在 `http://localhost:5173` 啟動。
