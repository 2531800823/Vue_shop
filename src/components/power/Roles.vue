<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col
          ><el-button type="primary" @click="dialogVisible = true"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['botBor', index === 0 ? 'topBor' : '', 'dis']"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteQuan(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二 三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index1 === 0 ? '' : 'topBor', 'dis']"
                  v-for="(item1, index1) in item.children"
                  :key="item1.id"
                >
                  <!-- 2级 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="deleteQuan(scope.row, item1.id)"
                      >{{ item1.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 3级 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      type="warning"
                      closable
                      @close="deleteQuan(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="index"
          width="80px"
          type="index"
        ></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="技术负责人" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="500px">
          <template slot-scope="scope">
            <el-button
              size=" small "
              type="primary"
              @click="updataUser(scope.row.id)"
              ><i class="el-icon-edit"></i> 编辑</el-button
            >
            <el-button type="danger" @click="deleteUser(scope.row.id)"
              ><i class="el-icon-delete"></i>删除</el-button
            >
            <el-button type="warning" @click="showSetRights(scope.row)"
              ><i class="el-icon-s-tools"></i>分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加角色" :visible.sync="dialogVisible" width="30%">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="ruleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="ruleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="reset">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog title="修改角色" :visible.sync="UpdataVisible" width="30%">
        <el-form
          ref="UpdataRef"
          :rules="rules"
          :model="updataFrom"
          label-width="80px"
        >
          <el-form-item label="id" prop="id">
            <el-input v-model="updataFrom.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="updataFrom.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="updataFrom.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="UpdataVisible = false">取 消</el-button>
          <el-button type="primary" @click="updataSubmit">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色权限 -->
      <el-dialog
        title="分配角色权限"
        :visible.sync="jueSetRights"
        width="50%"
        @close="setRightsList"
      >
        <el-tree
          :data="rightsList"
          :props="treeProps"
          node-key="id"
          show-checkbox
          default-expand-all
          :default-checked-keys="morenQuan"
          ref="addQuan"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="jueSetRights = false">取 消</el-button>
          <el-button type="primary" @click="submitQuan">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      //   添加用户对话框
      dialogVisible: false,
      //   添加用户表单数据
      ruleForm: {
        roleName: "",
        roleDesc: "",
      },
      //   添加用户的验证数据
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      //修改角色对话框
      UpdataVisible: false,
      // 修改用户表单
      updataFrom: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
      // 分配角色权限对话框
      jueSetRights: false,
      // 所有权限的数据
      rightsList: [],
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 分配权限的默认已选择权限
      morenQuan: [],
      // 添加权限需要角色的id
      userId: "",
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get("roles")
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleList = res.data
    },
    // 添加用户取消重置
    reset() {
      this.$refs.ruleFormRef.resetFields()
      this.dialogVisible = false
    },
    // 添加用户
    async addUser() {
      let status = await this.$refs.ruleFormRef.validate()
      if (!status) return this.$message.error("输入错误")

      const { data: res } = await this.$http.post("roles", this.ruleForm)
      console.log(res)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)

      this.$message.success("添加成功")
      this.dialogVisible = false
      this.getList()
    },
    // 修改用角色
    async updataUser(id) {
      this.UpdataVisible = true
      let { data: form } = await this.$http.get("roles/" + id)
      if (form.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.updataFrom.id = id
      this.updataFrom.roleName = form.data.roleName
      this.updataFrom.roleDesc = form.data.roleDesc
    },
    // 提交修改用户
    async updataSubmit() {
      let status = await this.$refs.UpdataRef.validate()
      if (!status) return this.$message.error("输入错误")

      let { data: res } = await this.$http.put(
        "roles/" + this.updataFrom.id,
        this.updataFrom
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.$message.success("修改角色成功")
      this.UpdataVisible = false
      this.getList()
    },
    // 删除角色
    async deleteUser(id) {
      const confirm = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
        // 不过异常并返回 错误对象
      ).catch((err) => err)

      // 点击确定返回confirm
      // 点击取消不过异常 cancel
      if (confirm !== "confirm") return this.$message.info("已取消删除")
      const { data: res } = await this.$http.delete("roles/" + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success("删除角色成功")
      this.getList()
    },
    // 删除权限
    async deleteQuan(user, id) {
      const confirm = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
        // 不过异常并返回 错误对象
      ).catch((err) => err)
      console.log(user, id)
      // 点击确定返回confirm
      // 点击取消不过异常 cancel
      if (confirm !== "confirm") return this.$message.info("已取消删除")
      const { data: res } = await this.$http.delete(
        `roles/${user.id}/rights/${id}`
      )
      if (res.meta.status !== 200) return this.$message.info("取消权限失败")
      user.children = res.data
      this.$message.success("删除权限成功")
    },
    // 添加分配权限
    async showSetRights(user) {
      const { data: res } = await this.$http.get("rights/tree")
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.jueSetRights = true
      this.rightsList = res.data
      // 递归查找所有已经选中的权限
      this.digui(user, this.morenQuan)
      this.userId = user.id
    },
    // 递归查找 默认选择权限
    digui(item, arr) {
      if (!item.children) return arr.push(item.id)
      item.children.forEach((item) => {
        this.digui(item, arr)
      })
    },
    // 关闭添加权限对话框
    setRightsList() {
      this.morenQuan = []
    },
    // 确定添加权限
    async submitQuan() {
      const List = [
        ...this.$refs.addQuan.getCheckedKeys(),
        ...this.$refs.addQuan.getHalfCheckedKeys(),
      ]

      const { data: res } = await this.$http.post(
        `roles/${this.userId}/rights`,
        { rids: List.join(",") }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.$message.success("添加成功")
      this.jueSetRights = false
      this.getList()
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 15px;
}

.topBor {
  border-top: 1px solid #eee;
}
.botBor {
  border-bottom: 1px solid #eee;
  margin: 10px 50px;
}
.dis {
  display: flex;
  align-items: center;
}
</style>