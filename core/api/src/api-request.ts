export const apiRequest = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  });
