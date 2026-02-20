import { goto } from '$app/navigation';
// Toasts will be implemented later, so we use a console fallback for now
const toast = { error: (msg: string) => console.error(msg) };

const BASE = '/api';

interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  error: string;
  detail?: string;
}

class ApiClient {
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Include session cookie automatically
      credentials: 'include',
    });

    if (res.status === 401 && !path.startsWith('/auth/')) {
      // Only trigger auth redirects for protected routes
      goto('/auth');
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      let errStr = `HTTP ${res.status}`;
      try {
        const errData: ApiError = await res.json();
        errStr = errData.error || errStr;
      } catch { }

      if (res.status === 502) {
        toast.error('Could not reach AudioBookShelf');
      } else if (res.status === 503) {
        toast.error('Service unavailable');
      }

      throw new Error(errStr);
    }

    // Handle non-JSON responses (streams, files)
    const contentType = res.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      const body: ApiResponse<T> = await res.json();
      return body.data;
    }

    return res as unknown as T;
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
