import React from 'react';
import { ArrowRight, Leaf, ShieldCheck, Zap, Globe, Heart, Activity } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-xl tracking-tight">RescueLink</span>
          </div>
          <button 
            onClick={onGetStarted}
            className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live on Mainnet Beta
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Zero Waste. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              100% Impact.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            The AI-powered protocol connecting surplus food from restaurants and farms to communities in need, verified on-chain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <button 
              onClick={onGetStarted}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-slate-900 hover:bg-slate-800 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
              View Transparency Report
            </button>
          </div>
        </div>

        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-40">
           <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
           <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
           <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={Zap}
              title="AI Prediction"
              description="Our Gemini-powered engine analyzes perishability and demand to route food before it expires."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="On-Chain Verification"
              description="Every donation is recorded on the blockchain, providing immutable proof of impact for ESG reporting."
            />
            <FeatureCard 
              icon={Activity}
              title="Real-Time Logistics"
              description="Match supply to demand instantly. Coordinate pickups and drop-offs with live tracking."
            />
          </div>
        </div>
      </div>

      {/* Social Proof / Stats */}
      <div className="py-20 bg-white border-t border-slate-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">Trust the Protocol</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatItem value="12.5k+" label="Meals Saved" />
                <StatItem value="8.5T" label="CO2e Reduced" />
                <StatItem value="100%" label="Transparent" />
                <StatItem value="45" label="NGO Partners" />
            </div>
         </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-white font-bold text-xs">R</div>
                <span className="text-slate-100 font-semibold">RescueLink</span>
            </div>
            <div className="text-sm">
                © 2024 RescueLink Protocol. All rights reserved.
            </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
);

const StatItem: React.FC<{ value: string, label: string }> = ({ value, label }) => (
    <div>
        <div className="text-4xl font-extrabold text-slate-900 mb-2">{value}</div>
        <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
);

export default LandingPage;