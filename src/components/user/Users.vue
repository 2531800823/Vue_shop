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
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            v-model="queryInfo.query"
            @clear="getList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6"
          ><el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="getState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <!-- 删除 -->
            <el-button type="warning" icon="el-icon-delete"></el-button>
            <!-- 修改状态 -->
            <el-tooltip
              effect="dark"
              content="修改状态"
              placement="top"
              :enterable="false"
            >
              <el-button type="danger" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @closed="resetClosed"
      >
        <!-- 表单 -->
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addUser">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getList()
  },
  data() {
    // 邮箱验证规则
    var emailCheck = (rule, value, cb) => {
      let exp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (exp.test(value)) cb()
      cb(new Error("邮箱格式不正确"))
    }

    // 手机号验证规则
    var mobeilCheck = (rule, value, cb) => {
      let exp =
        /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (exp.test(value)) return cb()
      return cb(new Error("手机号格式不正确"))
    }
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 控制对话框的显示隐藏
      dialogVisible: false,
      //添加用户表单验证
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 表单验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "长度在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            validator: emailCheck,
            message: "请输入正确的邮箱码",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            validator: mobeilCheck,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
      },
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
    },
    // 改变 个数 触发
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getList()
    },
    // 改变 页数
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getList()
    },
    // 更新用户状态信息
    async getState(info) {
      const { data: res } = await this.$http.put(
        `users/${info.id}/state/${info.mg_state}`
      )
      if (res.meta.status === 200) return this.$message.success("修改成功")
      info.mg_state = !info.mg_state
      return this.$message.error("修改失败")
    },
    // 监听添加用户对话框关闭
    resetClosed() {
      this.$refs.ruleFormRef.resetFields()
    },
    // 添加用户确定
    addUser() {
      // 预校验
      this.$refs.ruleFormRef.validate(async (val) => {
        if (!val) return
        // 发起用户请求
        console.log(this.ruleForm)
        const { data: res } = await this.$http.post("users", this.ruleForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error("添加用户失败")
        this.$message.success("添加成功")
        this.dialogVisible = false
        this.getList()
      })
    },
  },
}
</script>

<style lang="less" secpod>
.el-table {
  margin-top: 20px;
}
</style>