import type { MCPTransport } from "@/controllers/API/queries/mcp/use-patch-install-mcp";
import { BASE_URL_API } from "../config-constants";

type ComposerConnectionOptions = {
  useComposer?: boolean;
  streamableHttpUrl?: string;
  legacySseUrl?: string;
};

export const customGetMCPUrl = (
  projectId: string,
  options: ComposerConnectionOptions = {},
  transport: MCPTransport = "streamablehttp",
) => {
  const { useComposer, streamableHttpUrl, legacySseUrl } = options;

  if (useComposer) {
    if (transport === "streamablehttp" && streamableHttpUrl) {
      return streamableHttpUrl;
    }
    if (legacySseUrl) {
      return legacySseUrl;
    }
    if (streamableHttpUrl) {
      return streamableHttpUrl;
    }
  }

  const baseUrl = new URL(
    `${BASE_URL_API}mcp/project/${projectId}`,
    window.location.origin,
  ).toString();
  return transport === "streamablehttp"
    ? `${baseUrl}/streamable`
    : `${baseUrl}/sse`;
};
