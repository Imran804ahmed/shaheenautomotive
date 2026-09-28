/**
 * Sub-path the site is deployed under ("" = site root, https://shaheenautomotive.com.pk/).
 * Shared by next.config.ts (`basePath`) and anything that builds raw asset
 * URLs, which Next does not prefix on its own. Set to "" to serve from the root.
 */
export const BASE_PATH = "";

/** Prefix a root-relative public asset path, e.g. "/images/x.jpg" → "/sub/images/x.jpg" when BASE_PATH is "/sub". */
export function withBasePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? `${BASE_PATH}${path}` : path;
}
