# ZZ4THBlog Frontend

郑州市第四高级中学菜品评分系统前端。

## Project setup

```bash
npm install
```

## Development

```bash
npm run serve
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## 后端接口预留说明

所有预留后端请求统一放在 `src/api` 目录，使用 `Axios`、`GET`、`JSON` 格式。默认 `VUE_APP_API_MOCK` 不设置时走本地 mock，不会真实请求后端；需要联调后端时设置：

```bash
VUE_APP_API_MOCK=false
VUE_APP_API_BASE_URL=http://localhost:8080/api
```

### 通用约定

- 请求方式：`GET`
- 响应格式：`application/json`
- 前端统一入口：`src/api/client.js`
- 参数传递：全部使用 query params
- 成功字段：建议统一返回 `success: true`

### 管理员密码验证

- 接口：`GET /admin/verify-password`
- 前端方法：`verifyAdminPassword(password)`
- 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| password | string | 是 | 管理员密码 |

- 响应示例：

```json
{
  "success": true
}
```

### 补充信息审核列表

- 接口：`GET /admin/supplement-reviews`
- 前端方法：`fetchSupplementReviews()`
- 参数：无
- 响应示例：

```json
{
  "pending": [
    {
      "id": 1,
      "dishName": "红烧肉",
      "userName": "同学A",
      "submittedAt": "2026-03-21",
      "info": "价格调整为18元，位置在1楼1号窗口。"
    }
  ],
  "reviewed": [
    {
      "id": 3,
      "dishName": "番茄炒蛋",
      "userName": "同学C",
      "submittedAt": "2026-03-20",
      "reviewedAt": "2026-03-20",
      "status": "approved",
      "info": "补充价格12元和1楼4号窗口位置。"
    }
  ]
}
```

### 提交补充信息审核结果

- 接口：`GET /admin/review-supplement`
- 前端方法：`reviewSupplementInfo({ id, approved })`
- 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | number/string | 是 | 补充信息 ID |
| approved | boolean | 是 | `true` 为通过，`false` 为不通过 |

- 响应示例：

```json
{
  "success": true,
  "approved": true
}
```

### 用户管理列表

- 接口：`GET /admin/users`
- 前端方法：`fetchUsers()`
- 参数：无
- 响应示例：

```json
{
  "users": [
    {
      "id": 1,
      "name": "同学A",
      "role": "普通用户",
      "ratingCount": 8,
      "status": "正常"
    }
  ]
}
```

### 评论/建议/补充信息统一审核

- 接口：`GET /review/content`
- 前端方法：`submitContentForReview(payload)`
- 说明：当前前端 mock 直接返回通过，页面即时显示；后端接入后应由后端审核并返回是否通过，前端仅在 `approved: true` 时显示内容。
- 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| type | string | 是 | 内容类型，如 `selection`、`selection-comment`、`advice`、`advice-comment`、`suggestion`、`suggestion-comment`、`dish-supplement` |
| comment/reply | string | 否 | 评论或回复内容 |
| dishName | string | 否 | 菜品名称 |
| price | number | 否 | 价格 |
| positions | array/json string | 否 | 位置信息 |
| target | object/json string | 否 | 回复目标 |

- 响应示例：

```json
{
  "success": true,
  "approved": true,
  "reviewId": "selection-comment-123"
}
```

### 菜单增量同步

菜单增量同步：前端从 IndexedDB 读取本地菜单与 `sync_version`，请求后端同步，并把同步结果写回本地菜单。

#### 前端 → 后端

- 请求方式：`GET`
- 请求路径：`/menu/sync`
- Query 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| since | number | 否 | 本地 `sync_version`；无本地菜单或无 `sync_version` 时不携带 |

- 请求时机：调用 `getMenu()` 时发起同步；有 `sync_version` 时携带 `since=sync_version`，无本地菜单或无 `sync_version` 时不带 `since`，执行 Full Sync。
- 后端响应格式（`application/json`）：

```json
{
  "success": true,
  "mode": "fullsync | incremental",
  "version": 123
}
```

- 增量同步与 Full Sync：
  - 返回 `fullsync` 还是 `incremental` 由后端决定，前端不判断版本差距。
  - `fullsync`：后端返回完整 `menu`，前端覆盖本地菜单并更新 `sync_version`。
  - `incremental`：后端返回 `changes`，前端按版本顺序逐条应用，应用成功后保存最新 `version`。
  - 无本地菜单或无 `sync_version` 时执行 Full Sync（前端不携带 `since`，后端应返回 `fullsync`）。

- fullsync 响应示例：

```json
{
  "success": true,
  "mode": "fullsync",
  "version": 123,
  "menu": [
    {
      "id": 1,
      "name": "红烧肉",
      "position": { "stair": 1, "window": 1 },
      "image": "",
      "rate": 4.8,
      "price": 18
    }
  ]
}
```

- incremental 响应示例（`changes` 已按版本顺序排列）：

```json
{
  "success": true,
  "mode": "incremental",
  "version": 124,
  "changes": [
    {
      "op": "create",
      "data": {
        "id": 16,
        "name": "新菜品",
        "position": { "stair": 2, "window": 8 },
        "image": "",
        "rate": 0,
        "price": 12
      }
    },
    {
      "op": "update",
      "data": { "id": 1, "rate": 4.9 }
    },
    {
      "op": "delete",
      "id": 3
    }
  ]
}
```

- create / update / delete 数据格式：

| op | 数据格式 | 说明 |
| --- | --- | --- |
| create | `{ "op": "create", "data": Dish }` | 新增菜品 |
| update | `{ "op": "update", "data": Partial<Dish> }` | 只合并返回字段；`rate` 更新只修改对应 Dish 的 `rate`，其余字段保持不变；本地不存在该 Dish 时忽略 |
| delete | `{ "op": "delete", "id": number }` | 按 `id` 删除；也兼容 `{ "op": "delete", "data": { "id": number } }` 写法 |

- 开发环境 mock 回退：无 `since` 时模拟 fullsync（保持当前本地菜单），有 `since` 时模拟空增量。

#### 前端调用

- 前端方法：`getMenu()`
- 参数：无
- 返回值：`Promise<Dish[]>`
- 返回数据类型：完整 `Dish[]`（Dish 实例，字段含 `id`、`name`、`position`、`image`、`rate`、`price`）
- 简单调用示例：

```js
import { getMenu } from '@/api/getMenu';

