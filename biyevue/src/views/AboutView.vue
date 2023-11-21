<template>
  <div>
    <h1>餐饮店最近七日的营业额走势</h1>
  <!--渲染Echarts图表的容器-->
  <div id="main"></div>

  </div>

</template>

<script>
// 引入Echarts
import * as echarts from 'echarts';
import request from "@/utils/request";

export default {
  name: 'App',
  // 属性
  data() {
    return {
      daysum:[],
      datelist:[],
      test:3
    }
  },
  // 生命周期函数
  mounted() {
    // 渲染图表
    this.initEcharts();
  },
  updated() {
  },
  created() {
    request.get("/orderdetail/getDaySumByDates1").then(res=>{
      this.test=2
      console.log(this.test)
    })

  },
  // 方法定义
  methods: {

    // 渲染Echarts图表
    initEcharts() {
      // 获取DOM元素（根据id）
      request.get("/orderdetail/getChartData").then(res=>{
        this.daysum=res.data.last7dateSum
        this.datelist=res.data.dateList
        var chartDom = document.getElementById('main');
        // 初始化
        var myChart = echarts.init(chartDom);
        // 属性

        var option = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.datelist
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data:this.daysum,
              type: 'line',
              areaStyle: {}
            }
          ]
        };
        // 设置属性
        option && myChart.setOption(option);
      })

    },

  }
}
</script>

<style>
#main{
  width: 800px;
  height: 500px;
}
</style>

