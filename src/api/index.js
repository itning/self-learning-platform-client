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
    update: `${SERVER_HOST}/student_class`,
    allStudentInClass: `${SERVER_HOST}/student_in_class`,
    studentOwnClass: `${SERVER_HOST}/my_classes`,
    joinClass: `${SERVER_HOST}/join_class`
  },
  subject: {
    all: `${SERVER_HOST}/subjects`,
    add: `${SERVER_HOST}/subject`,
    del: `${SERVER_HOST}/subject/`,
    update: `${SERVER_HOST}/subject`
  },
  examination: {
    all: `${SERVER_HOST}/examinations`,
    add: `${SERVER_HOST}/examination`,
    del: `${SERVER_HOST}/examination/`,
    update: `${SERVER_HOST}/examination`
  },
  examinationScore: {
    all: `${SERVER_HOST}/examination_scores`,
    add: `${SERVER_HOST}/examination_score`,
    del: `${SERVER_HOST}/examination_score/`,
    update: `${SERVER_HOST}/examination_score`,
    studentOwn: `${SERVER_HOST}/examination_score_student`
  },
  learningContent: {
    all: `${SERVER_HOST}/learning_contents`,
    add: `${SERVER_HOST}/learning_content`,
    del: `${SERVER_HOST}/learning_content/`,
    update: `${SERVER_HOST}/learning_content`,
    allCanStudy: `${SERVER_HOST}/learning_content_of_student`
  },
  studentLearning: {
    allByTeacher: `${SERVER_HOST}/student_learning_teacher`,
    all: `${SERVER_HOST}/student_learning`,
    del: `${SERVER_HOST}/student_learning/`,
    add: `${SERVER_HOST}/student_learning`
  },
  studentWork: {
    review: `${SERVER_HOST}/student_work_review`,
    download: `${SERVER_HOST}/download_student_work/`,
    own: `${SERVER_HOST}/student_work`,
    upload: `${SERVER_HOST}/student_work`
  },
  teacherInfo: {
    all: `${SERVER_HOST}/teacher_infos`,
    add: `${SERVER_HOST}/teacher_info`,
    del: `${SERVER_HOST}/teacher_info/`,
    update: `${SERVER_HOST}/teacher_info`
  },
  log: `${SERVER_HOST}/system_log`
}
