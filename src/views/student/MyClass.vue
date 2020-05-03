<template>
  <div>
    <v-card class="mx-auto" max-width="344">
      <v-card-title>我的班级</v-card-title>
      <v-card-text>
        <div v-if="classData.name">
          <div class="text--primary">班名：{{classData.name}}</div>
          <div class="text--primary">教师：{{classData.teacherName}}</div>
          <div class="text--primary">加入时间：{{classData.gmtCreate}}</div>
        </div>
        <div v-else>
          请单击下面按钮选择加入班级
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="showChangeClassDialog">
          {{classData.name?'重新选择班级':'加入班级'}}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="isChangeClassDialogVisible" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">选择班级</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select class="px-4" :items="allClass" label="选择班级" v-model="nowSelectClassId"></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="isChangeClassDialogVisible = false">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="changeClass">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {API} from "../../api";
  import {Get, Post} from "@itning/axios-helper";
  import {formatItemResponseDateTime} from "../../util";

  export default {
    name: "MyClass",
    data() {
      return {
        isChangeClassDialogVisible: false,
        classData: {},
        allClass: [],
        nowSelectClassId: null
      }
    },
    methods: {
      showChangeClassDialog() {
        if (this.classData) {
          this.allClass = this.allClass.filter(item => item.id !== this.classData.id);
        }
        this.isChangeClassDialogVisible = true;
      },
      changeClass() {
        if (!this.nowSelectClassId) {
          alert('请选择班级');
          return;
        }
        Post(API.studentClass.joinClass)
          .withSuccessCode(201)
          .withURLSearchParams({classId: this.nowSelectClassId})
          .do(() => {
            this.initAllClass();
            this.initOwnClass();
            this.isChangeClassDialogVisible = false;
            alert('换班成功');
          })
      },
      initOwnClass() {
        Get(API.studentClass.studentOwnClass)
          .withSuccessCode(200)
          .do(response => {
            if (response.data.data) {
              this.classData = formatItemResponseDateTime(response.data.data);
            }
          })
      },
      initAllClass() {
        Get(API.studentClass.allWithTeacherName)
          .withSuccessCode(200)
          .do(response => {
            this.allClass = response.data.data.map(item => {
              item.text = item.name;
              item.value = item.id;
              return item;
            });
          })
      }
    },
    created() {
      this.initAllClass();
      this.initOwnClass();
    }
  }
</script>

<style scoped>

</style>
