<template>
  <div>
    <div style="padding: 10px">
      <el-select v-model="value" placeholder="菜品种类选择" @change="load()">
        <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
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
      <el-table-column prop="merchID" label="菜品编号" width="140">
      </el-table-column>
      <el-table-column prop="fullname" label="菜品名称" width="140">
      </el-table-column>
      <el-table-column prop="kind" label="菜品种类" width="120">
      </el-table-column>
      <el-table-column prop="unitCost" label="单价">
      </el-table-column>
      <el-table-column prop="merchAvatar" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.merchAvatar" width="100" height="100" class="cover" />
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
          <el-button type="danger" @click="handleDelete(scope.row.merchID)">删除 <i class="el-icon-remove-outline"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
    <el-dialog title="餐品信息" :visible.sync="dialogFormVisible" width="60%" >
      <el-form :model="form" label-width="100px" size="small" ref="numberValidateForm">
        <el-form-item label="餐品种类" >
          <el-select v-model="value0"
                     filterable
                     allow-create
                     default-first-option
                     placeholder="菜品种类选择"
                     @change="saveKind()">
            <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="餐品名称" >
          <el-input v-model="form.fullname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单价"
                      prop="unitCost"
                      :rules="[
      { required: true, message: '单价不能为空'},
      { type: 'number', message: '单价必须为数字值'}
    ]" >
          <el-input v-model.number="form.unitCost" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="配料表" >
          <el-input v-model="form.chargeMixture" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="餐品详情描述" >
          <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="form.detail">
          </el-input>
        </el-form-item>
        <el-form-item label="添加商品图片" >
          <el-upload
              class="avatar-uploader"
              :action="'http://localhost:9090/file/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
          >
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="save('numberValidateForm')">确 定</el-button>
      </div>
    </el-dialog>
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
      value:'',
      total:0,
      pageNum:1,
      pageSize:5,
      username:"",
      address:"",
      dialogFormVisible:false,
      form:{},
      mutipleselection:[],
      avatarUrl:'',
      value0:'',
    }
  },
  created() {
   this.load()
  },
  methods:{

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
      request.get("/merch/page",{params:{pageNum:this.pageNum, pageSize:this.pageSize, merchKind:this.value}
      }).then(res=>{
        console.log(res)
        this.tableData=res.records
        this.total=res.total;
      })
      request.get("/merch/getMerchKind").then(res=>{
        this.options=res.data;
      })
    },
    handleAdd(){
      this.dialogFormVisible=true;
      this.form={};
      this.avatarUrl="";
      this.value0=""
    },
    handleEdit(row){
      this.value0=row.kind
      this.form=row;
      this.avatarUrl=row.merchAvatar
      this.dialogFormVisible=true;
      this.load()
    },
    handleDelete(id){
      request.delete("/merch/"+id).then(res=>{
        if (res){
          this.$message.success("删除成功！")
        }
        this.load();
      })

    },
    save(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
        } else {
          return false;
        }
      });

    },
    handleSelectionChange(val){

      this.mutipleselection=val;
      console.log(this.mutipleselection)
    },
    delbatch(){
      let ids=this.mutipleselection.map(v=>v.merchID);
      console.log(ids)
      request.post("/merch/del/batch",ids).then(res=>{
        if(res){
          this.$message.success("删除成功！")
        }
        else {
          this.$message.error("删除失败！")
        }
      })
    },
    handleAvatarSuccess(res){
        this.avatarUrl=res
      this.form.merchAvatar=res
    },
    saveKind(){
      this.form.kind=this.value0
    },
    filtermethod(val){
      console.log('val')
    }
  }

}
</script>

<style scoped>

</style>
