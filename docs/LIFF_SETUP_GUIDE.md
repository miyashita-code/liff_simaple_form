# LIFF登録ガイド（Messaging APIチャンネルしかない場合）

## 手順

### 1. LINE Developers Consoleにログイン
[https://developers.line.biz/console/](https://developers.line.biz/console/)

### 2. 新規チャンネル作成
1. 既存のプロバイダーを選択（または新規作成）
2. **「新規チャンネル作成」**をクリック
3. **「LINE Login」**を選択（Messaging APIではない！）

### 3. LINE Loginチャンネルの設定
```
チャンネル名: ReMENTIA Survey（任意）
チャンネル説明: アンケートフォーム用（任意）
アプリタイプ: ウェブアプリ ✓
メールアドレス: あなたのメール
```

### 4. LIFFアプリを追加
1. 作成したLINE Loginチャンネルを開く
2. **「LIFF」**タブをクリック
3. **「追加」**ボタンをクリック

### 5. LIFF設定
```
LIFFアプリ名: 3択アンケート
サイズ: Compact（または Full - お好みで）
エンドポイントURL: https://your-app.vercel.app/
Scope: 
  ✓ profile（必須）
  ✓ openid
ボットリンク機能: Off
```

#### サイズの選び方
- **Compact (50%)**: シンプルなフォームに最適。トーク画面も見える
- **Tall (70%)**: より多くの情報を表示したい場合
- **Full (100%)**: 複雑なアプリケーション向け

### 6. LIFF IDを取得
作成後に表示される`LIFF ID`をコピー

## 🔗 既存の公式アカウントとの連携

### 公式アカウントからLIFFへの誘導方法

#### 1. リッチメニューから
```
Official Account Manager → リッチメニュー
アクション: リンク
URL: https://liff.line.me/YOUR-LIFF-ID
```

#### 2. メッセージから
```javascript
// Messaging APIを使う場合
{
  "type": "text",
  "text": "アンケートはこちら\nhttps://liff.line.me/YOUR-LIFF-ID"
}
```

#### 3. Flex Messageから（推奨）
```javascript
{
  "type": "flex",
  "altText": "アンケートのお願い",
  "contents": {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "アンケートにご協力ください",
          "weight": "bold",
          "size": "lg"
        },
        {
          "type": "button",
          "action": {
            "type": "uri",
            "label": "回答する",
            "uri": "https://liff.line.me/YOUR-LIFF-ID"
          },
          "style": "primary",
          "margin": "md"
        }
      ]
    }
  }
}
```

## 📌 重要なポイント

1. **Messaging APIチャンネル ≠ LINE Loginチャンネル**
   - Messaging API: ボット・公式アカウント用
   - LINE Login: LIFFアプリ用

2. **同じプロバイダー内で両方作成可能**
   ```
   プロバイダー
   ├── Messaging APIチャンネル（既存の公式アカウント）
   └── LINE Loginチャンネル（新規作成） ← LIFFはここに追加
   ```

3. **ユーザー視点では統合されて見える**
   - 公式アカウントからLIFF URLを送信
   - ユーザーはシームレスにアンケートフォームへ

## 🎯 この構成のメリット

- ✅ 既存の公式アカウントを変更不要
- ✅ 友だち追加済みユーザーにすぐ配信可能
- ✅ LIFFアプリを独立して管理
- ✅ 将来的に複数のLIFFアプリを追加可能