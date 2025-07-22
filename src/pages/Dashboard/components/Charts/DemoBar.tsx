import Chart, { EChartsOption } from '@/components/Charts';
import { styled } from 'umi';

const DemoWrapper = styled.div`
  height: 50px;
`;

interface DemoBarProps {
  data?: number[];
}

const DemoBar: React.FC<DemoBarProps> = ({
  data = [120, 200, 150, 80, 70, 110, 130],
}) => {
  const options: EChartsOption = {
    xAxis: {
      type: 'category',
      show: false,
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
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
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

export default DemoBar;
