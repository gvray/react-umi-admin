import { styled } from 'umi';

const RankWrapper = styled.div`
  height: 280px;
`;
const RankList = styled.ul`
  height: 100%;
  margin: 0;
  padding: 0;
`;

const RankItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  list-style: none;
  font-size: 13px;
  cursor: pointer;
  position: relative;
`;

const RankListItem = styled(RankItem)<{ $special: number }>`
  &::before {
    content: attr(data-index);
    background-color: ${({ $special }) =>
      $special < 3 ? '#000' : 'transparent'};
    width: 25px;
    text-align: center;
    line-height: 25px;
    border-radius: 50%;
    color: ${({ $special }) => ($special < 3 ? '#FFF' : '#000')};
    position: absolute;
    left: 0px;
  }

  a {
    color: #000;
    padding-left: 30px;
  }
`;

interface RankDataItem {
  name: string;
  value: number;
  percentage: number;
}

interface RankProps {
  data?: RankDataItem[];
}

const Rank: React.FC<RankProps> = ({ data = [] }) => {
  return (
    <RankWrapper>
      <RankList>
        {data &&
          data.map((item, index) => (
            <RankListItem key={index} $special={index} data-index={index + 1}>
              <a>{item.name}</a>
              <span>{item.value}</span>
            </RankListItem>
          ))}
      </RankList>
    </RankWrapper>
  );
};

export default Rank;
