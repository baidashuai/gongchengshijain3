<template>
  <div>
    <div style="padding: 10px">
      <div style="padding: 10px">
        <el-input style="width: 200px;"suffix-icon="el-icon-search" placeholder="餐品名称" v-model="orderThing"></el-input>
        <el-button class="ml-5" type="primary" @click="updateOrderState">查询订单状态</el-button>
      </div>
    </div>
    <div style="margin:10px 0">

    </div>

    <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">

      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="orderId" label="订单号" width="140">
      </el-table-column>
      <el-table-column prop="nickName" label="用户昵称" width="140">
      </el-table-column>
      <el-table-column prop="orderThing" label="点餐" width="140">
      </el-table-column>
      <el-table-column prop="sum" label="总计" width="120" sortable>
      </el-table-column>
      <el-table-column prop="orderDate" label="订单时间" sortable>
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
      <el-table-column prop="state" label="订单状态">
      </el-table-column>
      <el-table-column prop="payState" label="订单支付状态">
      </el-table-column>

    </el-table>
    <div style="padding: 10px">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "menu",
  data(){
    return{
      tableData:[],
      options:[],
      orderThing:'',
      total:0,
      pageNum:1,
      pageSize:10,
      dialogFormVisible:false,
      form:{},
      mutipleselection:[],
      daysum:'',
      flag:'',
      orderState:''
    }
  },
  created() {
    this.load()
    let timer = setTimeout(() => {
          //需要定时执行的代码
      for(let i=0;i<this.tableData.length;i++){
        console.log(this.tableData[i].state)
        if (this.tableData[i].state===0||this.tableData[i].state==='配送未完成') {
          this.tableData[i].state = '配送未完成'
        }
        else {
          this.tableData[i].state='配送已完成';
        }
      }
        }, 100)
  },
  methods:{

    updateOrderState(){
      for(let i=0;i<this.tableData.length;i++){
        console.log(this.tableData[i].state)
        if (this.tableData[i].state===0||this.tableData[i].state==='配送未完成') {
          this.tableData[i].state = '配送未完成'
        }
      else {
          this.tableData[i].state='配送已完成';
        }
      }
    },
    handleCurrentChange(pageNum){
      this.pageNum=pageNum;
      this.load()
      console.log(pageNum)
    },
    handleSizeChange(val){
      this.pageSize=val;
      this.load()
    },
    load(){
      //请求分页查询数据
      let user=localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):null;
      let token=user.token
      request.get("/takeout/page",{params:{pageNum:this.pageNum,
          pageSize:this.pageSize,token:token}
      }).then(res=>{
         console.log(res)
        this.tableData=res.records
        this.total=res.total;
      })
    },
    handleAdd(){
      this.dialogFormVisible=true;
      this.form={};
    },
    handleEdit(row){
      this.form=row;
      this.dialogFormVisible=true;
      this.load()
    },
    handleSelectionChange(val){
      console.log(val)
      this.mutipleselection=val;
    }

  }

}
</script>

<style scoped>

</style>
