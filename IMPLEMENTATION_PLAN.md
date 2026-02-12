# Remotion 解説動画自動生成パイプライン - 実装計画書

## 1. 概要

メモを書くだけで解説動画が自動生成されるパイプラインを構築する。

### データフロー

```
メモ (notes.md)
  ↓ Claude Code
台本 (script.json)
  ↓ Gemini Imagen
画像生成
  ↓ VOICEVOX
音声生成
  ↓ Remotion
動画 (video.mp4)
```

### 技術スタック

| カテゴリ | 技術 |
|---------|------|
| 言語 | TypeScript / Node.js 20+ |
| 動画生成 | Remotion 4.x + React 19 |
| 台本生成 | Claude Code |
| 画像生成 | Gemini Imagen API |
| 音声合成 | VOICEVOX（ローカル起動） |

---

## 2. プロジェクト構造

```
remotion/
├── package.json
├── tsconfig.json
├── remotion.config.ts
├── .env                           # API keys (gitignore対象)
├── .env.example
│
├── src/
│   ├── Root.tsx                   # Remotion エントリポイント
│   ├── Video.tsx                  # メインComposition
│   │
│   ├── components/
│   │   ├── slides/                # 7種類のスライドテンプレート
│   │   │   ├── index.ts
│   │   │   ├── TitleSlide.tsx
│   │   │   ├── ListSlide.tsx
│   │   │   ├── StepsSlide.tsx
│   │   │   ├── ImageTextSlide.tsx
│   │   │   ├── TableSlide.tsx
│   │   │   ├── SummarySlide.tsx
│   │   │   └── EndingSlide.tsx
│   │   │
│   │   ├── diagrams/              # 7種類のダイアグラム
│   │   │   ├── index.ts
│   │   │   ├── TimelineDiagram.tsx
│   │   │   ├── CycleDiagram.tsx
│   │   │   ├── PieDiagram.tsx
│   │   │   ├── MatrixDiagram.tsx
│   │   │   ├── VennDiagram.tsx
│   │   │   ├── FunnelDiagram.tsx
│   │   │   └── PyramidDiagram.tsx
│   │   │
│   │   ├── character/             # キャラクターアニメーション
│   │   │   ├── Character.tsx
│   │   │   ├── useLipSync.ts
│   │   │   └── useBlink.ts
│   │   │
│   │   ├── audio/                 # 音声関連
│   │   │   ├── AudioManager.tsx
│   │   │   ├── SlideSE.tsx
│   │   │   ├── LineSE.tsx
│   │   │   ├── DiagramSE.tsx
│   │   │   └── AnnotationSE.tsx
│   │   │
│   │   └── common/                # 共通コンポーネント
│   │       ├── AnimatedText.tsx
│   │       └── FadeIn.tsx
│   │
│   ├── compositions/
│   │   ├── SceneRenderer.tsx      # シーン描画ロジック
│   │   └── SlideSelector.tsx      # スライドタイプ選択
│   │
│   ├── hooks/
│   │   ├── useAudioSync.ts
│   │   └── useSceneData.ts
│   │
│   ├── styles/
│   │   └── tokens.ts              # デザイントークン
│   │
│   ├── types/
│   │   ├── script.ts              # script.json の型定義
│   │   ├── slide.ts
│   │   └── diagram.ts
│   │
│   └── utils/
│       ├── timing.ts              # フレーム・タイミング計算
│       └── animation.ts           # アニメーションヘルパー
│
├── scripts/                       # CLIパイプラインスクリプト
│   ├── 01-generate-script.ts      # Claude Code 台本生成
│   ├── 02-generate-images.ts      # Gemini Imagen 画像生成
│   ├── 03-generate-audio.ts       # VOICEVOX 音声合成
│   ├── 04-render-video.ts         # Remotion レンダリング
│   └── pipeline.ts                # 全ステップ実行
│
├── lib/
│   ├── claude/
│   │   ├── client.ts
│   │   └── prompts.ts
│   ├── gemini/
│   │   ├── client.ts
│   │   └── imagen.ts
│   └── voicevox/
│       ├── client.ts
│       └── speaker.ts
│
├── public/
│   ├── audio/
│   │   ├── bgm/
│   │   └── se/
│   │       └── README.md          # SE定義ファイル
│   ├── images/
│   │   └── characters/
│   │       ├── left/              # 左キャラ 4枚（AI生成）
│   │       └── right/             # 右キャラ 4枚（AI生成）
│   └── fonts/
│
├── data/
│   ├── input/
│   │   └── notes.md               # 入力メモ
│   └── output/
│       ├── script.json            # 生成された台本
│       ├── audio/                 # 生成音声
│       └── images/                # 生成画像
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 3. Phase別実装計画

### Phase 1: 基盤構築

**目標**: Remotionプロジェクト初期化、静的スライド表示

#### 作業内容

1. プロジェクト初期化
   ```bash
   npx create-video@latest remotion-explainer --template=typescript
   npm install zod @google/generative-ai
   ```

2. デザイントークン定義 (`src/styles/tokens.ts`)
   - カラーパレット（primary, secondary, background, text）
   - タイポグラフィ（fontFamily, fontSize）
   - スペーシング（xs, sm, md, lg, xl）
   - アニメーション設定（duration）

3. Zodスキーマによる型定義 (`src/types/script.ts`)
   - SlideTypeSchema
   - DiagramTypeSchema
   - SESchema
   - SceneSchema
   - ScriptSchema

4. TitleSlideコンポーネント作成

#### 確認方法
- `npm run dev` でプレビュー起動
- TitleSlideが表示される

---

### Phase 2: スライドテンプレート実装

**目標**: 7種類のスライドテンプレート完成

| テンプレート | 機能 | アニメーション |
|-------------|------|--------------|
| TitleSlide | タイトル表示 | フェードイン + 上昇 |
| ListSlide | 箇条書き | 項目順次フェードイン |
| StepsSlide | 手順フロー | ステップ順次ハイライト |
| ImageTextSlide | 画像+説明 | 左右スライドイン |
| TableSlide | 比較表 | 行順次フェードイン |
| SummarySlide | まとめ | チェックマークアニメ |
| EndingSlide | CTA | パルスアニメーション |

#### 作業内容

1. 各スライドコンポーネント作成
2. SlideSelector実装（typeに応じてコンポーネント選択）
3. モックデータでの動作確認

#### 確認方法
- 各スライドがモックデータで正しく表示される
- アニメーションが動作する

---

### Phase 3: ダイアグラムコンポーネント実装

**目標**: 7種類のダイアグラム完成

| ダイアグラム | 用途 | 実装ポイント |
|-------------|------|-------------|
| Timeline | 年表、進行 | 水平スクロールアニメーション |
| Cycle | PDCA等 | SVG円形配置、回転アニメ |
| Pie | 円グラフ | ラベル重複防止ロジック |
| Matrix | 2x2マトリクス | 象限ハイライト |
| Venn | ベン図 | 交差領域計算 |
| Funnel | コンバージョン | 台形描画、パーセント表示 |
| Pyramid | 階層構造 | レベル別アニメーション |

#### 作業内容

1. 各ダイアグラムの型定義 (`src/types/diagram.ts`)
2. SVGベースのコンポーネント実装
3. DiagramSelector実装

#### 確認方法
- script.jsonからダイアグラムが選択・表示される
- アニメーションが滑らかに動作する

---

### Phase 4: キャラクターアニメーション実装

**目標**: 口パク・まばたき付きキャラクター

#### キャラクター画像（Gemini Imagenで生成）

各キャラクター4枚:
- eyes-open-mouth-open.png
- eyes-open-mouth-closed.png
- eyes-closed-mouth-open.png
- eyes-closed-mouth-closed.png

#### フック実装

| フック | 機能 |
|-------|------|
| useLipSync | 音声同期の口パク（0.15秒間隔） |
| useBlink | 2〜5秒間隔のランダムまばたき |

#### 作業内容

1. キャラクター画像生成スクリプト作成
2. useLipSync フック実装
3. useBlink フック実装
4. Characterコンポーネント実装

#### 確認方法
- プレビューでまばたきが動作
- 音声再生時に口パクが動作

---

### Phase 5: SE（効果音）システム実装

**目標**: 4種類のSEトリガー実装

| トリガー | タイミング | 用途 |
|---------|-----------|------|
| SlideSE | スライド表示時 | シーン切り替え音 |
| LineSE | セリフ開始時 | 強調・感情表現 |
| DiagramSE | ダイアグラム表示0.3秒後 | データ表示音 |
| AnnotationSE | アノテーション表示時 | 注釈表示音 |

#### 音量バランス
- BGM: 15%
- SE: 30%
- ナレーション: 100%

#### 作業内容

1. SE定義ファイル作成 (`public/audio/se/README.md`)
2. 効果音素材ダウンロード（効果音ラボ）
3. 各SEコンポーネント実装
4. AudioManager実装

#### 確認方法
- script.jsonの`se`プロパティで効果音が再生される

---

### Phase 6: 外部API連携実装

**目標**: Gemini Imagen、VOICEVOX連携

#### Gemini Imagen (`lib/gemini/imagen.ts`)

- 16:9スライド用画像生成
- フラットデザインプロンプト補強
- エラーハンドリング、リトライ

#### VOICEVOX (`lib/voicevox/client.ts`)

- 音声合成API呼び出し（http://127.0.0.1:50021）
- 音声長計算（フレーム同期用）
- スピーカーID管理

#### 作業内容

1. Gemini クライアント実装
2. VOICEVOX クライアント実装
3. 各パイプラインスクリプト作成

#### 確認方法
```bash
npx ts-node scripts/02-generate-images.ts  # 画像生成
npx ts-node scripts/03-generate-audio.ts   # 音声生成
```

---

### Phase 7: 統合とレンダリング

**目標**: 全コンポーネント統合、動画出力

#### 主要ファイル

- `src/Video.tsx`: メインComposition
- `src/compositions/SceneRenderer.tsx`: シーン描画統合

#### パイプライン実行

```bash
npx ts-node scripts/pipeline.ts data/input/notes.md
```

#### 作業内容

1. Video.tsx実装（メインComposition）
2. SceneRenderer実装（シーン描画統合）
3. パイプラインスクリプト統合

#### 確認方法
- `npm run dev` で全編プレビュー
- `npx remotion render` でMP4出力

---

### Phase 8: テストと品質向上

**目標**: テストカバレッジ80%以上

#### テスト種類

| 種類 | 対象 | ツール |
|-----|------|-------|
| ユニットテスト | utils/, hooks/ | Vitest |
| 統合テスト | パイプラインスクリプト | Vitest |
| E2Eテスト | 動画レンダリング | Vitest + Remotion |

#### 作業内容

1. Vitest設定
2. ユニットテスト作成
3. 統合テスト作成
4. E2Eテスト作成
5. カバレッジ確認

---

## 4. 重要ファイル一覧

| ファイル | 役割 |
|---------|------|
| `src/types/script.ts` | Zodスキーマ（全体の型定義） |
| `src/styles/tokens.ts` | デザイントークン |
| `src/compositions/SceneRenderer.tsx` | シーン描画統合 |
| `lib/voicevox/client.ts` | 音声合成連携 |
| `scripts/pipeline.ts` | パイプライン制御 |

---

## 5. 前提条件・準備物

- [x] Node.js 20+
- [ ] VOICEVOX Engine（ローカル起動）
- [ ] Gemini API Key
- [ ] キャラクター画像 → Phase 4でAI生成
- [ ] BGM・SE素材 → 効果音ラボからダウンロード

---

## 6. リスクと対策

| リスク | 影響度 | 対策 |
|-------|-------|-----|
| VOICEVOX接続失敗 | 高 | ヘルスチェック実装、フォールバック音声 |
| Gemini API制限 | 中 | レート制限対応、キャッシュ機構 |
| レンダリング時間長 | 中 | 並列レンダリング、プレビュー分離 |
| メモリ不足 | 中 | シーン単位の遅延ロード |
| 音声同期ズレ | 高 | 音声長の正確な計算、バッファ調整 |

---

## 7. 検証方法

| Phase | 確認コマンド | 期待結果 |
|-------|-------------|---------|
| 1-3 | `npm run dev` | プレビューでスライド/ダイアグラム表示 |
| 4-5 | `npm run dev` | キャラクターアニメ、SE再生 |
| 6 | `npx ts-node scripts/0*.ts` | 画像・音声生成成功 |
| 7 | `npx ts-node scripts/pipeline.ts` | 動画出力 |
| 8 | `npm run test` | カバレッジ80%以上 |
