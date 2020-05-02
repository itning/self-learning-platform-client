<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>登陆系统</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="loginInfo.username" label="用户名" name="login" prepend-icon="mdi-account"
                                type="text"/>
                  <v-text-field v-model="loginInfo.password" label="密码" name="password" prepend-icon="mdi-lock"
                                type="password"/>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn color="primary" @click="$router.push('/reg')">注册</v-btn>
                <v-btn color="primary" @click="login">登录</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import {Post} from "@itning/axios-helper";
  import {API} from "../api";

  export default {
    name: "Login",
    data() {
      return {
        loginInfo: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      login() {
        if (!this.loginInfo.username || !this.loginInfo.password
          || this.loginInfo.username.trim() === '' || this.loginInfo.password.trim() === '') {
          return;
        }
        Post(API.security.login)
          .withURLSearchParams(this.loginInfo)
          .withSuccessCode(200)
          .withErrorStartMsg("登录失败")
          .do(response => {
            console.log(response.data);
            window.localStorage.setItem('authorization_token', response.data.data);
            const loginUser = this.$user.loginUser;
            switch (loginUser.roleId) {
              case 'a': {
                this.$router.push('/admin');
                break;
              }
              case 'b': {
                this.$router.push('/teacher');
                break;
              }
              case 'c': {
                this.$router.push('/student');
                break;
              }
              default: {
                console.warn(loginUser)
                alert("未知角色");
              }
            }
          })
      }
    }
  }
</script>

<style scoped>

</style>
