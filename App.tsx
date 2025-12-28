import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DonationForm from './components/DonationForm';
import MatchingView from './components/MatchingView';
import BlockchainFeed from './components/BlockchainFeed';
import LandingPage from './components/LandingPage';
import WalletLogin from './components/WalletLogin';
import { DonationItem, ImpactStats } from './types';

// Mock initial stats
const INITIAL_STATS: ImpactStats = {
    totalMealsSaved: 12450,
    co2ReducedKg: 8500,
    activeDonors: 42,
    communitiesServed: 18
};

type ViewState = 'landing' | 'login' | 'app';

const App: React.FC = () => {
    // Auth State
    const [viewState, setViewState] = useState<ViewState>('landing');
    
    // App State
    const [activeTab, setActiveTab] = useState('dashboard');
    const [donations, setDonations] = useState<DonationItem[]>([]);
    const [stats, setStats] = useState<ImpactStats>(INITIAL_STATS);

    const handleAddDonation = (donation: DonationItem) => {
        setDonations(prev => [donation, ...prev]);
        setActiveTab('logistics'); // Switch to logistics to see the match
        
        // Optimistically update stats for demo
        setStats(prev => ({
            ...prev,
            totalMealsSaved: prev.totalMealsSaved + Math.floor(donation.quantityKg * 2), // Approx 2 meals per kg
            co2ReducedKg: prev.co2ReducedKg + (donation.quantityKg * 2.5)
        }));
    };

    const handleLoginSuccess = () => {
        setViewState('app');
    };

    const handleLogout = () => {
        setViewState('landing');
        setActiveTab('dashboard');
    };

    // Render Logic for Landing & Login (Modal Pattern)
    if (viewState === 'landing' || viewState === 'login') {
        return (
            <>
                <LandingPage onGetStarted={() => setViewState('login')} />
                {viewState === 'login' && (
                    <WalletLogin 
                        onLoginSuccess={handleLoginSuccess} 
                        onBack={() => setViewState('landing')} 
                    />
                )}
            </>
        );
    }

    // Main App View
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard stats={stats} />;
            case 'donate':
                return <DonationForm onAddDonation={handleAddDonation} />;
            case 'logistics':
                return <MatchingView donations={donations} />;
            case 'blockchain':
                return <div className="max-w-4xl mx-auto"><BlockchainFeed /></div>;
            default:
                return <Dashboard stats={stats} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Navbar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={handleLogout}
            />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;