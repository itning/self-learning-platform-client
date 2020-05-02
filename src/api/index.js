export const SERVER_HOST = "http://localhost:8888";
export const API = {
  teacher: {
    all: `${SERVER_HOST}/teachers`,
    add: `${SERVER_HOST}/teacher`
  },
  student: {
    all: `${SERVER_HOST}/students`
  },
  user: {
    del: `${SERVER_HOST}/user/`,
    update: `${SERVER_HOST}/user`
  },
  security: {
    login: `${SERVER_HOST}/security/login`,
    reg: `${SERVER_HOST}/security/reg`
  },
  announcement: {
    all: `${SERVER_HOST}/announcements`,
    add: `${SERVER_HOST}/announcement`,
    del: `${SERVER_HOST}/announcement/`,
    update: `${SERVER_HOST}/announcement`
  },
  attendance: {
    all: `${SERVER_HOST}/attendances`,
    del: `${SERVER_HOST}/attendance/`,
    addByAdmin: `${SERVER_HOST}/attendance_admin`,
    add: `${SERVER_HOST}/attendance`,
    update: `${SERVER_HOST}/attendance_change`
  },
  studentClass: {
    allWithTeacherName: `${SERVER_HOST}/classes`,
    all: `${SERVER_HOST}/student_classes`,
    add: `${SERVER_HOST}/student_class`,
    del: `${SERVER_HOST}/student_class/`,
    update: `${SERVER_HOST}/student_class`
  },
  subject: {
    all: `${SERVER_HOST}/subjects`,
    add: `${SERVER_HOST}/subject`,
    del: `${SERVER_HOST}/subject/`,
    update: `${SERVER_HOST}/subject`
  },
  log: `${SERVER_HOST}/system_log`
}
