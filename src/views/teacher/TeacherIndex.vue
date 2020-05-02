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
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">自主学习平台系统</span>
      </v-toolbar-title>
      <v-spacer/>
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
          <v-list-item @click="pushRouter('/login')">
            <v-list-item-title>注销登录</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <router-view name="subContent"/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: "TeacherIndex",
    data: () => ({
      drawer: null,
      user: {}
    }),
    methods: {
      pushRouter(path) {
        if (this.$route.path === path) {
          return;
        }
        this.$router.push(path);
      }
    },
    created() {
      this.user = this.$user.loginUser();
    }
  }
</script>

<style scoped>

</style>
