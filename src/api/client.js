import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
    // Cookie Session：跨域联调时也携带 HttpOnly Session Cookie（等价于 fetch 的 credentials: 'include'）。
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

export const shouldUseMockApi = () => process.env.VUE_APP_API_MOCK !== 'false';

export const getJson = async (url, params = {}, mockData = {}) => {
    if (shouldUseMockApi()) {
        return Promise.resolve(mockData);
    }

    const response = await apiClient.get(url, {
        params,
        headers: {
            Accept: 'application/json',
        },
    });
    return response.data;
};

const navigateToErrorPage = async (path) => {
    try {
        const { default: router } = await import('@/router');
        if (router.currentRoute.value.path !== path) {
            router.push(path);
        }
    } catch (error) {
        // 错误页导航失败时静默处理，不阻断原错误。
    }
};

// 全局错误处理：按 HTTP 状态码进入对应错误页，避免错误逻辑散落在各业务页面。
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error && error.response && error.response.status;
        if (status === 401) {
            // 未登录：由登录恢复与登录守卫处理，不进入错误页。
            return Promise.reject(error);
        }
        if (status === 403) {
            navigateToErrorPage('/403');
            return Promise.reject(error);
        }
        if (status && status >= 500) {
            navigateToErrorPage('/500');
            return Promise.reject(error);
        }
        if (!error.response && !shouldUseMockApi()) {
            // 网络错误 / 后端不可用（生产环境）。
            navigateToErrorPage('/network-error');
            return Promise.reject(error);
        }
        return Promise.reject(error);
    },
);

export default apiClient;
