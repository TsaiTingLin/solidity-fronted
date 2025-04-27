import { useState, useEffect } from 'react';
import {
    connectWallet,
    getRemainingStock,
    getBalance,
    getTransactionHistory,
    buyStock,
    transferStock
} from '../services/contractService';

function Dashboard() {
    const [account, setAccount] = useState('');
    const [remainingStock, setRemainingStock] = useState(0);
    const [balance, setBalance] = useState(0);
    const [history, setHistory] = useState(0);
    const [transferTo, setTransferTo] = useState('');
    const [transferAmount, setTransferAmount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConnect = async () => {
        try {
            setLoading(true);
            setError('');
            const signer = await connectWallet();
            const address = await signer.getAddress();
            setAccount(address);
            await fetchData(address);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async (address) => {
        try {
            setLoading(true);
            setError('');

            const stock = await getRemainingStock();
            setRemainingStock(Number(stock));

            if (address) {
                const bal = await getBalance(address);
                setBalance(Number(bal));

                const hist = await getTransactionHistory(address);
                setHistory(Number(hist));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyStock = async () => {
        try {
            setLoading(true);
            setError('');
            await buyStock(1); // 根据合约，一次只能购买1股
            await fetchData(account);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTransferStock = async () => {
        try {
            if (!transferTo || !transferAmount) {
                setError('Please provide a recipient address and amount');
                return;
            }

            setLoading(true);
            setError('');
            await transferStock(transferTo, transferAmount);
            await fetchData(account);
            setTransferTo('');
            setTransferAmount(1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h1>台積電股票管理系統</h1>

            <div className="card">
                <h2>連接錢包</h2>
                {account ? (
                    <p>已連接帳戶: {account}</p>
                ) : (
                    <button onClick={handleConnect} disabled={loading}>
                        {loading ? '連接中...' : '連接 MetaMask'}
                    </button>
                )}
            </div>

            <div className="card">
                <h2>股票資訊</h2>
                <p>剩餘股票: {remainingStock}</p>
                {account && (
                    <>
                        <p>您的持股: {balance}</p>
                        <p>交易總量: {history}</p>
                    </>
                )}
            </div>

            {account && (
                <>
                    <div className="card">
                        <h2>購買股票</h2>
                        <button onClick={handleBuyStock} disabled={loading}>
                            {loading ? '處理中...' : '購買 1 股'}
                        </button>
                    </div>

                    <div className="card">
                        <h2>轉移股票</h2>
                        <div className="form-group">
                            <label>
                                收件人地址:
                                <input
                                    type="text"
                                    value={transferTo}
                                    onChange={(e) => setTransferTo(e.target.value)}
                                    placeholder="0x..."
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                數量:
                                <input
                                    type="number"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(e.target.value)}
                                    min="1"
                                />
                            </label>
                        </div>
                        <button onClick={handleTransferStock} disabled={loading}>
                            {loading ? '處理中...' : '轉移股票'}
                        </button>
                    </div>
                </>
            )}

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default Dashboard;