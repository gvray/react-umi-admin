import { styled } from 'umi';

const RankWrapper = styled.div`
  height: 280px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  overflow: hidden;
`;

const RankList = styled.ul`
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const RankItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  list-style: none;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  margin-bottom: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const RankNumber = styled.div<{ $special: number }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  margin-right: 12px;
  flex-shrink: 0;

  background: ${({ $special }) => {
    if ($special === 0) return 'linear-gradient(135deg, #FFD700, #FFA500)';
    if ($special === 1) return 'linear-gradient(135deg, #C0C0C0, #A9A9A9)';
    if ($special === 2) return 'linear-gradient(135deg, #CD7F32, #B8860B)';
    return 'linear-gradient(135deg, #e3e3e3, #c8c8c8)';
  }};

  color: ${({ $special }) => ($special < 3 ? '#fff' : '#666')};
  box-shadow: ${({ $special }) =>
    $special < 3
      ? '0 4px 12px rgba(0, 0, 0, 0.2)'
      : '0 2px 6px rgba(0, 0, 0, 0.1)'};
`;

const RankContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RankName = styled.span`
  color: #333;
  font-weight: 500;
  flex: 1;
`;

const RankValue = styled.span`
  color: #666;
  font-weight: 600;
  font-size: 13px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const RankListItem = styled(RankItem)<{ $special: number }>``;

interface RankDataItem {
  name: string;
  value: number;
  percentage: number;
}

interface RankProps {
  data?: RankDataItem[];
}

const Rank: React.FC<RankProps> = ({ data = [] }) => {
  // 默认数据
  const defaultData = [
    { name: '华为手机专卖店', value: 323234, percentage: 15.2 },
    { name: '小米之家旗舰店', value: 281234, percentage: 13.8 },
    { name: '苹果官方授权店', value: 234567, percentage: 11.5 },
    { name: 'OPPO体验店', value: 198765, percentage: 9.7 },
    { name: 'vivo智能体验馆', value: 156789, percentage: 7.7 },
    { name: '三星电子专营店', value: 134567, percentage: 6.6 },
    { name: '联想电脑专卖店', value: 123456, percentage: 6.1 },
  ];

  const rankData = data.length > 0 ? data : defaultData;

  return (
    <RankWrapper>
      <RankList>
        {rankData.map((item, index) => (
          <RankListItem key={index} $special={index}>
            <RankNumber $special={index}>{index + 1}</RankNumber>
            <RankContent>
              <RankName>{item.name}</RankName>
              <RankValue>{item.value.toLocaleString()}</RankValue>
            </RankContent>
          </RankListItem>
        ))}
      </RankList>
    </RankWrapper>
  );
};

export default Rank;
