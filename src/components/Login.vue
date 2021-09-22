<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="./../assets/logo.png" alt="" />
      </div>

      <!-- 登录表单 -->
      <el-form
        label-width="0px"
        :model="loginFor"
        :rules="rules"
        class="login_form"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginFor.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginFor.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="yanZheng">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginFor: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "长度在 5 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    }
  },
  methods: {
    // 重置表单
    resetForm() {
      this.$refs.loginFormRef.resetField()
    },
    //验证表单
    yanZheng() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.post("login", this.loginFor)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

        this.$message({ message: "恭喜你，登录成功", type: "success" })
        // 保存 token  到sessionStorage 这个是会话参数 关闭网页就没了 locaionStorage是一只在
        window.sessionStorage.setItem("token", res.data.token)

        // 跳转到/home页面
        this.$router.push("/home")
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    position: absolute;
    height: 130px;
    width: 130px;
    border-radius: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;

    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      background-color: #eee;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>