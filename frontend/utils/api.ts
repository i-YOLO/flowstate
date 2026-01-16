/**
 * API 工具函数 - 封装 fetch 请求并处理 token 过期
 */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
    method?: HttpMethod;
    body?: any;
    headers?: Record<string, string>;
}

// 全局回调，用于处理登出
let onTokenExpired: (() => void) | null = null;

export const setTokenExpiredCallback = (callback: () => void) => {
    onTokenExpired = callback;
};

/**
 * 封装的 fetch 请求，自动处理认证和 token 过期
 */
export const apiFetch = async <T>(url: string, options: FetchOptions = {}): Promise<T | null> => {
    const token = localStorage.getItem('token');
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
        });
        
        // 处理 token 过期或未授权 (401/403)
        if (response.status === 401 || response.status === 403) {
            console.warn('%c[AUTH] Token expired or unauthorized. Redirecting to login...', 'color: #ef4444; font-weight: bold;');
            localStorage.removeItem('token');
            
            if (onTokenExpired) {
                onTokenExpired();
            }
            return null;
        }
        
        if (!response.ok) {
            console.error(`[API] Request failed: ${response.status} ${response.statusText}`);
            return null;
        }
        
        // 尝试解析 JSON，如果失败则返回 null
        try {
            return await response.json();
        } catch {
            return null;
        }
    } catch (error) {
        console.error('[API] Network error:', error);
        return null;
    }
};

/**
 * 获取 API 基础 URL
 */
export const API_BASE_URL = 'http://localhost:4000';
