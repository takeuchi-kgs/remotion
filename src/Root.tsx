import React from "react";
import { Composition, staticFile } from "remotion";
// Original 7 slides
import { TitleSlide } from "./components/slides/TitleSlide";
import { ListSlide } from "./components/slides/ListSlide";
import { StepsSlide } from "./components/slides/StepsSlide";
import { ImageTextSlide } from "./components/slides/ImageTextSlide";
import { TableSlide } from "./components/slides/TableSlide";
import { SummarySlide } from "./components/slides/SummarySlide";
import { EndingSlide } from "./components/slides/EndingSlide";
// Phase 1: Simple slides
import { BridgeSlide } from "./components/slides/BridgeSlide";
import { QuoteSlide } from "./components/slides/QuoteSlide";
import { DefinitionSlide } from "./components/slides/DefinitionSlide";
import { HighlightSlide } from "./components/slides/HighlightSlide";
import { TipsSlide } from "./components/slides/TipsSlide";
import { WarningSlide } from "./components/slides/WarningSlide";
// Phase 2: Medium slides
import { ComparisonSlide } from "./components/slides/ComparisonSlide";
import { StatSlide } from "./components/slides/StatSlide";
import { ChecklistSlide } from "./components/slides/ChecklistSlide";
import { BeforeAfterSlide } from "./components/slides/BeforeAfterSlide";
import { CodeSlide } from "./components/slides/CodeSlide";
import { QASlide } from "./components/slides/QASlide";
import { TwoColumnSlide } from "./components/slides/TwoColumnSlide";
import { AgendaSlide } from "./components/slides/AgendaSlide";
// Phase 3: Complex slides
import { GallerySlide } from "./components/slides/GallerySlide";
import { ProcessSlide } from "./components/slides/ProcessSlide";
import { ProfileSlide } from "./components/slides/ProfileSlide";
import { MetricsSlide } from "./components/slides/MetricsSlide";
import { IconListSlide } from "./components/slides/IconListSlide";
// Original 7 diagrams
import { TimelineDiagram } from "./components/diagrams/TimelineDiagram";
import { CycleDiagram } from "./components/diagrams/CycleDiagram";
import { PieDiagram } from "./components/diagrams/PieDiagram";
import { MatrixDiagram } from "./components/diagrams/MatrixDiagram";
import { VennDiagram } from "./components/diagrams/VennDiagram";
import { FunnelDiagram } from "./components/diagrams/FunnelDiagram";
import { PyramidDiagram } from "./components/diagrams/PyramidDiagram";
// Phase 4: New diagrams
import { BarChartDiagram } from "./components/diagrams/BarChartDiagram";
import { LineChartDiagram } from "./components/diagrams/LineChartDiagram";
import { FlowChartDiagram } from "./components/diagrams/FlowChartDiagram";
import { TreeDiagram } from "./components/diagrams/TreeDiagram";
import { RadarChartDiagram } from "./components/diagrams/RadarChartDiagram";
import { GanttChartDiagram } from "./components/diagrams/GanttChartDiagram";
import { AreaChartDiagram } from "./components/diagrams/AreaChartDiagram";
import { NetworkDiagram } from "./components/diagrams/NetworkDiagram";
// Other
import { CharacterPreview } from "./compositions/CharacterPreview";
import { Video } from "./Video";
import { calculateTimings } from "./utils/timing";
import type { AudioManifest } from "./utils/timing";
import type { Script } from "./schemas/script";
import { tokens } from "./styles/tokens";

const { fps, width, height } = tokens.video;
const duration = 90;

const mockScript: Script = {
  title: "AIで解説動画を作る方法",
  description: "テスト用台本",
  scenes: [
    {
      title: "イントロ",
      slide: {
        type: "title",
        title: "AIで解説動画を作る方法",
        subtitle: "メモから動画まで全自動",
      },
      lines: [
        { speaker: "left", text: "今日はAIで解説動画を作る方法を紹介します。" },
        { speaker: "right", text: "楽しみですね！どんな仕組みなんですか？" },
      ],
    },
    {
      title: "全体フロー",
      slide: {
        type: "steps",
        title: "動画生成の流れ",
        items: ["メモを書く", "台本を生成", "画像・音声を生成", "動画をレンダリング"],
      },
      lines: [
        { speaker: "left", text: "まずメモを書くだけで、あとは自動で動画になります。" },
        { speaker: "right", text: "4つのステップがあるんですね。" },
      ],
    },
    {
      title: "まとめ",
      slide: {
        type: "summary",
        title: "今日のまとめ",
        items: ["メモを書くだけでOK", "AIが台本・画像・音声を生成", "Remotionで動画に合成"],
      },
      lines: [
        { speaker: "left", text: "以上が全体の流れでした。" },
        { speaker: "right", text: "とても便利ですね！ありがとうございました。" },
      ],
    },
  ],
};