const menu = await getMenu();
console.log(menu);
```

### 新品建议增量同步

- 函数名：`getAdvice`
- 前端调用方式：`import { getAdvice } from '@/api/getAdvice'; await getAdvice();`
- 返回值：`Promise<Advice[]>`（Advice 实例，字段含 `id`、`user_id`、`date`、`comment`、`like`、`follow_comments`）
- 后端请求方法和路径：`GET /advice/sync`
- Query 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| since | number | 否 | 本地 `advice_version`；无本地数据或无版本号时不携带 |

- 对应版本号：`advice_version`（IndexedDB `meta` 仓库记录 id，与其他数据域完全独立）
- 增量响应格式：

```json
{
  "success": true,
  "mode": "incremental",
  "version": 124,
  "changes": [
    { "op": "create", "data": Advice },
    { "op": "update", "data": "Partial<Advice>" },
    { "op": "delete", "id": 3 }
  ]
}
```

- Full Sync 响应格式：

```json
{
  "success": true,
  "mode": "fullsync",
  "version": 123,
  "advices": [ "Advice" ]
}
```

### 新品建议评论增量同步

- 函数名：`getAdviceComments`
- 前端调用方式：`import { getAdviceComments } from '@/api/getAdviceComments'; await getAdviceComments();`
- 返回值：`Promise<AdviceComment[]>`（AdviceComment 实例，字段含 `id`、`user_id`、`date`、`advice_id`、`reply`、`parent_id`、`likes`）
- 后端请求方法和路径：`GET /advice-comments/sync`
- Query 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| since | number | 否 | 本地 `advice_comment_version`；无本地数据或无版本号时不携带 |

- 对应版本号：`advice_comment_version`（IndexedDB `meta` 仓库记录 id，与其他数据域完全独立）
- 增量响应格式：

```json
{
  "success": true,
  "mode": "incremental",
  "version": 124,
  "changes": [
    { "op": "create", "data": AdviceComment },
    { "op": "update", "data": "Partial<AdviceComment>" },
    { "op": "delete", "id": 3 }
  ]
}
```

- Full Sync 响应格式：

```json
{
  "success": true,
  "mode": "fullsync",
  "version": 123,
  "adviceComments": [ "AdviceComment" ]
}
```

### 食堂建议增量同步

- 函数名：`getSuggestion`
- 前端调用方式：`import { getSuggestion } from '@/api/getSuggestion'; await getSuggestion();`
- 返回值：`Promise<Suggestion[]>`（Suggestion 实例，字段含 `id`、`user_id`、`date`、`comment`、`like`、`follow_comments`）
- 后端请求方法和路径：`GET /suggestion/sync`
- Query 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| since | number | 否 | 本地 `suggestion_version`；无本地数据或无版本号时不携带 |

- 对应版本号：`suggestion_version`（IndexedDB `meta` 仓库记录 id，与其他数据域完全独立）
- 增量响应格式：

```json
{
  "success": true,
  "mode": "incremental",
  "version": 124,
  "changes": [
    { "op": "create", "data": Suggestion },
    { "op": "update", "data": "Partial<Suggestion>" },
    { "op": "delete", "id": 3 }
  ]
}
```

- Full Sync 响应格式：

```json
{
  "success": true,
  "mode": "fullsync",
  "version": 123,
  "suggestions": [ "Suggestion" ]
}
```

### 食堂建议评论增量同步

- 函数名：`getSuggestionComments`
- 前端调用方式：`import { getSuggestionComments } from '@/api/getSuggestionComments'; await getSuggestionComments();`
- 返回值：`Promise<SuggestionComment[]>`（SuggestionComment 实例，字段含 `id`、`user_id`、`date`、`suggestion_id`、`reply`、`parent_id`、`likes`）
- 后端请求方法和路径：`GET /suggestion-comments/sync`
- Query 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| since | number | 否 | 本地 `suggestion_comment_version`；无本地数据或无版本号时不携带 |

- 对应版本号：`suggestion_comment_version`（IndexedDB `meta` 仓库记录 id，与其他数据域完全独立）
- 增量响应格式：

```json
{
  "success": true,
  "mode": "incremental",
  "version": 124,
  "changes": [
    { "op": "create", "data": SuggestionComment },
    { "op": "update", "data": "Partial<SuggestionComment>" },
    { "op": "delete", "id": 3 }
  ]
}
```

- Full Sync 响应格式：

```json
{
  "success": true,
  "mode": "fullsync",
  "version": 123,
  "suggestionComments": [ "SuggestionComment" ]
}
```

### 严选分享增量同步

- 函数名：`getSelection`
- 前端调用方式：`import { getSelection } from '@/api/getSelection'; await getSelection();`
- 返回值：`Promise<Selection[]>`（Selection 实例，字段含 `id`、`user_id`、`date`、`comment`、`price`、`position`、`rate`、`follow_comments`）
- 后端请求方法和路径：`GET /selection/sync`
- Query 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| since | number | 否 | 本地 `selection_version`；无本地数据或无版本号时不携带 |

- 对应版本号：`selection_version`（IndexedDB `meta` 仓库记录 id，与其他数据域完全独立）
- 增量响应格式：

```json
{
  "success": true,
  "mode": "incremental",
  "version": 124,
  "changes": [
    { "op": "create", "data": Selection },
    { "op": "update", "data": "Partial<Selection>" },
    { "op": "delete", "id": 3 }
  ]
}
```

- Full Sync 响应格式：

```json
{
  "success": true,
  "mode": "fullsync",
  "version": 123,
  "selections": [ "Selection" ]
}
```

### 严选分享评论增量同步

- 函数名：`getSelectionComments`
- 前端调用方式：`import { getSelectionComments } from '@/api/getSelectionComments'; await getSelectionComments();`
- 返回值：`Promise<SelectionComment[]>`（SelectionComment 实例，字段含 `id`、`user_id`、`date`、`detail`、`selection_id`、`reply`）
- 后端请求方法和路径：`GET /selection-comments/sync`
- Query 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| since | number | 否 | 本地 `selection_comment_version`；无本地数据或无版本号时不携带 |

- 对应版本号：`selection_comment_version`（IndexedDB `meta` 仓库记录 id，与其他数据域完全独立）
- 增量响应格式：

```json
{
  "success": true,
  "mode": "incremental",
  "version": 124,
  "changes": [
    { "op": "create", "data": SelectionComment },
    { "op": "update", "data": "Partial<SelectionComment>" },
    { "op": "delete", "id": 3 }
  ]
}
```

- Full Sync 响应格式：

```json
{
  "success": true,
  "mode": "fullsync",
  "version": 123,
  "selectionComments": [ "SelectionComment" ]
}
```

以上 6 个接口通用行为与菜单同步一致：`changes` 按版本顺序逐条应用；`update` 只合并返回字段，本地不存在该记录时忽略；是否返回 `fullsync` 或 `incremental` 由后端决定，前端不判断版本差距；无本地数据或无对应版本号时不携带 `since` 并执行 Full Sync；同步成功后保存最新版本号。开发环境 mock 回退与 `getMenu` 一致：无 `since` 时模拟 fullsync（保持当前本地数据），有 `since` 时模拟空增量。
