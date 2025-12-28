// Domain entities

export enum FoodCategory {
    PRODUCE = "Produce",
    DAIRY = "Dairy",
    BAKERY = "Bakery",
    MEAT = "Meat",
    PREPARED = "Prepared Meals",
    CANNED = "Canned Goods"
}

export interface Donor {
    id: string;
    name: string;
    type: "Restaurant" | "Supermarket" | "Farm";
    location: string;
}

export interface Recipient {
    id: string;
    name: string;
    type: "NGO" | "Shelter" | "Food Bank";
    needs: FoodCategory[];
    capacityKg: number;
    location: string;
}

export interface DonationItem {
    id: string;
    donorId: string;
    name: string; // e.g., "50kg of Tomatoes"
    quantityKg: number;
    category: FoodCategory;
    expiryDate: string; // ISO Date
    status: "Pending" | "Matched" | "In Transit" | "Delivered";
    aiPrediction?: AIPredictionResult;
}

// Updated based on the predict_surplus schema
export interface SurplusItemPrediction {
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    unit: string;
    expiry_time: string | null;
    surplus_probability: number;
    reason_codes: string[];
    recommended_donation_window: {
        start: string;
        end: string;
    };
    urgency_score: number; // 0-100
    safety_flags: string[];
}

export interface AIPredictionResult {
    task: string;
    version: string;
    confidence: number;
    required_fields: string[];
    donor_id: string;
    time_generated: string;
    predictions: SurplusItemPrediction[];
    summary: {
        items_analyzed: number;
        items_high_risk_waste: number;
        estimated_meals_rescued_if_donated: number;
        top_recommendations: string[];
    };
    notes: string[];
}

// New interfaces for match_recipients schema
export interface RecipientMatch {
    recipient_id: string;
    match_score: number; // 0-100
    distance_km: number;
    eta_minutes: number;
    pickup_window: {
        start: string;
        end: string;
    };
    constraints: string[];
    why_this_match: string[];
}

export interface ItemMatch {
    item_id: string;
    recommended_recipients: RecipientMatch[];
}

export interface MatchResult {
    task: string;
    version: string;
    confidence: number;
    required_fields: string[];
    donor_id: string;
    time_generated: string;
    matches: ItemMatch[];
    fallback_options: string[];
    notes: string[];
}

export interface MatchRecommendation {
    recipientId: string;
    score: number; // 0-100
    reason: string;
}

export interface BlockchainTransaction {
    hash: string;
    timestamp: string;
    action: string;
    actor: string;
    details: string;
    status: "Verified" | "Pending";
}

export interface ImpactStats {
    totalMealsSaved: number;
    co2ReducedKg: number;
    activeDonors: number;
    communitiesServed: number;
}