# 解説動画パイプライン 使い方マニュアル

メモ → 台本(script.json) → 画像・音声 → 動画 を自動生成するパイプラインです。

## 前提条件

| 必要なもの | 備考 |
|-----------|------|
| Node.js 20+ | `node -v` で確認 |
| VOICEVOX | ローカルで起動しておく（デフォルト: `http://127.0.0.1:50021`） |
| Gemini API Key | 画像生成に使用（Google AI Studio で取得） |

## セットアップ

```bash
# 依存関係インストール
npm install

# 環境変数を設定
cp .env.example .env
```

`.env` を編集:
```
GEMINI_API_KEY=your-gemini-api-key-here
VOICEVOX_BASE_URL=http://127.0.0.1:50021
```

## 台本を書く

`data/input/script.json` を作成・編集します。

### 基本構造

```json
{
  "title": "動画タイトル",
  "description": "動画の説明（省略可）",
  "scenes": [
    {
      "title": "シーン名",
      "slide": { ... },
      "lines": [ ... ]
    }
  ]
}
```

### スライドタイプ一覧

#### 1. title（タイトル）
```json
{
  "type": "title",
  "title": "AIで解説動画を作る方法",
  "subtitle": "メモから動画まで全自動"
}
```

#### 2. list（箇条書き）
```json
{
  "type": "list",
  "title": "技術スタック",
  "items": ["TypeScript", "Remotion", "Gemini", "VOICEVOX"]
}
```

#### 3. steps（ステップ）
```json
{
  "type": "steps",
  "title": "動画生成の流れ",
  "items": ["メモを書く", "台本を生成", "画像・音声を生成", "動画をレンダリング"]
}
```

#### 4. image-text（画像＋テキスト）
```json
{
  "type": "image-text",
  "title": "画像とテキスト",
  "items": ["ポイント1", "ポイント2"],
  "image": { "source": "generate", "prompt": "フラットなイラストでメモ帳を描いて" }
}
```
`image` は2種類:
- `{ "source": "generate", "prompt": "..." }` → Gemini で自動生成
- `{ "source": "static", "path": "images/my-image.png" }` → `public/` 内の画像を使用

#### 5. table（テーブル）
```json
{
  "type": "table",
  "title": "技術比較",
  "tableHeaders": ["ツール", "用途", "特徴"],
  "tableRows": [
    ["Remotion", "動画生成", "React製"],
    ["VOICEVOX", "音声合成", "ローカル実行"]
  ]
}
```

#### 6. summary（まとめ）
```json
{
  "type": "summary",
  "title": "今日のまとめ",
  "items": ["ポイント1", "ポイント2", "ポイント3"]
}
```

#### 7. ending（エンディング）
```json
{
  "type": "ending",
  "title": "ご視聴ありがとうございました",
  "subtitle": "チャンネル登録お願いします",
  "ctaText": "チャンネル登録はこちら"
}
```

### セリフ（lines）

各シーンに会話形式のセリフを設定します。

```json
"lines": [
  { "speaker": "left", "text": "今日はAIで動画を作る方法を紹介します。" },
  { "speaker": "right", "text": "楽しみですね！" }
]
```

| speaker | キャラクター | VOICEVOX話者 |
|---------|------------|-------------|
| `left`  | 左側キャラ（青） | ずんだもん（ID: 1） |
| `right` | 右側キャラ（緑） | 春日部つむぎ（ID: 3） |

### 台本の例

