<template>
  <el-menu :default-openeds="['1', '3']"
           style="height: 100%;overflow-x:hidden"
           background-color="rgb(48,65,86)"
           text-color="#fff":collapse-transition="false"
           router
  >
    <div>
      <img src="../assets/logo.png" alt="" style="width :30px">
      <b style="color:white">hello餐饮</b>
    </div>
    <el-submenu
        :index="item.id + ''"
        v-for="item in menulist"
        :key="item.id"
    >
      <!-- 一级菜单模板区 -->
      <template slot="title">
        <!-- 图标 -->

        <!-- 文本 -->
        <span>{{ item.name }}</span>
      </template>
      <!-- 二级菜单 -->
      <el-menu-item
          :index="'/' + subItem.path + ''"
          v-for="subItem in item.children"
          :key="subItem.id"
          @click="saveNavState('/' + subItem.path)"
      >
        <!-- 二级菜单模板区 -->
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{ subItem.name }}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Aside",
  data(){
    return{
      menulist: [],
    }
  },
  created() {
    request.get("/menu/costemmenu").then(res=>{
      console.log(res)
      this.menulist=res
    })
  },
  methods :{
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  }
}
</script>

<style scoped>

</style>
