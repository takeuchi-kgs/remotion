import * as fs from "node:fs";
import * as path from "node:path";
import { ai } from "./client.js";

const RATE_LIMIT_MS = 1000;
const MAX_RETRIES = 3;

let lastRequestTime = 0;

async function rateLimitedWait(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS - elapsed));
  }
  lastRequestTime = Date.now();
}

export async function generateSlideImage(
  prompt: string,
  outputPath: string,
): Promise<void> {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fullPrompt = `シンプルなフラットデザインのイラスト。背景は明るく、ビジネス向けの清潔感のあるスタイル。${prompt}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await rateLimitedWait();

      const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: "16:9",
        },
      });

      const image = response.generatedImages?.[0];
      if (!image?.image?.imageBytes) {
        throw new Error("No image data in response");
      }

      const buffer = Buffer.from(image.image.imageBytes, "base64");
      fs.writeFileSync(outputPath, buffer);
      console.log(`  Generated: ${outputPath}`);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  Attempt ${attempt}/${MAX_RETRIES} failed: ${message}`);
      if (attempt === MAX_RETRIES) {
        throw new Error(`Failed to generate image after ${MAX_RETRIES} attempts: ${message}`);
      }
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}
