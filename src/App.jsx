import { useState, useEffect } from 'react';
import { initializeAccounts } from './services/accountService';
import {
    getRemainingStock,
    getBalance,
    getTransactionHistory,
    buyStock,
    transferStock
} from './services/contractService';
import './App.css';

function App() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [remainingStock, setRemainingStock] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [transferTo, setTransferTo] = useState('');
    const [transferAmount, setTransferAmount] = useState(1);
    const [accountsData, setAccountsData] = useState({});

    // 初始化帳戶和合約數據
    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true);
                // 初始化帳戶
                const accts = await initializeAccounts();
                setAccounts(accts);

                if (accts.length > 0) {
                    setSelectedAccount(accts[0]);
                }

                // 獲取剩餘庫存
                const stock = await getRemainingStock();
                setRemainingStock(stock);

                // 獲取所有帳戶的餘額和交易歷史
                await refreshAccountsData(accts);
            } catch (err) {
                setError(`初始化失敗: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    // 刷新所有帳戶的數據
    const refreshAccountsData = async (accts) => {
        try {
            const accountsDataObj = {};

            // 使用傳入的帳戶列表或全局帳戶列表（已去重）
            const uniqueAccounts = accts || accounts;

            for (const account of uniqueAccounts) {
                const balance = await getBalance(account.address);
                const history = await getTransactionHistory(account.address);

                accountsDataObj[account.address] = {
                    balance,
                    history
                };
            }

            setAccountsData(accountsDataObj);
        } catch (err) {
            setError(`刷新帳戶數據失敗: ${err.message}`);
        }
    };

    // 處理帳戶切換
    const handleAccountChange = (e) => {
        const selectedIndex = e.target.value;
        setSelectedAccount(accounts[selectedIndex]);
    };

    // 處理購買股票
    const handleBuyStock = async () => {
        if (!selectedAccount) {
            setError('請先選擇一個帳戶');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await buyStock(selectedAccount.signer, 1);

            // 刷新數據
            const stock = await getRemainingStock();
            setRemainingStock(stock);
            await refreshAccountsData();
        } catch (err) {
            setError(`購買股票失敗: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 處理轉移股票
    const handleTransferStock = async () => {
        if (!selectedAccount) {
            setError('請先選擇一個帳戶');
            return;
        }

        if (!transferTo) {
            setError('請輸入接收者地址');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await transferStock(selectedAccount.signer, transferTo, transferAmount);

            // 刷新數據
            await refreshAccountsData();
            setTransferTo('');
            setTransferAmount(1);
        } catch (err) {
            setError(`轉移股票失敗: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>台積電股票管理系統</h1>

            {/* 帳戶選擇 */}
            <div className="card">
                <h2>選擇操作帳戶</h2>
                <select
                    value={accounts.indexOf(selectedAccount)}
                    onChange={handleAccountChange}
                    disabled={loading || accounts.length === 0}
                >
                    {accounts.map((account, index) => (
                        <option key={account.address} value={index}>
                            {account.label}
                        </option>
                    ))}
                </select>

                {selectedAccount && accountsData[selectedAccount.address] && (
                    <div className="account-info">
                        <p>當前地址: {selectedAccount.address}</p>
                        <p>持有股票: {accountsData[selectedAccount.address].balance}</p>
                        <p>交易總量: {accountsData[selectedAccount.address].history}</p>
                    </div>
                )}
            </div>

            {/* 股票信息 */}
            <div className="card">
                <h2>股票資訊</h2>
                <p>剩餘股票: {remainingStock}</p>
            </div>

            {/* 購買股票 */}
            <div className="card">
                <h2>購買股票</h2>
                <button
                    onClick={handleBuyStock}
                    disabled={loading || !selectedAccount}
                >
                    {loading ? '處理中...' : '購買 1 股'}
                </button>
            </div>

            {/* 轉移股票 */}
            <div className="card">
                <h2>轉移股票</h2>
                <div className="form-group">
                    <label>
                        接收者地址:
                        <select
                            value={transferTo}
                            onChange={(e) => setTransferTo(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">-- 選擇接收者 --</option>
                            {accounts
                                .filter(account =>
                                    selectedAccount &&
                                    account.address.toLowerCase() !== selectedAccount.address.toLowerCase()
                                )
                                .map((account) => (
                                    <option key={account.address} value={account.address}>
                                        {account.label}
                                    </option>
                                ))
                            }
                        </select>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        數量:
                        <input
                            type="number"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(Number(e.target.value))}
                            min="1"
                            disabled={loading}
                        />
                    </label>
                </div>
                <button
                    onClick={handleTransferStock}
                    disabled={loading || !selectedAccount || !transferTo}
                >
                    {loading ? '處理中...' : '轉移股票'}
                </button>
            </div>

            {/* 所有帳戶信息 */}
            <div className="card">
                <h2>所有帳戶資訊</h2>
                <table className="accounts-table">
                    <thead>
                    <tr>
                        <th>帳戶</th>
                        <th>持有股票</th>
                        <th>交易總量</th>
                    </tr>
                    </thead>
                    <tbody>
                    {accounts.map((account) => (
                        <tr
                            key={account.address}
                            className={selectedAccount && selectedAccount.address.toLowerCase() === account.address.toLowerCase() ? 'selected-account' : ''}
                        >
                            <td>{account.label}</td>
                            <td>{accountsData[account.address]?.balance || 0}</td>
                            <td>{accountsData[account.address]?.history || 0}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default App;