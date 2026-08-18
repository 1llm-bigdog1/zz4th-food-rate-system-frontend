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
