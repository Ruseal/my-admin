<template>
  <div class="right-list">
    <el-card class="box-card">
      <!-- -----面包屑---- -->
      <my-breadcrumb :level="['首页', '权限管理', '权限列表']" />
      <!-- ---------表格---------->
      <el-table class="right-list-table" :data="rightList" border height="75vh">
        <el-table-column type="index" label="#" width="180"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column  label="层级"> 
          <template slot-scope="scope">
            <span v-if="scope.row.level==='0'">一级</span>
            <span v-else-if="scope.row.level==='1'">二级</span>
            <span v-else-if="scope.row.level==='2'">三级</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from "../../../components/comps/MyBreadcrumb.vue";
export default {
  name: "",
  components: {
    MyBreadcrumb,
  },
  data() {
    return {
      rightList: [],
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const res = await this.$http.get(`rights/list`);
      this.rightList = res.data.data;
    },
  },
};
</script>
<style scoped>
.right-list-table{
  margin-top: 15px;
  width: 100%;
}
</style>