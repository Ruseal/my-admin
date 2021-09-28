<template>
  <div class="user-list">
    <el-card class="box-card">
      <my-breadcrumb :level="['首页','用户管理','用户列表']"/>

      <el-row class="search">
        <el-col :span="8">
          <el-input
            @clear="resetUserList"
            placeholder="请输入内容"
            v-model="query"
            clearable
          >
            <el-button
              @click="searchUsers"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            @click="isShowUserTable = true"
            class="add-user"
            type="primary"
            >添加用户</el-button
          >
        </el-col>
        <span></span>
      </el-row>

      <el-table class="users-table" :data="userList" stripe>
        <el-table-column label="#" type="index" width="50px"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="100px">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="create_time" label="创建时间"> </el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch
              @change="change(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="showUpdateMsgBox(scope.row)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              plain
            ></el-button>

            <el-button
              @click="showDelMsgBox(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              plain
            ></el-button>
            <el-button
              @click="showSetUserRoleBox(scope.row)"
              type="success"
              icon="el-icon-check"
              size="mini"
              circle
              plain
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="limit-foot"
        @current-change="currentPageChange"
        @size-change="currentShowCount"
        :current-page="pagenum"
        :page-sizes="[7, 4, 2]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <el-dialog title="添加用户" :visible.sync="isShowUserTable">
        <el-form :model="form">
          <el-form-item label="用户名:" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="密码:" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮箱:" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="电话:" :label-width="formLabelWidth">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="isShowUserTable = false">取 消</el-button>
          <el-button type="primary" @click="clickAddUserVisible"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <el-dialog
        title="编辑用户"
        :visible.sync="isShowUpdateTable"
        @close="updateClose"
      >
        <el-form :model="form">
          <el-form-item label="用户名:" :label-width="formLabelWidth">
            <el-input
              v-model="form.username"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item label="邮箱:" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="电话:" :label-width="formLabelWidth">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="isShowUpdateTable = false">取 消</el-button>
          <el-button type="primary" @click="clickUpdateUserVisible"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <el-dialog title="分配角色" :visible.sync="isShowSetUserRoleBox">
        <el-form :model="form">
          <el-form-item label="用户名：" :label-width="formLabelWidth">
            {{ currentusername }}
          </el-form-item>

          <el-form-item label="角色：" :label-width="formLabelWidth">
            <el-select v-model="currentRoleId">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option
                :label="item.roleName"
                :value="item.id"
                v-for="(item, index) in roleList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowSetUserRoleBox = false">取 消</el-button>
          <el-button @click="clickUpdateRoleVisible" type="primary"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from '../../../components/comps/MyBreadcrumb.vue';
export default {
  name: "",
  components: {MyBreadcrumb},
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 7,
      userList: [],
      roleList: [],
      total: 0,

      form: {},
      formUpdate: {},
      isShowUserTable: false,
      isShowUpdateTable: false,
      isShowSetUserRoleBox: false,
      formLabelWidth: "100px",

      updateUserId: 0,
      currentRoleId: -1,
      currentusername: "",
      currentuserId: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async clickUpdateRoleVisible() {
      const res = await this.$http.put(`users/${this.currentuserId}/role`, {
        id: this.currentuserId,
        rid: this.currentRoleId,
      });
      const {
        data,
        meta: { msg, status },
      } = res.data;
      if (status == 200) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      this.isShowSetUserRoleBox = false;
    },
    async showSetUserRoleBox(user) {
      this.currentusername = user.username;
      this.currentuserId = user.id;
      const roleRes = await this.$http.get(`roles`);
      const {
        data,
        meta: { msg, status },
      } = roleRes.data;
      if (status !== 200) {
        this.$message.warning(msg);
        return;
      }
      this.roleList = data;
      const userRes = await this.$http.get(`users/${user.id}`);
      this.currentRoleId = userRes.data.data.rid;
      this.isShowSetUserRoleBox = true;
    },
    async change(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const {
        data,
        meta: { msg, status },
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },
    updateClose() {
      this.isShowUpdateTable = false;
      this.form = {};
    },
    async clickUpdateUserVisible() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      const {
        data,
        meta: { msg, status },
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.isShowUpdateTable = false;
      } else {
        this.$message.warning(msg);
      }
      this.form = {};
    },
    showUpdateMsgBox(user) {
      this.isShowUpdateTable = true;
      this.form = user;
    },
    showDelMsgBox(userId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userId}`);
          const {
            meta: { msg, status },
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.getUserList();
          } else {
            this.$message.warning(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    async clickAddUserVisible() {
      const res = await this.$http.post(`users`, this.form);
      const {
        meta: { msg, status },
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.getUserList();
        this.form = {};
      } else {
        this.$message.warning(msg);
      }
      this.isShowUserTable = false;
    },
    resetUserList() {
      this.getUserList();
    },
    searchUsers() {
      this.getUserList();
    },
    async getUserList() {
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      const {
        meta: { status, msg },
        data: { users, total, pagenum },
      } = res.data;
      if (status === 200) {
        this.userList = users;
        this.total = total;
      } else {
        this.$message.warning(msg);
      }
    },
    currentShowCount(count) {
      this.pagesize = count;
      this.pagenum = 1;
      this.getUserList();
    },
    currentPageChange(page) {
      this.pagenum = page;
      this.getUserList();
    },
  },
};
</script>
<style scoped>
.box-card {
  width: 100%;
  height: 100%;
}
.search {
  margin-top: 15px;
}
.add-user {
  margin-left: 10px;
}
.users-table {
  width: 100%;
  margin-top: 15px;
}
.limit-foot {
  margin-top: 15px;
}
</style>