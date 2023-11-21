<template>
  <div>
    <b-container fluid>
      <!-- User Interface controls -->
      <b-row>
        <b-col lg="6" class="my-1">
          <b-form-group
              label="排序"
              label-for="sort-by-select"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
              v-slot="{ ariaDescribedby }"
          >
            <b-input-group size="sm">
              <b-form-select
                  id="sort-by-select"
                  v-model="sortBy"
                  :options="sortOptions"
                  :aria-describedby="ariaDescribedby"
                  class="w-75"
              >
                <template #first>
                  <option value="">-- none --</option>
                </template>
              </b-form-select>

              <b-form-select
                  v-model="sortDesc"
                  :disabled="!sortBy"
                  :aria-describedby="ariaDescribedby"
                  size="sm"
                  class="w-25"
              >
                <option :value="false">升序</option>
                <option :value="true">降序</option>
              </b-form-select>
            </b-input-group>
          </b-form-group>
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
        <!-- Main table element -->
        <b-table
            :items="items"
            :fields="fields"

            :current-page="currentPage"
            :per-page="perPage"

            :filter="filter"
            :filter-included-fields="filterOn"

            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"

            stacked="md"
            show-empty
            small
            @filtered="onFiltered"
        >
          <template #cell(actions)="row">
            <b-button size="sm" @click="row.toggleDetails">
              {{ row.detailsShowing ? '隐藏' : '显示' }} 用户详情
            </b-button>
          </template>

          <template #row-details="r">
            <b-card>
              <div style="display: flex">
              <div class="mb-2">
                <b-avatar :src="r.item.avatarUrl" size="6rem" ></b-avatar>
              </div>
              <b-button size="sm" @click="showUser(r.item)" class="mr-1">
                显示详情
              </b-button>
              </div>
            </b-card>
          </template>
        </b-table>
        <b-col sm="5" md="6" class="my-1">
          <b-form-group
              label="每页几条"
              label-for="per-page-select"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
          >
            <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>

        <b-col sm="7" md="6" class="my-1">
          <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
          ></b-pagination>
        </b-col>
      </b-row>

      <!-- Info modal -->
      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
    </b-container>

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

<script>


import request from "@/utils/request";

export default {
  data() {
    return {
      items: [

      ],
      fields: [
        { key: 'id', label: '用户编号', sortable: true, sortDirection: 'desc' },
        { key: 'username', label: '用户昵称', sortable: true, class: 'text-center' },
        {
          key: 'phone',
          label: '手机号',
          sortable: true,
        },
        { key: 'address', label: '地址', sortable: true, class: 'text-center' },
        { key: 'actions', label: 'Actions' }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 2,
      pageOptions: [2, 10, 15, { value: 100, text: "显示全部" }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      userDetail:{},
      active:false,
      user:{}
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
    }
  },
  created() {
    this.getAllUser()
  },
  methods: {
    getAllUser(){
      request.get("/user").then(res=>{
        this.items=res
        this.totalRows=res.length
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
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>
