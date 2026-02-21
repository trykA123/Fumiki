import { goto } from '$app/navigation';
import { toast } from '$lib/stores/toast';

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
    let res: Response;
    try {
      res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        // Include session cookie automatically
        credentials: 'include',
      });
    } catch (e) {
      // Network layer failure (e.g. server down, offline)
      toast.add('Network offline. Please check your connection.', 'error', 0);
      throw new Error('Network Error');
    }

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
        toast.add('Could not reach AudioBookShelf', 'error');
      } else if (res.status === 503) {
        toast.add('Service unavailable', 'error');
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
