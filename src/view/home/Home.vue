<template>
  <el-container class="home-container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img
            class="image"
            src="../../assets/image/itcast.jpeg"
            alt="无法显示图片"
          />
        </el-col>
        <el-col :span="18">
          <div class="title">电商后台管理系统</div>
        </el-col>
        <el-col :span="2">
          <a class="exit" href="javascript:void(0)" @click.prevent="exitLogin()"
            >退出</a
          >
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu unique-opened router>
          <!-- ------1------- -->
          <el-submenu :index="menu.order+''" v-for="(menu, index) in menuList" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item
              v-for="(item, itemIndex) in menu.children"
              :key="itemIndex"
              :index="menu.order+'-'+itemIndex"
              :route="{ name: item.path }"
            >
              <i class="el-icon-menu"></i>
              <span>{{ item.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      menuList: [],
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    async getMenus() {
      const res = await this.$http.get(`menus`);
      this.menuList = res.data.data;
    },
    exitLogin() {
      this.$confirm("是否退出登入?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        localStorage.removeItem("token");
        this.$router.replace({ name: "login" });
        this.$message.success("退出登入成功!");
      });
    },
  },
};
</script>
<style scoped>
.home-container {
  width: 100%;
  height: 100%;
}
.header {
  text-align: center;
  line-height: 60px;
  background-color: #b3c0d1;
}
.aside {
  background-color: #fff;
}
.main {
  background-color: #e9eef3;
}
.image {
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding: 5px;
}
.title {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.3em;
}
.exit {
  text-decoration: none;
}
</style>