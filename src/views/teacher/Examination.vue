<template>
  <div>
    <crud-table title="考试管理" :headers="headers" :data="data" :data-loading="isLoading"
                @save="handleSave" @update="handleUpdate" @delete="handleDelete">
      <template v-slot="{editedItem,isModify}">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="editedItem.name" label="考试信息"></v-text-field>
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
    name: "Examination",
    components: {CrudTable},
    data: () => ({
      isLoading: false,
      headers: [
        {text: '考试', align: 'start', value: 'name',},
        {text: '创建时间', value: 'gmtCreate'},
        {text: '修改时间', value: 'gmtModified'},
        {text: '操作', value: 'actions', sortable: false},
      ],
      data: []
    }),
    methods: {
      initialize() {
        this.isLoading = true;
        Get(API.examination.all)
          .withSuccessCode(200)
          .do(response => {
            this.data = formatResponseDateTime(response.data.data)
          })
          .doAfter(() => {
            this.isLoading = false;
          });
      },
      handleSave(data) {
        if (!data.name || data.name.trim() === '') {
          alert("值不能为空");
          return;
        }
        Post(API.examination.add)
          .withURLSearchParams(data)
          .withSuccessCode(201)
          .do(response => {
            this.data.push(formatItemResponseDateTime(response.data.data))
            alert('新增成功');
          })
      },
      handleUpdate(data, index) {
        if (!data.name || data.name.trim() === '') {
          alert("值不能为空");
          return;
        }
        const json = {id: data.id, name: data.name}
        Patch(API.examination.update)
          .withJson(json)
          .withSuccessCode(204)
          .do(() => {
            this.initialize();
            alert('修改成功');
          })
      },
      handleDelete(data) {
        Delete(API.examination.del + data.id)
          .withSuccessCode(204)
          .do(() => {
            const index = this.data.indexOf(data)
            this.data.splice(index, 1)
            alert('删除成功');
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
