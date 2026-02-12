# Remotion Explainer

メモから解説動画を自動生成するパイプラインです。

## 前提条件

| 必要なもの | 備考 |
|-----------|------|
| Node.js 20+ | `node -v` で確認 |
| VOICEVOX | 音声合成エンジン（デフォルト: `http://127.0.0.1:50021`） |
| Gemini API Key | 画像生成・テキスト変換に使用 |

## セットアップ

```bash
npm install
cp .env.example .env
```

`.env` を編集:
```
GEMINI_API_KEY=your-gemini-api-key-here
VOICEVOX_BASE_URL=http://127.0.0.1:50021
```

## 起動方法

### GUI（Remotion Converter）

ブラウザベースのGUIで、テキスト変換・編集・パイプライン実行・設定変更をまとめて行えます。

```bash
npm run gui
```

http://localhost:3456 をブラウザで開きます。

### Remotion Studio（プレビュー）

各スライドやコンポーネントの確認、動画全体のプレビューができます。

```bash
npm run dev
```

http://localhost:3000 をブラウザで開きます。

### 両方同時に起動する場合

ターミナルを2つ開いて、それぞれ実行します:

```bash
# ターミナル1: GUI
npm run gui

# ターミナル2: Remotion Studio
npm run dev
```

## 停止方法

各ターミナルで `Ctrl + C` を押して停止します。

## パイプライン（CLI）

GUIを使わずコマンドラインで動画を生成する場合:

```bash
# 一括実行
npm run pipeline

# ステップ個別実行
npm run extract-slides    # Step 1: スライド抽出
npm run generate-images   # Step 2: 画像生成（Gemini）
npm run generate-audio    # Step 3: 音声生成（VOICEVOX）
npm run render-video      # Step 4: 動画レンダリング
```

詳しい台本の書き方やスライドタイプについては [MANUAL.md](MANUAL.md) を参照してください。
