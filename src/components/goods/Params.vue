<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三季分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>

      <!-- 商品分类区域 -->
      <el-row class="elCol">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectOptions"
            :options="cateList"
            :props="catePorp"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab区域 -->
      <el-tabs v-model="tabName" @tab-click="tabHandle">
        <el-tab-pane label="用户管理" name="many">
          <el-button
            type="primary"
            :disabled="isDisabled"
            @click="addDialog = true"
            >添加参数</el-button
          >
          <!-- 动态表格 -->
          <el-table :data="manyTabName" border stripe>
            <el-table-column type="expand" label="动态参数">
              <template slot-scope="scope">
                <el-tag
                  class="center"
                  closable
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="index"
                  :type="tag.type"
                  @close="deleteShuxing(index, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="inputTag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ 添加属性值</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  @click="updataTab(scope.row)"
                  icon="el-icon-edit"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteTab(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only">
          <el-button
            type="primary"
            :disabled="isDisabled"
            @click="addDialog = true"
            >添加属性</el-button
          >
          <!-- 静态表格 -->
          <el-table :data="onlyTabName" border stripe>
            <el-table-column type="expand" label="动态参数">
              <template slot-scope="scope">
                <el-tag
                  class="center"
                  closable
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="index"
                  :type="tag.type"
                  @close="deleteShuxing(index, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="inputTag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ 添加属性值</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="updataTab(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteTab(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数、添加属性 对话框 -->
      <el-dialog
        :title="'请添加' + isShuCan"
        :visible.sync="addDialog"
        width="50%"
        @close="addHandleClose"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item label="活动名称" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改参数的对话框 -->
      <el-dialog
        :title="'请修改' + isShuCan"
        :visible.sync="updataDialog"
        width="50%"
        @close="updataHandleClose"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item label="活动名称" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updataDialog = false">取 消</el-button>
          <el-button type="primary" @click="updataSubmit">确 定</el-button>
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
    return {
      // 商品列表
      cateList: [],
      //   数据显示的方式
      catePorp: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的值
      selectOptions: [],
      //   tab选中值
      tabName: "many",
      //   静态数据
      onlyTabName: [],
      //   动态数据
      manyTabName: [],
      //   添加参数、添加属性 对话框
      addDialog: false,
      //   添加参数、添加属性 表单
      addForm: {
        attr_name: "",
      },
      //   表单验证
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
      // 修改对话框
      updataDialog: false,
      updateId: "",
    }
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get("categories")
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    // 节点发生变化 如果不是3级就重置
    handleChange() {
      this.getParamsData()
    },
    // tab点击事件
    tabHandle() {
      this.getParamsData()
    },
    // 获取参数数据
    async getParamsData() {
      if (this.selectOptions.length !== 3) {
        this.selectOptions = []
        this.$message.warning("只允许为第三季分类设置相关参数")
        this.onlyTabName = []
        this.manyTabName = []
        this.selectOptions = []

        return
      }
      //   没有返回就是三级分类
      const { data: res } = await this.$http.get(
        `categories/${this.selectOptions[2]}/attributes`,
        {
          params: {
            sel: this.tabName,
          },
        }
      )
      if (res.meta.status !== 200) return this.$$message.error(res.meta.msg)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
        item.inputVisible = false
        item.inputValue = ""
      })
      if (this.tabName === "many") {
        //   不是动态数据就是静态数据
        this.manyTabName = res.data
      } else {
        this.onlyTabName = res.data
      }
      // console.log(this.manyTabName)
    },
    // 关闭添加参数对话框
    addHandleClose() {
      this.$refs.addFormRef.resetFields()
      this.addForm.attr_name = ""
      this.addDialog = false
    },
    // 添加de按钮
    async addSubmit() {
      const flag = await this.$refs.addFormRef.validate().catch((e) => e)
      if (!flag) return

      const { data: res } = await this.$http.post(
        `categories/${this.selectOptions[2]}/attributes`,
        {
          attr_name: this.addForm.attr_name,
          attr_sel: this.tabName,
        }
      )
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)

      this.$message.success("添加成功")
      this.getParamsData()
      this.addDialog = false
    },
    // 修改表格数据
    updataTab(id) {
      this.updataDialog = true
      this.updataId = id.attr_id
      this.addForm.attr_name = id.attr_name
      // console.log(id)
      // console.log(this.tabName)
    },
    // 修改对话框
    async updataSubmit() {
      const flag = await this.$refs.addFormRef.validate().catch((e) => e)
      if (!flag) return
      const { data: res } = await this.$http.put(
        `categories/${this.selectOptions[2]}/attributes/${this.updataId}`,
        {
          attr_name: this.addForm.attr_name,
          attr_sel: this.tabName,
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)

      this.getParamsData()
      this.updataDialog = false
      // console.log(res)
      // console.log(this.tabName)
      // console.log(this.updataId)
      // console.log(this.selectOptions[2])
    },
    // 修改对话框的关闭事件
    updataHandleClose() {
      this.addForm.attr_name = ""
      this.updataDialog = false
    },
    // 删除参数
    async deleteTab(id) {
      // console.log(id)
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
      const { data: res } = await this.$http.delete(
        `categories/${this.selectOptions[2]}/attributes/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)

      this.getParamsData()

      console.log(res)
    },
    // 添加属性值
    async handleInputConfirm(user) {
      user.inputVisible = false
      if (user.inputValue.trim().length === 0) {
        user.inputValue = ""
        return
      }
      user.attr_vals.push(user.inputValue.trim())
      user.inputValue = ""
      const { data: res } = await this.$http.put(
        `categories/${this.selectOptions[2]}/attributes/${user.attr_id}`,
        {
          attr_name: user.attr_name,
          attr_sel: this.tabName,
          attr_vals: user.attr_vals.join(" "),
        }
      )

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.$message.success("添加成功")
    },
    // 显示添加属性值
    showInput(user) {
      user.inputVisible = true

      // 当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除属性值
    async deleteShuxing(index, user) {
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
      user.attr_vals.splice(index, 1)
      const { data: res } = await this.$http.put(
        `categories/${this.selectOptions[2]}/attributes/${user.attr_id}`,
        {
          attr_name: user.attr_name,
          attr_sel: this.tabName,
          attr_vals: user.attr_vals.join(" "),
        }
      )

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.$message.success("删除成功")
    },
  },
  computed: {
    isDisabled() {
      if (this.selectOptions.length !== 3) {
        return true
      }
      return false
    },
    isShuCan() {
      if (this.tabName === "many") {
        return "参数"
      }
      return "属性"
    },
  },
}
</script>

<style lang="less" scoped>
.elCol {
  margin: 15px 0;
}
.center {
  margin: 0 20px;
  margin-left: 50px;
}
.inputTag {
  width: 100px;
}
</style>