```json
{
  "title": "AIで解説動画を作る方法",
  "scenes": [
    {
      "title": "イントロ",
      "slide": {
        "type": "title",
        "title": "AIで解説動画を作る方法",
        "subtitle": "メモから動画まで全自動"
      },
      "lines": [
        { "speaker": "left", "text": "今日はAIで解説動画を作る方法を紹介します。" },
        { "speaker": "right", "text": "楽しみですね！どんな仕組みなんですか？" }
      ]
    },
    {
      "title": "全体フロー",
      "slide": {
        "type": "steps",
        "title": "動画生成の流れ",
        "items": ["メモを書く", "台本を生成", "画像・音声を生成", "動画をレンダリング"]
      },
      "lines": [
        { "speaker": "left", "text": "まずメモを書くだけで、あとは自動で動画になります。" },
        { "speaker": "right", "text": "4つのステップがあるんですね。" }
      ]
    },
    {
      "title": "まとめ",
      "slide": {
        "type": "summary",
        "title": "今日のまとめ",
        "items": ["メモを書くだけでOK", "AIが台本・画像・音声を生成", "Remotionで動画に合成"]
      },
      "lines": [
        { "speaker": "left", "text": "以上が全体の流れでした。" },
        { "speaker": "right", "text": "とても便利ですね！ありがとうございました。" }
      ]
    }
  ]
}
```

## 動画を生成する

### 一括実行（推奨）

```bash
npm run pipeline
```

以下の4ステップを順番に実行します:
1. スライド抽出 → `data/output/slides.json`
2. 画像生成 → `data/output/images/`
3. 音声生成 → `data/output/audio/` + `manifest.json`
4. 動画レンダリング → `data/output/video/output.mp4`

### スキップオプション

```bash
# 画像生成をスキップ（既に生成済みの場合）
npm run pipeline -- --skip-images

# 音声生成をスキップ
npm run pipeline -- --skip-audio

# レンダリングをスキップ（プレビューで確認したい場合）
npm run pipeline -- --skip-render

# 組み合わせも可
npm run pipeline -- --skip-images --skip-audio
```

### ステップ個別実行

```bash
# Step 1: script.json → slides.json
npm run extract-slides

# Step 2: 画像生成（Gemini Imagen）
npm run generate-images

# Step 3: 音声生成（VOICEVOX）
npm run generate-audio

# Step 4: 動画レンダリング
npm run render-video
```

## プレビュー

Remotion Studio で各コンポーネントをプレビューできます。

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開き、左サイドバーから選択:

| Composition | 内容 |
|------------|------|
| ExplainerVideo | 完成動画（全シーン＋音声） |
| TitleSlidePreview | タイトルスライド単体 |
| ListSlidePreview | 箇条書きスライド単体 |
| StepsSlidePreview | ステップスライド単体 |
| ImageTextSlidePreview | 画像テキストスライド単体 |
| TableSlidePreview | テーブルスライド単体 |
| SummarySlidePreview | まとめスライド単体 |
| EndingSlidePreview | エンディングスライド単体 |
| TimelineDiagramPreview | タイムライン図 |
| CycleDiagramPreview | サイクル図 |
| PieDiagramPreview | 円グラフ |
| MatrixDiagramPreview | マトリクス図 |
| VennDiagramPreview | ベン図 |
| FunnelDiagramPreview | ファネル図 |
| PyramidDiagramPreview | ピラミッド図 |
| CharacterPreview | キャラクターアニメーション |

## 出力ファイル

```
data/output/
├── slides.json          # 抽出されたスライド定義
├── images/              # 生成された画像
├── audio/
│   ├── scene-000-line-000.wav   # 各セリフの音声
│   ├── scene-000-line-001.wav
│   └── manifest.json            # 音声メタデータ（尺情報）
└── video/
    └── output.mp4               # 完成動画
```

## トラブルシューティング

### VOICEVOX に接続できない
```
Error: connect ECONNREFUSED 127.0.0.1:50021
```
→ VOICEVOX を起動してください。起動後 http://127.0.0.1:50021/docs でAPIドキュメントが表示されれば正常です。

### Gemini API エラー
```
Error: API key not valid
```
→ `.env` の `GEMINI_API_KEY` を確認してください。

### 音声が再生されない
→ `npm run generate-audio` で音声を生成した後、WAVファイルを `public/audio/` にコピーしてください:
```bash
cp data/output/audio/*.wav public/audio/
```

### テストの実行
```bash
# 全テスト実行
npm run test

# ウォッチモード
npm run test:watch
```
