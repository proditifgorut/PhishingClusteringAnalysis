import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { ScatterChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { PhishingData, ClusterResult } from '../types';

echarts.use([
  ScatterChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer
]);

interface ClusterVisualizationProps {
  data: PhishingData[];
  clusters: ClusterResult[];
}

export default function ClusterVisualization({ data, clusters }: ClusterVisualizationProps) {
  const scatterData = clusters.map(cluster => ({
    name: `Cluster ${cluster.clusterId + 1}`,
    type: 'scatter',
    data: data
      .filter(d => d.cluster === cluster.clusterId)
      .map(d => [d.urlLength, d.riskScore]),
    itemStyle: {
      color: cluster.color
    },
    symbolSize: 10
  }));

  const scatterOption = {
    title: {
      text: 'URL Length vs Risk Score Distribution',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `URL Length: ${params.value[0]}<br/>Risk Score: ${params.value[1].toFixed(2)}`;
      }
    },
    legend: {
      bottom: 10,
      data: clusters.map(c => `Cluster ${c.clusterId + 1}`)
    },
    xAxis: {
      name: 'URL Length',
      nameLocation: 'middle',
      nameGap: 30,
      splitLine: { show: true }
    },
    yAxis: {
      name: 'Risk Score',
      nameLocation: 'middle',
      nameGap: 40,
      splitLine: { show: true }
    },
    series: scatterData,
    grid: {
      left: '10%',
      right: '5%',
      bottom: '15%',
      top: '15%'
    }
  };

  const pieOption = {
    title: {
      text: 'Cluster Distribution',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} URLs ({d}%)'
    },
    legend: {
      bottom: 10,
      data: clusters.map(c => `Cluster ${c.clusterId + 1}`)
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%'
        },
        data: clusters.map(c => ({
          value: c.count,
          name: `Cluster ${c.clusterId + 1}`,
          itemStyle: { color: c.color }
        }))
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <ReactEChartsCore
          echarts={echarts}
          option={scatterOption}
          style={{ height: '400px' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <ReactEChartsCore
          echarts={echarts}
          option={pieOption}
          style={{ height: '400px' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  );
}
