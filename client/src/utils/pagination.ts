/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Paginated, PaginationMeta } from "../types/api";

/**
 * Backends differ in how they wrap lists. These helpers accept the shapes seen in your docs
 * and the usual variants, so the pages always receive { items: T[], meta }.
 *
 *   { status, data: [...], meta }                 (API spec)
 *   { success, data: [...], pagination }
 *   { data: { projects: [...], meta } }           (array under a named key)
 *   { items: [...], total, page, pages }          (Postman collection)
 *   [...]                                         (bare array)
 */
function findList(body: any): { items: any[]; rawMeta: any } | null {
  if (Array.isArray(body)) return { items: body, rawMeta: undefined };
  if (!body || typeof body !== "object") return null;

  const d = body.data;
  if (Array.isArray(d)) return { items: d, rawMeta: body.meta ?? body.pagination };

  if (d && typeof d === "object") {
    const key = Object.keys(d).find((k) => Array.isArray(d[k]));
    if (key) {
      return { items: d[key], rawMeta: d.meta ?? d.pagination ?? body.meta ?? body.pagination ?? d };
    }
  }

  const key = Object.keys(body).find((k) => Array.isArray(body[k]));
  if (key) return { items: body[key], rawMeta: body.meta ?? body.pagination ?? body };

  return null;
}

function toMeta(raw: any, count: number, fallback: { page?: number; limit?: number }): PaginationMeta {
  const m = raw ?? {};
  const limit = Number(m.limit ?? m.pageSize ?? m.perPage ?? fallback.limit ?? (count || 1));
  const total = Number(m.total ?? m.totalItems ?? m.count ?? count);
  const page = Number(m.page ?? m.currentPage ?? fallback.page ?? 1);
  const totalPages = Number(
    m.totalPages ?? m.pages ?? m.total_pages ?? (limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1),
  );
  return { page, limit, total, totalPages };
}

export function toPaginated<T = any>(
  body: any,
  map: (raw: any) => T = (x) => x as T,
  fallback: { page?: number; limit?: number } = {},
): Paginated<T> {
  const found = findList(body);
  if (!found) {
    console.warn("[IMAS] Could not find a list in the API response. Shape received:", body);
    return { items: [], meta: toMeta(undefined, 0, fallback) };
  }
  const items = found.items.map(map);
  return { items, meta: toMeta(found.rawMeta, items.length, fallback) };
}

/** Single-record responses: { data: {...} } | { data: { project: {...} } } | { project: {...} } | {...} */
export function unwrap<T = any>(body: any, key?: string): T {
  const inner = body?.data ?? body;
  return (key && inner?.[key] ? inner[key] : inner) as T;
}
