import type { EChartsOption } from 'echarts';
import { BarChart, GaugeChart, LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import React, { useLayoutEffect } from 'react';
import { useDeepCompareMemo } from 'use-compare';

// 按需注册项目中实际使用的图表类型与组件，避免全量引入 echarts
// 目前使用到的 series：line / bar / pie / gauge
// 目前使用到的组件：title / tooltip / grid / legend
// 如需新增图表类型，请在这里补充注册
echarts.use([
  BarChart,
  GaugeChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

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
