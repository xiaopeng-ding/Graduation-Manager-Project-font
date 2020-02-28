import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'



Vue.use(Router)

export default new Router({
  routes: [
    {
      name:'Login',
      path:'/',
      component: Login //() => import('@/components/Login')
    },
    {
      name: 'super',
      path:'/Super',
      component: () => import('@/components/super/Admin.vue'),
      children: [
        {
          name: 'Anav',
          path: 'Anav',
          meta: {  requireAuth:true  },
          component: () => import('@/components/super/Anav.vue'),
          children:[
            {
              name: 'ChangeUserPassword',
              path: 'ChangeUserPassword',
              meta: {  requireAuth:true  },
              component: () => import('@/components/change/ChangeUserPassword.vue')
            },
            {
              name: 'ChangeUserInfo',
              path: 'ChangeUserInfo',
              meta: {  requireAuth:true  },
              component: () => import('@/components/change/ChangeUserInfo.vue')
            },
            {
              name: 'QueryUser',
              path: 'QueryUser',
              meta: {  requireAuth:true  },
              component: () => import('@/components/user/QueryUser.vue')
            },
            {
              name: 'SearchUser',
              path: 'SearchUser',
              meta: {  requireAuth:true  },
              component: () => import('@/components/user/SearchUser.vue')
            },
            {
              name: 'announcement',
              path: 'announcement',
              meta: {  requireAuth:true  },
              component: () => import('@/components/user/announcement.vue')
            }
          ]
        },
      ]
    }
  ]
})
