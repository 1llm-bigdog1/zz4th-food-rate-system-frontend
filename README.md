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

### 获取待审核补充信息

- 接口：`GET /admin/supplement-reviews?status=pending`
- 前端方法：`fetchPendingSupplementReviews()`
- 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| status | string | 是 | 固定为 `pending`，只返回尚未审核的补充信息 |

- 用途：从后端获取新的、尚未审核的补充信息，供管理端“待审核”列表展示。
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

### 用户注册

- 接口：`POST /auth/register`（配合 `src/api/client.js` 的 baseURL `/api`，实际请求 `/api/auth/register`）
- 前端方法：`register({ username, email, password, captcha_token })`
- 请求体格式：`application/json`（本接口为 POST + JSON 请求体，与上述通用约定的 GET 不同）
- 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| username | string | 是 | 用户名 |
| email | string | 是 | 邮箱 |
| password | string | 是 | 密码（前端不做加密/摘要处理，不保存、不打印） |
| captcha_token | string/null | 否 | 人机验证预留字段，默认 `null`，暂不接入任何 CAPTCHA |

- 返回值：后端响应体 `response.data`（结构以后端实际返回为准）
- 请求示例：

```json
{
  "username": "student_2026",
  "email": "student@example.com",
  "password": "******",
  "captcha_token": null
}
```

- 简单调用示例：

```js
import { register } from '@/api/register';

const result = await register({
    username: 'student_2026',
    email: 'student@example.com',
    password: '******',
});
```

### 用户登录

- 接口：`POST /auth/login`（配合 `src/api/client.js` 的 baseURL `/api`，实际请求 `/api/auth/login`）
- 前端方法：`login({ account, password, captcha_token })`
- 请求体格式：`application/json`（本接口为 POST + JSON 请求体，与上述通用约定的 GET 不同）
- 参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| account | string | 是 | 账号（用户名或邮箱等，以后端约定为准） |
| password | string | 是 | 密码（前端不做加密/摘要处理，不保存、不打印） |
| captcha_token | string/null | 否 | 人机验证预留字段，默认 `null`，暂不接入任何 CAPTCHA |

- 返回值：后端响应体 `response.data`（结构以后端实际返回为准）
- 请求示例：

```json
{
  "account": "student_2026",
  "password": "******",
  "captcha_token": null
}
```

- 简单调用示例：

```js
import { login } from '@/api/login';

const result = await login({
    account: 'student_2026',
    password: '******',
});
```

### Rating API

#### 评分提交

- API 名称：`pushRate`
- HTTP Method：`GET`
- URL：`/api/rate`
- 是否需要登录：是（未登录时前端弹出登录提示并跳转登录页；请求携带 Session Cookie）
- 是否需要审核：否（评分不进入内容审核）
- 审核状态：不适用（评分不审核，直接生效）
- 显示规则：不适用
- API 用途：提交对菜品（`dish`）、严选分享（`selection`）或评论（`comment`）的评分
- 请求参数（query params）：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| targetType | string | 是 | 评分对象类型：`dish` / `selection` / `comment` |
| targetId | number/string | 是 | 评分对象 ID |
| score | number | 是 | 评分值（1-5，可含小数） |

- 请求示例：`GET /api/rate?targetType=dish&targetId=1&score=4.5`
- 成功响应示例：

```json
{
  "success": true,
  "rateId": "dish-1-1755561600000"
}
```

- 失败响应示例：

```json
{
  "success": false,
  "message": "请先登录"
}
```

#### 补充信息提交（菜品）

- API 名称：`submitContentForReview`
- HTTP Method：`GET`
- URL：`/api/review/content`
- 是否需要登录：是
- 是否需要审核：否（Rating 补充信息不进入文字审核）
- 审核状态：不适用（不审核，提交后直接生效）
- 显示规则：不适用
- API 用途：提交菜品价格/位置等补充信息，进入审核
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| type | string | 是 | 固定为 `dish-supplement` |
| dishName | string | 是 | 菜品名称 |
| price | number | 否 | 价格 |
| stair | number | 否 | 楼层 |
| window | number | 否 | 窗口号 |

- 请求示例：`{ "type": "dish-supplement", "dishName": "红烧肉", "price": 18, "stair": 1, "window": 1 }`
- 成功响应示例：`{ "success": true, "approved": true, "reviewId": "dish-supplement-123" }`
- 失败响应示例：`{ "success": false, "message": "请先登录" }`

### Advice API

#### 内容提交

- API 名称：`submitContentForReview`
- HTTP Method：`GET`
- URL：`/api/review/content`
- 是否需要登录：是
- 是否需要审核：是（后端调用第三方内容审核，前端不直接调用）
- 审核状态：`approved`（显示）/ `rejected`（不显示）/ `pending`（审核中不显示）
- 显示规则：仅 `approved` 内容显示；`rejected` 与 `pending` 不显示
- API 用途：发布新品建议内容
- 请求参数：`type`（固定为 `advice`）、`comment`（建议内容）
- 请求示例：`{ "type": "advice", "comment": "希望增加低脂鸡胸肉沙拉窗口" }`
- 成功响应示例：`{ "success": true, "approved": true, "reviewId": "advice-123" }`
- 失败响应示例：`{ "success": false, "message": "请先登录" }`

#### 评论提交与回复

- API 名称：`submitContentForReview`
- HTTP Method：`GET`
- URL：`/api/review/content`
- 是否需要登录：是
- 是否需要审核：是（后端调用第三方内容审核，前端不直接调用）
- 审核状态：`approved`（显示）/ `rejected`（不显示）/ `pending`（审核中不显示）
- 显示规则：仅 `approved` 内容显示；`rejected` 与 `pending` 不显示
- API 用途：对新品建议发表评论，或回复某条评论（子评论）
- 请求参数：`type`（固定为 `advice-comment`）、`adviceId`（建议 ID）、`reply`（评论/回复内容）、`target`（回复目标，`{ type: 'advice' | 'comment', id }`；回复主贴时传 `{ type: 'advice', id }`）
- 请求示例：`{ "type": "advice-comment", "adviceId": 1, "reply": "支持这个建议", "target": { "type": "advice", "id": 1 } }`
- 成功响应示例：`{ "success": true, "approved": true, "reviewId": "advice-comment-123" }`
- 失败响应示例：`{ "success": false, "message": "请先登录" }`

### Suggestions API

#### 内容提交

- API 名称：`submitContentForReview`
- HTTP Method：`GET`
- URL：`/api/review/content`
- 是否需要登录：是
- 是否需要审核：是（后端调用第三方内容审核，前端不直接调用）
- 审核状态：`approved`（显示）/ `rejected`（不显示）/ `pending`（审核中不显示）
- 显示规则：仅 `approved` 内容显示；`rejected` 与 `pending` 不显示
- API 用途：发布食堂建议内容
- 请求参数：`type`（固定为 `suggestion`）、`comment`（建议内容）
- 请求示例：`{ "type": "suggestion", "comment": "建议午餐时段增加热汤自助台" }`
- 成功响应示例：`{ "success": true, "approved": true, "reviewId": "suggestion-123" }`
- 失败响应示例：`{ "success": false, "message": "请先登录" }`

#### 评论提交与回复

- API 名称：`submitContentForReview`
- HTTP Method：`GET`
- URL：`/api/review/content`
- 是否需要登录：是
- 是否需要审核：是（后端调用第三方内容审核，前端不直接调用）
- 审核状态：`approved`（显示）/ `rejected`（不显示）/ `pending`（审核中不显示）
- 显示规则：仅 `approved` 内容显示；`rejected` 与 `pending` 不显示
- API 用途：对食堂建议发表评论，或回复某条评论（子评论）
- 请求参数：`type`（固定为 `suggestion-comment`）、`suggestionId`（建议 ID）、`reply`（评论/回复内容）、`target`（回复目标，`{ type: 'suggestion' | 'comment', id }`）
- 请求示例：`{ "type": "suggestion-comment", "suggestionId": 1, "reply": "排队动线确实需要优化", "target": { "type": "suggestion", "id": 1 } }`
- 成功响应示例：`{ "success": true, "approved": true, "reviewId": "suggestion-comment-123" }`
- 失败响应示例：`{ "success": false, "message": "请先登录" }`

### Selection API

#### 内容提交

- API 名称：`submitContentForReview`
- HTTP Method：`GET`
- URL：`/api/review/content`
- 是否需要登录：是
- 是否需要审核：是（后端调用第三方内容审核，前端不直接调用）
- 审核状态：`approved`（显示）/ `rejected`（不显示）/ `pending`（审核中不显示）
- 显示规则：仅 `approved` 内容显示；`rejected` 与 `pending` 不显示
- API 用途：发布严选分享（菜品购买位置/价格推荐）
- 请求参数：`type`（固定为 `selection`）、`comment`（分享内容）、`price`（价格）、`positions`（购买位置数组 `[{ floor, window }]`）
- 请求示例：`{ "type": "selection", "comment": "这份套餐性价比很高", "price": 12, "positions": [{ "floor": 1, "window": 1 }] }`
- 成功响应示例：`{ "success": true, "approved": true, "reviewId": "selection-123" }`
- 失败响应示例：`{ "success": false, "message": "请先登录" }`

#### 评论提交与回复

- API 名称：`submitContentForReview`
- HTTP Method：`GET`
- URL：`/api/review/content`
- 是否需要登录：是
- 是否需要审核：是（后端调用第三方内容审核，前端不直接调用）
- 审核状态：`approved`（显示）/ `rejected`（不显示）/ `pending`（审核中不显示）
- 显示规则：仅 `approved` 内容显示；`rejected` 与 `pending` 不显示
- API 用途：对严选分享发表评论，或回复某条评论（子评论）
- 请求参数：`type`（固定为 `selection-comment`）、`selectionId`（分享 ID）、`reply`（评论/回复内容）、`target`（回复目标，`{ type: 'selection' | 'comment', id }`）
- 请求示例：`{ "type": "selection-comment", "selectionId": 1, "reply": "这条分享很有参考价值", "target": { "type": "selection", "id": 1 } }`
- 成功响应示例：`{ "success": true, "approved": true, "reviewId": "selection-comment-123" }`
- 失败响应示例：`{ "success": false, "message": "请先登录" }`

以上内容提交/评论/评分 API 均需要登录：未登录时前端弹出“请先登录后再进行此操作。”提示，点击“登录”跳转 `/login`。开发环境无后端时，评分与内容提交走本地 mock（默认 `VUE_APP_API_MOCK` 未设置），评论与提交 UI 可正常进行前端调试。

### 内容审核机制

- 审核流程：用户提交 → 登录检查 → 后端 → 第三方内容审核 → 审核通过 → 正式写入数据库 → 允许显示。
- 前端不直接调用第三方内容审核 API，也不保存第三方 API Key。
- 审核状态与显示规则：
  - `pending` → 不显示（审核中）
  - `approved` → 显示
  - `rejected` → 不显示
- 审核拒绝的内容不写入正式可见数据；审核服务异常、超时或无法确定结果时不得默认通过。
- 前端提交后仅 `approved` 内容即时加入本地列表；`rejected` / `pending` / 异常结果均不加入列表，并给出对应提示。
- 无后端调试：默认模拟 `approved`；开发环境可在控制台调用 `window.__REVIEW_DEBUG.setStatus('approved' | 'rejected' | 'pending')` 切换模拟审核结果，用于测试不同 UI 状态。调试账号仅用于开发环境，不参与正式认证，也不发送给真实后端。

### 获取当前登录用户

- API 名称：`getUser`
- HTTP Method：`GET`
- URL：`/api/user`
- 是否需要登录：是（请求携带 Session Cookie；HTTP 401 视为未登录）
- API 用途：获取当前登录用户的完整信息，并实例化为当前 `User` 模型（登录恢复、用户中心、GlobalHeader 均依赖）
- 请求参数：无
- 请求示例：`GET /api/user`
- 成功响应示例：

```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "student_2026",
    "avatar_path": "",
    "gender": "男",
    "session": "2026届",
    "classid": "3班",
    "nickname": "食堂观察员",
    "realname": "张三",
    "level": 3,
    "register_date": "2026-01-12",
    "rate_time": 128,
    "email": "student@example.com"
  }
}
```

- 失败响应示例：

