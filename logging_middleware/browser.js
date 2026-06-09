const DEFAULT_BASE_URL = 'http://20.244.56.144/evaluation-service';
const DEFAULT_TIMEOUT = 1000;

export function createBrowserLogger({ accessToken, stack = 'frontend', baseUrl = DEFAULT_BASE_URL } = {}) {
  return async function browserLog(level, pkg, message) {
    const payload = {
      stack,
      level,
      package: pkg,
      message,
    };

    try {
      const response = await fetch(`${baseUrl}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError' || /timeout/i.test(error.message || '')) {
        return false;
      }

      console.error(`[LOGGER:${stack}] ${pkg} - ${message}`, error);
      return false;
    }
  };
}
