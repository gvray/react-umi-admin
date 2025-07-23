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
  const defaultData: SalesDataItem[] = [];

  const chartData = data.length > 0 ? data : defaultData;
  const options: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.95)',
      borderColor: '#333',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
      formatter: function (params: any) {
        let result = `<div style="padding: 8px;">`;
        result += `<div style="margin-bottom: 4px; font-weight: bold;">${params[0].axisValue}</div>`;
        params.forEach((param: any) => {
          const color = param.color;
          result += `<div style="margin: 2px 0; display: flex; align-items: center;">`;
          result += `<span style="display: inline-block; width: 10px; height: 10px; background: ${color}; border-radius: 50%; margin-right: 8px;"></span>`;
          result += `<span>${param.seriesName}: ${param.value}k</span>`;
          result += `</div>`;
        });
        result += `</div>`;
        return result;
      },
    },
    legend: {
      data: ['销售额', '目标'],
      top: -5,
      textStyle: {
        color: '#666',
        fontSize: 12,
      },
      itemWidth: 12,
      itemHeight: 8,
    },
    grid: {
      left: 0,
      right: 0,
      top: 25,
      bottom: 0,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: chartData.map((item) => item.month),
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#666',
        fontSize: 11,
        margin: 10,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#666',
        fontSize: 11,
        formatter: '{value}k',
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '销售额',
        data: chartData.map((item) => Math.round(item.sales / 1000)),
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#4facfe' },
              { offset: 1, color: '#00f2fe' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(79, 172, 254, 0.5)',
          },
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
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#ff6b6b' },
              { offset: 1, color: '#ffa726' },
            ],
          },
        },
        itemStyle: {
          color: '#ff6b6b',
          borderColor: '#fff',
          borderWidth: 2,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 8,
            shadowColor: 'rgba(255, 107, 107, 0.5)',
          },
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 107, 107, 0.2)' },
              { offset: 1, color: 'rgba(255, 107, 107, 0.05)' },
            ],
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

export default DemoBarSale;
