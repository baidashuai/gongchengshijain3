<template>
  <div>
    <el-table
        :data="tableData"
        style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div>
            <el-steps :active="props.row.stepState" finish-status="success">
              <el-step title="申请退款"></el-step>
              <el-step title="等待商家审核"></el-step>
              <el-step title="审核完成"></el-step>
            </el-steps>
          </div>
          <div>
            <el-col :span="8">
              <el-card shadow="hover">
                商家回复：
               {{props.row.refuseReason}}
              </el-card>
            </el-col>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="订单号"
          prop="orderId">
      </el-table-column>
      <el-table-column
          label="点餐内容"
          prop="orderThing">
      </el-table-column>
      <el-table-column
          label="订单时间"
          prop="orderDate">
      </el-table-column>
      <el-table-column
          label="订单总额"
          prop="sum">
      </el-table-column>
      <el-table-column
          label="退款状态"
          prop="refundState">
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "MyAfterSales",
  data(){
    return{
      tableData: []
    }
  },
  created() {
    this.getRefuseDetailByUserId()
  },
  methods:{
    getRefuseDetailByUserId(){
      let user=localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):null;
      request.get("/refund/findRefuseByUserId",{params:{userId:user.id}}).then(res=>{
        console.log(res)
        for (var i = 0; i < res.length; i++) {
          if (res[i].refundState == 0) {
            res[i].refundState = '审核中'
          } else if (res[i].refundState==1){
            res[i].refundState = '已退款'
          }else {
            res[i].refundState='已拒绝'
          }
        }
        this.tableData=res
      })
    }
  }
}
</script>

<style scoped>

</style>
