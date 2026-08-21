/**
 * 图片上传。
 *
 * - 接口：POST /upload（配合 @/api/client.js 的 baseURL `/api`，实际请求 /api/upload）
 * - 请求体：multipart/form-data，字段名 `file`（Content-Type 由 axios 根据 FormData 自动设置边界）。
 * - 返回上传后的图片 URL；开发环境继续支持本地预览回退。
 */
import apiClient, { shouldUseMockApi } from '@/api/client';

export const uploadImage = async (file) => {
    if (shouldUseMockApi()) {
        return { success: true, url: '' };
    }
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload', formData);
    return response.data;
};

/**
 * 上传文件列表中的文件，返回上传后的图片 URL 数组。
 */
export const uploadFiles = async (fileList = []) => {
    const urls = [];
    for (const item of fileList || []) {
        const file = item && (item.originFileObj || item);
        if (!file) {
            continue;
        }
        const result = await uploadImage(file);
        // 统一使用后端返回的绝对地址 image_url（兼容旧字段 url）。
        const url = result && (result.image_url || result.url);
        if (url) {
            urls.push(url);
        }
    }
    return urls;
};

/**
 * 上传文件列表并取第一张图片 URL；上传失败或没有可上传文件时回退到本地预览/兜底图。
 */
export const resolveUploadedImage = async (fileList, fallback) => {
    try {
        const urls = await uploadFiles(fileList);
        if (urls.length > 0) {
            return urls[0];
        }
    } catch (error) {
        // 上传失败时回退本地预览，保证无后端调试可用。
    }
    const [firstFile] = fileList || [];
    return (firstFile && (firstFile.thumbUrl || firstFile.url)) || fallback;
};
