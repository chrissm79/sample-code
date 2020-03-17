import * as React from 'react';

type Props = {
  filter: string;
  setFilter: (value: string) => void;
};

export const DataTableFilter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <div
      className="data-table-filter"
      style={{ display: 'table', width: '100%', fontSize: 13 }}
    >
      <div className="form-group pull-right" style={{ maxWidth: 250 }}>
        <span style={{ paddingRight: 5 }}>Search:</span>
        <input
          type="text"
          value={filter || ''}
          className="form-control"
          placeholder="Filter Results"
          style={{ width: 180, display: 'inline-block', fontSize: 13 }}
          onChange={e => setFilter(e.target.value || undefined)}
        />
      </div>
    </div>
  );
};
