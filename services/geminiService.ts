
import { GoogleGenAI, Type } from "@google/genai";

// Lazy initialization - only create AI client when needed
let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI | null => {
  if (ai) return ai;
  
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("⚠️ Gemini API Key not configured. AI features will use fallback values.");
    return null;
  }
  
  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error) {
    console.error("Failed to initialize Gemini AI:", error);
    return null;
  }
};

export const generateTeamNames = async (count: number): Promise<string[]> => {
  const client = getAIClient();
  
  // If no API key is configured, return default team names
  if (!client) {
    console.info("Using default team names (API key not configured)");
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
  
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Generate ${count} creative, professional, and fun corporate team names. Keep them brief (1-3 words).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["names"]
        }
      },
    });

    const data = JSON.parse(response.text);
    return data.names;
  } catch (error) {
    console.error("Error generating team names:", error);
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
};
