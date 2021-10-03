<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索 -->
      <el-input placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>

      <!-- table 区域 -->
      <el-table :data="orderList" stripe border="">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="180"
        ></el-table-column>
        <el-table-column prop="user_id" label="是否付款" width="180">
          <template slot-scope="scope">
            <el-button v-if="scope.row.user_id" type="primary"
              >已付款</el-button
            >
            <el-button v-else type="warning">未付款 </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="80"
        ></el-table-column>
        <el-table-column label="下单时间" width="180">
          <template slot-scope="scope">{{
            scope.row.create_time | dataFilter
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="dialogVisible = true"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              @click="dingwei"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="50%"
      @closed="closeDialog"
    >
      <el-form
        :model="updataForm"
        :rules="updataFormRules"
        ref="updataFormRef"
        class="demo-ruleForm"
        label-width="100px"
      >
        <el-form-item label="省市区" prop="adress">
          <el-cascader
            v-model="updataForm.adress"
            :options="city"
            class="city"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="详细地址" prop="adress2">
          <el-input v-model="updataForm.adress2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="wuLiu" width="50%">
      <span>接口错误</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="wuLiu = false">取 消</el-button>
        <el-button type="primary" @click="wuLiu = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./city.js"
var city = cityData.city()
export default {
  created() {
    this.getList()
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      //   修改地址对话框
      dialogVisible: false,
      //   修改地址表单
      updataForm: {
        adress: [],
        adress2: "",
      },
      updataFormRules: {
        adress: [
          { required: true, message: "请输入省市区县", trigger: "blur" },
        ],
        adress2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      //   城市
      city,
      //   物流信息对话框
      wuLiu: false,
    }
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getList()
    },
    // 关闭修改地址对话框
    closeDialog() {
      this.$refs.updataFormRef.resetFields()
    },
    // 操作物流信息对话框
    async dingwei() {
      this.wuLiu = true

      //   const { data: res } = await this.$http.get("/kuaidi/1106975712662")
      //   if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //   console.log(res.data)
    },
  },
}
</script>

<style lang="less" scoped>
.input-with-select {
  width: 30%;
}
.city {
  width: 100%;
}
</style>