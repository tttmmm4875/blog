ドキュメントサイトジェネレータdocsifyの基本的な使い方まとめ  
docsify  
最終更新日 2022年02月03日  
投稿日 2022年02月03日  
image.png

ちょっとしたドキュメントを作成するのに便利な「ドキュメントサイトジェネレータ」であるdocsifyについて、基本的な情報＆使い方をまとめます（自分で使いながら追記していきます）。

docsifyとは  
公式サイト：docsify

トップに

A magical documentation site generator.

と書かれているように、docsifyは"ドキュメントサイトジェネレータ"です。

ドキュメントサイトジェネレータとは  
その名の通り、たとえばプログラミング言語やフレームワークのドキュメントページのような形式のサイトを作るためのツールです。左にメニューがあって、右に本文があって、というあれです。

docsifyのサイト自体がdocsifyで作られているので、これを見ていただくのが一番わかりやすいです。

類似のツール  
GitBook - Where software teams break knowledge silos.  
docuowl/docuowl: 🦉 A documentation generator  
Build optimized websites quickly, focus on your content | Docusaurus  
などなどなど多数存在します

docsifyを使うメリット  
なんといっても、ドキュメントサイトが爆速で作れる点です。HTMLやCSSなど細かいところをいじる必要がなく、Markdownでドキュメントの本文を書くことに集中できる点が魅力です。

また、他のドキュメントサイトジェネレータに比べても導入が簡単と個人的に感じたことも大きいです。

コマンドラインでnpmが実行できれば今すぐに始められる手軽さです。

例  
本記事執筆時点でつくりかけですが、こんな感じのサイトがすぐ作れます。GitHub Pagesでデプロイしています。

テストエンジニアのための初めてのプログラミング

このサイトで実際にやっている例をベースに説明します。

docsifyのはじめかた  
前提  
node.jsがインストールされていること  
環境構築  
基本的には公式のQuick startの通りにやればOKです。

まずはインストール。

npm i docsify-cli -g  
公式ではグローバルのインストールが推奨されています。

次に初期化です。docsifyのドキュメントを作成したいディレクトリに移動してコマンドを実行します。

ここでは公式の例にそって、カレントの下にある./docsディレクトリにドキュメントサイトを作ることにします。  
（ここを揃えておくと、後々GitHub Pagesにデプロイするときに公式のdocsifyドキュメントと整合性がとれた状態で進められます。）

docsify init ./docs  
成功すると、

Initialization succeeded! Please run docsify serve ./docs  
と表示されるので、書いてあるとおりにdocsify serve ./docsすると・・・

で以下のように表示されます。

1000.png

docsディレクトリの中身は3つです。

index.html : エントリファイル。ここに設定など色々記述します。  
README.md : ドキュメントサイトのHOMEに相当します。  
.nojekyll : GitHub Pagesでホスティングするときにjekyllとして処理されないようにするためのファイルです。  
参考：GitHub Pagesで普通の静的ホスティングをしたいときは .nojekyll ファイルを置く - Qiita

記事を書く  
記事を書く際は.mdファイルに本文をどんどん書いていけばOKです。

README.mdはホーム画面にあたるので追記するだけです。

新しくページを追加したいときは、docsディレクトリ内にhogehoge.mdを追加して、そこに本文を書いていきます。

この先は記事を書いてサイトを構築していくにあたってよく使う機能について説明します。

よく使う（であろう）機能  
サイドバーを追加する  
参考：Sidebar

サイドバーを追加するのは2ステップです。

1.  index.htmlに追記  
    index.htmlにloadSidebar: trueを追記します。

具体的にはココ。このとき、ついでにsubMaxLevelも設定しておくとよいでしょう。ToCをサイドバーに出してくれます。

参考：Table of Contents

window.$docsify = { name: '', repo: '', loadSidebar: true, /\* ココ \*/ subMaxLevel: 2, /\* h2までをサイドバーに出す、の意 \*/ } 2. \_sidebar.mdを作成 docsディレクトリの直下に\_sidebar.mdを作成します。アンダーバーが先頭についています。

\_sidebar.mdの中に、箇条書きでリンクを書いていきます。

例

**テストエンジニアのための初めてのプログラミング**

[Home](/)

[講師](/instructor.md)

[ワーク環境構築](/env.md)

---

[プログラミングを始めよう](/introduction.md)

[プログラミングの基礎知識](/fundamentals.md)

[実際にやってみよう～ワーク～](/work.md)

---

[プログラミングを学ぶコツ](/how-to-learn.md)

---

[Python環境構築](/python-env.md)  
このように表示されます。

image.png

ナビゲーションバーの追加  
参考：Custom navbar

1.  index.htmlに追記  
    index.htmlにloadNavbar: trueを追記します。

具体的にはココ。

window.$docsify = { name: '', repo: '', loadSidebar: true, subMaxLevel: 2, loadNavbar: true /\* ココ \*/ } 2. \_navbar.mdを作成 docsディレクトリの直下に\_navbar.mdを作成します。こちらもアンダーバーが先頭についています。

\_navbar.mdの中に箇条書きでリンクを書いていきます。

*   [JaSST'22 Tokyo](http://www.jasst.jp/symposium/jasst22tokyo.html)  
    ここではNavbarの内容が一つだけですが、このように右上に表示されます。

image.png

Tipsとポイントの書き方  
image.png

↑こんなやつです。緑背景や、「！」のついたグレー背景の部分です。

それぞれ書き方は以下。

?> 参考情報を書いたりできるし

!> 気をつけるべきことを書いたりできるよ  
絵文字を使う  
リストはこちら＞Markdown

:thumbsup: +1  
:clap: clap  
:100: 100  
などが使えます。