<template>
  <div>
    <div style="padding: 10px">
      <div style="padding: 10px">
        <el-input style="width: 200px;" suffix-icon="el-icon-search" placeholder="餐品名称" v-model="orderThing"></el-input>
        <el-button class="ml-5" type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <div style="margin:10px 0">
      <el-button type="danger" @click="delbatch">批量删除 <i class="el-icon-remove-outline"></i></el-button>
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
      <el-table-column prop="payState" label="支付状态" sortable>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="danger" @click=handleRefund(scope.row.orderId) v-if="scope.row.payState==='已支付'">申请退款</el-button>
          <el-button type="success" @click="handlePay(scope.row)">支付 <i class="el-icon-remove-outline"></i></el-button>
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
    <div>


      <el-dialog title="退款申请" :visible.sync="dialogTableVisible">
        <div>
          <b-form-textarea
              id="textarea"
              v-model="text"
              placeholder="请输入退款理由"
              rows="3"
              max-rows="6"
          ></b-form-textarea>

          <el-upload
              :action="'http://localhost:9090/file/upload'"
              :on-success="handleAvatarSuccess"
              list-type="picture-card"
              :auto-upload="true">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url" alt=""
              >
              <span class="el-upload-list__item-actions">
        <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
        >
          <i class="el-icon-download"></i>
        </span>
        <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertRefund()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "menu",
  data() {
    return {
      tableData: [],
      options: [],
      orderThing: '',
      total: 0,
      pageNum: 1,
      pageSize: 10,
      dialogFormVisible: false,
      form: {},
      mutipleselection: [],
      daysum: '',
      flag: '',
      text: '',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      orderId: '',
      dialogTableVisible:false
    }
  },
  created() {
    this.load()
  },
  methods: {
    insertRefund(){
      request.get("/refund/insertRefund",{params:{reason:this.text,orderId:this.orderId}}).then(res=>{
        console.log(res)
        this.dialogTableVisible=false
      })
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.load()
      console.log(pageNum)
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.load()
    },
    search() {
      this.pageNum = 1
      this.flag = null
      this.load()

    },
    load() {
      //请求分页查询数据
      let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      let token = user.token
      request.get("/orderdetail/myOrderPage", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize, orderThing: this.orderThing, flag: this.flag, token: token
        }
      }).then(res => {
        // console.log(res)
        this.tableData = res.records
        this.total = res.total;
      })
      /*    request.get("/orderdetail/daysum").then(res=>{
            // console.log(res)
          })*/
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.form = {};
    },
    handleEdit(row) {
      this.form = row;
      this.dialogFormVisible = true;
      this.load()
    },
    //申请退款
    handleRefund(id) {
      this.dialogTableVisible=true
      console.log(id)
      this.orderId = id
    },
    handleDelete(id) {
      request.delete("/orderdetail/" + id).then(res => {
        if (res) {
          this.$message.success("删除成功！")
        }
        this.load();
      })

    },
    save() {
      request.post("/merch", this.form).then(res => {
        if (res) {
          this.$message.success("新增成功！")
          console.log(this.form)
        } else {
          this.$message.error("新增失败！")
        }
        this.dialogFormVisible = false;

      })
    },
    handleSelectionChange(val) {
      console.log(val)
      this.mutipleselection = val;
    },
    delbatch() {
      let ids = this.mutipleselection.map(v => v.orderId);
      // console.log(ids)
      request.post("/orderdetail/del/batch", ids).then(res => {
        if (res) {
          this.$message.success("删除成功！")
        } else {
          this.$message.error("删除失败！")
        }
      })
    },
    getOrderByDates(val) {
      this.pageNum = 1
      this.flag = val
      this.load()
      // this.flag=null
    },
    handlePay(row) {
      console.log(row.sum)
      console.log(row.orderId)
      console.log(row.orderThing)
      console.log(row.orderId)
      // ?alipayTraceNo=09090&subject=ui&totalAmount=50&traceNo=111222
      window.open("http://localhost:9090/alipay/pay?alipayTraceNo=" + row.orderId + "&subject=hello" + "&totalAmount=" + row.sum + "&traceNo=" + row.orderId)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      console.log(file)
      this.dialogVisible = true;
    },

    handleAvatarSuccess(res) {
      console.log("hdfhskdlhfksdhfslhflksadhflks")
      request.get("/refund-img/insertOrderIdAndImg", {params: {orderId: this.orderId, imgUrl: res}}).then(res => {
        console.log(res)
      })

    }
  }

}
</script>

<style scoped>

</style>
