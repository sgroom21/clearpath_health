import OpenAI from "openai";

export const OPENROUTER_AI_MODEL = process.env.OPENROUTER_AI_MODEL;

export const openRouter = new OpenAI({
  baseURL: process.env.OPENROUTER_AI_URL,
  apiKey: process.env.OPENROUTER_API_KEY,
});
