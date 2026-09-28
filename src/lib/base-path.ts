/**
 * Sub-path the site is deployed under (https://shaheenautomotive.com.pk/Newui/).
 * Shared by next.config.ts (`basePath`) and anything that builds raw asset
 * URLs, which Next does not prefix on its own. Set to "" to serve from the root.
 */
export const BASE_PATH = "/Newui";

/** Prefix a root-relative public asset path, e.g. "/images/x.jpg" → "/Newui/images/x.jpg". */
export function withBasePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? `${BASE_PATH}${path}` : path;
}
