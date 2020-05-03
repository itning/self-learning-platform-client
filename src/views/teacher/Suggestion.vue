<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-select class="pl-4" :items="subject.data" label="科目"
                  :loading="subject.isLoading" :value="subject.data[0]" @change="handleSubjectChange"></v-select>
      </v-col>
      <v-col cols="6">
        <v-select class="pr-4" :items="learningContent.data" label="学习内容"
                  :loading="learningContent.isLoading" :value="learningContent.data[0]"
                  @change="handleLearningContentChange"></v-select>
      </v-col>
    </v-row>
    <v-data-table
      :search="search"
      :headers="headers"
      :items="data"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="id"
      show-expand>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>教师建议</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field append-icon="mdi-magnify" v-model="search"
                        label="搜索" single-line hide-details></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-switch v-model="singleExpand" label="单独展开" class="mt-2"></v-switch>
        </v-toolbar>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <div class="my-5" v-if="item.studentWork">
            <span>评分：</span>
            <v-rating v-model="item.studentWork.score" :clearable="true"></v-rating>
            <v-textarea label="建议" :auto-grow="true" counter :rows="1" v-model="item.studentWork.suggest"></v-textarea>
            <v-btn color="primary" @click="save(item)">保存</v-btn>
            <v-btn color="primary" class="ml-1" :disabled="!item.studentWork.fileUri"
                   @click="downloadWork(item.studentWork)">下载作业（{{item.studentWork.size}}）
            </v-btn>
          </div>
          <div v-else>该学生没有上传作业</div>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {Download, Get, Post} from "@itning/axios-helper";
  import {API} from "../../api";
  import {formatFileSize, formatResponseDateTime} from "../../util";

  export default {
    name: "Suggestion",
    data() {
      return {
        subject: {
          isLoading: false,
          data: [],
          nowId: null
        },
        learningContent: {
          isLoading: false,
          data: [],
          nowId: null
        },
        search: '',
        expanded: [],
        singleExpand: false,
        headers: [
          {text: '学生', align: 'start', value: 'studentName',},
          {text: '选择时间', value: 'gmtCreate'},
          {text: '作业', value: 'upload'},
          {text: '', value: 'data-table-expand'},
        ],
        data: [],
      }
    },
    methods: {
      handleLearningContentChange(id) {
        this.learningContent.nowId = id;
        this.initialize(id);
      },
      handleSubjectChange(id) {
        this.subject.nowId = id;
        this.initLearningContent(id);
      },
      initSubjects() {
        this.subject.isLoading = true;
        Get(API.subject.all)
          .withSuccessCode(200)
          .do(response => {
            this.subject.data = response.data.data.map(item => {
              item.text = item.name;
              item.value = item.id;
              return item;
            });
            if (this.subject.data.length !== 0) {
              this.subject.nowId = this.subject.data[0].id;
              this.initLearningContent(this.subject.data[0].id);
            }
          })
          .doAfter(() => {
            this.subject.isLoading = false;
          });
      },
      initLearningContent(subjectId) {
        this.learningContent.isLoading = true;
        Get(`${API.learningContent.all}?subjectId=${subjectId}`)
          .withSuccessCode(200)
          .do(response => {
            this.learningContent.data = response.data.data.map(item => {
              item.text = item.name;
              item.value = item.id;
              return item;
            });
            if (this.learningContent.data.length !== 0) {
              this.learningContent.nowId = this.learningContent.data[0].id;
              this.initialize(this.learningContent.data[0].id);
            }
          })
          .doAfter(() => {
            this.learningContent.isLoading = false;
          });
      },
      initialize(id) {
        Get(`${API.studentLearning.allByTeacher}?learningContentId=${id}`)
          .withSuccessCode(200)
          .do(response => {
            this.data = formatResponseDateTime(response.data.data).map(item => {
              if (item.studentWork && item.studentWork.fileUri) {
                item.upload = '已上传';
                item.studentWork.size = formatFileSize(item.studentWork.size);
              } else {
                item.upload = '未上传';
              }
              return item;
            });
          })
      },
      save(data) {
        if (!data.studentWork.suggest || data.studentWork.suggest.trim() === '') {
          alert("请输入建议");
          return;
        }
        if (!data.studentWork.score) {
          data.studentWork.score = 0;
        }
        Post(API.studentWork.review)
          .withSuccessCode(201)
          .withURLSearchParams({
            studentWorkId: data.id,
            suggest: data.studentWork.suggest,
            score: data.studentWork.score
          })
          .do(response => {
            this.initialize(this.learningContent.nowId);
            alert("批阅成功");
          })
      },
      downloadWork(data) {
        Download(API.studentWork.download + data.id, () => "学生作业." + data.extensionName)
      }
    },
    created() {
      this.initSubjects();
    }
  }
</script>

<style scoped>

</style>
