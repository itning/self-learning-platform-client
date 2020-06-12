<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <v-list-item link @click="pushRouter('/teacher/clazz')">
          <v-list-item-action>
            <v-icon>mdi-book-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>班级管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="pushRouter('/teacher/subject')">
          <v-list-item-action>
            <v-icon>mdi-playlist-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>科目管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="pushRouter('/teacher/examination')">
          <v-list-item-action>
            <v-icon>mdi-counter</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>考试管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="pushRouter('/teacher/examinationScore')">
          <v-list-item-action>
            <v-icon>mdi-calendar-month-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>成绩管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="pushRouter('/teacher/learningContent')">
          <v-list-item-action>
            <v-icon>mdi-play-protected-content</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>学习内容管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="pushRouter('/teacher/suggestion')">
          <v-list-item-action>
            <v-icon>mdi-account-voice</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>教师建议</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="pushRouter('/teacher/personalInformation')">
          <v-list-item-action>
            <v-icon>mdi-cards</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>个人信息</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">自主学习平台系统</span>
      </v-toolbar-title>
      <v-spacer/>
      <VueMarquee :marqueeList="announcements" speed="300" autoPlay="5000" fontSize="20"/>
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="">
            <v-list-item-title>{{user.name}}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="attendance">
            <v-list-item-title>出勤打卡</v-list-item-title>
          </v-list-item>
          <v-list-item @click="isChangePasswordDialogVisible=true">
            <v-list-item-title>修改密码</v-list-item-title>
          </v-list-item>
          <v-list-item @click="pushRouter('/login')">
            <v-list-item-title>注销登录</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view name="subContent"/>
      </v-container>
    </v-main>
    <v-dialog v-model="isChangePasswordDialogVisible" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">修改密码</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field type="password" label="新密码" required v-model="newPassword"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="isChangePasswordDialogVisible = false">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="changePassword">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import {API} from "../../api";
  import {Get, Patch, Post} from "@itning/axios-helper";
  import VueMarquee from "../../components/VueMarquee";

  export default {
    name: "TeacherIndex",
    components: {
      VueMarquee
    },
    data: () => ({
      isChangePasswordDialogVisible: false,
      newPassword: '',
      drawer: null,
      user: {},
      announcements: []
    }),
    methods: {
      pushRouter(path) {
        if (this.$route.path === path) {
          return;
        }
        this.$router.push(path);
      },
      getAnnouncements() {
        Get(API.announcement.all)
          .withSuccessCode(200)
          .do(response => {
            this.announcements = response.data.data.map(item => item.content);
          })
      },
      attendance() {
        Post(API.attendance.add).withSuccessCode(201).withErrorStartMsg('警告').do(response => alert("打卡成功"));
      },
      changePassword() {
        if (this.newPassword.trim() === '') {
          alert('密码不能为空');
          return;
        }
        Patch(API.user.update)
          .withSuccessCode(204)
          .withJson({password: this.newPassword})
          .do(() => {
            this.isChangePasswordDialogVisible = false;
            alert('修改成功');
            this.$router.push('/login');
          })
      }
    },
    created() {
      this.user = this.$user.loginUser();
      this.getAnnouncements();
    }
  }
</script>

<style scoped>

</style>
