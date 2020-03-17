import * as React from 'react';
import ReactPaginate from 'react-paginate';

type Props = {
  total: number;
  pageCount: number;
  pageSize: number;
  pageIndex: number;
  gotoPage: (page: number) => void;
};

export const DataTablePaginator: React.FC<Props> = ({
  total,
  pageCount,
  gotoPage,
  pageSize,
  pageIndex
}) => {
  const startIndex = pageIndex * pageSize;
  const endIndex = startIndex + pageSize;
  const startCount = startIndex + 1;
  const endCount = endIndex > total ? total : endIndex;
  return (
    <div className="commission-paginator" style={{ fontSize: 12 }}>
      <div className="row">
        <div className="col-md-3">
          Showing {startCount} to {endCount} of {total} entries
        </div>
        <div className="col-md-9">
          <div style={{ display: 'table', width: '100%' }}>
            <div className="pull-right">
              <ReactPaginate
                nextLabel="Next"
                pageCount={pageCount}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                previousLabel="Previous"
                activeLinkClassName="current"
                containerClassName="pagination dataTables_paginate"
                onPageChange={({ selected }) => gotoPage(selected)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
