import React from 'react';
import { Column } from 'react-table';
import { DataTableCheckbox } from './data-table-checkbox';

export const getDataTableSelectColumn = (): Column<any> => ({
  id: 'selection',
  Header: ({ getToggleAllRowsSelectedProps }) => (
    <DataTableCheckbox {...getToggleAllRowsSelectedProps()} />
  ),
  Cell: ({ row }) => <DataTableCheckbox {...row.getToggleRowSelectedProps()} />
});
