# CreateLog

CreateLogは、デザイン学習のアウトプットを投稿・記録し、ポートフォリオのように蓄積できる学習支援サービスです。

課題を選び、制作物を投稿し、制作意図や使用ツールを記録することで、「作って終わり」になりがちな学習を、振り返りや公開プロフィールにつなげることを目的としています。

## 公開URL

https://create-log.vercel.app/

## GitHub

このリポジトリでは、CreateLogのMVP実装を管理しています。

## 制作目的

デザイン学習では、バナー・ロゴ・LP・UIなどを制作しても、作品単体で終わってしまい、制作意図や振り返りが残りにくいという課題があります。

CreateLogでは、以下の流れを作ることで、学習成果を蓄積しやすくすることを目指しました。

- 課題を選ぶ
- 制作物を投稿する
- 制作意図・使用ツールを記録する
- 公開投稿として一覧に表示する
- 自分のプロフィールに学習ログとして蓄積する

## 主な機能

### 認証機能

- 新規登録
- ログイン
- ログアウト
- ログイン状態に応じたヘッダー表示切り替え

### 課題機能

- 課題一覧表示
- 課題詳細表示
- 課題から投稿作成ページへの遷移

### 投稿機能

- 投稿作成
- 画像アップロード
- 投稿一覧表示
- 投稿詳細表示
- 投稿編集
- 投稿削除
- 公開 / 非公開 / 下書きのステータス管理

### マイページ

- ログインユーザーのプロフィール表示
- 自分の投稿一覧表示
- 投稿の編集・削除導線
- プロフィール編集

### 公開プロフィール

- ユーザーごとの公開プロフィールページ
- 公開投稿のみ表示
- 自己紹介・WebサイトURLの表示

### その他

- カスタム404ページ
- Supabase Row Level Security による権限管理
- Vercelによる本番公開

## 使用技術

| 分類 | 技術 |
| --- | --- |
| フロントエンド | Next.js |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| 認証 | Supabase Auth |
| データベース | Supabase PostgreSQL |
| ストレージ | Supabase Storage |
| ホスティング | Vercel |
| バージョン管理 | Git / GitHub |

## 使用している主なページ

| パス | 内容 |
| --- | --- |
| `/` | トップページ |
| `/themes` | 課題一覧 |
| `/themes/[id]` | 課題詳細 |
| `/posts` | 投稿一覧 |
| `/posts/[id]` | 投稿詳細 |
| `/posts/new` | 投稿作成 |
| `/posts/[id]/edit` | 投稿編集 |
| `/mypage` | マイページ |
| `/mypage/profile/edit` | プロフィール編集 |
| `/users/[username]` | 公開プロフィール |
| `/login` | ログイン |
| `/register` | 新規登録 |

## データ設計

主に以下のテーブルを使用しています。

### profiles

ユーザーのプロフィール情報を管理します。

- id
- username
- display_name
- bio
- avatar_url
- website_url
- created_at
- updated_at

### themes

投稿課題を管理します。

- id
- title
- description
- category
- level
- thumbnail_url
- prompt
- requirements
- is_published
- created_at
- updated_at

### posts

ユーザーの投稿を管理します。

- id
- user_id
- theme_id
- title
- description
- concept
- tools
- category
- image_url
- status
- copyright_confirmed
- created_at
- updated_at

### post_images

投稿画像を複数管理するための拡張用テーブルです。  
現時点のMVPでは、主に `posts.image_url` を使用しています。

- id
- post_id
- image_url
- alt_text
- sort_order
- created_at

## 権限設計

Supabaseの Row Level Security を使用し、以下の方針で権限を制御しています。

- 公開投稿は誰でも閲覧可能
- 非公開・下書き投稿は本人のみ閲覧可能
- 投稿の作成・編集・削除はログインユーザー本人のみ可能
- プロフィールは誰でも閲覧可能
- プロフィール編集は本人のみ可能
- 投稿画像は公開バケットで表示可能
- 画像アップロードはログインユーザーのみ可能

## 実装で意識したこと

### 1. 学習ログとしての蓄積

単なる投稿サービスではなく、学習課題・制作意図・使用ツールをセットで記録できるようにしました。これにより、作品だけでは伝わりにくい考え方や制作プロセスも残せる設計にしています。

### 2. 公開と非公開の切り分け

投稿には `public`、`private`、`draft` のステータスを持たせ、公開プロフィールや投稿一覧には公開投稿のみ表示されるようにしています。

### 3. 安全な投稿導線

投稿時には、他者の作品を無断転載していないことを確認するチェック項目を設けています。学習サービスとして、著作権や投稿内容への配慮を設計に含めました。

### 4. 実サービスに近いCRUD

投稿作成、表示、編集、削除まで一通り実装し、MVPとして実際に操作できる状態を目指しました。

### 5. Supabase RLSによる権限管理

フロント側の表示制御だけでなく、Supabase側でもRLSを設定し、本人以外が投稿を編集・削除できないようにしています。

## ローカル環境での起動方法

### 1. リポジトリをクローン

```bash
git clone https://github.com/ユーザー名/createlog.git
cd createlog