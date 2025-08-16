// Valida e sanitiza campos de uma policy casbin (v0..v5)
export function sanitizePolicyFields(fields: Array<string | null | undefined>) {
  return fields.map((f) => {
    if (f === null || f === undefined) return '';
    // remove control chars NUL, TAB, LF, CR
    return String(f).replace(/[\x00\x09\x0A\x0D]/g, '').trim();
  });
}

export function looksLikeJson(s: string) {
  if (!s) return false;
  const t = s.trim();
  return (t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'));
}

export function validateV4Json(s: string) {
  if (!s) return { ok: true };
  if (!looksLikeJson(s)) return { ok: true };
  try {
    JSON.parse(s);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: (e && e.message) || 'invalid json' };
  }
}

export function validatePolicy(fields: Array<string | null | undefined>) {
  const sanitized = sanitizePolicyFields(fields);
  const v4 = sanitized[4] || '';
  const v4res = validateV4Json(v4);
  if (!v4res.ok) return { ok: false, error: 'v4 invalid JSON: ' + v4res.error, sanitized };
  return { ok: true, sanitized };
}
