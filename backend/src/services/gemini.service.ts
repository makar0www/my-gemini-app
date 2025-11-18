import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateImage(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
  });

  const result = await model.generateContent([
    { text: prompt }
  ]);

  const candidates = result.response?.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("Gemini не вернул кандидатов");
  }

  const parts = candidates[0].content?.parts;
  if (!parts || parts.length === 0) {
    throw new Error("Gemini не вернул parts");
  }

  // ищем part с картинкой
  const imagePart = parts.find(
    p => p.inlineData?.mimeType?.startsWith("image/")
  );

  if (!imagePart || !imagePart.inlineData?.data) {
    throw new Error("Gemini не прислал изображение");
  }

  return imagePart.inlineData.data; // base64
}
