<template>
  <div class="home-container">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div>
          <img src="./../assets/heima.png" alt="" />
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="exit">退出</el-button></el-header
      >

      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isNav ? '200px' : '64px'">
          <!-- 侧边栏 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            router
            :collapse-transition="false"
            :collapse="!isNav"
            :default-active="dePath"
          >
            <div class="toggleNav" @click="isNav = !isNav">|||</div>
            <el-submenu
              v-for="item in menuList"
              :index="item.id + ''"
              :key="item.id"
            >
              <!-- 1级菜单 -->
              <template slot="title">
                <i class="icon" :class="icon[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>

              <!-- 2级菜单 -->
              <el-menu-item
                :index="'/' + item1.path"
                v-for="item1 in item.children"
                :key="item1.id"
                @click="getItem(item1.path)"
              >
                <i class="iconfont icon-tijikongjian icon"></i>
                {{ item1.authName }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      icon: {
        125: "iconfont icon-user",
        103: "iconfont icon-lock_fill",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isNav: true,
      dePath: "",
    }
  },
  methods: {
    exit() {
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    //   获取侧边栏菜单
    async getMenu() {
      const { data: res } = await this.$http.get("menus")
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    getItem(e) {
      console.log(e)
      window.sessionStorage.setItem("dePath", "/" + e)
    },
  },
  created() {
    this.getMenu()
    this.dePath = window.sessionStorage.getItem("dePath")
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    div {
      display: flex;
      align-items: center;
      span {
        padding-left: 20px;
      }
    }
  }

  .icon {
    margin-right: 10px;
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border: none;
    }
  }

  .el-main {
    background-color: eaedf1;
  }
  .toggleNav {
    background-color: #4a5064;
    height: 24px;
    text-align: center;
    color: #fff;
    letter-spacing: 2.5px;
    cursor: pointer;
    user-select: none;
  }
}
</style>