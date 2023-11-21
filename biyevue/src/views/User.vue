<template>
<div>
  <div style="padding: 10px">
    <el-input style="width: 200px;"suffix-icon="el-icon-search" placeholder="请输入用户名" v-model="username"></el-input>
    <el-input style="width: 200px;"suffix-icon="el-icon-search" placeholder="请输入地址" v-model="address"></el-input>
    <el-button class="ml-5" type="primary" @click="search">搜索</el-button>
  </div>
  <div style="margin:10px 0">
    <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
    <el-button type="danger" @click="delbatch" >批量删除 <i class="el-icon-remove-outline"></i></el-button>
  </div>
  <el-table :data="tableData" @selection-change="handleSelectionChange">
    <el-table-column
        type="selection"
        width="55">
    </el-table-column>
    <el-table-column prop="id" label="ID" width="140">
    </el-table-column>
    <el-table-column prop="username" label="用户名" width="140">
    </el-table-column>
    <el-table-column prop="address" label="地址" width="120">
    </el-table-column>
    <el-table-column prop="phone" label="电话">
    </el-table-column>
    <el-table-column>
      <template slot-scope="scope">
        <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
        <el-button type="danger" @click="handleDelete(scope.row.id)">删除 <i class="el-icon-remove-outline"></i></el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="padding: 10px">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>
  <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%" >
    <el-form :model="form" label-width="80px" size="small">
      <el-form-item label="用户名" >
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="地址" >
        <el-input v-model="form.address" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" >
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary"  @click="save">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "User",
  data(){
    return{
      tableData:[],
      total:0,
      pageNum:1,
      pageSize:2,
      username:"",
      address:"",
      dialogFormVisible:false,
      form:{},
      mutipleselection:[]
    }
  },
  created() {
    //请求分页查询数据
    this.load()
    request.post("/order/getorder?id=1"
    ).then(res=>{
      console.log(res)
    })
  },
  methods:{
    search(){
      this.pageNum=1;
      this.load();
    },
    handleCurrentChange(pageNum){
      console.log(pageNum)
      this.pageNum=pageNum;
      this.load()
    },
    handleSizeChange(val){
      this.pageSize=val;
      this.load()
    },
    load(){
      //请求分页查询数据
      request.get("/user/page",{params:{pageNum:this.pageNum, pageSize:this.pageSize, username:this.username}
      }).then(res=>{
        console.log(res)
        this.tableData=res.records
        this.total=res.total;
      })
      // fetch("http://localhost:9090/user/page?pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&username="+this.username+"").then(res=>res.json()).then(res=> {
      //       console.log(res);
      //       this.tableData = res.records;
      //       this.total=res.total;
      //     }
      // )
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
      request.delete("/user/"+id).then(res=>{
        if (res){
          this.$message.success("删除成功！")
        }
        this.load();
      })

    },
    save(){
      request.post("/user",this.form).then(res=>{
        if (res){
          this.$message.success("新增成功！")
        }
        else {
          this.$message.error("新增失败！")
        }
        this.dialogFormVisible=false;

      })
    },
    handleSelectionChange(val){

      this.mutipleselection=val;
      console.log(this.mutipleselection)
    },
    delbatch(){
      let ids=this.mutipleselection.map(v=>v.id);
      console.log(ids)
      request.post("/user/del/batch",ids).then(res=>{
        if(res){
          this.$message.success("删除成功！")
        }
        else {
          this.$message.error("删除失败！")
        }
      })
    }
  }

}
</script>

<style scoped>

</style>
