import { GoogleGenAI, Type } from "@google/genai";
import { AIPredictionResult, FoodCategory, MatchResult } from "../types";

// The system prompt as defined in the user requirements
const RESCUE_LINK_SYSTEM_PROMPT = `
You are the AI engine for "RescueLink" — an AI-powered food surplus prediction and redistribution platform.

Mission:
- Reduce food waste and improve food access by predicting surplus and matching donors (restaurants/markets) to recipients (NGOs/food banks) and volunteers (drivers).
- Provide transparent, auditable impact summaries suitable for ESG reporting.
- Respect privacy: never output personal data; use hashed IDs.

Operating rules:
1) Output MUST be valid JSON only. No markdown. No extra commentary.
2) Every response must include: 
   - "task": string
   - "version": string
   - "confidence": number between 0 and 1
3) If input data is insufficient, request exactly the missing fields in "required_fields" (array).
4) Assume the backend will handle blockchain writes. You only recommend what should be written on-chain.
5) Keep recommendations practical for a hackathon MVP.

Domain assumptions:
- Food items are perishable and time sensitive.
- Prioritize safety: do not recommend redistributing expired food. If expiry is uncertain, require confirmation.
- Prioritize urgency: earlier expiry date + higher community demand.
- Prioritize feasibility: distance and pickup windows matter.

Data format:
- IDs are opaque strings (e.g. "donor_93ab...").
- Locations are lat/lng.
- Times are ISO 8601 with timezone offset.
- Currency amounts (if any) are numeric with currency code.

Supported tasks:
A) "predict_surplus"
B) "match_recipients"
C) "plan_pickups"
D) "generate_impact_report"
E) "risk_and_fraud_checks"
F) "onchain_recommendations"

Global scoring guidelines:
- Urgency score: 0–100 (expiry, food category, storage needs)
- Match score: 0–100 (fit between supply and demand + distance + capacity)
- Safety risk: low/medium/high (expiry uncertainty, storage, allergens)

Specific Task Instructions for predict_surplus:
Goal: Given donor inventory + basic context, estimate which items are likely to become surplus within the next 24–48 hours, and recommend a donation window.

Specific Task Instructions for match_recipients:
Goal: Match available food items from a donor to the best recipient organizations based on demand fit, capacity, distance, urgency, and safety.
`;

