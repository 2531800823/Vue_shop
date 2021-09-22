<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6"
          ><el-button type="primary">添加用户</el-button></el-col
        >
      </el-row>
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
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
    }
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error("获取数据失败")
      this.userList = res.data.users
      this.total = res.data.total
      //   console.log(res)
    },
  },
}
</script>

<style>
</style>