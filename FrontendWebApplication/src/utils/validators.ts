const URL_REGEX =
  /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i;

// PUBLIC_INTERFACE
export function isNonEmptyString(v?: string | null): boolean {
  /** Returns true if value is a non-empty trimmed string. */
  return typeof v === "string" && v.trim().length > 0;
}

// PUBLIC_INTERFACE
export function isValidUrl(url?: string | null): boolean {
  /** Basic URL validator allowing http(s) and simple host/path patterns. */
  if (!isNonEmptyString(url)) return false;
  const str = String(url).trim();
  if (!/^https?:\/\//i.test(str)) {
    // assume https if scheme missing for regex test only
    return URL_REGEX.test("https://" + str);
  }
  return URL_REGEX.test(str);
}
