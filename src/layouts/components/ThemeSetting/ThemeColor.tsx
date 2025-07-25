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
    color: string;
    label: string;
  }[];
  value: string;
  onChange?: (theme: { label: string; color: string }) => void;
}

const ThemeColors = styled.div`
  display: flex;
  gap: 8px;
`;
const ThemeColor: React.FC<ThemeColorProps> = ({
  colorList,
  value,
  onChange,
}) => {
  return (
    <ThemeColors>
      {colorList.map(({ color, label }) => {
        return (
          <Tooltip key={color} title={label}>
            <Tag
              check={value === color}
              color={color}
              onClick={() => onChange?.({ color, label })}
            />
          </Tooltip>
        );
      })}
    </ThemeColors>
  );
};

export default ThemeColor;
