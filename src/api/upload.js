/**
 * 图片上传（预留接口）。
 *
 * - 接口：POST /upload（配合 @/api/client.js 的 baseURL `/api`，实际请求 /api/upload）
 * - 请求体：multipart/form-data，字段名 `file`（Content-Type 由 axios 根据 FormData 自动设置边界）。
 * - 返回上传后的图片 URL。
 */
import apiClient from '@/api/client';

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload', formData);
    return response.data;
};
