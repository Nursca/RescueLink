import React, { useEffect, useState } from 'react';
import { BlockchainTransaction } from '../types';
import { Box, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

const MOCK_CHAIN_DATA: BlockchainTransaction[] = [
    {
        hash: "0x8f2a...9b1c",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        action: "DONATION_VERIFIED",
        actor: "Validator_Node_04",
        details: "Verified 50kg tomatoes quality via image analysis",
        status: "Verified"
    },
    {
        hash: "0x3c4d...1e2f",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        action: "LOGISTICS_UPDATE",
        actor: "Driver_Wallet_X9",
        details: "Pickup confirmed at Joe's Diner",
        status: "Verified"
    },
    {
        hash: "0xa1b2...c3d4",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        action: "IMPACT_MINTED",
        actor: "RescueLink_Contract",
        details: "Minted 12 Impact Credits for 400 meals saved",
        status: "Verified"
    }
];

const BlockchainFeed: React.FC = () => {
    const [transactions, setTransactions] = useState<BlockchainTransaction[]>(MOCK_CHAIN_DATA);

    // Simulate live feed
    useEffect(() => {
        const interval = setInterval(() => {
            const newTx: BlockchainTransaction = {
                hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
                timestamp: new Date().toISOString(),
                action: "BLOCK_CONFIRMATION",
                actor: "Validator_Node_01",
                details: "New block validated containing 4 transactions",
                status: "Verified"
            };
            setTransactions(prev => [newTx, ...prev.slice(0, 9)]);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        Transparency Ledger
                    </h2>
                    <p className="text-sm text-slate-500">Real-time immutable record of food rescue operations.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-200 px-3 py-1 rounded">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Mainnet Live
                </div>
            </div>
            
            <div className="divide-y divide-slate-100">
                {transactions.map((tx, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                {tx.action.includes('DONATION') ? (
                                    <div className="p-2 bg-blue-100 rounded text-blue-600"><Box className="w-4 h-4"/></div>
                                ) : tx.action.includes('LOGISTICS') ? (
                                    <div className="p-2 bg-orange-100 rounded text-orange-600"><Clock className="w-4 h-4"/></div>
                                ) : (
                                    <div className="p-2 bg-emerald-100 rounded text-emerald-600"><CheckCircle2 className="w-4 h-4"/></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-semibold text-slate-900">{tx.action}</p>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 rounded">{tx.hash}</span>
                                </div>
                                <p className="text-sm text-slate-600 mt-0.5">{tx.details}</p>
                                <div className="flex gap-4 mt-2 text-xs text-slate-400">
                                    <span>Actor: {tx.actor}</span>
                                    <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockchainFeed;