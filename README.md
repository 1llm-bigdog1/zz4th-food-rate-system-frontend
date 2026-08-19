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
