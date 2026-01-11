# フロントエンド設計における状態管理とコンポーネント設計の原則

フロントエンド開発において、コンポーネント設計と状態管理は密接に関連する重要なトピックである。本記事では、コンポーネントの結合度と状態の局所性という2つの観点から、保守性の高いフロントエンドアーキテクチャを実現するための原則を解説する。

## 1. コンポーネントの入れ子と結合度

### 入れ子の深さは本質ではない

コンポーネントの入れ子が深いことは、それ自体が問題ではない。真の問題は、コンポーネント間の依存関係の方向性と結合度である。入れ子が深くても、適切に設計されていれば保守性は保たれる。

逆に、入れ子を無理に浅くしようとすると、親コンポーネントが肥大化し、単一責務の原則に反する可能性がある。親が複数の無関係な子コンポーネントを管理することで、凝集度が低下し、かえって保守性が悪化する。

### 悪い例：親コンポーネントの肥大化

```vue
<template>
  <div>
    <!-- 親が多くの子の状態を管理 -->
    <UserProfile
      :user="user"
      :isEditing="isEditingProfile"
      @update="handleProfileUpdate"
      @cancel="isEditingProfile = false"
    />
    <UserSettings
      :settings="settings"
      :isEditing="isEditingSettings"
      @update="handleSettingsUpdate"
      @cancel="isEditingSettings = false"
    />
    <UserNotifications
      :notifications="notifications"
      :filter="notificationFilter"
      @filter="handleFilterChange"
      @dismiss="handleDismiss"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 親が全ての状態を管理
const user = ref({})
const isEditingProfile = ref(false)
const settings = ref({})
const isEditingSettings = ref(false)
const notifications = ref([])
const notificationFilter = ref('all')

// 親が全てのハンドラを持つ
const handleProfileUpdate = (data) => { /* ... */ }
const handleSettingsUpdate = (data) => { /* ... */ }
const handleFilterChange = (filter) => { /* ... */ }
const handleDismiss = (id) => { /* ... */ }
</script>
```

この例では、親コンポーネントが3つの無関係な機能（プロフィール、設定、通知）の状態とロジックを全て管理しており、凝集度が低い。

### 良い例：適切な責務の分離

```vue
<template>
  <div>
    <!-- 各コンポーネントが自律的 -->
    <UserProfile :userId="userId" />
    <UserSettings :userId="userId" />
    <UserNotifications :userId="userId" />
  </div>
</template>

<script setup>
defineProps(['userId'])
</script>
```

各子コンポーネント内部で必要な状態とロジックを管理することで、親はシンプルになり、それぞれのコンポーネントの凝集度が高まる。

### 重視すべき設計指針

- **単方向データフロー**：親から子への props、子から親への events という明確な流れを保つ
- **単一責務**：各コンポーネントは1つの関心事に集中する
- **Props の数**：多すぎる props は結合度の高さを示すシグナル
- **疎結合**：親が子の実装詳細を知らない、子が親の実装詳細を知らない

## 2. 状態管理の局所性

### 距離が理解度を左右する

状態の変更箇所と参照箇所の距離が遠いほど、コードの理解は困難になる。同じファイル内、同じ関数内で状態の変更と参照が完結していれば、影響範囲が明確で追跡が容易である。

### グローバル状態管理の落とし穴

グローバルな状態管理ツール（Vuex、Pinia など）を安易に使用すると、時間経過とともに状態の変更箇所がコードベース全体に散在する。その結果、特定の状態がどこで、なぜ変更されているのかを追跡することが極めて困難になる。

### 悪い例：グローバル状態への過度な依存

```vue
<!-- ComponentA.vue -->
<script setup>
import { useStore } from '@/store'

const store = useStore()

// グローバル状態を変更
const handleClick = () => {
  store.updateUserPreference('theme', 'dark')
}
</script>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { useStore } from '@/store'

const store = useStore()

// 別の場所でも同じ状態を変更
const handleToggle = () => {
  store.updateUserPreference('theme', store.userPreference.theme === 'dark' ? 'light' : 'dark')
}
</script>
```

この例では、`theme` という状態が複数のコンポーネントから変更される可能性があり、バグの原因となりやすい。

### 良い例：Colocation の原則

```vue
<template>
  <div>
    <ThemeToggle v-model="theme" />
    <MainContent :theme="theme" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 状態を必要な場所に近く配置
const theme = ref('light')
</script>
```

状態を使用する場所の近くに配置することで、状態の変更と参照が局所的になり、理解しやすくなる。

### 推奨アプローチ

- **状態を持たないコンポーネント**：可能な限り、props のみで動作する純粋なコンポーネントを作る
- **末端での状態管理**：状態が必要な場合は、末端のコンポーネントが個別に管理する
- **グローバル状態は最小限に**：本当に複数の離れた場所で共有が必要な状態のみグローバルにする（認証情報、テーマなど）

## 3. 2つの原則の統合

### 共通のゴール：変更の影響範囲の最小化

「コンポーネントの結合度」と「状態の局所性」という2つの原則は、異なる角度から同じゴールを目指している。それは、変更の影響範囲を最小化し、コードの理解しやすさと変更しやすさを両立することである。

結合度の低いコンポーネント設計を行えば、変更が他のコンポーネントに波及しにくい。状態を局所的に管理すれば、状態の変更による影響を予測しやすくなる。

### 統合された設計思想

両方の原則を統合すると、以下のような設計思想が導かれる。

**関連するものを近くに置く（Colocation）**
- 状態とそれを操作するロジックは近くに配置する
- コンポーネントとそのスタイル、テスト、型定義も近くに配置する

**依存を一方向に整理する**
- データの流れは親から子へ（props）
- イベントの流れは子から親へ（events）
- この一方向性が複雑さの増大を防ぐ

### 実践例：自己完結型コンポーネント

```vue
<template>
  <div class="todo-list">
    <input v-model="newTodo" @keyup.enter="addTodo" placeholder="新しいタスク" />
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <input type="checkbox" v-model="todo.done" />
        <span :class="{ done: todo.done }">{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)">削除</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 状態とロジックが同じコンポーネント内に局所化
const todos = ref([])
const newTodo = ref('')
let nextId = 0

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: nextId++,
      text: newTodo.value,
      done: false
    })
    newTodo.value = ''
  }
}

const removeTodo = (id) => {
  todos.value = todos.value.filter(todo => todo.id !== id)
}
</script>

<style scoped>
.done {
  text-decoration: line-through;
  color: #999;
}
</style>
```

このコンポーネントは、TODO リストの状態と操作ロジックを全て内部に持ち、外部に依存していない。変更の影響範囲が明確で、テストもしやすい。

## まとめ

フロントエンド設計において、コンポーネントの入れ子の深さそのものは問題ではない。重要なのは、依存関係の方向性と結合度を適切に管理することである。

状態管理においては、変更箇所と参照箇所の距離を最小化することで、コードの理解度と保守性が向上する。グローバル状態は必要最小限にとどめ、可能な限り局所的に状態を管理すべきである。

これら2つの原則は、共に「変更の影響範囲を最小化する」という同じゴールを目指している。関連するものを近くに配置し、依存を一方向に整理することで、理解しやすく変更しやすいコードベースを実現できる。
