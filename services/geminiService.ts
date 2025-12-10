
import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis } from "../types";

// Helper to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzePlantImage = async (base64Image: string): Promise<PlantAnalysis> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze this image of a plant. 
    1. Identify the plant name and scientific name.
    2. Determine if it is commonly used as a medicinal plant (herbal medicine).
    3. If it is medicinal, list its benefits and provide a step-by-step processing guide on how to use it for health purposes.
    4. List any potential side effects.
    5. Provide a confidence score (0-100) based on visual clarity.
    6. Provide estimated performance metrics (accuracy, precision, recall, f1Score) that a state-of-the-art CNN model would typically achieve when identifying this specific plant species. Return these as percentages (85-99).
    
    If it is NOT a plant, set isMedicinal to false and name to "Unknown Object".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg/png, Gemini handles standard image types well
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            scientificName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            mlMetrics: {
              type: Type.OBJECT,
              properties: {
                accuracy: { type: Type.NUMBER },
                precision: { type: Type.NUMBER },
                recall: { type: Type.NUMBER },
                f1Score: { type: Type.NUMBER }
              }
            },
            isMedicinal: { type: Type.BOOLEAN },
            description: { type: Type.STRING },
            benefits: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            processingGuide: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.NUMBER },
                  instruction: { type: Type.STRING }
                }
              }
            },
            sideEffects: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as PlantAnalysis;
    } else {
      throw new Error("No response text from Gemini");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
