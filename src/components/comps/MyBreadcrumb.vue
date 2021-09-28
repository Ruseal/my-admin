<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    
    <el-breadcrumb-item v-for="(item, index) in level" :key="index">{{
      item
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  props: {
    level: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>
<style lang='stylus' ref='stylesheet/stylus' scoped></style>