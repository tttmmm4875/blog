# Laravelのメソッドスプーフィング

## 概要

HTMLフォームはGETとPOSTしかサポートしていないため、PUT、PATCH、DELETEリクエストを送信するには擬似的にHTTPメソッドを指定する必要があります。これがメソッドスプーフィングです。

## 基本的な使い方

### @methodディレクティブを使用

Bladeテンプレートでは`@method`ディレクティブを使います：

```php
<form action="/posts/1" method="POST">
    @csrf
    @method('DELETE')
    <button type="submit">削除</button>
</form>
```

### hidden inputを直接記述

または、hidden inputを直接書くこともできます：

```php
<form action="/posts/1" method="POST">
    @csrf
    <input type="hidden" name="_method" value="PUT">
    <button type="submit">更新</button>
</form>
```

## 仕組み

メソッドスプーフィングは以下の流れで動作します：

1. フォームは実際にはPOSTで送信される
2. `_method`フィールドの値をLaravelが読み取る
3. ルーティング時に指定されたHTTPメソッド（PUT、DELETE等）として扱われる

## 対応するルート定義

メソッドスプーフィングを使用する場合、ルート定義側で適切なHTTPメソッドを指定する必要があります：

```php
Route::put('/posts/{id}', [PostController::class, 'update']);
Route::delete('/posts/{id}', [PostController::class, 'destroy']);
Route::patch('/posts/{id}', [PostController::class, 'partialUpdate']);
```

## まとめ

RESTfulなAPI設計をHTMLフォームでも実現できる、シンプルで実用的な機能です。フォームベースのアプリケーションでも、適切なHTTPメソッドを使用してリソース操作を表現できます。
