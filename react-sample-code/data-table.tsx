import * as React from 'react';
import { UseDataTableParams, useDataTable } from '@dpp/utils';
import { DataTableFilter } from './data-table-filter';
import { DataTablePaginator } from './data-table-paginator';
import { TableInstance } from 'react-table';

type Props<T extends object> = UseDataTableParams<T> & {
  children: (props: TableInstance<T>) => JSX.Element;
  headerLeft?: (props: TableInstance<T>) => JSX.Element;
  unsortedColumns?: string[];
};

export const ReactDataTable = <T extends object>({
  children,
  unsortedColumns = [],
  headerLeft = undefined,
  ...dataTableProps
}: Props<T>) => {
  const props = useDataTable(dataTableProps);
  return (
    <div className="react-data-table">
      <div className="row">
        <div className="col-md-9">{headerLeft ? headerLeft(props) : null}</div>
        <div className="col-md-3">
          <DataTableFilter
            filter={props.state.globalFilter}
            setFilter={props.setGlobalFilter}
          />
        </div>
      </div>
      <table {...props.getTableProps()} className="table table-striped">
        <thead>
          {props.headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                let columnClass = column.isSorted
                  ? column.isSortedDesc
                    ? 'sorting_desc'
                    : 'sorting_asc'
                  : 'sorting';

                if (unsortedColumns.includes(column.id)) {
                  columnClass = '';
                }

                return (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={columnClass}
                  >
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        {children(props)}
      </table>
      <DataTablePaginator
        pageIndex={props.state.pageIndex}
        pageSize={props.state.pageSize}
        total={props.rows.length}
        pageCount={props.pageCount}
        gotoPage={props.gotoPage}
      />
    </div>
  );
};
