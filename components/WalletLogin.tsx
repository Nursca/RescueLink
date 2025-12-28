import React, { useState } from 'react';
import { Loader2, ArrowLeft, Mail, Smartphone, X } from 'lucide-react';

interface WalletLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const WalletLogin: React.FC<WalletLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [step, setStep] = useState<'options' | 'connecting'>('options');
  const [email, setEmail] = useState('');

  const handleConnect = () => {
    setStep('connecting');
    // Simulate network delay for realistic effect
    setTimeout(() => {
        onLoginSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onBack}
      ></div>

      {/* Privy-style Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 pb-0 flex items-center justify-between relative">
            <div className="flex items-center">
                 {step === 'options' ? (
                     <button 
                         onClick={onBack}
                         className="p-1 -ml-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50"
                     >
                         <X className="w-5 h-5" />
                     </button>
                 ) : (
                     <div className="w-5 h-5"></div> // Spacer
                 )}
            </div>
            
            <div className="absolute left-0 right-0 text-center pointer-events-none">
                <h2 className="text-lg font-bold text-slate-900">
                    {step === 'options' ? 'Log in or sign up' : 'Connecting Wallet'}
                </h2>
            </div>
            
            <div className="w-5 h-5"></div> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
            {step === 'options' ? (
                <>
                    <div className="space-y-3">
                         {/* Email Input Simulation */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                            />
                        </div>
                        <button 
                            disabled={!email}
                            onClick={handleConnect}
                            className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/10"
                        >
                            Continue with Email
                        </button>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">or</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <button onClick={handleConnect} className="flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group bg-white">
                             <div className="w-5 h-5 mr-2 bg-gradient-to-tr from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-sm">M</div>
                             <span className="text-slate-700 font-medium text-sm">Metamask</span>
                         </button>
                         <button onClick={handleConnect} className="flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors bg-white">
                             <div className="w-5 h-5 mr-2 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                <Smartphone className="w-3 h-3" />
                             </div>
                             <span className="text-slate-700 font-medium text-sm">Coinbase</span>
                         </button>
                    </div>
                </>
            ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 relative">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-100 opacity-50"></div>
                    </div>
                    <p className="text-slate-600 font-medium">Requesting signature...</p>
                    <p className="text-xs text-slate-400 mt-2">Check your wallet to continue</p>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5">
            <span className="text-xs text-slate-400">Protected by</span>
            <span className="text-xs font-bold text-slate-600">Privy</span>
        </div>
      </div>
    </div>
  );
};

export default WalletLogin;