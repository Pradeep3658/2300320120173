import { createBrowserLogger } from '@shared-logger';
import { accessToken } from '../config';

const browserLogger = createBrowserLogger({
  accessToken,
  stack: 'frontend',
});

export async function logFrontend(level, pkg, message) {
  return browserLogger(level, pkg, message);
}

export async function logInfo(pkg, message) {
  return logFrontend('info', pkg, message);
}

export async function logWarn(pkg, message) {
  return logFrontend('warn', pkg, message);
}

export async function logError(pkg, message) {
  return logFrontend('error', pkg, message);
}
