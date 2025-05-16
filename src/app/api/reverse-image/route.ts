import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';

const google = new OpenAI({
  baseURL: process.env.GEMINI_BASE_URL,
  apiKey: process.env.GEMINI_API_KEY,
});
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-preview-04-17";

const promptTemplate = `
Please analyze the attached image in detail. Your task is to generate a highly detailed, precise, and structured text prompt (hereinafter referred to as the 'image prompt'). The sole objective of this image prompt is that when it is input into an advanced image generation AI (e.g., Midjourney, Stable Diffusion, DALL-E, etc.), it enables the AI to regenerate the original image as faithfully and visually similarly as possible.

The image prompt you generate must include, but is not limited to, the following key visual elements:
- Core Subject: Clearly describe the main focus of the image (person, animal, object, scene, etc.), including its posture, action, and expression (if applicable to living beings).
- Composition and Perspective: Describe the layout of the frame (e.g., close-up, medium shot, full shot, bird's-eye view, low-angle shot), and the subject's position within the frame (e.g., centered, rule of thirds, etc.).
- Environment and Background: Detail the subject's surroundings or background, including location, other objects, distant views, etc.
- Artistic Style: Identify and describe the overall style of the image (e.g., photorealistic, oil painting, watercolor, sketch, cartoon, anime, cyberpunk, steampunk, style of a specific artist, etc.).
- Lighting and Atmosphere: Describe the lighting conditions (e.g., bright daylight, dusk, overcast, studio lighting, Rembrandt lighting), light direction, shadow effects, and the overall mood or atmosphere conveyed by the image (e.g., serene, mysterious, joyful, tense).
- Color: Describe the main color palette, tone (warm tones, cool tones), saturation, and contrast.
- Key Details: Mention any specific details crucial for accurate reproduction, such as clothing textures, object materials, specific markings, visual elements, etc.
- Image Quality/Medium: If possible, describe the image's texture or quality (e.g., high-definition, cinematic, film grain, blur effect, sharp focus).

Please provide the final generated image prompt as the sole output. Ensure it is a coherent text string suitable for direct copy-pasting into an image generation AI. Do not include any explanations, titles, or additional dialogue; output only the final image prompt itself, optimized for image generation.
Output language: @{{promptLang}}.
`;

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