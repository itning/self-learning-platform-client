<template>
  <div>
    <crud-table title="我的成绩" :headers="headers" :data="data" :data-loading="isLoading"
                :disable-edit="true" :disable-add="true" :disable-del="true"/>
  </div>
</template>

<script>
  import CrudTable from "../../components/CrudTable";
  import {Get} from "@itning/axios-helper";
  import {API} from "../../api";
  import {formatResponseDateTime} from "../../util";

  export default {
    name: "ExamScore",
    components: {CrudTable},
    data() {
      return {
        isLoading: false,
        headers: [
          {text: '考试', align: 'start', value: 'name',},
          {text: '学科', value: 'subject',},
          {text: '成绩', value: 'score',},
          {text: '填写时间', value: 'gmtModified',}
        ],
        data: []
      }
    },
    methods: {
      initialize() {
        Get(API.examinationScore.studentOwn)
          .withSuccessCode(200)
          .do(response => {
            this.data = formatResponseDateTime(response.data.data);
          })
      }
    },
    created() {
      this.initialize();
    }
  }
</script>

<style scoped>

</style>
