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
      <el-button type="text" @click="merchCardialogFormVisible = true">购物车</el-button>
      <el-button type="success" @click="allMerch()">全部菜单</el-button>
    </div>


    <el-table :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="merchAvatar" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.merchAvatar" width="100" height="100" class="cover"/>
        </template>
      </el-table-column>
      <el-table-column prop="fullname" label="菜品名称" width="140">
      </el-table-column>
      <el-table-column prop="kind" label="菜品种类" width="120">
      </el-table-column>
      <el-table-column prop="unitCost" label="单价">
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="success" @click="handleDetail(scope.row)">查看详情 <i class="el-icon-edit"></i></el-button>
          <el-input-number v-model="scope.row.num0" controls-position="right" @change="handleChange" :min="1"
                           :max="100"></el-input-number>
          <el-button type="danger" @click="handleOrder(scope.row)">加入购物车 <i class="el-icon-remove-outline"></i>
          </el-button>
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
    <el-dialog title="" :visible.sync="dialogFormVisible" width="60%">
      <el-card class="box-card">
        <div class="text item">
          <el-descriptions title="餐品详情">
            <el-descriptions-item label="餐品名称">{{ this.merchDetail.fullname }}</el-descriptions-item>
            <el-descriptions-item label="单价">￥{{ this.merchDetail.unitCost }}</el-descriptions-item>
            <el-descriptions-item label="配料">{{ this.merchDetail.chargeMixture }}</el-descriptions-item>
            <el-descriptions-item label="老板推荐">{{ this.merchDetail.detail }}</el-descriptions-item>

            <el-descriptions-item label="">
              <div class="demo-image">
                <div class="block" v-for="fit in fits" :key="fit">
                  <span class="demonstration"></span>
                  <el-image
                      style="width: 500px; height: 500px"
                      :src="avatarUrl"
                      :fit="fit"></el-image>
                </div>
              </div>
            </el-descriptions-item>

          </el-descriptions>
        </div>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="购物车" :visible.sync="merchCardialogFormVisible">
      <el-table :data="orderCar"
                border
                show-summary>
        <el-table-column property="count" label="数量" width="150"></el-table-column>
        <el-table-column property="merchName" label="商品名称" width="200"></el-table-column>
        <el-table-column property="sum" label="价格" width="200"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="danger" @click="handleDelete(scope.row.merchID)">移出购物车 <i
                class="el-icon-remove-outline"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="merchCardialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitOrder">确认订单</el-button>
        <el-button type="info" @click="check">我想配送</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请填写你的收货信息" :visible.sync="takeOutVisable">
      <el-form :model="userinfo">
        <el-form-item label="你的昵称" :label-width="formLabelWidth">
          <el-input v-model="userinfo.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input v-model="userinfo.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" :label-width="formLabelWidth">
          <el-input v-model="userinfo.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="takeOutVisable = false">取 消</el-button>
        <el-button type="primary" @click="submitOrder">确认订单</el-button>
      </div>
    </el-dialog>
<!--历史订单弹出框
-->
    <div class="center">
      <vs-dialog v-model="active">
        <template #header>
          <h4 class="not-margin">
            你上一次的<b>用餐：</b>
          </h4>
        </template>


        <div class="con-form">
          <div class="center examplex">
            <vs-table striped>
              <template #thead>
                <vs-tr>
                  <vs-th>
                    菜品
                  </vs-th>
                  <vs-th>
                    数量
                  </vs-th>
                  <vs-th>
                    总价
                  </vs-th>
                </vs-tr>
              </template>
              <template #tbody>
                <vs-tr
                    :key="i"
                    v-for="(tr, i) in orders"
                    :data="tr"
                >
                  <vs-td>
                    {{ tr.fullname }}
                  </vs-td>
                  <vs-td>
                    {{ tr.count }}
                  </vs-td>
                  <vs-td>
                    {{ tr.sum }}￥
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </div>
        </div>

        <template #footer>
          <div class="footer-dialog">
            <vs-button block @click="addRecentOrderToShopCar">
              将他们加入购物车
            </vs-button>

          </div>
        </template>
      </vs-dialog>
    </div>
  </div>


</template>
<script>
import request from "@/utils/request";
import MyModel from "@/components/MyModel";

