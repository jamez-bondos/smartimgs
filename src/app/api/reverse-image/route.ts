import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';
import { promptTemplate } from "@/lib/prompts/reverse-image-template";

const google = new OpenAI({
  baseURL: process.env.GEMINI_BASE_URL,
  apiKey: process.env.GEMINI_API_KEY,
});
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-preview-04-17";

async function encodeImageToBase64(file: File): Promise<string> {
  const imageBuffer = await file.arrayBuffer();
  const mimeType = file.type;
  const base64Image = Buffer.from(imageBuffer).toString('base64');
  return `data:${mimeType};base64,${base64Image}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    let promptLang = formData.get("promptLang") as string;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    if (!promptLang) {
      promptLang = "zh";
    }

    const base64Image = await encodeImageToBase64(file);
    if (!base64Image) {
      return NextResponse.json({ error: "Failed to encode image to base64." }, { status: 500 });
    }

    const language = promptLang === "zh" ? "中文" : "English";
    const prompt = promptTemplate.replace("@{{promptLang}}", language);
    const response = await google.chat.completions.create({
      model: model,
      messages: [
        { 
          role: 'user', 
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
    });

    console.log(JSON.stringify(response, null, 2));

    const content = response.choices[0].message.content;

    return NextResponse.json({ prompt: content });
  } catch (error: unknown) {
    console.error("Error in /api/reverse-image:", error);
    const errorMessage = 'Google Gemini API request failed.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 