import { apiBaseUrl } from '../config';
import { logError, logInfo } from '../utils/logger';

async function parseResponse(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

export async function apiRequest(path, options = {}) {
  const url = `${apiBaseUrl}${path}`;
  const method = options.method || 'GET';
  void logInfo('api', `Request ${method} ${path}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      const message = data.message || `Request failed with status ${response.status}`;
      void logError('api', `${method} ${path} failed: ${message}`);
      throw new Error(message);
    }

    void logInfo('api', `Response ${method} ${path} succeeded`);
    return data;
  } catch (error) {
    void logError('api', `Request ${method} ${path} error: ${error.message}`);
    throw error;
  }
}
