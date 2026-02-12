/**
 * LLMプロバイダー抽象化
 * Gemini APIとOllama（ローカルLLM）を切り替え可能にする
 */

export type LLMProvider = "gemini" | "ollama";

export type LLMConfig = {
  provider: LLMProvider;
  model?: string;
  ollamaBaseUrl?: string;
};

const DEFAULT_CONFIG: LLMConfig = {
  provider: (process.env.LLM_PROVIDER as LLMProvider) || "gemini",
  model: process.env.LLM_MODEL,
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
};

let currentConfig: LLMConfig = { ...DEFAULT_CONFIG };

export function getLLMConfig(): LLMConfig {
  return currentConfig;
}

export function setLLMConfig(config: Partial<LLMConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * JSON出力を生成する（プロバイダーに応じて適切なバックエンドを使用）
 */
export async function generateJSON<T>(
  prompt: string,
  systemInstruction: string,
): Promise<T> {
  const config = getLLMConfig();

  if (config.provider === "ollama") {
    return generateWithOllama<T>(prompt, systemInstruction, config);
  }
  return generateWithGemini<T>(prompt, systemInstruction, config);
}

// ---------------------------------------------------------------------------
// Gemini
// ---------------------------------------------------------------------------

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

async function generateWithGemini<T>(
  prompt: string,
  systemInstruction: string,
  config: LLMConfig,
): Promise<T> {
  // 遅延インポート（APIキーがない時でもインポートエラーにしない）
  const { getAI } = await import("../gemini/client.js");
  const ai = getAI();
  const model = config.model || "gemini-2.5-flash";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await rateLimitedWait();

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const text = response.text ?? "";
      return JSON.parse(text) as T;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  Attempt ${attempt}/${MAX_RETRIES} failed: ${message}`);
      if (attempt === MAX_RETRIES) {
        throw new Error(
          `Gemini: Failed after ${MAX_RETRIES} attempts: ${message}`,
        );
      }
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  throw new Error("Unreachable");
}

// ---------------------------------------------------------------------------
// Ollama (OpenAI互換API)
// ---------------------------------------------------------------------------

async function generateWithOllama<T>(
  prompt: string,
  systemInstruction: string,
  config: LLMConfig,
): Promise<T> {
  const baseUrl = config.ollamaBaseUrl || "http://localhost:11434";
  const model = config.model || "qwen2.5";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt },
          ],
          format: "json",
          stream: false,
          options: {
            temperature: 0.3,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        message?: { content?: string };
      };
      const text = data.message?.content ?? "";
      return JSON.parse(text) as T;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  Attempt ${attempt}/${MAX_RETRIES} failed: ${message}`);
      if (attempt === MAX_RETRIES) {
        throw new Error(
          `Ollama: Failed after ${MAX_RETRIES} attempts: ${message}`,
        );
      }
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  throw new Error("Unreachable");
}
