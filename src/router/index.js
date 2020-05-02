import Vue from 'vue'
import VueRouter from 'vue-router'
import AdminIndex from "../views/admin/AdminIndex";

Vue.use(VueRouter)

const routes = [
  {
    path: '/admin',
    component: AdminIndex,
    children: [
      {
        path: 'teacherManagement',
        components: {
          subContent: () => import(/* webpackChunkName: "TeacherManagement" */ '../views/admin/TeacherManagement.vue')
        }
      },
      {
        path: 'studentManagement',
        components: {
          subContent: () => import(/* webpackChunkName: "TeacherManagement" */ '../views/admin/StudentManagement.vue')
        }
      },
      {
        path: 'log',
        components: {
          subContent: () => import(/* webpackChunkName: "Log" */ '../views/admin/Log.vue')
        }
      },
      {
        path: 'announcementManagement',
        components: {
          subContent: () => import(/* webpackChunkName: "AnnouncementManagement" */ '../views/admin/AnnouncementManagement.vue')
        }
      },
      {
        path: 'teacherAttendanceManagement',
        components: {
          subContent: () => import(/* webpackChunkName: "TeacherAttendanceManagement" */ '../views/admin/TeacherAttendanceManagement.vue')
        }
      },
      {
        path: 'studentAttendanceManagement',
        components: {
          subContent: () => import(/* webpackChunkName: "StudentAttendanceManagement" */ '../views/admin/StudentAttendanceManagement.vue')
        }
      },
      {
        path: '',
        redirect: 'teacherManagement'
      },
    ]
  },
  {
    path: '/security',
    component: () => import(/* webpackChunkName: "Security" */ '../views/Security.vue')
  },
  {
    path: '*',
    redirect: '/admin'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
