import Vue from 'vue'
import VueRouter from 'vue-router'
import AdminIndex from "../views/admin/AdminIndex";
import TeacherIndex from "../views/teacher/TeacherIndex";
import StudentIndex from "../views/student/StudentIndex";

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
      }
    ]
  },
  {
    path: '/teacher',
    component: TeacherIndex,
    children: [
      {
        path: 'clazz',
        components: {
          subContent: () => import(/* webpackChunkName: "Clazz" */ '../views/teacher/Clazz.vue')
        }
      },
      {
        path: 'subject',
        components: {
          subContent: () => import(/* webpackChunkName: "Subject" */ '../views/teacher/Subject.vue')
        }
      },
      {
        path: 'examination',
        components: {
          subContent: () => import(/* webpackChunkName: "Examination" */ '../views/teacher/Examination.vue')
        }
      },
      {
        path: '',
        redirect: 'clazz'
      }
    ]
  },
  {
    path: '/student',
    component: StudentIndex,
    children: []
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue')
  },
  {
    path: '/reg',
    component: () => import(/* webpackChunkName: "Reg" */ '../views/Reg.vue')
  },
  {
    path: '*',
    redirect: '/login'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
