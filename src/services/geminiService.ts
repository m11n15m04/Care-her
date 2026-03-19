import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export async function getPamperingAdvice(symptoms: string[], mood: string) {
  if (!API_KEY) return "I'm here to help, but I need an API key to give personalized advice. Try some chocolate and a warm hug in the meantime!";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-3-flash-preview";

  const prompt = `
    My girlfriend is on her period. 
    Symptoms: ${symptoms.join(", ") || "none specified"}.
    Mood: ${mood || "neutral"}.
    
    Provide 2 specific, thoughtful, and creative pampering ideas, 1 Bollywood movie recommendation, and 1 song recommendation that perfectly matches her current mood. 
    Keep the tone warm, supportive, and romantic. 
    Format the response as a JSON array of objects with 'title', 'description', and 'type' (either 'care', 'movie', or 'song') fields.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { title: "Warm Compress", description: "A hot water bottle or heating pad can work wonders for cramps." },
      { title: "Herbal Tea", description: "Chamomile or peppermint tea can help soothe the body and mind." }
    ];
  }
}
