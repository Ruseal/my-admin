<template>
  <div class="">
    <el-card>
      <my-breadcrumb :level="['首页', '商品管理', '商品列表']" />
      <el-alert
        style="margin-top: 15px"
        title="添加商品信息"
        type="success"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        class="steps"
        :active="parseInt(active)"
        finish-status="success"
        simple
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>

      <el-form
        label-width="80px"
        class="addgoods-form"
        :label-position="labelPosition"
        :model="form"
      >
        <el-tabs
          @tab-click="changeTab"
          class="tabs"
          v-model="active"
          :tab-position="tabPosition"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称">
              <el-input v-model="form.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="form.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="form.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="form.goods_number"></el-input>
            </el-form-item>
            <el-form-item
              ><el-cascader
                v-model="finalCheckList"
                :options="options"
                :props="configCascader"
                @change="cascChange"
                clearable
              ></el-cascader
            ></el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in goodsParams"
              :key="index"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(val, index) in item.attr_vals"
                  :key="index"
                  :label="val"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in staticParams"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-form-item>
              <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <el-form-item>
              <el-button type="primary" size="small" @click="addGoods"
                >添加商品</el-button
              >
              <quill-editor v-model="form.goods_introduce" />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

import MyBreadcrumb from "../../comps/MyBreadcrumb.vue";
export default {
  name: "",
  components: {
    MyBreadcrumb,
    quillEditor,
  },
  data() {
    return {
      tabPosition: "left",
      labelPosition: "top",
      active: "0",
      form: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,

        goods_cat: "",
        goods_introduce: "",
        pics: [],
        attrs: [],
      },
      finalCheckList: [],
      configCascader: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
      },
      options: [],

      goodsParams: [],
      staticParams: [],

      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
  },
  created() {
    this.getGoodcategories();
  },

  methods: {
    async addGoods() {
      this.form.goods_cat = this.finalCheckList.join(",");
      this.form.attrs.push(...this.goodsParams,...this.staticParams)
      const res = await this.$http.post(`goods`,this.form)
      console.log(res);
    },
    handleRemove(file, fileList) {
      let index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tem_path;
      });
      this.form.pics.splice(index, 1);
      console.log(this.form);
      this.$message.warning("已移除该图片");
    },
    handlePreview(file) {
      this.$message.warning("点击该图片");
    },
    handleSuccess(file) {
      this.$message.success("上次成功");
      this.form.pics.push({
        pic: file.data.tmp_path,
      });
    },
    async changeTab() {
      if (this.active === "1") {
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
      } else if (this.active === "2") {
        if (this.finalCheckList.length !== 3) {
          this.$message.warning("请选选择三级分类");
          return;
        }
        const res = await this.$http.get(
          `categories/${this.finalCheckList[2]}/attributes?sel=only`
        );
        this.staticParams = res.data.data;
      }
    },
    cascChange() {},
    async getGoodcategories() {
      const res = await this.$http.get(`categories`);
      this.options = res.data.data;
    },
  },
};
</script>
<style>
.steps {
  margin: 20px 0;
}
.addgoods-form {
  height: 400px;
  overflow: auto;
}
.ql-editor {
  height: 200px !important;
}
</style>