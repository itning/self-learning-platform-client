<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>注册系统</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="reg.name" label="姓名" name="name" prepend-icon="mdi-account-circle"
                                type="text"/>
                  <v-text-field v-model="reg.username" label="用户名" name="username" prepend-icon="mdi-account"
                                type="text"/>
                  <v-text-field v-model="reg.password" label="密码" name="password" prepend-icon="mdi-lock"
                                type="password"/>
                  <v-autocomplete prepend-icon="mdi-book-variant" label="班级" v-model="reg.studentClassId"
                                  :items="classes"></v-autocomplete>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn color="primary" @click="doReg">注册</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import {Get, Post} from "@itning/axios-helper";
  import {API} from "../api";

  export default {
    name: "Reg",
    data() {
      return {
        reg: {},
        classes: []
      }
    },
    methods: {
      doReg() {
        if (!this.reg.name || !this.reg.username || !this.reg.password ||
          this.reg.name.trim() === '' || this.reg.username.trim() === '' || this.reg.password.trim() === '') {
          alert('值为空')
        }
        Post(API.security.reg)
          .withSuccessCode(201)
          .withURLSearchParams(this.reg)
          .do(response => {
            alert('注册成功');
            this.$router.push('/login');
          })
      },
      initClasses() {
        Get(API.studentClass.allWithTeacherName)
          .withSuccessCode(200)
          .do(response => {
            this.classes = response.data.data.map(item => {
              item.text = `${item.name} ${item.teacherName}`;
              item.value = item.id;
              return item;
            })
          })
      }
    },
    created() {
      this.initClasses();
    }
  }
</script>

<style scoped>

</style>
