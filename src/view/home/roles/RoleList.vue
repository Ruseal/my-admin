<template>
  <div class="role-list">
    <el-card>
      <my-breadcrumb :level="['首页', '权限管理', '角色列表']" />

      <el-row class="role-addrole">
        <el-col :span="4">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table class="role-table" :data="roleList" stripe height="65vh">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, index) in scope.row.children" :key="index">
              <!-- v-model="item1.children.length"
                v-if="item1.children.length" -->
              <el-col :span="4">
                <el-tag
                  @close="deleteRole(scope.row, item1.id, index)"
                  closable
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(item2, index) in item1.children" :key="index">
                  <el-col :span="4" v-if="item2.children.length">
                    <el-tag
                      @close="deleteRole(scope.row, item2.id, index)"
                      type="success"
                      closable
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      @close="deleteRole(scope.row, item3.id, index)"
                      closable
                      type="warning"
                      v-for="(item3, index) in item2.children"
                      :key="index"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <span v-if="!scope.row.children.length">未分配权限</span>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="120"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="200">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
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
              @click="showDelMsgBox(scope.row)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              plain
            ></el-button>
            <el-button
              @click="showEditRightBox(scope.row)"
              type="success"
              icon="el-icon-check"
              size="mini"
              circle
              plain
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- ---------修改权限对话框------------ -->
      <el-dialog title="修改权限" :visible.sync="isShowEditRightBoxFlag">
        <el-tree
          ref="tree"
          :data="roleTree"
          show-checkbox
          node-key="id"
          :default-expanded-keys="expandedArr"
          :default-checked-keys="checkedArr"
          :props="defaultProps"
        >
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowEditRightBoxFlag = false">取 消</el-button>
          <el-button type="primary" @click="updateRigthClick">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from "../../../components/comps/MyBreadcrumb.vue";
export default {
  name: "",
  components: { MyBreadcrumb },
  data() {
    return {
      roleList: [],
      isShowEditRightBoxFlag: false,

      roleTree: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      expandedArr: [],
      checkedArr: [],
      currentRoleId: 0,
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async updateRigthClick() {
      const treeArrChecked = this.$refs.tree.getCheckedKeys();
      const treeArrHalf = this.$refs.tree.getHalfCheckedKeys();
      let treeArrAll = [...treeArrChecked, ...treeArrHalf];

      const res = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: treeArrAll.join(","),
      });
      const { msg, status } = res.data.meta;
      if (status === 200) {
        this.$message.success(msg);
        this.getRoleList();
      } else {
        this.$message.warning(msg);
      }
      this.isShowEditRightBoxFlag = false;
    },
    async showEditRightBox(role) {
      const res = await this.$http.get(`rights/tree`);
      this.roleTree = res.data.data;
      this.currentRoleId = role.id;

      this.expandedArr = [];
      this.checkedArr = [];
      role.children.forEach((item1) => {
        if (item1.children.length !== 0) {
          this.expandedArr.push(item1.id);
          item1.children.forEach((item2) => {
            if (item2.children.length !== 0) {
              this.expandedArr.push(item2.id);
              item2.children.forEach((item3) => {
                this.checkedArr.push(item3.id);
              });
            }
          });
        }
      });
      this.isShowEditRightBoxFlag = true;
    },

    async deleteRole(roleItem, rightId) {
      const res = await this.$http.delete(
        `roles/${roleItem.id}/rights/${rightId}`
      );
      roleItem.children = res.data.data;
    },

    async getRoleList() {
      const res = await this.$http.get(`roles`);
      this.roleList = res.data.data;
    },
  },
};
</script>
<style scoped>
.role-addrole {
  margin-top: 15px;
}
.role-table {
  margin-top: 15px;
}
</style>