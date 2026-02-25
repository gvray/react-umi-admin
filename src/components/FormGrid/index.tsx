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

  // 递归提取所有 FormGridItem，处理嵌套的 Fragment
  const extractGridItems = (children: ReactNode): React.ReactElement[] => {
    const items: React.ReactElement[] = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;

      // 如果是 FormGridItem，直接添加
      if (child.type === FormGridItem) {
        items.push(child);
      }
      // 如果是 Fragment，递归处理其子元素
      else if (child.type === React.Fragment) {
        items.push(...extractGridItems(child.props.children));
      }
    });

    return items;
  };

  const gridItems = extractGridItems(children);

  return (
    <Row gutter={gutter}>
      {gridItems.map((child, index) => {
        const props = child.props as FormGridItemProps;
        const xs = props.xs ?? 24;
        const md = props.md ?? props.span ?? defaultMd;

        return (
          <Col key={index} xs={xs} md={md}>
            {props.children}
          </Col>
        );
      })}
    </Row>
  );
};

FormGrid.Item = FormGridItem;

export default FormGrid;
