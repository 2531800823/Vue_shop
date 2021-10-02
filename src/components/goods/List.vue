<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="cleanQuery"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="seach"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品重量" width="95">
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteList(scope.row.goods_id)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getList()
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagesize: 10,
        pagenum: 1,
      },
      //   商品列表
      goodList: [],
      //   总条数
      total: 0,
    }
  },
  methods: {
    //   获取数据列表
    async getList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.total = res.data.total
      this.goodList = res.data.goods
    },
    // 当前分页发生变化
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getList()
    },
    // 当前条数发生变化
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getList()
    },
    // 添加商品
    addGoods() {
      this.$router.push("./add")
    },
    // 搜索商品
    seach() {
      this.getList()
    },
    // 清空搜索
    cleanQuery() {
      this.queryInfo.query = ""
      this.getList()
    },
    // 删除商品
    async deleteList(id) {
      const confirm = await this.$confirm(
        "此操作将永久删除，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((e) => e)

      if (confirm !== "confirm") return this.$message.info("删除已取消")

      const { data: res } = await this.$http.delete("goods/" + id)

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)

      this.getList()
    },
  },
}
</script>

<style lang="less" scoped>
</style>