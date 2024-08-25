"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import {
  ColDef,
  ModuleRegistry,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react"; // React Grid Logic

import { PiFilePdf, PiMicrosoftExcelLogoFill } from "react-icons/pi";

import { useResolvedTheme } from "~/hooks/use-resolved-theme";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

type AgGridProps<T> = {
  data: T[];
  columns: ColDef[];
  defaultColDef?: ColDef;
  className?: string;
  rowSelection?: "single" | "multiple";
  pagination: boolean;
  quickSearch?: boolean;
  selectedRows?: any[];
  exports?: { excel?: boolean; pdf?: boolean; csv?: boolean; print?: boolean };
  onSelectionChanged?: (selectedRows: T[]) => void;
};
export default function AgGrid<T>({
  data,
  columns,
  defaultColDef,
  quickSearch = false,
  className,
  rowSelection,
  selectedRows,
  exports = {},
  pagination,
  onSelectionChanged,
}: AgGridProps<T>) {
  const [rowData, setRowData] = useState<T[]>(data);
  const [colDefs] = useState<ColDef[]>(columns);

  useEffect(() => {
    setRowData(data);
  }, [data]);

  const theme = useResolvedTheme();
  const currentTheme =
    theme == "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine";

  // const currentTheme =
  //   theme == "dark" ? "ag-theme-balham-dark" : "ag-theme-balham";

  const gridRef = useRef<AgGridReact<T[]>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => {
    return {
      type: "fitGridWidth",
      defaultMinWidth: 100,
      columnLimits: [
        {
          colId: "country",
          minWidth: 900,
        },
      ],
    };
  }, []);

  const defaultCol = useMemo<ColDef>(() => {
    return {
      ...defaultColDef,
      filter: true,
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Container: Defines the grid's theme & dimensions.
  // const statusBar = useMemo(() => {
  //   return {
  //     statusPanels: [
  //       { statusPanel: "agTotalAndFilteredRowCountComponent" },
  //       { statusPanel: "agTotalRowCountComponent" },
  //       { statusPanel: "agFilteredRowCountComponent" },
  //       { statusPanel: "agSelectedRowCountComponent" },
  //       { statusPanel: "agAggregationComponent" },
  //     ],
  //   };
  // }, []);

  const onQuickFilterChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("quickFilter") as HTMLInputElement).value,
    );
  }, []);

  const params = useParams();

  const onGridReady = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
    gridRef.current?.api.forEachNode((node) => {
      // if (selectedRows.includes(node.data?.id)) {
      //   node.setSelected(true);
      // }
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="flex h-full flex-col">
        <div className="flex flex-row justify-between">
          {quickSearch && (
            <Input
              type="text"
              className="h-8 w-[250px]"
              onInput={onQuickFilterChanged}
              id="quickFilter"
              placeholder="quick filter..."
            />
          )}
          {Object.keys(exports).length > 0 && (
            <div className="mb-1 flex h-9 flex-row gap-0 border-b-2 p-0">
              {exports.excel && (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => {
                    //gridRef.current!.api.exportDataAsExcel();
                    alert("Exporting to Excel...");
                  }}
                >
                  <PiMicrosoftExcelLogoFill className="h-6 w-6 text-green-600" />
                </Button>
              )}
              {exports.pdf && (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => {
                    //gridRef.current!.api.exportDataAsExcel();
                    alert("Exporting to Excel...");
                  }}
                >
                  <PiFilePdf className="h-6 w-6 text-red-600" />
                </Button>
              )}
            </div>
          )}
        </div>
        <div
          // style={gridStyle}
          className={cn(
            currentTheme,
            "z-40 h-[calc(100vh-15rem)] w-full",
            className,
          )}
        >
          <AgGridReact
            onGridReady={onGridReady}
            ref={gridRef}
            // statusBar={statusBar}
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultCol}
            autoSizeStrategy={autoSizeStrategy}
            pagination={pagination}
            //suppressRowClickSelection={false}
            rowSelection={rowSelection}
            onSelectionChanged={(event) => {
              onSelectionChanged &&
                onSelectionChanged(event.api.getSelectedRows());
            }}
            onCellValueChanged={(event) =>
              console.log(`New Cell Value: ${event.value}`)
            }
          />
        </div>
      </div>
    </div>
  );
}
