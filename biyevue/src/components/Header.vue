<template>
<div>

    <div class="center con-avatars">
      <vs-avatar size="50" badge-position="top-right" badge badge-color="#7d33ff" history history-gradient circle id="my-imge">
        <router-link to="/person"><img :src="avatarUrl" alt=""></router-link>
      </vs-avatar>
    </div>

</div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "Header",
  data(){
    return{
      avatarUrl:''
    }
  },
  created() {
    this.getUser()
  },
  methods:{
    getUser(){
      request.get("/user/getIdByToken/"+JSON.parse(localStorage.getItem("user")).token).then(res=>{
        request.get("/user/"+res.data).then(res=>{
          this.avatarUrl=res.avatarUrl
        })
      })
    }
  }
}
</script>

<style scoped>
#my-imge{
  position: absolute;
  right: 229px;
}
</style>