const mockAudioManifest: AudioManifest = {
  fps: 30,
  files: [
    { scene: 0, line: 0, speaker: "left", text: "", path: "audio/scene-000-line-000.wav", durationSeconds: 4.779, durationFrames: 144 },
    { scene: 0, line: 1, speaker: "right", text: "", path: "audio/scene-000-line-001.wav", durationSeconds: 3.296, durationFrames: 99 },
    { scene: 1, line: 0, speaker: "left", text: "", path: "audio/scene-001-line-000.wav", durationSeconds: 4.448, durationFrames: 134 },
    { scene: 1, line: 1, speaker: "right", text: "", path: "audio/scene-001-line-001.wav", durationSeconds: 2.251, durationFrames: 68 },
    { scene: 2, line: 0, speaker: "left", text: "", path: "audio/scene-002-line-000.wav", durationSeconds: 2.485, durationFrames: 75 },
    { scene: 2, line: 1, speaker: "right", text: "", path: "audio/scene-002-line-001.wav", durationSeconds: 3.445, durationFrames: 104 },
  ],
};

const linesPerScene = mockScript.scenes.map((s) => s.lines.length);
const { totalFrames } = calculateTimings(mockScript.scenes.length, linesPerScene, mockAudioManifest);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* === Original 7 Slide Previews === */}
      <Composition
        id="TitleSlidePreview"
        component={TitleSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "AIで解説動画を作る方法",
          subtitle: "メモから動画まで全自動",
        }}
      />
      <Composition
        id="ListSlidePreview"
        component={ListSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "技術スタックの紹介",
          items: [
            "TypeScript / Node.js 20+",
            "Remotion 4.x + React 19",
            "Gemini Imagen API",
            "VOICEVOX 音声合成",
          ],
        }}
      />
      <Composition
        id="StepsSlidePreview"
        component={StepsSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "動画生成の流れ",
          items: [
            "メモを書く",
            "台本を生成",
            "画像・音声を生成",
            "動画をレンダリング",
          ],
        }}
      />
      <Composition
        id="ImageTextSlidePreview"
        component={ImageTextSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "画像とテキスト",
          items: [
            "左側に画像を配置",
            "右側に説明テキスト",
            "スライドインアニメーション",
          ],
          image: { source: "generate" as const, prompt: "フラットなイラストでメモ帳を描いて" },
        }}
      />
      <Composition
        id="TableSlidePreview"
        component={TableSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "技術比較",
          tableHeaders: ["ツール", "用途", "特徴"],
          tableRows: [
            ["Remotion", "動画生成", "React製フレームワーク"],
            ["VOICEVOX", "音声合成", "ローカル実行"],
            ["Gemini", "画像生成", "API経由"],
          ],
        }}
      />
      <Composition
        id="SummarySlidePreview"
        component={SummarySlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "今日のまとめ",
          items: [
            "メモを書くだけでOK",
            "AIが台本・画像・音声を生成",
            "Remotionで動画に合成",
          ],
        }}
      />
      <Composition
        id="EndingSlidePreview"
        component={EndingSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "ご視聴ありがとうございました",
          subtitle: "チャンネル登録お願いします",
          ctaText: "チャンネル登録はこちら",
        }}
      />

      {/* === Phase 1: Simple Slide Previews === */}
      <Composition
        id="BridgeSlidePreview"
        component={BridgeSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "第2章",
          subtitle: "技術アーキテクチャ",
        }}
      />
      <Composition
        id="QuoteSlidePreview"
        component={QuoteSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          quote: "シンプルさは究極の洗練である。",
          attribution: "レオナルド・ダ・ヴィンチ",
        }}
      />
      <Composition
        id="DefinitionSlidePreview"
        component={DefinitionSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "API",
          definition: "Application Programming Interface の略。ソフトウェア間のデータ連携の仕組み。",
        }}
      />
      <Composition
        id="HighlightSlidePreview"
        component={HighlightSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "最重要ポイント",
          subtitle: "テストを先に書くことで設計が改善される",
        }}
      />
      <Composition
        id="TipsSlidePreview"
        component={TipsSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "便利なショートカット",
          items: ["Cmd+Shift+P でコマンドパレット", "Cmd+D で単語選択", "Cmd+/ でコメントトグル"],
        }}
      />
      <Composition
        id="WarningSlidePreview"
        component={WarningSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "注意事項",
          items: ["本番環境で直接テストしない", "APIキーをコミットしない", "バックアップを取ってから作業する"],
        }}
      />

      {/* === Phase 2: Medium Slide Previews === */}
      <Composition
        id="ComparisonSlidePreview"
        component={ComparisonSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "React vs Vue",
          leftColumn: { title: "React", items: ["JSX構文", "大規模エコシステム", "Meta製"] },
          rightColumn: { title: "Vue", items: ["テンプレート構文", "学習コスト低", "軽量"] },
        }}
      />
      <Composition
        id="StatSlidePreview"
        component={StatSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "月間アクティブユーザー",
          statValue: "1,200万",
          statLabel: "前年比 +45%",
        }}
      />
      <Composition
        id="ChecklistSlidePreview"
        component={ChecklistSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "リリース前チェックリスト",
          items: ["ユニットテスト通過", "E2Eテスト通過", "パフォーマンス計測", "セキュリティレビュー"],
        }}
      />
      <Composition
        id="BeforeAfterSlidePreview"
        component={BeforeAfterSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "リファクタリング結果",
          leftColumn: { title: "Before", items: ["コールバック地獄", "グローバル変数多用", "テストなし"] },
          rightColumn: { title: "After", items: ["async/await", "モジュール分割", "カバレッジ80%"] },
        }}
      />
      <Composition
        id="CodeSlidePreview"
        component={CodeSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "Hello World",
          code: "const greet = (name: string) => {\n  return `Hello, ${name}!`;\n};",
          language: "typescript",
        }}
      />
      <Composition
        id="QASlidePreview"
        component={QASlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          question: "TypeScriptとJavaScriptの違いは？",
          answer: "TypeScriptはJavaScriptに静的型付けを追加した言語です。コンパイル時に型エラーを検出できます。",
        }}
      />
      <Composition
        id="TwoColumnSlidePreview"
        component={TwoColumnSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "フロントエンド vs バックエンド",
          leftColumn: { title: "フロントエンド", items: ["UI/UX", "React/Vue", "CSS"] },
          rightColumn: { title: "バックエンド", items: ["API設計", "DB管理", "認証"] },
        }}
      />
      <Composition
        id="AgendaSlidePreview"
        component={AgendaSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "本日のアジェンダ",
          items: ["プロジェクト概要", "技術選定", "アーキテクチャ", "デモ", "Q&A"],
        }}
      />

      {/* === Phase 3: Complex Slide Previews === */}
      <Composition
        id="GallerySlidePreview"
        component={GallerySlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "スクリーンショット",
          images: [
            { source: "generate" as const, prompt: "ダッシュボード画面" },
            { source: "generate" as const, prompt: "設定画面" },
            { source: "generate" as const, prompt: "レポート画面" },
            { source: "generate" as const, prompt: "プロフィール画面" },
          ],
        }}
      />
      <Composition
        id="ProcessSlidePreview"
        component={ProcessSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "CI/CDパイプライン",
          items: ["コミット", "ビルド", "テスト", "デプロイ"],
        }}
      />
      <Composition
        id="ProfileSlidePreview"
        component={ProfileSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "スピーカー紹介",
          profileName: "田中太郎",
          profileRole: "シニアエンジニア",
          items: ["React歴5年", "TypeScript推進", "OSS貢献者"],
        }}
      />
      <Composition
        id="MetricsSlidePreview"
        component={MetricsSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "Q4 KPIダッシュボード",
          metrics: [
            { label: "売上", value: "¥5.2億", change: "+12%" },
            { label: "ユーザー数", value: "85万", change: "+23%" },
            { label: "解約率", value: "2.1%", change: "-0.5%" },
            { label: "NPS", value: "72", change: "+8" },
          ],
        }}
      />
      <Composition
        id="IconListSlidePreview"
        component={IconListSlide}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          title: "サービスの特徴",
          iconItems: [
            { icon: "🚀", text: "高速デプロイ" },
            { icon: "🔒", text: "エンタープライズセキュリティ" },
            { icon: "📊", text: "リアルタイム分析" },
            { icon: "🌍", text: "グローバルCDN" },
          ],
        }}
      />

      {/* === Original 7 Diagram Previews === */}
      <Composition
        id="TimelineDiagramPreview"
        component={TimelineDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          events: [
            { label: "企画", description: "2024年1月" },
            { label: "開発", description: "2024年3月" },
            { label: "テスト", description: "2024年6月" },
            { label: "リリース", description: "2024年9月" },
          ],
        }}
      />
      <Composition
        id="CycleDiagramPreview"
        component={CycleDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          steps: ["Plan", "Do", "Check", "Act"],
        }}
      />
      <Composition
        id="PieDiagramPreview"
        component={PieDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          slices: [
            { label: "TypeScript", value: 40 },
            { label: "Python", value: 25 },
            { label: "Go", value: 20 },
            { label: "その他", value: 15 },
          ],
        }}
      />
      <Composition
        id="MatrixDiagramPreview"
        component={MatrixDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          axisX: "緊急度",
          axisY: "重要度",
          quadrants: [
            { label: "重要かつ緊急", items: ["バグ修正", "障害対応"] },
            { label: "重要だが非緊急", items: ["設計改善", "学習"] },
            { label: "緊急だが非重要", items: ["メール返信"] },
            { label: "非重要・非緊急", items: ["雑務"] },
          ] as [any, any, any, any],
        }}
      />
      <Composition
        id="VennDiagramPreview"
        component={VennDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          sets: [
            { label: "デザイン", items: ["UI", "UX"] },
            { label: "エンジニアリング", items: ["React", "Node.js"] },
          ],
          intersection: "フロントエンド",
        }}
      />
      <Composition
        id="FunnelDiagramPreview"
        component={FunnelDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          stages: [
            { label: "認知", value: 100 },
            { label: "興味", value: 60 },
            { label: "検討", value: 30 },
            { label: "購入", value: 10 },
          ],
        }}
      />
      <Composition
        id="PyramidDiagramPreview"
        component={PyramidDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          levels: [
            { label: "自己実現", description: "創造性・成長" },
            { label: "承認欲求", description: "評価・尊重" },
            { label: "社会的欲求", description: "所属・愛情" },
            { label: "安全欲求", description: "安定・保障" },
            { label: "生理的欲求", description: "食事・睡眠" },
          ],
        }}
      />

      {/* === Phase 4: New Diagram Previews === */}
      <Composition
        id="BarChartDiagramPreview"
        component={BarChartDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          bars: [
            { label: "Q1", value: 120 },
            { label: "Q2", value: 180 },
            { label: "Q3", value: 150 },
            { label: "Q4", value: 220 },
          ],
        }}
      />
      <Composition
        id="LineChartDiagramPreview"
        component={LineChartDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          series: [
            { label: "売上", data: [100, 150, 130, 200, 250] },
            { label: "コスト", data: [80, 90, 85, 110, 120] },
          ],
          xLabels: ["1月", "2月", "3月", "4月", "5月"],
        }}
      />
      <Composition
        id="FlowChartDiagramPreview"
        component={FlowChartDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          nodes: [
            { id: "start", label: "開始", shape: "oval" as const },
            { id: "check", label: "条件チェック", shape: "diamond" as const },
            { id: "process", label: "処理実行", shape: "rect" as const },
            { id: "end", label: "終了", shape: "oval" as const },
          ],
          edges: [
            { from: "start", to: "check" },
            { from: "check", to: "process", label: "Yes" },
            { from: "process", to: "end" },
          ],
        }}
      />
      <Composition
        id="TreeDiagramPreview"
        component={TreeDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          root: "プロジェクト",
          children: [
            { label: "フロントエンド", children: [{ label: "React" }, { label: "CSS" }] },
            { label: "バックエンド", children: [{ label: "Node.js" }, { label: "DB" }] },
            { label: "インフラ", children: [{ label: "AWS" }, { label: "Docker" }] },
          ],
        }}
      />
      <Composition
        id="RadarChartDiagramPreview"
        component={RadarChartDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          axes: [
            { label: "速度", value: 85 },
            { label: "信頼性", value: 90 },
            { label: "拡張性", value: 70 },
            { label: "セキュリティ", value: 95 },
            { label: "コスト", value: 60 },
          ],
        }}
      />
      <Composition
        id="GanttChartDiagramPreview"
        component={GanttChartDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          tasks: [
            { label: "設計", start: 0, end: 3 },
            { label: "開発", start: 2, end: 7 },
            { label: "テスト", start: 5, end: 9 },
            { label: "リリース", start: 8, end: 10 },
          ],
        }}
      />
      <Composition
        id="AreaChartDiagramPreview"
        component={AreaChartDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          series: [
            { label: "トラフィック", data: [50, 80, 120, 95, 150, 180] },
          ],
          xLabels: ["月", "火", "水", "木", "金", "土"],
        }}
      />
      <Composition
        id="NetworkDiagramPreview"
        component={NetworkDiagram}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          nodes: [
            { id: "api", label: "API Gateway" },
            { id: "auth", label: "認証サービス" },
            { id: "db", label: "データベース" },
            { id: "cache", label: "キャッシュ" },
            { id: "queue", label: "メッセージキュー" },
          ],
          links: [
            { source: "api", target: "auth" },
            { source: "api", target: "db" },
            { source: "api", target: "cache" },
            { source: "db", target: "queue" },
          ],
        }}
      />

      {/* Character Preview */}
      <Composition
        id="CharacterPreview"
        component={CharacterPreview}
        durationInFrames={duration}
        fps={fps}
        width={width}
        height={height}
      />

      {/* Full Video — loads real data from public/data/ */}
      <Composition
        id="ExplainerVideo"
        component={Video}
        durationInFrames={totalFrames}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          script: mockScript,
          audioManifest: mockAudioManifest,
          showSubtitles: false,
        }}
        calculateMetadata={async ({ props: inputProps }) => {
          try {
            const scriptRes = await fetch(staticFile("data/script.json"));
            if (!scriptRes.ok) throw new Error("script.json not found");
            const realScript: Script = await scriptRes.json();

            let realManifest: AudioManifest = { fps: 30, files: [] };
            try {
              const manifestRes = await fetch(staticFile("data/manifest.json"));
              if (manifestRes.ok) {
                realManifest = await manifestRes.json();
              }
            } catch {
              // manifest is optional
            }

            // Load timing config if available
            let timingConfig: { lineGapFrames?: number; sceneBufferFrames?: number } = {};
            try {
              const timingRes = await fetch(staticFile("data/timing-config.json"));
              if (timingRes.ok) {
                timingConfig = await timingRes.json();
              }
            } catch {
              // timing config is optional
            }

            // Load avatar config if available
            let avatarConfig: { left?: string; right?: string } = {};
            try {
              const avatarRes = await fetch(staticFile("data/avatar-config.json"));
              if (avatarRes.ok) {
                avatarConfig = await avatarRes.json();
              }
            } catch {
              // avatar config is optional
            }

            const lps = realScript.scenes.map((s) => s.lines.length);
            const { totalFrames: realTotal } = calculateTimings(
              realScript.scenes.length,
              lps,
              realManifest,
              timingConfig,
            );

            return {
              durationInFrames: realTotal,
              props: {
                script: realScript,
                audioManifest: realManifest,
                showSubtitles: false,
                lineGapFrames: inputProps.lineGapFrames ?? timingConfig.lineGapFrames,
                sceneBufferFrames: inputProps.sceneBufferFrames ?? timingConfig.sceneBufferFrames,
                avatarLeft: inputProps.avatarLeft ?? avatarConfig.left,
                avatarRight: inputProps.avatarRight ?? avatarConfig.right,
              },
            };
          } catch {
            // Fallback to mock data if files not found
            return {
              durationInFrames: totalFrames,
              props: {
                script: mockScript,
                audioManifest: mockAudioManifest,
                showSubtitles: false,
              },
            };
          }
        }}
      />
    </>
  );
};
