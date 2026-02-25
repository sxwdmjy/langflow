import { useEffect } from "react";
import type { Locale } from "@/i18n";
import { messages } from "@/i18n/messages";

const SKIP_SELECTOR =
  [
    "code",
    "pre",
    "kbd",
    "samp",
    "textarea",
    "input",
    "[contenteditable=\"true\"]",
    ".ace_editor",
    ".monaco-editor",
    "[data-no-i18n]",
    // Avoid rewriting user/model chat content.
    "[data-testid^=\"chat-message-\"]",
    "[data-testid*=\"chat-input\"]",
    "[data-testid*=\"chat-message\"]",
  ].join(",");

const CORE_EXACT_ZH_MAP = Object.fromEntries(
  Object.entries(messages["en-US"]).map(([key, value]) => [
    value,
    messages["zh-CN"][key as keyof typeof messages["zh-CN"]],
  ]),
);

const EXTRA_EXACT_ZH_MAP: Record<string, string> = {
  "Get started": "快速开始",
  "All Set": "已完成",
  "Star repo for updates": "关注仓库更新",
  "Join the community": "加入社区",
  "Create a flow": "创建流程",
  "Start creating a project or flow": "开始创建项目或流程",
  "MCP Server": "MCP 服务器",
  "MCP Servers": "MCP 服务器",
  "Add MCP Server": "新增 MCP 服务器",
  "No MCP servers added": "尚未添加 MCP 服务器",
  "Added MCP Servers": "已添加的 MCP 服务器",
  "Global Variables": "全局变量",
  "Model Providers": "模型供应商",
  "Shortcuts": "快捷键",
  "Messages": "消息",
  "General": "通用",
  "Settings": "设置",
};

const ZH_REGEX_REPLACERS: Array<[RegExp, (...args: string[]) => string]> = [
  [/^Search (.+)\.\.\.$/, (_, subject) => `搜索${subject}...`],
  [/^Drop your (.+) here$/, (_, subject) => `将${subject}拖拽到这里`],
  [/^(\d+) tools?$/, (_, count) => `${count} 个工具`],
  [/^(\d+) flow\(s\)$/, (_, count) => `${count} 个流程`],
];

const originalTextMap = new WeakMap<Text, string>();
const originalAttrMap = new WeakMap<Element, Map<string, string>>();

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const translateToZhCN = (value: string): string => {
  const trimmed = normalizeWhitespace(value);
  if (!trimmed) return value;

  const exact = CORE_EXACT_ZH_MAP[trimmed] ?? EXTRA_EXACT_ZH_MAP[trimmed];
  if (exact) {
    return value.replace(trimmed, exact);
  }

  for (const [pattern, replacer] of ZH_REGEX_REPLACERS) {
    if (pattern.test(trimmed)) {
      const translated = trimmed.replace(
        pattern,
        (...args) => replacer(...(args.slice(0, -2) as string[])),
      );
      return value.replace(trimmed, translated);
    }
  }

  return value;
};

const shouldSkipNode = (node: Node | null): boolean => {
  if (!node) return true;
  const element =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as Element)
      : node.parentElement;
  if (!element) return true;
  return Boolean(element.closest(SKIP_SELECTOR));
};

const applyTextTranslation = (textNode: Text, locale: Locale) => {
  if (shouldSkipNode(textNode)) return;
  if (!textNode.nodeValue) return;

  if (!originalTextMap.has(textNode)) {
    originalTextMap.set(textNode, textNode.nodeValue);
  }
  const original = originalTextMap.get(textNode) ?? textNode.nodeValue;
  const translated = locale === "zh-CN" ? translateToZhCN(original) : original;
  if (translated !== textNode.nodeValue) {
    textNode.nodeValue = translated;
  }
};

const applyAttributeTranslation = (element: Element, locale: Locale) => {
  if (shouldSkipNode(element)) return;
  const attrs = ["placeholder", "title", "aria-label"] as const;

  let stored = originalAttrMap.get(element);
  if (!stored) {
    stored = new Map<string, string>();
    originalAttrMap.set(element, stored);
  }

  for (const attr of attrs) {
    const current = element.getAttribute(attr);
    if (!current) continue;

    if (!stored.has(attr)) {
      stored.set(attr, current);
    }

    const original = stored.get(attr) ?? current;
    const translated = locale === "zh-CN" ? translateToZhCN(original) : original;
    if (translated !== current) {
      element.setAttribute(attr, translated);
    }
  }
};

const localizeRoot = (root: Node, locale: Locale) => {
  if (root.nodeType === Node.TEXT_NODE) {
    applyTextTranslation(root as Text, locale);
    return;
  }

  if (root.nodeType === Node.ELEMENT_NODE) {
    applyAttributeTranslation(root as Element, locale);
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let currentText = walker.nextNode();
  while (currentText) {
    applyTextTranslation(currentText as Text, locale);
    currentText = walker.nextNode();
  }

  if (root.nodeType === Node.ELEMENT_NODE) {
    const rootElement = root as Element;
    rootElement.querySelectorAll("*").forEach((element) => {
      applyAttributeTranslation(element, locale);
    });
  }
};

export const useDomLocalization = (locale: Locale) => {
  useEffect(() => {
    const root = document.body;
    if (!root) return;

    let isApplying = false;

    const apply = (node: Node) => {
      if (isApplying) return;
      isApplying = true;
      try {
        localizeRoot(node, locale);
      } finally {
        isApplying = false;
      }
    };

    apply(root);

    const observer = new MutationObserver((mutations) => {
      if (isApplying) return;
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          apply(mutation.target);
          continue;
        }
        if (mutation.type === "attributes") {
          apply(mutation.target);
          continue;
        }
        mutation.addedNodes.forEach((node) => apply(node));
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
    });

    return () => observer.disconnect();
  }, [locale]);
};
