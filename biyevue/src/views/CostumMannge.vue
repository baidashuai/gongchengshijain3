<template>

  <el-container style="min-height: 100% ;width: 100%;">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246);height:100%">
      <CostomAside></CostomAside>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px;border-bottom: 1px solid #ccc;line-height: 55px">
        <Header></Header>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
// @ is an alias to /src
import request from "@/utils/request";
import CostomAside from "@/components/CostomAside";
import Header from "@/components/Header";

export default {
  name: 'HomeView',
  components: {Header, CostomAside},
  data(){
    return {

    }
  },
  created() {

  },
  methods:{

  }


}
</script>
