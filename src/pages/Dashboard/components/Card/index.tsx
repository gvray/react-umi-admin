import React from 'react';
import { styled } from 'umi';

type LabelValue = {
  label: string;
  value: number | string;
};
interface CardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  header?: LabelValue;
  footer?: LabelValue | (() => React.ReactNode);
}

const CardWarp = styled.div`
  background-color: #fff;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: #000;
`;

const CardTitle = styled.div`
  padding: 15px 20px;
  font-size: 15px;
  font-weight: 700;
  color: #000;
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 20px;
`;

const CardBody = styled.div`
  padding: 0 20px 20px 20px;
  min-height: 50px;
  width: 100%;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  border-top: 1px solid #f7f7f7;
  font-size: 12px;
  margin: 0 5px;
  padding: 0 15px;
  box-sizing: border-box;
`;

const CardHeaderValue = styled.span`
  font-size: 18px;
  font-weight: 700;
`;

const CardLabel = styled.span`
  margin-right: 10px;
`;

const Card: React.FC<CardProps> = ({ children, title, header, footer }) => {
  const genFooter = () => {
    if (!footer) return null;
    if (typeof footer === 'function') {
      return footer();
    }
    return (
      <>
        <CardLabel>{footer.label}</CardLabel>
        <span>{footer.value}</span>
      </>
    );
  };
  const genHeader = () => {
    if (!header) return null;
    return (
      <>
        <CardLabel>{header.label}</CardLabel>
        <CardHeaderValue>{header.value}</CardHeaderValue>
      </>
    );
  };
  return (
    <CardWarp>
      {title && <CardTitle>{title}</CardTitle>}
      {header && <CardHead>{genHeader()}</CardHead>}
      <CardBody>{children}</CardBody>
      {footer && <CardFooter>{genFooter()}</CardFooter>}
    </CardWarp>
  );
};

export default Card;
