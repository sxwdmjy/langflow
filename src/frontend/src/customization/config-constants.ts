const normalizeBasename = (basePath: string): string => {
  const normalized = basePath.trim().replace(/^\/+|\/+$/g, "");
  return normalized ? `/${normalized}` : "";
};

const applyBasenameToRoute = (routePath: string, basePath: string): string => {
  if (!basePath) return routePath;
  if (routePath.startsWith("^/")) {
    return `^${basePath}${routePath.slice(1)}`;
  }
  if (routePath.startsWith("/")) {
    return `${basePath}${routePath}`;
  }
  return `${basePath}/${routePath}`;
};

export const BASENAME = "/langflow/";
const BASENAME_PREFIX = normalizeBasename(BASENAME);
export const PORT = 3000;
export const PROXY_TARGET = "http://localhost:7860";
export const API_ROUTES = [
  applyBasenameToRoute("^/api/v1/", BASENAME_PREFIX),
  applyBasenameToRoute("^/api/v2/", BASENAME_PREFIX),
  applyBasenameToRoute("/health", BASENAME_PREFIX),
];
export const BASE_URL_API = `${BASENAME_PREFIX}/api/v1/`;
export const BASE_URL_API_V2 = `${BASENAME_PREFIX}/api/v2/`;
export const HEALTH_CHECK_URL = `${BASENAME_PREFIX}/health_check`;
export const DOCS_LINK = "https://docs.langflow.org";

export default {
  DOCS_LINK,
  BASENAME,
  PORT,
  PROXY_TARGET,
  API_ROUTES,
  BASE_URL_API,
  BASE_URL_API_V2,
  HEALTH_CHECK_URL,
};
