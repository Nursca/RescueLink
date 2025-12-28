import React from 'react';
import { LayoutDashboard, Send, Truck, Activity, LogOut, Wallet } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Impact Dashboard', icon: LayoutDashboard },
    { id: 'donate', label: 'Post Surplus', icon: Send },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'blockchain', label: 'Chain Feed', icon: Activity },
  ];

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                 <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">RescueLink</span>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Node Status: Active
             </div>
             
             {onLogout && (
                 <div className="flex items-center gap-3 pl-4 border-l border-slate-200 ml-2">
                    <div className="hidden md:block text-right">
                        <div className="text-xs text-slate-400">Connected</div>
                        <div className="text-xs font-mono font-medium text-slate-700">0x8a...4b2</div>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-50"
                        title="Disconnect Wallet"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                 </div>
             )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu (simplified for this layout) */}
      <div className="sm:hidden flex justify-around border-t border-slate-200 bg-white p-2">
          {navItems.map((item) => {
              const Icon = item.icon;
              return (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`p-2 rounded-md ${activeTab === item.id ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500'}`}
                  >
                      <Icon className="w-6 h-6" />
                  </button>
              )
          })}
          {onLogout && (
             <button onClick={onLogout} className="p-2 rounded-md text-slate-500 hover:text-red-500">
                <LogOut className="w-6 h-6" />
             </button>
          )}
      </div>
    </nav>
  );
};

export default Navbar;