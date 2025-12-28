import React, { useState } from 'react';
import { FoodCategory, DonationItem, AIPredictionResult } from '../types';
import { analyzeSurplusItem } from '../services/geminiService';
import { Loader2, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface DonationFormProps {
    onAddDonation: (donation: DonationItem) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ onAddDonation }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState<number>(0);
    const [category, setCategory] = useState<FoodCategory>(FoodCategory.PRODUCE);
    const [expiry, setExpiry] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<AIPredictionResult | null>(null);

    const handleAnalyze = async () => {
        if (!name || !quantity || !expiry) return;
        
        setIsAnalyzing(true);
        const result = await analyzeSurplusItem(name, quantity, category, expiry);
        setAiResult(result);
        setIsAnalyzing(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newDonation: DonationItem = {
            id: `donation_${Math.random().toString(36).substr(2, 9)}`,
            donorId: 'current_user',
            name,
            quantityKg: quantity,
            category,
            expiryDate: expiry,
            status: 'Pending',
            aiPrediction: aiResult || undefined
        };
        onAddDonation(newDonation);
        // Reset
        setName('');
        setQuantity(0);
        setExpiry('');
        setAiResult(null);
    };

    // Helper to get main prediction for the single item being edited
    const mainPrediction = aiResult?.predictions?.[0];

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white shadow-sm border border-slate-100 rounded-xl p-6 sm:p-8">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Post Surplus Food</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Use our AI Engine to estimate shelf-life urgency and find the perfect match.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700">Item Description</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., 3 crates of ripe tomatoes"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Quantity (kg)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                            >
                                {Object.values(FoodCategory).map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
                            <input
                                type="datetime-local"
                                required
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                            />
                        </div>
                    </div>

                    {/* AI Section */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                RescueLink AI Analysis
                            </h3>
                            <button
                                type="button"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !name || !expiry}
                                className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                            >
                                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Run Prediction'}
                            </button>
                        </div>

                        {!aiResult && !isAnalyzing && (
                            <p className="text-xs text-slate-500">Fill details and click "Run Prediction" to get safety checks and CO2 estimates.</p>
                        )}

                        {aiResult && mainPrediction && (
                            <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex gap-4">
                                    <div className="bg-white p-3 rounded shadow-sm border border-slate-100 flex-1">
                                        <span className="text-xs text-slate-500 block">Urgency Score</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${mainPrediction.urgency_score > 80 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                                                    style={{ width: `${mainPrediction.urgency_score}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-800">{mainPrediction.urgency_score}/100</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm border border-slate-100 flex-1">
                                         <span className="text-xs text-slate-500 block">Potential Impact</span>
                                         <span className="text-sm font-bold text-emerald-600 mt-1 block">
                                            {aiResult.summary.estimated_meals_rescued_if_donated} meals
                                         </span>
                                         <span className="text-[10px] text-slate-400">
                                            ~{(aiResult.summary.estimated_meals_rescued_if_donated * 2.5).toFixed(1)} kg CO2e
                                         </span>
                                    </div>
                                </div>
                                {mainPrediction.reason_codes.length > 0 && (
                                     <div className="text-xs text-slate-600 bg-blue-50 p-2 rounded border border-blue-100">
                                        <strong>Analysis:</strong> {mainPrediction.reason_codes.join(', ')}. {aiResult.notes[0]}
                                    </div>
                                )}
                                {mainPrediction.safety_flags.length > 0 && (
                                    <div className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-100 flex items-start gap-2">
                                        <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                        <div>
                                            <strong>Safety Warning:</strong> {mainPrediction.safety_flags.join(', ')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                        >
                            <SendIcon className="w-4 h-4 mr-2" />
                            Post Donation to Blockchain
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

export default DonationForm;