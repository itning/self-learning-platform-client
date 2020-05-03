<template>
  <div>
    <crud-table title="学习内容管理" :headers="headers" :data="data" :data-loading="isLoading"
                :disable-edit="true" @delete="handleDelete" @save="handleSave">
      <template v-slot="{editedItem,isModify}">
        <v-row>
          <v-col cols="12">
            <v-select class="px-4" :items="canStudyLearningContent.data" label="选择学习内容"
                      :loading="canStudyLearningContent.loading"
                      v-model="canStudyLearningContent.nowSelectId"></v-select>
          </v-col>
        </v-row>
      </template>
    </crud-table>
  </div>
</template>

<script>
  import CrudTable from "../../components/CrudTable";
  import {Delete, Get, Post} from "@itning/axios-helper";
  import {API} from "../../api";
  import {formatDateTime, formatResponseDateTime} from "../../util";

  export default {
    name: "StudyContent",
    components: {CrudTable},
    data() {
      return {
        isLoading: false,
        headers: [
          {text: '名称', align: 'start', value: 'name',},
          {text: '选择时间', value: 'chooseDate',},
          {text: '操作', value: 'actions', sortable: false},
        ],
        data: [],
        canStudyLearningContent: {
          data: [],
          loading: false,
          nowSelectId: null
        }
      }
    },
    methods: {
      handleSave() {
        if (!this.canStudyLearningContent.nowSelectId) {
          alert('请选择学习内容');
          return;
        }
        Post(API.studentLearning.add)
          .withSuccessCode(201)
          .withURLSearchParams({learningContentId: this.canStudyLearningContent.nowSelectId})
          .do(() => {
            this.initialize();
            this.initAllCanStudy();
            alert('选择成功');
          })
      },
      handleDelete(data) {
        Delete(API.studentLearning.del + data.studentLearningId)
          .withSuccessCode(204)
          .do(() => {
            const index = this.data.indexOf(data)
            this.data.splice(index, 1);
            this.initAllCanStudy();
            alert('删除成功');
          })
      },
      initAllCanStudy() {
        Get(API.learningContent.allCanStudy)
          .withSuccessCode(200)
          .do(response => {
            this.canStudyLearningContent.data = response.data.data.map(item => {
              item.text = item.name;
              item.value = item.id;
              return item;
            });
          })
      },
      initialize() {
        Get(API.studentLearning.all)
          .withSuccessCode(200)
          .do(response => {
            this.data = formatResponseDateTime(response.data.data).map(item => {
              item.chooseDate = formatDateTime(item.chooseDate);
              return item;
            });
          })
      }
    },
    created() {
      this.initialize();
      this.initAllCanStudy();
    }
  }
</script>

<style scoped>

</style>
