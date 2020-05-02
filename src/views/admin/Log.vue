<template>
  <div>
    <v-card v-for="item in data" :key="item.id" class="mx-auto mb-2" tile>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title v-html="item.content"></v-list-item-title>
          <v-list-item-subtitle>记录时间：{{item.gmtModified}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <div class="text-center" v-if="totalPage!==0" v-show="!isLoading">
      <v-pagination
        @input="handleChange"
        v-model="nowPage"
        :length="totalPage"
        :total-visible="10"
      ></v-pagination>
    </div>
    <v-alert type="info" v-if="totalPage===0">
      没有日志信息
    </v-alert>
  </div>
</template>

<script>
  import {Get} from "@itning/axios-helper";
  import {API} from "../../api";
  import {formatResponseDateTime, group} from "../../util";

  export default {
    name: "Log",
    data() {
      return {
        nowPage: 1,
        totalPage: 1,
        pageSize: 10,
        isLoading: false,
        data: [],
        pageData: []
      }
    },
    methods: {
      initialize() {
        this.isLoading = true;
        Get(API.log)
          .withSuccessCode(200)
          .do(response => {
            this.totalPage = Math.ceil(response.data.data.length / this.pageSize);
            const tempData = formatResponseDateTime(response.data.data).map(item => {
              item.content = item.content.replace(/\r\n/g, "<br>")
              item.content = item.content.replace(/\n/g, "<br>");
              return item;
            });
            this.pageData = group(tempData, this.pageSize);
            this.data = this.pageData[0];
          })
          .doAfter(() => {
            this.isLoading = false;
          })
      },
      handleChange(num) {
        this.data = this.pageData[num - 1];
      }
    },
    created() {
      this.initialize();
    }
  }
</script>

<style scoped>

</style>