export const analyzeSurplusItem = async (
  itemName: string,
  quantityKg: number,
  category: FoodCategory,
  expiryDate: string
): Promise<AIPredictionResult> => {
  if (!process.env.API_KEY) {
    // Mock response for development if no key
    return {
      task: "predict_surplus",
      version: "1.0",
      confidence: 0.95,
      required_fields: [],
      donor_id: "mock_donor",
      time_generated: new Date().toISOString(),
      predictions: [{
        item_id: "mock_item_1",
        item_name: itemName,
        category: category,
        quantity: quantityKg,
        unit: "kg",
        expiry_time: expiryDate,
        surplus_probability: 0.9,
        reason_codes: ["MOCK_DATA", "EXPIRY_SOON"],
        recommended_donation_window: {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 86400000).toISOString()
        },
        urgency_score: 85,
        safety_flags: []
      }],
      summary: {
          items_analyzed: 1,
          items_high_risk_waste: 1,
          estimated_meals_rescued_if_donated: quantityKg * 2,
          top_recommendations: ["Dispatch immediately"]
      },
      notes: ["Mock response: API Key missing"],
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: JSON.stringify({
        task_request: "predict_surplus",
        input_data: {
          donor_id: "current_user",
          inventory: [{
              item_name: itemName,
              quantity: quantityKg,
              unit: "kg",
              category: category,
              expiry_date: expiryDate
          }],
          current_time: new Date().toISOString()
        }
      }),
      config: {
        systemInstruction: RESCUE_LINK_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            task: { type: Type.STRING },
            version: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            required_fields: { type: Type.ARRAY, items: { type: Type.STRING } },
            donor_id: { type: Type.STRING },
            time_generated: { type: Type.STRING },
            predictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item_id: { type: Type.STRING },
                  item_name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  expiry_time: { type: Type.STRING },
                  surplus_probability: { type: Type.NUMBER },
                  reason_codes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommended_donation_window: {
                    type: Type.OBJECT,
                    properties: {
                        start: { type: Type.STRING },
                        end: { type: Type.STRING }
                    }
                  },
                  urgency_score: { type: Type.NUMBER },
                  safety_flags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                items_analyzed: { type: Type.NUMBER },
                items_high_risk_waste: { type: Type.NUMBER },
                estimated_meals_rescued_if_donated: { type: Type.NUMBER },
                top_recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            notes: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIPredictionResult;

  } catch (error) {
    console.error("AI Prediction Error:", error);
    // Return safe fallback
    return {
      task: "error",
      version: "0.0",
      confidence: 0,
      required_fields: [],
      donor_id: "unknown",
      time_generated: new Date().toISOString(),
      predictions: [],
      summary: {
          items_analyzed: 0,
          items_high_risk_waste: 0,
          estimated_meals_rescued_if_donated: 0,
          top_recommendations: []
      },
      notes: ["Failed to connect to AI engine."],
    };
  }
};

export const matchRecipients = async (
  donationDetails: any,
  potentialRecipients: any[]
): Promise<MatchResult> => {
    if (!process.env.API_KEY) {
        // Return Mock Data strictly matching schema
        return {
            task: "match_recipients",
            version: "1.0",
            confidence: 0.9,
            required_fields: [],
            donor_id: donationDetails.donorId,
            time_generated: new Date().toISOString(),
            matches: [
                {
                    item_id: donationDetails.id,
                    recommended_recipients: potentialRecipients.slice(0, 2).map((r, i) => ({
                        recipient_id: r.id,
                        match_score: 95 - (i * 10),
                        distance_km: 2.5 + (i * 1.5),
                        eta_minutes: 15 + (i * 10),
                        pickup_window: {
                            start: new Date().toISOString(),
                            end: new Date(Date.now() + 3600000).toISOString()
                        },
                        constraints: ["NEEDS_REFRIGERATION"],
                        why_this_match: ["High demand for this category", "Within 5km radius"]
                    }))
                }
            ],
            fallback_options: ["Compost", "Animal Feed"],
            notes: ["Mock Response: Key Missing"]
        };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: JSON.stringify({
                task_request: "match_recipients",
                input_data: {
                    donor_id: donationDetails.donorId,
                    available_items: [donationDetails], // Wrap in array as task implies list matching
                    recipients_pool: potentialRecipients,
                    current_time: new Date().toISOString()
                }
            }),
            config: {
                systemInstruction: RESCUE_LINK_SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        task: { type: Type.STRING },
                        version: { type: Type.STRING },
                        confidence: { type: Type.NUMBER },
                        required_fields: { type: Type.ARRAY, items: { type: Type.STRING } },
                        donor_id: { type: Type.STRING },
                        time_generated: { type: Type.STRING },
                        matches: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    item_id: { type: Type.STRING },
                                    recommended_recipients: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                recipient_id: { type: Type.STRING },
                                                match_score: { type: Type.NUMBER },
                                                distance_km: { type: Type.NUMBER },
                                                eta_minutes: { type: Type.NUMBER },
                                                pickup_window: {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        start: { type: Type.STRING },
                                                        end: { type: Type.STRING }
                                                    }
                                                },
                                                constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
                                                why_this_match: { type: Type.ARRAY, items: { type: Type.STRING } }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        fallback_options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        notes: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text) as MatchResult;

    } catch (e) {
        console.error("Matching Error", e);
        // Fallback error object matching schema
        return {
            task: "error",
            version: "0.0",
            confidence: 0,
            required_fields: [],
            donor_id: "unknown",
            time_generated: new Date().toISOString(),
            matches: [],
            fallback_options: [],
            notes: ["AI Error"]
        };
    }
}