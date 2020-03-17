import {
  useTable,
  Column,
  PluginHook,
  TableInstance,
  useGlobalFilter,
  useSortBy,
  usePagination,
  Renderer,
  CellProps
} from "react-table";

export type UseDataTableParams<D extends object> = {
  columns: Column<D>[];
  data: D[];
  hooks?: PluginHook<D>[];
  renderCells?: Partial<
    {
      [K in keyof D]: Renderer<CellProps<D>>;
    }
  >;
};

export const useDataTable = <T extends object>({
  columns,
  data,
  hooks = [],
  renderCells = undefined
}: UseDataTableParams<T>): TableInstance<T> => {
  return useTable<T>(
    { columns, data },
    useGlobalFilter,
    useSortBy,
    usePagination,
    ...hooks,
    hook => {
      hook.flatColumns.push(columns =>
        columns.map(column => {
          if (renderCells === undefined) {
            return column;
          }

          const cellRenderer: Renderer<CellProps<T>> =
            renderCells[column.id as keyof T];

          return !!cellRenderer ? { ...column, Cell: cellRenderer } : column;
        })
      );
    }
  );
};
