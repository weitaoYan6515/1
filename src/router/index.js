import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },

 


]
export const menuRoutes=[
  {
    path: '/prototype',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Prototype',
        component: () => import('@/views/prototype/index'),
        meta: { title: '产品原型管理', icon: 'prototype' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Product',
        component: () => import('@/views/product/index'),
        meta: { title: '质保产品管理', icon: 'product' }
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Customer',
        component: () => import('@/views/customer/index'),
        meta: { title: '质保客户管理', icon: 'customer' } 
      }
    ]
  },
  {
    path: '/partner',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Partner',
        component: () => import('@/views/partner/index'),
        meta: { title: '运营商管理', icon: 'partner' }
      }
    ]
  },
  {
    path: '/store',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Store',
        component: () => import('@/views/store/index'),
        meta: { title: '门店管理', icon: 'store' }
      }
    ]
  },
  {
    path: '/images',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Images',
        component: () => import('@/views/images/index'),
        meta: { title: '图片案例管理', icon: 'images' }
      }
    ]
  },
  {
    path: '/car',
    component: Layout,
    redirect: '/car/brand',
    name: 'Car',
    meta: { title: '车辆管理', icon: 'el-icon-truck' },
    children: [
      {
        path: 'brand',
        name: 'Brand',
        component: () => import('@/views/car/brand/index'),
        meta: { title: '品牌管理', icon: 'brand' }
      },
      {
        path: 'model',
        name: 'Model',
        component: () => import('@/views/car/model/index'),
        meta: { title: '型号管理', icon: 'model' }
      }
    ]
  },
  {
    path: '/banner',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Banner',
        component: () => import('@/views/banner/index'),
        meta: { title: 'Banner管理', icon: 'banner' }
      }
    ]
  },
  {
    path: '/price',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Price',
        component: () => import('@/views/price/index'),
        meta: { title: '报价管理', icon: 'price' }
      }
    ]
  },
  {
    path: '/interface',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Interface',
        component: () => import('@/views/interface/index'),
        meta: { title: '产品界面管理', icon: 'interface' }
      }
    ]
  },
]
export const errorRoutes = [
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes.concat(menuRoutes).concat(errorRoutes)
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
