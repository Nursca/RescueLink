import React, { useEffect, useState } from 'react';
import { DonationItem, Recipient, FoodCategory } from '../types';
import { matchRecipients } from '../services/geminiService';
import { Loader2, MapPin, Check, Truck, AlertTriangle, Clock, Info } from 'lucide-react';

interface MatchingViewProps {
    donations: DonationItem[];
}

// Mock recipients database
const MOCK_RECIPIENTS: Recipient[] = [
    { id: 'rec_1', name: "Downtown Shelter", type: "Shelter", needs: [FoodCategory.PREPARED, FoodCategory.BAKERY], capacityKg: 50, location: "34.05,-118.24" },
    { id: 'rec_2', name: "Community Food Bank", type: "Food Bank", needs: [FoodCategory.PRODUCE, FoodCategory.CANNED, FoodCategory.MEAT], capacityKg: 500, location: "34.06,-118.25" },
    { id: 'rec_3', name: "Hope Kitchen", type: "NGO", needs: [FoodCategory.DAIRY, FoodCategory.PRODUCE], capacityKg: 100, location: "34.04,-118.23" },
];

const MatchingView: React.FC<MatchingViewProps> = ({ donations }) => {
    const [selectedDonation, setSelectedDonation] = useState<string | null>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [analysisNotes, setAnalysisNotes] = useState<string[]>([]);

    const activeDonations = donations.filter(d => d.status === 'Pending');

    const handleFindMatch = async (donation: DonationItem) => {
        setSelectedDonation(donation.id);
        setLoading(true);
        setMatches([]); // Clear previous
        setAnalysisNotes([]);

        // Call AI to match
        const result = await matchRecipients(donation, MOCK_RECIPIENTS);
        
        // Find the specific item matches in the result array (AI might process list)
        const itemMatch = result.matches?.find(m => m.item_id === donation.id) || result.matches?.[0];
        
        if (itemMatch && itemMatch.recommended_recipients) {
            // Enrich result with local recipient data
            const enrichedMatches = itemMatch.recommended_recipients.map((m) => {
                const recipient = MOCK_RECIPIENTS.find(r => r.id === m.recipient_id);
                return { ...m, recipient };
            });
            setMatches(enrichedMatches.sort((a, b) => b.match_score - a.match_score));
        }

        if (result.notes) {
            setAnalysisNotes(result.notes);
        }

        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* List of Donations */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-800">Available Surplus</h3>
                    <span className="text-xs text-slate-500">{activeDonations.length} items pending redistribution</span>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {activeDonations.length === 0 && (
                        <div className="p-8 text-center text-slate-400">
                            <Check className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No pending surplus.</p>
                        </div>
                    )}
                    {activeDonations.map(donation => {
                        // Access the urgency score from the new nested structure
                        const urgencyScore = donation.aiPrediction?.predictions?.[0]?.urgency_score;
                        
                        return (
                        <div 
                            key={donation.id}
                            onClick={() => handleFindMatch(donation)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedDonation === donation.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-medium text-slate-900">{donation.name}</h4>
                                    <p className="text-sm text-slate-500">{donation.quantityKg}kg • {donation.category}</p>
                                </div>
                                {urgencyScore !== undefined && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyScore > 80 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        Urgency: {urgencyScore}
                                    </span>
                                )}
                            </div>
                        </div>
                    )})}
                </div>
            </div>

            {/* Match Detail View */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col relative">
                {!selectedDonation ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <MapPin className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a donation to find nearby recipients.</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-semibold text-slate-800">AI Recommended Matches</h3>
                            {loading && <span className="text-xs text-emerald-600 flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Analyzing logistics...</span>}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {matches.length === 0 && (
                                        <div className="text-center p-10 text-slate-500">
                                            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                                            No suitable matches found based on current criteria.
                                            {analysisNotes.length > 0 && (
                                                <div className="mt-4 text-xs bg-slate-100 p-2 rounded text-slate-600">
                                                    Note: {analysisNotes[0]}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {matches.map((match, idx) => (
                                        <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                            {idx === 0 && (
                                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold">
                                                    Best Match
                                                </div>
                                            )}
                                            
                                            {/* Header Section */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900">{match.recipient?.name || "Unknown Recipient"}</h4>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">
                                                            {match.recipient?.type}
                                                        </span>
                                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium flex items-center">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {match.distance_km} km
                                                        </span>
                                                        <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-xs font-medium flex items-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            ETA: {match.eta_minutes} mins
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <span className="block text-2xl font-bold text-emerald-600">{match.match_score}</span>
                                                        <span className="text-sm text-emerald-600 font-bold">%</span>
                                                    </div>
                                                    <span className="text-xs text-slate-400">Match Score</span>
                                                </div>
                                            </div>
                                            
                                            {/* AI Reasoning Section */}
                                            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 mb-3">
                                                <p className="text-xs text-emerald-800 font-semibold mb-1 flex items-center">
                                                    <Info className="w-3 h-3 mr-1"/> AI Reasoning
                                                </p>
                                                <ul className="list-disc list-inside text-sm text-emerald-900 space-y-1">
                                                    {match.why_this_match?.map((reason: string, rIdx: number) => (
                                                        <li key={rIdx}>{reason}</li>
                                                    )) || <li>Strong alignment with donor inventory.</li>}
                                                </ul>
                                            </div>

                                            {/* Constraints & Logistics */}
                                            {match.constraints && match.constraints.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {match.constraints.map((constraint: string, cIdx: number) => (
                                                        <span key={cIdx} className="text-[10px] font-mono border border-slate-200 bg-slate-50 text-slate-500 px-2 py-1 rounded">
                                                            {constraint}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex gap-3 pt-2 border-t border-slate-50">
                                                <button className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center shadow-sm">
                                                    <Truck className="w-4 h-4 mr-2" />
                                                    Dispatch Driver ({match.eta_minutes}m)
                                                </button>
                                                <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                                                    View Recipient Profile
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MatchingView;