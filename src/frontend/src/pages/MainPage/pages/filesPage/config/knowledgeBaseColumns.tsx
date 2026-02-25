import type { ColDef } from "ag-grid-community";
import type { TranslationKey } from "@/i18n";
import { formatFileSize } from "@/utils/stringManipulation";
import {
  formatAverageChunkSize,
  formatNumber,
} from "../utils/knowledgeBaseUtils";

type Translator = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string;

export const createKnowledgeBaseColumns = (t: Translator): ColDef[] => {
  const baseCellClass =
    "text-muted-foreground cursor-pointer select-text group-[.no-select-cells]:cursor-default group-[.no-select-cells]:select-none";

  return [
    {
      headerName: t("files.name"),
      field: "name",
      flex: 2,
      sortable: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      editable: false,
      filter: "agTextColumnFilter",
      cellClass: baseCellClass,
      cellRenderer: (params) => (
        <div className="flex items-center gap-3 font-medium">
          <div className="flex flex-col">
            <div className="text-sm font-medium">{params.value}</div>
          </div>
        </div>
      ),
    },
    {
      headerName: t("knowledgeBase.embeddingProvider"),
      field: "embedding_provider",
      flex: 2,
      sortable: false,
      filter: "agTextColumnFilter",
      editable: false,
      cellClass: baseCellClass,
      tooltipValueGetter: (params) =>
        params.data.embedding_model || t("knowledgeBase.unknown"),
      valueGetter: (params) =>
        params.data.embedding_model || t("knowledgeBase.unknown"),
    },
    {
      headerName: t("files.size"),
      field: "size",
      flex: 1,
      sortable: false,
      valueFormatter: (params) => formatFileSize(params.value),
      editable: false,
      cellClass: baseCellClass,
    },
    {
      headerName: t("knowledgeBase.words"),
      field: "words",
      flex: 1,
      sortable: false,
      editable: false,
      cellClass: baseCellClass,
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      headerName: t("knowledgeBase.characters"),
      field: "characters",
      flex: 1,
      sortable: false,
      editable: false,
      cellClass: baseCellClass,
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      headerName: t("knowledgeBase.chunks"),
      field: "chunks",
      flex: 1,
      sortable: false,
      editable: false,
      cellClass: baseCellClass,
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      headerName: t("knowledgeBase.avgChunks"),
      field: "avg_chunk_size",
      flex: 1,
      sortable: false,
      editable: false,
      cellClass: baseCellClass,
      valueFormatter: (params) => formatAverageChunkSize(params.value),
    },
  ];
};
