import Chart, { EChartsOption } from '@/components/Charts';
import { styled } from 'umi';

const DemoWrapper = styled.div`
  height: 280px;
`;

interface SalesDataItem {
  month: string;
  sales: number;
  target: number;
}

interface DemoBarSaleProps {
  data?: SalesDataItem[];
}

const DemoBarSale: React.FC<DemoBarSaleProps> = ({ data = [] }) => {
  // 默认数据
  const defaultData = [
    { month: '一月', sales: 120000, target: 150000 },
    { month: '二月', sales: 200000, target: 180000 },
    { month: '三月', sales: 150000, target: 160000 },
    { month: '四月', sales: 80000, target: 120000 },
    { month: '五月', sales: 70000, target: 110000 },
    { month: '六月', sales: 110000, target: 130000 },
    { month: '七月', sales: 130000, target: 140000 },
    { month: '八月', sales: 180000, target: 170000 },
    { month: '九月', sales: 210000, target: 200000 },
    { month: '十月', sales: 160000, target: 180000 },
    { month: '十一月', sales: 140000, target: 160000 },
    { month: '十二月', sales: 230000, target: 220000 },
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const options: EChartsOption = {
    xAxis: {
      type: 'category',
      data: chartData.map((item) => item.month),
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
    },
    grid: {
      left: 30,
      right: 2,
      top: 15,
      bottom: 40,
    },
    series: [
      {
        name: '销售额',
        data: chartData.map((item) => Math.round(item.sales / 1000)),
        type: 'bar',
        barWidth: 20,
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
      {
        name: '目标',
        data: chartData.map((item) => Math.round(item.target / 1000)),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#ff7875',
          width: 2,
        },
        itemStyle: {
          color: '#ff7875',
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

export default DemoBarSale;
