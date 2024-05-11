<template>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,

} from "echarts/components";
import VChart from "vue-echarts";
import { getLibraryViewECharts} from "@/api/system/echarts";

use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart
]);

export default {
  name: "LibraryViewECharts",
  components: {
    VChart
  },
  data() {
    return {
      option: {
        title: {
          text: "思政元素浏览统计",
          left: "center"
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '浏览次数',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
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
      getLibraryViewECharts().then(response => {
        this.option.xAxis[0].data = response.data.map((item) => item.libraryName)
        this.option.series[0].data = response.data.map((item) => item.view)
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
