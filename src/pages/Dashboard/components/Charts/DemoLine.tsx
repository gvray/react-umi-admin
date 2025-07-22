import Chart, { EChartsOption } from '@/components/Charts';
import { styled } from 'umi';

const DemoWrapper = styled.div`
  height: 50px;
`;

interface DemoLineProps {
  data?: number[];
}

const DemoLine: React.FC<DemoLineProps> = ({
  data = [10, 13, 16, 10, 9, 18, 20, 18, 22],
}) => {
  const options: EChartsOption = {
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(22, 119, 255, 0.7)', // 开始颜色，这里是蓝色，透明度为0.7
              },
              {
                offset: 1,
                color: 'rgba(0, 0, 255, 0)', // 结束颜色，透明度为0，即完全透明
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  };
  return (
    <DemoWrapper>
      <Chart options={options} />
    </DemoWrapper>
  );
};

export default DemoLine;