export default {
  name: "menu",

  data() {
    return {
      tableData: [],
      options: [],
      merchDetail: {},
      value: '',
      total: 0,
      pageNum: 1,
      pageSize: 5,
      username: "",
      address: "",
      dialogFormVisible: false,
      form: {},
      userinfo: {},
      mutipleselection: [],
      avatarUrl: '',
      value0: '',
      fits: ['cover'],
      orderCar: [],
      merchCardialogFormVisible: false,
      takeOutState: false,
      takeOutVisable: false,
      formLabelWidth: '120px',
      active: false,
      email: '',
      password: '',
      remember: false,
      orders: [
      ]
    }
  },
  created() {
    this.load()
    this.showRecentOrder()
  },
  methods: {

    handleCurrentChange(pageNum) {
      console.log(pageNum)
      this.pageNum = pageNum;
      this.load()
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.load()
    },
    allMerch() {
      this.pageNum = 1
      this.pageSize = 5
      this.value = ''
      this.load()
    },
    load() {
      //请求分页查询数据
      request.get("/merch/page", {
        params: {pageNum: this.pageNum, pageSize: this.pageSize, merchKind: this.value}
      }).then(res => {
        console.log(res)
        this.tableData = res.records
        this.total = res.total;
      })
      request.get("/merch/getMerchKind").then(res => {
        this.options = res.data;
      })
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.form = {};
      this.avatarUrl = "";
      this.value0 = ""
    },
    handleEdit(row) {
      this.value0 = row.kind
      this.form = row;
      this.avatarUrl = row.merchAvatar
      this.dialogFormVisible = true;
      this.load()
    },
    handleDetail(row) {
      console.log(row)
      this.dialogFormVisible = true
      this.merchDetail = row
      this.avatarUrl = row.merchAvatar
    },
    handleOrder(row) {
      let order = {};
      order.merchID = row.merchID
      order.merchName = row.fullname;
      order.count = row.num0;
      order.sum = row.num0 * row.unitCost
      this.orderCar.push(order)
      console.log(this.orderCar)
    },
    showRecentOrder() {
      let token;
      let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      token = user.token
      request.get("/order/getRecentOrder", {params: {token: token}}).then(res => {
        if (res.length !== 0) {
          console.log(res)
          this.active=true
          this.orders=res
        }
      })
    },
    addRecentOrderToShopCar() {
      let token;
      let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      token = user.token
      request.get("/order/getRecentOrder", {params: {token: token}}).then(res => {
        if (res.length !== 0) {
          console.log(res)
          for (var i = 0; i < res.length; i++) {
            let order = {}
            order.merchID = res[i].merchId
            order.merchName = res[i].fullname;
            order.count = res[i].count;
            order.sum = res[i].count
            this.orderCar.push(order)
          }
        }
        this.active=false
      })
    },
    handleDelete(merchID) {
      let line = this.orderCar.map(item => item.merchID).indexOf(merchID)
      this.orderCar.splice(line, 1)
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

      this.mutipleselection = val;
      console.log(this.mutipleselection)
    },
    delbatch() {
      let ids = this.mutipleselection.map(v => v.merchID);
      console.log(ids)
      request.post("/merch/del/batch", ids).then(res => {
        if (res) {
          this.$message.success("删除成功！")
        } else {
          this.$message.error("删除失败！")
        }
      })
    },
    handleAvatarSuccess(res) {
      this.avatarUrl = res
      this.form.merchAvatar = res
    },
    saveKind() {
      this.form.kind = this.value0
    },
    filtermethod(val) {
      console.log('val')
    },
    handleChange(value) {
      console.log(value);
    },
    submitOrder() {
      let DTO = {};
      let merchId = [];
      let oc;
      let count;
      let token;
      let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      token = user.token
      for (oc in this.orderCar) {
        for (let i = 0; i < this.orderCar[oc].count; i++) {
          merchId.push(this.orderCar[oc].merchID)
        }
      }
      DTO.merchId = merchId;
      DTO.token = token;
      DTO.takeOutState = this.takeOutState;
      if (this.takeOutState === true) {
        DTO.address = this.userinfo.address;
        DTO.phone = this.userinfo.phone;
        DTO.nickName = this.userinfo.username;
      }
      request.post("/order/saveorder", DTO).then(res => {
        console.log(res)
        request.get("/order/genOneOrder", {params: {orderId: res.data}}).then(res => {
          console.log(res)
          request.get("/order/orderMerchSumUpdate").then(res => {
            console.log(res)
          })
        })
      })
      this.$message.success("点餐成功!")
      this.merchCardialogFormVisible = false;

    },
    check() {
      this.takeOutState = true;
      console.log(this.takeOutState);
      this.takeOutVisable = true;
      this.merchCardialogFormVisible = false;
      let token;
      let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      token = user.token
      request.get("/user/getIdByToken/" + token).then(res => {
        let userId = res.data
        request.get("/user/" + userId).then(res => {
          this.userinfo = res
        })
      })

    }

  }

}
</script>

<style scoped>

</style>
