<template>
  <div>
    <crud-table title="公告管理" :headers="headers" :data="data" :data-loading="isLoading"
                @save="handleSave" @update="handleUpdate" @delete="handleDelete">
      <template v-slot="{editedItem,isModify}">
        <v-text-field v-model="editedItem.content" label="内容"></v-text-field>
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
    name: "AnnouncementManagement",
    components: {CrudTable},
    data: () => ({
      isLoading: false,
      headers: [
        {text: '内容', align: 'start', value: 'content',},
        {text: '创建时间', value: 'gmtCreate'},
        {text: '修改时间', value: 'gmtModified'},
        {text: '操作', value: 'actions', sortable: false},
      ],
      data: []
    }),
    methods: {
      initialize() {
        this.isLoading = true;
        Get(API.announcement.all)
          .withSuccessCode(200)
          .do(response => {
            this.data = formatResponseDateTime(response.data.data)
          })
          .doAfter(() => {
            this.isLoading = false;
          });
      },
      handleSave(data) {
        if (!data.content || data.content.trim() === '') {
          alert("值不能为空");
          return;
        }
        Post(API.announcement.add)
          .withURLSearchParams(data)
          .withSuccessCode(201)
          .do(response => {
            this.data.push(formatItemResponseDateTime(response.data.data))
            alert('新增成功');
          })
      },
      handleUpdate(data, index) {
        if (!data.content || data.content.trim() === '') {
          alert("值不能为空");
          return;
        }
        const json = {id: data.id, content: data.content}
        Patch(API.announcement.update)
          .withJson(json)
          .withSuccessCode(204)
          .do(() => {
            this.initialize();
            alert('修改成功');
          })
      },
      handleDelete(data) {
        Delete(API.announcement.del + data.id)
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
