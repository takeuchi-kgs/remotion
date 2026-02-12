import * as fs from "node:fs";
import * as path from "node:path";

const BASE_URL = process.env.VOICEVOX_BASE_URL || "http://127.0.0.1:50021";

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/version`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function getAudioQuery(
  text: string,
  speakerId: number,
): Promise<unknown> {
  const res = await fetch(
    `${BASE_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
    { method: "POST" },
  );
  if (!res.ok) {
    throw new Error(`audio_query failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function synthesize(
  audioQuery: unknown,
  speakerId: number,
): Promise<ArrayBuffer> {
  const res = await fetch(
    `${BASE_URL}/synthesis?speaker=${speakerId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(audioQuery),
    },
  );
  if (!res.ok) {
    throw new Error(`synthesis failed: ${res.status} ${await res.text()}`);
  }
  return res.arrayBuffer();
}

export async function generateVoice(
  text: string,
  speakerId: number,
  outputPath: string,
): Promise<number> {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const audioQuery = await getAudioQuery(text, speakerId);
  const wavBuffer = await synthesize(audioQuery, speakerId);
  const buffer = Buffer.from(wavBuffer);
  fs.writeFileSync(outputPath, buffer);

  // Calculate duration from WAV header
  const durationSeconds = getWavDuration(buffer);
  console.log(`  Generated: ${outputPath} (${durationSeconds.toFixed(2)}s)`);
  return durationSeconds;
}

function getWavDuration(buffer: Buffer): number {
  // WAV format: bytes 28-31 = byte rate, bytes 40-43 = data size
  // Or more reliably: sample rate at offset 24, bits per sample at 34, data size at 40
  const sampleRate = buffer.readUInt32LE(24);
  const bitsPerSample = buffer.readUInt16LE(34);
  const numChannels = buffer.readUInt16LE(22);

  // Find "data" chunk
  let offset = 12;
  while (offset < buffer.length - 8) {
    const chunkId = buffer.toString("ascii", offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    if (chunkId === "data") {
      const bytesPerSample = (bitsPerSample / 8) * numChannels;
      return chunkSize / (sampleRate * bytesPerSample);
    }
    offset += 8 + chunkSize;
  }

  // Fallback: estimate from file size
  const byteRate = buffer.readUInt32LE(28);
  return (buffer.length - 44) / byteRate;
}
