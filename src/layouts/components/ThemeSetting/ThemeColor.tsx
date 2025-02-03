import { CheckOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { styled } from 'umi';

interface TagProps {
  color: string;
  check: boolean;
  onClick: () => void;
}

const TagWrapper = styled.div`
  width: 20px;
  height: 20px;
  color: #fff;
  line-height: 20px;
  border-radius: 2px;
  float: left;
  text-align: center;
  margin-block-start: 8px;
  margin-inline-end: 8px;
  cursor: pointer;
`;

const Tag = (props: TagProps) => {
  const { color, check, ...rest } = props;
  return (
    <TagWrapper style={{ backgroundColor: color }} {...rest}>
      {check ? <CheckOutlined /> : ''}
    </TagWrapper>
  );
};

interface ThemeColorProps {
  colorList: {
    key: string;
    color: string;
    title?: string;
  }[];
  value: string;
  onChange?: (theme: { key: string; color: string }) => void;
}

const ThemeColors = styled.div`
  display: flex;
`;
const ThemeColor: React.FC<ThemeColorProps> = ({
  colorList,
  value,
  onChange,
}) => {
  return (
    <ThemeColors>
      {colorList.map(({ key, color, title }) => {
        return (
          <Tooltip key={key} title={title}>
            <Tag
              check={value === key}
              color={color}
              onClick={() => onChange?.({ key, color })}
            />
          </Tooltip>
        );
      })}
    </ThemeColors>
  );
};

export default ThemeColor;
