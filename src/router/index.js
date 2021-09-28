import Vue from 'vue'
import VueRouter from 'vue-router'

import { Message } from 'element-ui'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/view/login/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../view/home/Home.vue'),
    children: [
      {
        path: 'users',
        name: 'users',
        component: () => import('../view/home/users/UserList.vue')
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import('../view/home/rights/RightList.vue')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('../view/home/roles/RoleList.vue')
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('../view/home/goods/GoodsList.vue')
      },
      {
        path: 'params',
        name: 'params',
        component: () => import('../view/home/goods/Params.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('../view/home/goods/Categories.vue')
      },
      {
        path: 'goods/addgoods',
        name: 'addgoods',
        component: () => import('../components/conmmon/goods/AddGoods.vue')
      },
      
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  const a = 1
  // console.log(to.name);
  if (to.path !== '/login') {
    if (!localStorage.getItem("token")) {
      router.replace({ name: "login" });
      return
    }
  }
  next()
})
export default router
