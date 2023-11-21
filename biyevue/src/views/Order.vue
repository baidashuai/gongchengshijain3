<template>
  <div>
    <div style="padding: 10px">
      <div style="padding: 10px">
        <el-input style="width: 200px;"suffix-icon="el-icon-search" placeholder="根据餐品名称搜索" v-model="orderThing"></el-input>
        <el-button class="ml-5" type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <div style="margin:10px 0">
      <el-button type="danger" @click="delbatch" >批量删除 <i class="el-icon-remove-outline"></i></el-button>
      <el-button type="info" @click="getOrderByDates(0)">今日订单</el-button>
      <el-button type="info" @click="getOrderByDates(1)">昨日订单</el-button>
      <el-button type="info" @click="getOrderByDates(7)">近七天订单</el-button>
      <el-button type="info" @click="getOrderByDates(30)">近一月订单</el-button>
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
      <el-table-column prop="userId" label="用户编号" width="140">
      </el-table-column>
      <el-table-column prop="orderThing" label="点餐" width="140">
      </el-table-column>
      <el-table-column prop="sum" label="总计" width="120" sortable>
      </el-table-column>
      <el-table-column prop="orderDate" label="订单时间" sortable>
      </el-table-column>
      <el-table-column prop="payState" label="订单支付状态" sortable>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="danger" @click="handleDelete(scope.row.orderId)">删除 <i class="el-icon-remove-outline"></i></el-button>
        </template>
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
      orderId:'',
      total:0,
      pageNum:1,
      pageSize:10,
      dialogFormVisible:false,
      form:{},
      mutipleselection:[],
      daysum:'',
      flag:'',
      orderThing:''
    }
  },
  created() {
    this.load()
  },
  methods:{
    handleCurrentChange(pageNum){
      this.pageNum=pageNum;
      this.load()
      console.log(pageNum)
    },
    handleSizeChange(val){
      this.pageSize=val;
      this.load()
    },
    search(){
      this.pageNum=1
      this.flag=null
      this.load()
    },
    load(){
      //请求分页查询数据
      request.get("/orderdetail/page",{params:{pageNum:this.pageNum, pageSize:this.pageSize,orderThing:this.orderThing,flag:this.flag}
      }).then(res=>{
        // console.log(res)
        this.tableData=res.records
        this.total=res.total;
      })
      request.get("/orderdetail/daysum").then(res=>{
       // console.log(res)
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
    handleDelete(id){
      request.delete("/orderdetail/"+id).then(res=>{
        if (res){
          this.$message.success("删除成功！")
        }
        this.load();
      })

    },
    save(){
      request.post("/merch",this.form).then(res=>{
        if (res){
          this.$message.success("新增成功！")
          console.log(this.form)
        }
        else {
          this.$message.error("新增失败！")
        }
        this.dialogFormVisible=false;

      })
    },
    handleSelectionChange(val){
      console.log(val)
      this.mutipleselection=val;
    },
    delbatch(){
      let ids=this.mutipleselection.map(v=>v.orderId);
      // console.log(ids)
      request.post("/orderdetail/del/batch",ids).then(res=>{
        if(res){
          this.$message.success("删除成功！")
        }
        else {
          this.$message.error("删除失败！")
        }
      })
    },
    getOrderByDates(val){
      this.pageNum=1
      this.flag=val
      this.load()
     /* this.flag=null*/
    }

  }

}
</script>

<style scoped>

</style>
