<template>
  <div class="goods-list">
    <el-card class="box-card">
      <my-breadcrumb :level="['首页', '商品管理', '商品列表']" />
      <el-row class="search">
        <el-col :span="8">
          <!-- @clear="resetUserList" -->
          <el-input placeholder="请输入内容" v-model="query" clearable>
            <el-button
              @click="searchGoods"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            @click="$router.push({ name: 'addgoods' })"
            class="add-Goods"
            type="primary"
            >添加用户</el-button
          >
        </el-col>
        <span></span>
      </el-row>

      <el-table class="users-table" :data="goodsList" height="500" stripe>
        <el-table-column label="#" type="index" width="50px"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" >
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="100px"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建日期" width="100px"> </el-table-column>

        <el-table-column label="操作" width="100px">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              plain
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              plain
            ></el-button>
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
  components: { MyBreadcrumb },
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 100,
      isShowAddGoodsTable: false,
      goodsList: [],
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      this.goodsList = res.data.data.goods;
      // console.log(this.goodsList);
      // console.log(res);
    },
    searchGoods() {
      this.getGoodsList();
    },
  },
};
</script>
<style scoped>
.search {
  margin-top: 15px;
}
.add-Goods {
  margin-left: 15px;
}
</style>