```json
{
  "success": false,
  "message": "请先登录"
}
```

### 退出登录

- API 名称：`logout`
- HTTP Method：`POST`
- URL：`/api/auth/logout`
- 是否需要登录：否（后端负责使服务器端 Session 失效并通过 `Set-Cookie` 清除 HttpOnly Session Cookie）
- API 用途：用户主动退出，立即使 Session 失效，前端清除本地登录状态并跳转登录页
- 请求参数：无
- 请求示例：`POST /api/auth/logout`（空 JSON 请求体）
- 成功响应示例：`{ "success": true }`
- 失败响应示例：`{ "success": false, "message": "退出失败" }`

### 点赞

- API 名称：`toggleLike`
- HTTP Method：`GET`
- URL：`/api/like`
- 是否需要登录：是
- API 用途：对建议/分享等内容点赞或取消点赞（预留接口，当前前端点赞为本地状态）
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| targetType | string | 是 | 点赞对象类型（如 `advice`、`suggestion`） |
| targetId | number/string | 是 | 点赞对象 ID |
| cancel | boolean | 否 | `true` 为取消点赞，默认 `false` |

- 请求示例：`GET /api/like?targetType=advice&targetId=1&cancel=false`
- 成功响应示例：`{ "success": true, "liked": true }`
- 失败响应示例：`{ "success": false, "message": "请先登录" }`

### 用户资料更新

- API 名称：`updateProfile`
- HTTP Method：`POST`
- URL：`/api/profile`
- 是否需要登录：是
- API 用途：更新当前登录用户的资料（预留接口，字段与当前 `User` 模型一致）
- 请求参数（JSON 请求体）：`username`、`nickname`、`realname`、`gender`、`avatar_path`、`email` 等 User 字段
- 请求示例：`{ "nickname": "新昵称", "realname": "李四" }`
- 成功响应示例：`{ "success": true }`
- 失败响应示例：`{ "success": false, "message": "请先登录" }`

### 图片上传

- API 名称：`uploadImage`
- HTTP Method：`POST`
- URL：`/api/upload`
- 是否需要登录：是
- API 用途：上传菜品/用户头像等图片，返回图片 URL（预留接口，当前表单上传仅本地预览）
- 请求参数：`multipart/form-data`，字段名 `file`
- 请求示例：`POST /api/upload`（FormData: `file`）
- 成功响应示例：`{ "success": true, "url": "/uploads/xxx.png" }`
- 失败响应示例：`{ "success": false, "message": "上传失败" }`

### 管理端：菜品新增 / 删除

- API 名称：`createDish` / `deleteDish`
- HTTP Method：`GET`
- URL：`/api/admin/dish/add`、`/api/admin/dish/delete`
- 是否需要登录：是（管理端操作，需管理员会话）
- API 用途：管理端新增菜品、删除菜品（预留接口，当前新增/删除为本地 IndexedDB 状态）
- 请求参数：
  - `createDish`：`name`、`price`、`stair`、`window`、`image`
  - `deleteDish`：`id`
- 请求示例：`GET /api/admin/dish/add?name=红烧肉&price=18&stair=1&window=1`；`GET /api/admin/dish/delete?id=1`
- 成功响应示例：`{ "success": true, "dishId": 1 }`、`{ "success": true }`
- 失败响应示例：`{ "success": false, "message": "无权限" }`

### 管理端：用户详情 / 启用禁用

- API 名称：`fetchUserDetail` / `setUserStatus`
- HTTP Method：`GET`
- URL：`/api/admin/user-detail`、`/api/admin/user-status`
- 是否需要登录：是（管理端操作，需管理员会话）
- API 用途：查看用户详情、启用/禁用用户（预留接口，当前“查看/禁用”按钮未接入后端）
- 请求参数：`fetchUserDetail`：`id`；`setUserStatus`：`id`、`enabled`
- 请求示例：`GET /api/admin/user-detail?id=1`；`GET /api/admin/user-status?id=1&enabled=false`
- 成功响应示例：`{ "success": true, "user": { "id": 1, "username": "同学A" } }`、`{ "success": true, "id": 1, "enabled": false }`
- 失败响应示例：`{ "success": false, "message": "无权限" }`
