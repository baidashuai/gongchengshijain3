<template>
  <div>
    <div class="center">
      <vs-table>
        <template #thead>
          <vs-tr>
            <vs-th>
              用户
            </vs-th>
            <vs-th>
             电话
            </vs-th>
            <vs-th>
              地址
            </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr
              :key="i"
              v-for="(tr, i) in $vs.getPage(users, page, max)"
          >
            <vs-td>
              {{ tr.username }}
            </vs-td>
            <vs-td>
              {{ tr.phone }}
            </vs-td>
            <vs-td>
              {{ tr.address }}
            </vs-td>

            <template #expand>
              <div class="con-content">
                <div style="display: flex" >
                  <div>
                  <vs-avatar>
                    <img :src=tr.avatarUrl alt="">
                  </vs-avatar>
                </div>
                <div style="position:absolute;right: 150px">
                  <vs-button flat icon @click="showUser(tr)">
                    查看用户详情
                  </vs-button>
                </div>
                </div>
              </div>
            </template>
          </vs-tr>
        </template>
        <template #footer>
          <vs-pagination v-model="page" :length="$vs.getLength(users, max)"/>
        </template>
      </vs-table>
    </div>
    <div class="center" v-model="userDetail">
      <vs-dialog scroll overflow-hidden not-close auto-width v-model="active">
        <template #header>
          <h3>
            用户：{{user.username}} 在本餐饮店的数据如下
          </h3>
        </template>
        <div class="con-content">
          <h4>
            共计消费总额：
          </h4>
          <p>
            {{userDetail.sum}} ￥
          </p>
          <h4>
            历史消费记录：
          </h4>

          <p v-for="(detailOrder,i) in userDetail.allDetailOrder">
            {{i}} : {{detailOrder.orderThing}}  {{detailOrder.orderDate}}
          </p>


          <h4>
            未支付次数：
          </h4>
          <p>
            {{userDetail.notPayCount}} 次
          </p>
          <h4>
            购买餐品次数：
          </h4>
          <p v-for="(singleOrderMerchCount,i) in userDetail.singleMerchPayCountList">
            购买了: {{singleOrderMerchCount.fullname}}  {{singleOrderMerchCount.count}} 次
          </p>
          <h4>
            上一次用餐时间：
          </h4>
          <p>
            {{userDetail.lastCostDate}}
          </p>
        </div>
      </vs-dialog>
    </div>
  </div>
</template>

<!-- 脚本 -->
<script>
import request from "@/utils/request";


export default {
  name: "User",
  data(){
    return{
      page: 1,
      max: 3,
      active: 0,
      users: [],
      user:{},
      userDetail:{}
    }
  },
  created() {
    this.getAllUser()
  },
  methods:{
    getAllUser(){
      request.get("/user").then(res=>{
        this.users=res
        console.log(res)
      })
    },
    showUser(row){
      this.active=!this.active
      console.log(row)
      this.user=row
      this.getUserAllOrderDetail(row.id)
    },
    getUserAllOrderDetail(id){
      request.get("/order/getUserDetailData",{params:{userId:id}}).then(res=>{
        console.log(res)
        this.userDetail=res
        console.log(this.userDetail.allDetailOrder.length)
      })
    },
    refresh() {
      location.reload();
    }
  }

}
</script>

