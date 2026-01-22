
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
  // Note: process.env.API_KEY is replaced by Vite at build time via define config
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please configure VITE_API_KEY or API_KEY in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Instruksi yang sangat eksplisit untuk Bahasa Indonesia
  const prompt = `
    Kamu adalah ahli botani dan pengobatan herbal Indonesia.
    Tugasmu adalah menganalisis gambar tanaman ini dan memberikan output JSON SAJA.
    
    WAJIB GUNAKAN BAHASA INDONESIA UNTUK SEMUA FIELD TEKS.
    
    Instruksi Detail:
    1. Identifikasi nama tanaman (Nama Lokal Indonesia) dan nama ilmiah (Latin).
    2. Tentukan apakah tanaman ini lazim digunakan sebagai tanaman obat di Indonesia.
    3. Jelaskan deskripsi singkat tanaman tersebut.
    4. Sebutkan manfaat kesehatannya (khasiat).
    5. Berikan panduan pengolahan/resep tradisional (langkah demi langkah).
    6. Sebutkan efek samping atau peringatan konsumsi.
    7. Berikan confidence score (0-100) dan metrik AI (accuracy, precision, dll).

    Jika gambar bukan tanaman atau tidak jelas, set 'isMedicinal' ke false dan beri peringatan di deskripsi.
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
            name: { type: Type.STRING, description: "Nama lokal tanaman dalam Bahasa Indonesia" },
            scientificName: { type: Type.STRING, description: "Nama latin/ilmiah" },
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
            description: { type: Type.STRING, description: "Deskripsi fisik dan habitat dalam Bahasa Indonesia" },
            benefits: {
              type: Type.ARRAY,
              items: { type: Type.STRING, description: "Manfaat dalam Bahasa Indonesia" }
            },
            processingGuide: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.NUMBER },
                  instruction: { type: Type.STRING, description: "Instruksi langkah dalam Bahasa Indonesia" }
                }
              }
            },
            sideEffects: {
              type: Type.ARRAY,
              items: { type: Type.STRING, description: "Efek samping dalam Bahasa Indonesia" }
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
