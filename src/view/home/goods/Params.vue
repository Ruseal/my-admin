<template>
  <div class="">
    <el-card>
      <my-breadcrumb
        class="breadcrumb"
        :level="['首页', '商品管理', '分类参数']"
      />
      <el-alert class="style" title="错误提示的文案" type="error"> </el-alert>
      <el-form label-position="left" label-width="80px">
        <el-form-item label="分类参数:"
          ><el-cascader
            v-model="finalCheckList"
            :options="options"
            :props="configCascader"
            @change="cascChange"
            clearable
            :show-all-levels="false"
          ></el-cascader
        ></el-form-item>
      </el-form>

      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane label="动态参数" name="1">
          <el-button type="danger">设置动态参数</el-button>
          <el-table :data="goodsParams" style="width: 100%">
            <el-table-column type="expand" label="#">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row, tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
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
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
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
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="2">
          <el-button type="danger">设置静态参数</el-button>
          <el-table :data="staticParams" style="width: 100%;" height="320">
            <el-table-column type="expand" label="#"> </el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="属性值" prop="attr_vals"></el-table-column>
            <el-table-column label="操作">
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
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
      finalCheckList: [],
      options: [],
      configCascader: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
      },

      goodsParams: [],
      staticParams: [],

      activeName: "1",

      inputVisible: false,
      inputValue: "",

      isDeleteOrAdd: 0,
    };
  },
  created() {
    this.getGoodcategories();
  },
  methods: {
    async handleClose(obj, tag) {
      const res = await this.$http.put(
        `categories/${this.finalCheckList[2]}/attributes/${obj.attr_id}`,
        {
          attr_name: obj.attr_name,
          attr_sel: "many",
          attr_vals: obj.attr_vals.join(","),
        }
      );
      if (!this.isDeleteOrAdd) {
        obj.attr_vals.splice(obj.attr_vals.indexOf(tag), 1);
        return;
      }
      return res;
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(obj) {
      this.isDeleteOrAdd = 1;
      const res = await this.handleClose(obj);
      this.isDeleteOrAdd = 0;
      console.log(res);

      let inputValue = this.inputValue;
      if (inputValue) {
        obj.attr_vals.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    handleClick() {
      this.cascChange();
    },
    async cascChange() {
      if (this.activeName === "1") {
        if (this.finalCheckList.length !== 3) {
          this.$message.warning("请选选择三级分类");
          return;
        }

        const res = await this.$http.get(
          `categories/${this.finalCheckList[2]}/attributes?sel=many`
        );

        this.goodsParams = res.data.data;
        this.goodsParams.forEach((item) => {
          item.attr_vals = item.attr_vals.trim().split(",");
        });
        console.log(this.goodsParams);
      } else if (this.activeName === "2") {
        if (this.finalCheckList.length !== 3) {
          this.$message.warning("请选选择三级分类");
          return;
        }
        const res = await this.$http.get(
          `categories/${this.finalCheckList[2]}/attributes?sel=only`
        );
        this.staticParams = res.data.data;
        console.log(this.staticParams);
      }
    },
    async getGoodcategories() {
      const res = await this.$http.get(`categories`);
      this.options = res.data.data;
    },
  },
};
</script>
<style scoped>
.style {
  margin: 20px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>