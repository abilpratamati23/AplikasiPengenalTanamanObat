
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
    Analisis gambar tanaman ini dengan instruksi berikut:
    1. Identifikasi nama tanaman (dalam Bahasa Indonesia) dan nama ilmiahnya.
    2. Tentukan apakah ini termasuk tanaman obat (herbal).
    3. Jika tanaman obat, sebutkan manfaatnya dalam Bahasa Indonesia dan berikan panduan pengolahan langkah-demi-langkah yang jelas.
    4. Sebutkan efek samping yang mungkin ada.
    5. Berikan skor kepercayaan (confidence score) 0-100.
    6. Berikan estimasi metrik performa model (accuracy, precision, recall, f1Score) dalam rentang 85-99 yang mencerminkan kemampuan model AI dalam mendeteksi jenis tanaman spesifik ini.
    
    PENTING: Semua teks penjelasan harus dalam Bahasa Indonesia yang baik dan benar.
    Jika objek bukan tanaman, set isMedicinal ke false dan berikan nama "Objek Tidak Dikenal".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
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
      throw new Error("Tidak ada respon dari AI");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
