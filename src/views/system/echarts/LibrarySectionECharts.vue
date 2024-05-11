<template>
  <v-chart class="chart" :option="option"/>
</template>

<script>
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,

} from "echarts/components";
import VChart from "vue-echarts";
import { getLibrarySectionECharts} from "@/api/system/echarts";

use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PieChart
]);

export default {
  name: "LibrarySectionECharts",
  components: {
    VChart
  },
  data() {
    return {
      option: {
        title: {
          text: "思政元素选取统计",
          left: "center"
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '选取次数',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: 1048, name: 'Search Engine'},
              {value: 735, name: 'Direct'},
              {value: 580, name: 'Email'},
              {value: 484, name: 'Union Ads'},
              {value: 300, name: 'Video Ads'}
            ]
          }
        ]
      }
    };
  },
  created() {
    this.getEchartsData()
  },
  methods: {
    getEchartsData() {
      getLibrarySectionECharts().then(response => {
        this.option.series[0].data = response.data.map((item) => ({
          value: item.selectionNum,
          name: item.libraryName
        }))
      })
    }
  }
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
