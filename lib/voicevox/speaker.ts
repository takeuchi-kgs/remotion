export type SpeakerMapping = {
  left: number;
  right: number;
};

export const DEFAULT_SPEAKERS: SpeakerMapping = {
  left: 21,   // 剣崎雌雄 (ノーマル)
  right: 109,  // 東北イタコ (ノーマル)
};

export function getSpeakerId(
  speaker: "left" | "right",
  mapping: SpeakerMapping = DEFAULT_SPEAKERS,
): number {
  return mapping[speaker];
}
