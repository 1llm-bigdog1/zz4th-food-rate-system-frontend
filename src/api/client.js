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

export default apiClient;
