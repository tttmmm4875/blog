# Laravel プロジェクト構造ドキュメント

## 概要

このプロジェクトはLaravel 12を使用した練習用アプリケーションです。

**技術スタック:**
- Laravel 12.0
- PHP 8.2以上
- Vite 7.0（フロントエンドビルド）
- Tailwind CSS 4.0

## ディレクトリ構造

```
src/
├── app/           # アプリケーションコア
├── bootstrap/     # 起動設定
├── config/        # 設定ファイル
├── database/      # DB関連
├── public/        # 公開ディレクトリ
├── resources/     # フロントエンド
├── routes/        # ルート定義
├── storage/       # ストレージ
├── tests/         # テスト
└── vendor/        # Composerパッケージ
```

---

## app/ ディレクトリ

アプリケーションのコアロジックを格納するディレクトリ。

### Http/Controllers/

HTTPリクエストを処理するコントローラーを配置。

- `Controller.php` - 全コントローラーの基底クラス

**役割:**
- リクエストの受け取り
- バリデーション
- ビジネスロジックの呼び出し
- レスポンスの返却

### Models/

Eloquent ORMモデルを配置。データベーステーブルとのマッピングを担当。

- `User.php` - ユーザーモデル（認証用）

**主な機能:**
- データベースとのCRUD操作
- リレーション定義
- アクセサ・ミューテタ
- スコープ

### Providers/

サービスプロバイダを配置。アプリケーションの起動時に実行される初期化処理を担当。

- `AppServiceProvider.php` - メインサービスプロバイダ

**役割:**
- サービスコンテナへのバインディング
- イベントリスナーの登録
- ルートの登録

---

## bootstrap/ ディレクトリ

アプリケーションの起動処理を担当。

- `app.php` - アプリケーションインスタンスの生成と設定
- `providers.php` - サービスプロバイダのリスト
- `cache/` - 最適化されたファイルのキャッシュ
  - `packages.php` - パッケージ情報のキャッシュ
  - `services.php` - サービス情報のキャッシュ

---

## config/ ディレクトリ

アプリケーションの設定ファイルを格納。

| ファイル | 説明 |
|---------|------|
| `app.php` | アプリケーション全般（名前、環境、タイムゾーン、言語） |
| `auth.php` | 認証設定（ガード、プロバイダ、パスワードリセット） |
| `cache.php` | キャッシュ設定（ドライバー、接続情報） |
| `database.php` | データベース接続設定（SQLite、MySQL等） |
| `filesystems.php` | ファイルシステム設定（ローカル、S3等） |
| `logging.php` | ログ設定（チャンネル、レベル） |
| `mail.php` | メール送信設定（ドライバー、送信元） |
| `queue.php` | キュー設定（接続、ワーカー） |
| `services.php` | 外部サービス設定（API認証情報等） |
| `session.php` | セッション設定（ドライバー、有効期限） |

---

## database/ ディレクトリ

データベース関連のファイルを格納。

### migrations/

データベーススキーマのバージョン管理ファイル。

| ファイル | 説明 |
|---------|------|
| `0001_01_01_000000_create_users_table.php` | usersテーブルの作成 |
| `0001_01_01_000001_create_cache_table.php` | cacheテーブルの作成 |
| `0001_01_01_000002_create_jobs_table.php` | jobsテーブルの作成 |

**使い方:**
```bash
php artisan migrate        # マイグレーション実行
php artisan migrate:rollback # ロールバック
php artisan migrate:fresh    # 全テーブル再作成
```

### factories/

テスト用のダミーデータ生成ファクトリ。

- `UserFactory.php` - ユーザーのダミーデータ生成

### seeders/

初期データ投入用シーダー。

- `DatabaseSeeder.php` - データベースシーディングのエントリーポイント

**使い方:**
```bash
php artisan db:seed
```

---

## public/ ディレクトリ

Webサーバーの公開ディレクトリ（ドキュメントルート）。

- `index.php` - アプリケーションのエントリーポイント
- `build/` - Viteでビルドされたアセット

**注意:** このディレクトリのみがWeb経由でアクセス可能。

---

## resources/ ディレクトリ

フロントエンドリソースを格納。

### views/

Bladeテンプレートファイルを配置。

- `welcome.blade.php` - ウェルカムページ

**Blade構文:**
```blade
{{ $variable }}          <!-- エスケープ出力 -->
{!! $html !!}            <!-- 生HTML出力 -->
@if / @foreach / @include <!-- ディレクティブ -->
```

### css/

スタイルシートファイル。

- `app.css` - メインスタイルシート（Tailwind CSS）

### js/

JavaScriptファイル。

- `app.js` - メインJavaScript
- `bootstrap.js` - Axios等の初期設定

---

## routes/ ディレクトリ

ルート定義ファイルを格納。

### web.php

Webブラウザ向けルート（セッション、CSRF保護が有効）。

```php
Route::get('/', function () {
    return view('welcome');
});
```

### console.php

Artisanコマンドラインルート。カスタムコマンドの定義に使用。

---

## storage/ ディレクトリ

アプリケーションが生成するファイルを格納。

| ディレクトリ | 説明 |
|-------------|------|
| `app/private/` | 非公開ファイル |
| `app/public/` | 公開ファイル（シンボリックリンク経由） |
| `framework/cache/` | フレームワークキャッシュ |
| `framework/sessions/` | セッションファイル |
| `framework/views/` | コンパイル済みBladeテンプレート |
| `logs/` | アプリケーションログ |

**シンボリックリンク作成:**
```bash
php artisan storage:link
```

---

## tests/ ディレクトリ

テストコードを格納。

| ディレクトリ | 説明 |
|-------------|------|
| `Feature/` | 機能テスト（複数コンポーネントの統合テスト） |
| `Unit/` | ユニットテスト（単一クラス/メソッドのテスト） |

- `TestCase.php` - テストの基底クラス

**テスト実行:**
```bash
php artisan test
# または
./vendor/bin/phpunit
```

---

## 主要ファイル

### artisan

LaravelのCLIツール。

**よく使うコマンド:**
```bash
php artisan serve          # 開発サーバー起動
php artisan make:controller # コントローラー作成
php artisan make:model     # モデル作成
php artisan make:migration # マイグレーション作成
php artisan cache:clear    # キャッシュクリア
php artisan route:list     # ルート一覧表示
```

### composer.json

PHP依存関係の定義ファイル。

**主な依存パッケージ:**
- `laravel/framework` - Laravelコア
- `laravel/tinker` - REPLツール

**開発依存:**
- `phpunit/phpunit` - テストフレームワーク
- `laravel/pint` - コードフォーマッター
- `laravel/pail` - ログビューア

### package.json

Node.js依存関係の定義ファイル。

**主な依存パッケージ:**
- `vite` - ビルドツール
- `tailwindcss` - CSSフレームワーク
- `axios` - HTTPクライアント

### .env

環境変数ファイル（Git管理外）。

**主な設定項目:**
```
APP_ENV=local              # 環境（local/production）
APP_DEBUG=true             # デバッグモード
APP_KEY=                   # 暗号化キー
DB_CONNECTION=sqlite       # データベース接続
```

### vite.config.js

Viteビルド設定ファイル。

```javascript
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
});
```

### phpunit.xml

PHPUnitテスト設定ファイル。テスト環境の設定を定義。
