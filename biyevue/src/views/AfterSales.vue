<template>
  <div>
    <b-container fluid>
      <!-- User Interface controls -->
      <b-row>

        <b-col lg="6" class="my-1">
      <h6>退款状态</h6>
      <b-form-select
          v-model="filter"
          size="sm"
          class="w-25"
      >
        <option value='已退款'>已退款</option>
        <option value='拒绝退款'>拒绝退款</option>
        <option value='等待审核'>等待审核</option>
      </b-form-select>
        </b-col>

        <b-col lg="6" class="my-1">
      <b-form-group
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
      >
        <b-input-group size="sm">
          <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="全局搜索"
          ></b-form-input>

          <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">重置</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
        </b-col>
      </b-row>


    <b-table striped hover :items="items" :fields="fields" :filter="filter"
             :filter-included-fields="filterOn">
      <template #cell(actions)="row">
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? '隐藏' : '显示' }} 订单详情
        </b-button>
      </template>
      <template #row-details="r">
        <b-card>
          <div class="demo-image__lazy">
            <el-image v-for="url in r.item.imgUrls" :key="url" :src="url" lazy
                      style="width: 290px; height: 250px"></el-image>
          </div>
          <div style="margin-right:0">
            <button size="sm" class="mr-1" @click="acceptRefund(r.item.tradeNo,r.item.sum,r.item.orderId)" v-if="r.item.refundState==='等待审核'">
              接受退款
            </button>
            <button size="sm" class="mr-1" @click="show(r.item.orderId)" v-if="r.item.refundState==='等待审核'">
              拒绝退款
            </button>
          </div>
        </b-card>
      </template>
    </b-table>
    </b-container>

    <el-dialog title="拒绝理由" :visible.sync="dialogTableVisible">
      <b-form-textarea
          id="textarea"
          v-model="text"
          placeholder="说点什么吧"
          rows="3"
          max-rows="6"
      ></b-form-textarea>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="refuseRefund()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "AfterSales",
  data() {
    return {
      items: [],
      fields: [{key: 'orderId', label: '订单号'},
        {key: 'orderThing', label: '订单内容'},
        {key: 'reason', label: '退款原因'},
        {key: 'orderDate', label: '订单时间', sortable: true, sortDirection: 'desc'},
        {key: 'sum', label: '订单总价', sortable: true, sortDirection: 'desc'},
        {key: 'actions', label: '操作'},
        {key: 'refundState', label: '退款状态'}
      ],
      filter: null,
      filterOn: [],
      dialogTableVisible: false,
      text: '',
      orderId: ''
    }
  },
  created() {
    this.getAllRefund()
  },
  methods: {
    getAllRefund() {
      request.get("/refund/getRefundDetailList").then(res => {
        console.log(res)
        for (var i = 0; i < res.length; i++) {
          if (res[i].refundState == 0) {
            res[i].refundState = '等待审核'
          } else if(res[i].refundState==1){
            res[i].refundState = '已退款'
          }else {
            res[i].refundState='拒绝退款'
          }
        }
        this.items = res
      })
    },
    acceptRefund(tradeNo, sum, id) {
      console.log(tradeNo)
      console.log(sum)
      request.get("/alipay/refundMoney", {params: {tradeNo: tradeNo, refundAmount: sum, orderId: id}}).then(res => {
        console.log(res.state)
        if (res.state == '200') {
          alert('退款成功！')
        } else {
          alert('退款失败！')
        }
      })
    },
    show(id) {
      this.dialogTableVisible = true
      this.orderId = id
    },
    refuseRefund() {
      this.dialogTableVisible = false
      let a = {}
      console.log()
      a.orderId = this.orderId
      a.refuseReason = this.text
      request.post("/refuse/insertRefuse", a).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
