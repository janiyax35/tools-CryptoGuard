import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
    return localStorage.getItem('GEMINI_API_KEY');
}

export const explainConcept = async (topic, context) => {
  const apiKey = getApiKey();
  if (!apiKey) {
      return "Please set your Gemini API Key in the settings to use the AI Tutor.";
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const model = 'gemini-2.0-flash';
    const prompt = `
      You are a cryptography expert teacher.
      Explain the concept of "${topic}" in a simple, engaging way for a student.
      Context: The user is currently using a tool to ${context}.
      Keep the explanation under 150 words. Use Markdown for formatting.
      Focus on *why* it is secure (or not) and how it works conceptually.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text() || "I couldn't generate an explanation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to connect to the AI Tutor. Please check your API key.";
  }
};
