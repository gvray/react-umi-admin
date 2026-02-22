import type { RowProps } from 'antd';
import { Col, Row } from 'antd';
import type { PropsWithChildren, ReactNode } from 'react';
import React from 'react';

export type FormGridProps = PropsWithChildren<{
  gutter?: RowProps['gutter'];
  columns?: 1 | 2 | 3 | 4;
}>;

export type FormGridItemProps = {
  children: ReactNode;
  xs?: number;
  md?: number;
  span?: number;
};

const FormGridItem: React.FC<FormGridItemProps> = ({ children }) => {
  return <>{children}</>;
};

const FormGrid: React.FC<FormGridProps> & {
  Item: typeof FormGridItem;
} = ({ gutter = 24, columns = 2, children }) => {
  const defaultMd = Math.floor(24 / columns);

  return (
    <Row gutter={gutter}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if (child.type !== FormGridItem) return child;

        const props = child.props as FormGridItemProps;
        const xs = props.xs ?? 24;
        const md = props.md ?? props.span ?? defaultMd;

        return (
          <Col xs={xs} md={md}>
            {props.children}
          </Col>
        );
      })}
    </Row>
  );
};

FormGrid.Item = FormGridItem;

export default FormGrid;
