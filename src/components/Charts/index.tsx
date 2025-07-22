import * as echarts from 'echarts';
import React, { useLayoutEffect } from 'react';
import { useDeepCompareMemo } from 'use-compare';

export type EChartsOption = echarts.EChartsOption;

interface ChartProps {
  options: EChartsOption;
}

const Chart: React.FC<ChartProps> = ({ options }) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chatOptions: EChartsOption = useDeepCompareMemo(() => {
    return { ...options };
  }, [options]);
  useLayoutEffect(() => {
    const chart = echarts.init(chartRef.current as HTMLDivElement);
    chart.setOption(chatOptions);
    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(chartRef.current as HTMLDivElement);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [chatOptions]);
  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default Chart;
