import * as React from 'react';
import { TableToggleCommonProps } from 'react-table';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  TableToggleCommonProps;

export const DataTableCheckbox = React.forwardRef<HTMLInputElement, Props>(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>();
    const resolvedRef: any = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <div>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </div>
    );
  }
);
