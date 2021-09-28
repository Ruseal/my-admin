<template>
 <div class=''>
   <el-card>
     <my-breadcrumb :level="['首页','商品管理','商品分类']"/>
   </el-card>
 </div>
</template>

<script>
import MyBreadcrumb from '../../../components/comps/MyBreadcrumb.vue';
export default {
  name: '',
  components: {MyBreadcrumb},
  data () {
    return {
      
    };
  },
}
</script>
<style lang='stylus' ref='stylesheet/stylus' scoped>
</style>