# LIFF 3択アンケートフォーム

LINE公式アカウント内に埋め込める3択アンケートフォームです。回答はGoogleスプレッドシートに自動保存されます。

## 技術スタック

- **フロントエンド**: Next.js 15 + TypeScript + Tailwind CSS
- **LINE連携**: LIFF v2
- **ホスティング**: Vercel
- **データ保存**: Google スプレッドシート (Apps Script)

## セットアップガイド

### 1. Googleスプレッドシートの準備

1. 新しいGoogleスプレッドシートを作成します
2. シートに以下のヘッダーを追加（A1:D1）:
   - A列: `timestamp`
   - B列: `userId`
   - C列: `userName`
   - D列: `choice`

3. **拡張機能 → Apps Script** を開きます
4. 以下のコードを貼り付けて保存:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActive().getSheetByName('シート1');
    
    // 新しい行を追加
    sheet.appendRow([
      new Date(),
      data.userId || '不明',
      data.userName || '不明',
      data.choice || '不明'
    ]);
    
    // 成功レスポンス
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // エラーレスポンス
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. **デプロイ → 新しいデプロイ**
   - 種類: **ウェブアプリ**
   - 実行ユーザー: **自分**
   - アクセスできるユーザー: **全員**
   - デプロイをクリック
   - 表示されるWeb App URLをコピー

### 2. LINE Developersの設定

1. [LINE Developers Console](https://developers.line.biz/console/) にログイン
2. プロバイダーを作成または選択
3. **新規チャンネル作成 → LINE Login**
4. 以下を設定:
   - チャンネル名: 任意
   - チャンネル説明: 任意
   - アプリタイプ: ウェブアプリ

5. **LIFF** タブから **追加**
   - LIFF アプリ名: 任意
   - サイズ: **Full**
   - エンドポイントURL: `https://your-app.vercel.app/`（後で更新）
   - Scope: `profile` にチェック
   - LIFF IDをコピー

### 3. ローカル開発環境のセットアップ

1. 環境変数ファイルを作成:
```bash
cp .env.local.example .env.local
```

2. `.env.local` を編集:
```
NEXT_PUBLIC_LIFF_ID=your-liff-id-here
APPSCRIPT_URL=https://script.google.com/macros/s/your-script-id/exec
```

3. 開発サーバーを起動:
```bash
npm install
npm run dev
```

### 4. Vercelへのデプロイ

1. [Vercel](https://vercel.com) にログイン
2. **Add New → Project**
3. GitHubリポジトリをインポート
4. 環境変数を設定:
   - `NEXT_PUBLIC_LIFF_ID`: LINE Developers ConsoleのLIFF ID
   - `APPSCRIPT_URL`: Google Apps ScriptのWeb App URL

5. **Deploy** をクリック
6. デプロイ完了後、URLをコピー
7. LINE Developers ConsoleでエンドポイントURLを更新

### 5. テスト方法

1. LINE公式アカウントまたはLINEアプリで以下のURLにアクセス:
   ```
   https://liff.line.me/YOUR-LIFF-ID
   ```

2. フォームが表示されることを確認
3. 選択肢を選んで送信
4. Googleスプレッドシートに回答が記録されることを確認

## トラブルシューティング

### よくある問題

#### LIFFが初期化できない
- LIFF IDが正しく設定されているか確認
- HTTPSでアクセスしているか確認（ローカル開発時はngrokなどを使用）

#### スプレッドシートに保存されない
- Apps ScriptのWeb App URLが正しいか確認
- Apps Scriptの実行権限が「全員」になっているか確認
- Vercelの環境変数が正しく設定されているか確認

#### CORSエラーが発生する
- Apps Scriptは自動的にCORSヘッダーを設定するため、通常は問題ありません
- ブラウザの開発者ツールでネットワークタブを確認

## カスタマイズ

### 選択肢を変更する場合

`app/page.tsx` の以下の部分を編集:
```typescript
{['A', 'B', 'C'].map((opt) => (
  // 例: ['選択肢1', '選択肢2', '選択肢3']
```

### デザインを変更する場合

Tailwind CSSクラスを使用してスタイルをカスタマイズできます。

## セキュリティ考慮事項

- LIFF IDは公開されても問題ありませんが、Apps Script URLは適切に管理してください
- より高度なセキュリティが必要な場合は、Google Sheets APIとService Accountを使用する方法を検討してください

## ライセンス

ISC