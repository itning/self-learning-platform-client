<template>
  <div>
    <v-select class="px-4" :items="examData" label="考试信息"
              :loading="isExamLoading" :value="examData[0]" @change="handleExamChange"></v-select>
    <crud-table title="考试成绩管理" :headers="headers" :data="data" :data-loading="isLoading"
                :disable-add="examData.length===0"
                @save="handleSave" @update="handleUpdate" @delete="handleDelete">
      <template v-slot="{editedItem,isModify}">
        <v-row>
          <v-col cols="4">
            <v-autocomplete :disabled="isModify" label="学生" v-model="editedItem.studentId"
                            :items="allStudentInClass"></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="editedItem.subject" label="学科"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="editedItem.score" type="number" label="分数"></v-text-field>
          </v-col>
        </v-row>
      </template>
    </crud-table>
  </div>
</template>

<script>
  import CrudTable from "../../components/CrudTable";
  import {API} from "../../api";
  import {Delete, Get, Patch, Post} from "@itning/axios-helper";
  import {formatItemResponseDateTime, formatResponseDateTime} from "../../util";

  export default {
    name: "ExaminationScore",
    components: {CrudTable},
    data: () => ({
      isExamLoading: false,
      isLoading: false,
      headers: [
        {text: '学生', align: 'start', value: 'user.name',},
        {text: '学科', value: 'subject',},
        {text: '分数', value: 'score',},
        {text: '创建时间', value: 'gmtCreate'},
        {text: '修改时间', value: 'gmtModified'},
        {text: '操作', value: 'actions', sortable: false},
      ],
      data: [],
      examData: [],
      allStudentInClass: [],
      nowExamId: null
    }),
    methods: {
      initAllMyStudent() {
        Get(API.studentClass.allStudentInClass)
          .withSuccessCode(200)
          .do(response => {
            this.allStudentInClass = response.data.data.map(item => {
              item.text = item.name;
              item.value = item.id;
              return item;
            });
          })
      },
      handleExamChange(id) {
        this.nowExamId = id;
        this.initialize(id);
      },
      initExam() {
        this.isExamLoading = true;
        Get(API.examination.all)
          .withSuccessCode(200)
          .do(response => {
            this.examData = response.data.data.map(item => {
              item.text = item.name;
              item.value = item.id;
              return item;
            });
            if (this.examData.length !== 0) {
              this.nowExamId = this.examData[0].id;
              this.initialize(this.examData[0].id);
            }
          })
          .doAfter(() => {
            this.isExamLoading = false;
          });
      },
      initialize(id) {
        this.isLoading = true;
        Get(`${API.examinationScore.all}?examinationId=${id}`)
          .withSuccessCode(200)
          .do(response => {
            this.data = formatResponseDateTime(response.data.data);
          })
          .doAfter(() => {
            this.isLoading = false;
          });
      },
      handleSave(data) {
        if (!data.studentId || !data.subject || !data.score
          || data.studentId.trim() === '' || data.subject.trim() === '' || data.score.trim() === '') {
          alert("值不能为空");
          return;
        }
        Post(API.examinationScore.add)
          .withURLSearchParams({...data, examId: this.nowExamId})
          .withSuccessCode(201)
          .do(response => {
            this.data.push(formatItemResponseDateTime(response.data.data))
            alert('新增成功');
          })
      },
      handleUpdate(data, index) {
        if (!data.subject || !data.score || data.subject.trim() === '') {
          alert("值不能为空");
          return;
        }
        const json = {id: data.id, subject: data.subject, score: data.score}
        Patch(API.examinationScore.update)
          .withJson(json)
          .withSuccessCode(204)
          .do(() => {
            this.initialize(this.nowExamId);
            alert('修改成功');
          })
      },
      handleDelete(data) {
        Delete(API.examinationScore.del + data.id)
          .withSuccessCode(204)
          .do(() => {
            const index = this.data.indexOf(data)
            this.data.splice(index, 1)
            alert('删除成功');
          })
      }
    },
    created() {
      this.initExam();
      this.initAllMyStudent();
    }
  }
</script>

<style scoped>

</style>
