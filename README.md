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
Hardhat 開發智能合約不在這個專案中, 須先自行將合約部署完成並將 StockContract.json 和環境變量更新到本專案中, 在智能合約專案執行以下指令
``` bash
npx hardhat compile  # 編譯 Solidity 智能合約代碼, 編譯完成後會顯示成功信息
npx hardhat node  # 啟動本地測試區塊鏈（以太坊網絡）
```

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
