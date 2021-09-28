<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="addGoodsDialog">添加分类</el-button>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treetable"
        :data="goodList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :index-text="'#'"
        :show-row-hover="false"
        show-index
        border
      >
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === true"
            style="color: lightgreen; font-size: 120px"
            class="el-icon-success"
          ></i>
          <i
            v-else
            style="color: red; font-size: 20px"
            class="el-icon-error"
          ></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="updataCate(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="query.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加商品分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addGoodsVisible"
        width="50%"
        @close="addCateDialogClose"
      >
        <!-- 分类表单 -->
        <el-form
          :model="addGoods"
          :rules="addGoodsRules"
          ref="addGoodsRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addGoods.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectOption"
              :options="parentCateList"
              :props="selectPorps"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addGoodsVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑的对话框 -->
      <el-dialog title="编辑分类" :visible.sync="updataDislog" width="50%">
        <el-form
          :model="updataForm"
          :rules="updataFormRules"
          ref="updataFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="updataForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updataDislog = false">取 消</el-button>
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
      goodList: [],
      //   查询条件
      query: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      //   为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 定义当前为模板列
          type: "template",
          //   这一列的模板名称
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      //   添加商品分类对话框
      addGoodsVisible: false,
      //   分类的表单
      addGoods: {
        cat_name: "",
        // 分类的id
        cat_pid: 0,
        // 分类的等级
        cat_level: 0,
      },
      //分类表单验证规则
      addGoodsRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //   添加分类 -- 父级分类
      parentCateList: [],
      //   选中的数据
      selectOption: "",
      //   porps 配置参数
      selectPorps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      // 编辑对话框
      updataDislog: false,
      // 编辑对话框表单
      updataForm: {
        name: "",
      },
      // 编辑对话框的验证
      updataFormRules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      // 编辑对话框 保存的id
      updataId: "",
    }
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.query,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodList = res.data.result
      this.total = res.data.total
    },
    // 分割个数发生变化
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.getList()
    },
    // 分割页数发生变化
    handleCurrentChange(newNum) {
      this.query.pagenum = newNum
      this.getList()
    },
    // 点击弹出添加分类对话框
    addGoodsDialog() {
      // 先发起父级分类的请求
      this.getParentCateList()
      this.addGoodsVisible = true
    },
    // 获取父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", { type: 2 })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
    },
    handleChange() {
      if (this.selectOption.length > 0) {
        this.addGoods.cat_pid = this.selectOption[this.selectOption.length - 1]
        this.addGoods.cat_level = this.selectOption.length
      } else {
        this.addGoods.cat_pid = 0
        this.addGoods.cat_level = 0
      }
    },
    // 关闭对话框 清空表单
    addCateDialogClose() {
      this.$refs.addGoodsRef.resetFields()
      this.addGoods.cat_pid = 0
      this.addGoods.cat_level = 0
      this.selectOption = []
    },
    // 添加分类按钮
    async addCate() {
      const { data: res } = await this.$http.post("categories", this.addGoods)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)

      this.$message.success("添加成功")
      this.addGoods.cat_pid = 0
      this.addGoods.cat_level = 0
      this.getList()

      this.addGoodsVisible = false
    },
    // 编辑点击对话框
    updataCate(user) {
      console.log(user)
      this.updataDislog = true
      this.updataId = user.cat_id
      this.updataForm.name = user.cat_name
    },
    // 编辑对话框 提交
    async updataSubmit() {
      const { data: res } = await this.$http.put(
        "categories/" + this.updataId,
        {
          cat_name: this.updataForm.name,
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.$message.success("更新成功")
      this.updataDislog = false
      this.getList()
    },
    async removeCate(id) {
      const confirm = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        })
      })
      if (confirm === "confirm") {
        const { data: res } = await this.$http.delete("categories/" + id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success("删除成功")
        // 跳转其他页也行 不然最后一页就一个数据删除没了 还停留在哪里
        this.query.pagenum = 1
        this.getList()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.treetable {
  margin-top: 20px;
}
</style>