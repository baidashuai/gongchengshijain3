<style lang="stylus" scoped>
.my-reply
  padding 10px
  background-color #fafbfc
  .header-img
    display inline-block
    vertical-align top
  .reply-info
    display inline-block
    margin-left 5px
    width 90%
    @media screen and (max-width:1200px) {
      width 80%
    }
    .reply-input
      min-height 20px
      line-height 22px
      padding 10px 10px
      color #ccc
      background-color #fff
      border-radius 5px
      &:empty:before
        content attr(placeholder)
      &:focus:before
        content none
      &:focus
        padding 8px 8px
        border 2px solid blue
        box-shadow none
        outline none
  .reply-btn-box
    height 25px
    margin 10px 0
    .reply-btn
      position relative
      float right
      margin-right 15px
.my-comment-reply
  margin-left 50px
  .reply-input
    width flex
.author-title:not(:last-child)
  border-bottom: 1px solid rgba(178,186,194,.3)
.author-title
  padding 10px
  .header-img
    display inline-block
    vertical-align top
  .author-info
    display inline-block
    margin-left 5px
    width 60%
    height 40px
    line-height 20px
    >span
      display block
      cursor pointer
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
    .author-name
      color #000
      font-size 18px
      font-weight bold
    .author-time
      font-size 14px
  .icon-btn
    width 30%
    padding 0 !important
    float right
    @media screen and (max-width : 1200px){
      width 20%
      padding 7px
    }
    >span
      cursor pointer
    .iconfont
      margin 0 5px
  .talk-box
    margin 0 50px
    >p
      margin 0
    .reply
      font-size 16px
      color #000
  .reply-box
    margin 10px 0 0 50px
    background-color #efefef
</style>
<template>
  <div>
    <div v-clickoutside="hideReplyBtn" @click="inputFocus" class="my-reply">
      <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>
      <div class="reply-info" >
        <div
            tabindex="0"
            contenteditable="true"
            id="replyInput"
            spellcheck="false"
            placeholder="输入评论..."
            class="reply-input"
            @focus="showReplyBtn"
            @input="onDivInput($event)"
        >
        </div>
      </div>
      <div class="reply-btn-box" v-show="btnShow">
        <el-button class="reply-btn" size="medium" @click="sendComment" type="primary">发表评论</el-button>
      </div>
    </div>
    <div v-for="(item,i) in comments" :key="i" class="author-title reply-father">
      <el-avatar class="header-img" :size="40" :src="item.headImg"></el-avatar>
      <div class="author-info">
        <span class="author-name">{{item.username}}</span>
        <span class="author-time">{{item.time}}</span>
      </div>
      <div class="icon-btn">
        <span @click="showReplyInput(i,item.username,item.id)"><i class="iconfont el-icon-s-comment"></i>{{item.commentNum}}</span>
        <i class="iconfont el-icon-caret-top"></i>{{item.like}}
      </div>
      <div class="talk-box">
        <p>
          <span class="reply">{{item.userComment}}</span>
        </p>
      </div>
      <div class="reply-box">
        <div v-for="(reply,j) in item.reply" :key="j" class="author-title">
          <el-avatar class="header-img" :size="40" :src="reply.fromHeadImg"></el-avatar>
          <div class="author-info">
            <span class="author-name">{{reply.userfrom}}</span>
            <span class="author-time">{{reply.time}}</span>
          </div>
          <div class="icon-btn">
            <span @click="showReplyInput(i,reply.userfrom,item.id)"><i class="iconfont el-icon-s-comment"></i></span>
          </div>
          <div class="talk-box">
            <p>
              <span>回复 {{reply.toUser}}:</span>
              <span class="reply">{{reply.userComment}}</span>
            </p>
          </div>
          <div class="reply-box">

          </div>
        </div>
      </div>
      <div  v-show="inputShow(i)" class="my-reply my-comment-reply">
        <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>
        <div class="reply-info" >
          <div tabindex="0" contenteditable="true" spellcheck="false" placeholder="输入评论..."   @input="onDivInput($event)"  class="reply-input reply-comment-input"></div>
        </div>
        <div class=" reply-btn-box">
          <el-button class="reply-btn" size="medium" @click="sendCommentReply(i,j)" type="primary">发表评论</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";

