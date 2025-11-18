import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateImage(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "image/png",
    }
  });

  // --- БЕЗОПАСНЫЕ ПРОВЕРКИ ---

  const candidates = result.response?.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("Gemini не вернул кандидатов");
  }

  const parts = candidates[0].content?.parts;
  if (!parts || parts.length === 0) {
    throw new Error("Gemini не вернул parts");
  }

  const imagePart = parts[0];

  if (!imagePart.inlineData?.data) {
    throw new Error("Gemini не вернул inlineData (нет изображения)");
  }

  // --- BASE64 PNG ---
  return imagePart.inlineData.data;
}

