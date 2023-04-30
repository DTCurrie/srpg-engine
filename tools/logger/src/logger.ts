export type LogType = "log" | "info" | "warn" | "error";

export const logger = (source: string) => {
  const onceSet = new Set<string>();

  const emit = (
    type: LogType,
    message: string,
    data: unknown = {},
    once?: boolean
  ) => {
    if (once) {
      const key = `${message}|${JSON.stringify(data)}`;
      if (onceSet.has(key)) {
        return;
      }

      onceSet.add(key);
    }

    console[type](`[${source}]: ${message}`, data);
  };

  const log = (message: string, data?: unknown, once?: boolean) =>
    emit("log", message, data, once);

  const logInfo = (message: string, data?: unknown, once?: boolean) =>
    emit("info", message, data, once);

  const logWarning = (message: string, data?: unknown, once?: boolean) =>
    emit("warn", message, data, once);

  const logError = (message: string, data?: unknown, once?: boolean) =>
    emit("error", message, data, once);

  return {
    log,
    logInfo,
    logWarning,
    logError,
  };
};