const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  update() {},
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.vueClickOutside);
    delete el.vueClickOutside;
  },
};
export default {
  name:'Remark',
  data(){
    return{
      btnShow: false,
      index:'0',
      replyComment:'',
      myName:'',
      myHeader:'',
      myId:19870621,
      comments:[]
    }
  },
  directives: {clickoutside},
  created() {
    request.get("/remark/genRemark").then(res=>{
      console.log(res.data)
      this.comments=res.data

      let user=localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):null;
      let token=user.token
      request.get("/user/getIdByToken/"+token).then(res=>{
        console.log(res.data)
        request.get("/user/"+res.data).then(res=>{
          this.myName=res.username
          this.myHeader=res.avatarUrl
        })
      })
    }
    )
    let timer = setTimeout(() => {
      //需要定时执行的代码
      //转换时间
      for (var i=0;i<this.comments.length;i++){

        var t=new Date(this.comments[i].time.replace("T"," "))
        var nt=t.getTime()
        this.comments[i].time=this.dateStr(nt)

        for (var j=0;j<this.comments[i].reply.length;j++){
          console.log(this.comments[i].reply[j].time)
           t=new Date(this.comments[i].reply[j].time.replace("T"," "))
           nt=t.getTime()
          this.comments[i].reply[j].time=this.dateStr(nt)
        }
      }
    }, 100)
  },
  methods: {
    inputFocus(){
      var replyInput = document.getElementById('replyInput');
      replyInput.style.padding= "8px 8px"
      replyInput.style.border ="2px solid blue"
      replyInput.focus()
    },
    showReplyBtn(){
      this.btnShow = true
    },
    hideReplyBtn(){
      this.btnShow = false
      replyInput.style.padding= "10px"
      replyInput.style.border ="none"
    },
    showReplyInput(i,name,id){
      this.comments[this.index].inputShow = false
      this.index =i
      this.comments[i].inputShow = true
      this.toUser = name
      this.toId = id

    },
      inputShow(i){
      return this.comments[i].inputShow
    },
    sendComment(){
      if(!this.replyComment){
        this.$message({
          showClose: true,
          type:'warning',
          message:'评论不能为空'
        })
      }else{
        let a ={}
        let b={}
        let input =  document.getElementById('replyInput')
        let timeNow = new Date().getTime();
        let time= this.dateStr(timeNow);
        a.username= this.myName
        a.userComment =this.replyComment
        a.headImg = this.myHeader
        a.time = time
        a.commentNum = 0
        a.userlike = 0
        a.reply=[]
        a.id=crypto.randomUUID();
        b.username= this.myName
        b.userComment =this.replyComment
        b.headImg = this.myHeader
        b.commentNum = 0
        b.userlike = 0
        b.id=a.id

        this.comments.push(a)
        request.post("/remark/save",b).then(res=>{
          console.log(res)
        })
        this.replyComment = ''
        input.innerHTML = '';

      }
    },
    sendCommentReply(i,j){
      if(!this.replyComment){
        this.$message({
          showClose: true,
          type:'warning',
          message:'评论不能为空'
        })
      }else{
        let a ={}
        let b={}
        let timeNow = new Date().getTime();
        let time= this.dateStr(timeNow);
        a.userfrom= this.myName
        a.toUser = this.toUser
        a.fromHeadImg = this.myHeader
        a.userComment =this.replyComment
        a.time = time
        a.commentNum = 0
        a.userlike = 0
        a.fromId=crypto.randomUUID();
        b.userfrom= this.myName
        b.toUser = this.toUser
        b.fromHeadImg = this.myHeader
        b.userComment =this.replyComment
        b.commentNum = 0
        b.userlike = 0
        b.toId=this.toId;
        b.fromId=a.fromId;
        this.comments[i].reply.push(a)
        request.post("/replay/save",b).then(res=>{
          console.log(res)
        })
        this.replyComment = ''
        document.getElementsByClassName("reply-comment-input")[i].innerHTML = ""
      }
    },
    onDivInput: function(e) {
      this.replyComment = e.target.innerHTML;
    },
    dateStr(date){
      //获取js 时间戳
      var time=new Date().getTime();
      //去掉 js 时间戳后三位，与php 时间戳保持一致
      time=parseInt((time-date)/1000);
      //存储转换值
      var s;
      if(time<60*10){//十分钟内
        return '刚刚';
      }else if((time<60*60)&&(time>=60*10)){
        //超过十分钟少于1小时
        s = Math.floor(time/60);
        return  s+"分钟前";
      }else if((time<60*60*24)&&(time>=60*60)){
        //超过1小时少于24小时
        s = Math.floor(time/60/60);
        return  s+"小时前";
      }else if((time<60*60*24*30)&&(time>=60*60*24)){
        //超过1天少于30天内
        s = Math.floor(time/60/60/24);
        return s+"天前";
      }else{
        //超过30天ddd
        var date= new Date(parseInt(date));
        return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
      }
    }
  },
}
</script>
