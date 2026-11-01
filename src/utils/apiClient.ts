/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Safely fetches and parses JSON response from fetch, guarding against non-JSON responses
 * (such as HTML error pages, <!doctype ...>, 404s, or server fallbacks)
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit,
  fallback: T | null = null
): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    
    // If the server returned HTML (e.g. <!doctype ...) or non-JSON, do not call res.json()
    if (!contentType.includes('application/json')) {
      console.warn(`[safeFetchJson] Non-JSON response from ${url} (${res.status} ${contentType})`);
      return fallback;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[safeFetchJson] Failed to fetch or parse JSON from ${url}:`, err);
    return fallback;
  }
}
