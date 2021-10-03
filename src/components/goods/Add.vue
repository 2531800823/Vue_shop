<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert
        title="添加商品信息"
        type="info"
        effect="dark"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- 进度条 -->
      <el-steps
        space
        :active="step - 0"
        align-center
        finish-status="success"
        class="jindu"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="addForm"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="step"
          :before-leave="qiehuan"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="props"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="action"
              :headers="headers"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="addBtn" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title=" 图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      step: 0,
      //   表单
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      //   表单验证
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
      //   级联选择器的数据
      cateList: [],
      //   级联选择器配置
      props: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      //   选中tab栏的下标]
      tabIndex: "0",
      //   动态属性
      manyTableData: [],
      //   静态属性
      onlyTableData: [],
      // 上传图片地址
      action: "http://127.0.0.1:8888/api/private/v1/upload",
      // 请求头的token
      headers: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible: false,
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories")
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    // 级联选择器发生变化
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error("必须选中第3级菜单")
        this.addForm.goods_cat = []
        return
      }
    },
    // tab栏切换，如果没有选中级联选择就不让
    qiehuan(newData, oldData) {
      if (oldData == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error("必须选中第3级菜单")
        return false
      }
      this.tabIndex = newData
    },
    // tab点击事件
    async tabClick() {
      if (this.tabIndex == 1) {
        //   动态属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
        })
        this.manyTableData = res.data
      } else if (this.tabIndex == 2) {
        //   静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex((x) => x === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 图片上传成功
    handleSuccess(data) {
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg)
        this.addForm.pics.push(data.data.tmp_path)
      }
    },
    // 添加提交
    add() {
      this.$refs.addFormRef.validate(async (vaild) => {
        if (!vaild) {
          return this.$message.error("请填写表单必填项")
        }

        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          }
          this.addForm.attrs.push(newInfo)
        })

        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addForm.attrs.push(newInfo)
        })
        const addFormClone = { ...this.addForm }
        addFormClone.goods_cat = addFormClone.goods_cat.join(",")
        console.log(addFormClone)
        const { data: res } = await this.$http.post("goods", addFormClone)

        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)

        this.$router.push("/goods")
      })
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.jindu {
  margin-top: 30px;
  width: 100%;
}
.addForm {
  margin-top: 20px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 20px;
}
</style>