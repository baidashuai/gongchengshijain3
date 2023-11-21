import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Manage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Manage',
    component: () => import('../views/Manage.vue'),
    redirect:"/login",
    children:[
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/BootStrapUser'),
      },
      {
        path: 'refund',
        name: 'refund',
        component: () => import('../views/AfterSales'),
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('../views/Menu.vue'),
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('../views/Order.vue'),
      },
      {
        path: '/aboutview',
        name: 'aboutview',
        component: () => import('../views/AboutView')
      },
      {
        path: '/takeoutManage',
        name: 'takeoutManage',
        component: () => import('../views/TakeOutManage')
      },
      {
        path: '/gptuser',
        name: 'gptuser',
        component: () => import('../views/GPTUser')
      },
      {
        path: '/bootStrapUser',
        name: 'bootStrapUser',
        component: () => import('../views/BootStrapUser')
      },
      {
        path: '/remark',
        name: 'remark',
        component: () => import('../views/Remark')
      },
      {
        path: '/merch',
        name: 'merch',
        component: () => import('../views/Merch')
      },

    ]

  },
  {
    path: '/',
    name: 'CostomAside',
    component: () => import('../views/CostumMannge.vue'),
    redirect:"/login",
    children:[
      {
        path: 'CostomOrder',
        name: 'CostomHome',
        component: () => import('../views/CostumOrder'),
      },
      {
        path: 'myAfterSales',
        name: 'myAfterSales',
        component: () => import('../views/MyAfterSales'),
      },
      {
        path: 'myOrder',
        name: 'myOrder',
        component: () => import('../views/myOrder'),
      },
      {
        path: 'takeOut',
        name: 'takeOut',
        component: () => import('../views/TakeOut'),
      },
      {
        path: 'person',
        name: 'person',
        component: () => import('../views/Person.vue'),
      },
      {
        path: 'customRemark',
        name: 'customRemark',
        component: () => import('../views/Remark.vue'),
      },




    ]

  },

  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
