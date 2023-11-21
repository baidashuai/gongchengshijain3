<template>
  <el-menu :default-openeds="['1', '3']"
           style="height: 100%;overflow-x:hidden"
           background-color="rgb(48,65,86)"
           text-color="#fff":collapse-transition="false"
           router
  >
    <div>
      <img src="../assets/logo.png" alt="" style="width :30px">
      <b style="color:white">餐饮管理系统</b>
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
    request.get("/menu").then(res=>{
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

<style>
.el-menu {
  background-color: rgb(48,65,86); /* 更改菜单背景颜色 */
  color: #fff; /* 更改菜单文本字体颜色 */
  height: calc(100% - 50px); /* 缩短菜单高度并从底部居中对齐 */
}

.el-submenu__title {
  font-weight: bold; /* 加粗子菜单标题 */
}

.el-menu-item,
.el-submenu__title {
  transition: background-color 0.2s ease, color 0.2s ease; /* 添加渐变动画效果 */
}

.el-menu-item:hover,
.el-submenu__title:hover,
.el-menu-item.is-active {
  background-color: #fff; /* 鼠标悬停或当前选中菜单时的高亮背景颜色 */
  color: rgb(48,65,86); /* 鼠标悬停或当前选中菜单时的字体颜色 */
}


</style>
