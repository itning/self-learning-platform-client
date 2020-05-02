<template>
  <div>
    <crud-table title="教师管理" :headers="headers" :data="data" :data-loading="isLoading"
                @save="handleSave" @update="handleUpdate" @delete="handleDelete">
      <template v-slot="{editedItem,isModify}">
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="editedItem.name" label="姓名"></v-text-field>
          </v-col>
          <v-col cols="6" v-if="!isModify">
            <v-text-field v-model="editedItem.username" label="用户名"></v-text-field>
          </v-col>
          <v-col cols="6" v-if="isModify">
            <v-switch v-model="editedItem.freeze" :label="`冻结：${editedItem.freeze?'√':'×'}`"></v-switch>
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
    name: "TeacherManagement",
    components: {CrudTable},
    data: () => ({
      isLoading: false,
      headers: [
        {text: '姓名', align: 'start', value: 'name',},
        {text: '账户状态', value: 'freeze_format'},
        {text: '创建时间', value: 'gmtCreate'},
        {text: '修改时间', value: 'gmtModified'},
        {text: '操作', value: 'actions', sortable: false},
      ],
      data: []
    }),
    methods: {
      initialize() {
        this.isLoading = true;
        Get(API.teacher.all)
          .withSuccessCode(200)
          .do(response => {
            this.data = formatResponseDateTime(response.data.data).map(item => {
              item.freeze_format = item.freeze ? '冻结' : '可用';
              return item;
            });
          })
          .doAfter(() => {
            this.isLoading = false;
          });
      },
      handleSave(data) {
        if (!data.name || !data.username
          || data.name.trim() === '' || data.username.trim() === '') {
          alert("值不能为空");
          return;
        }
        Post(API.teacher.add)
          .withURLSearchParams(data)
          .withSuccessCode(201)
          .do(response => {
            const i = formatItemResponseDateTime(response.data.data);
            i.freeze_format = i.freeze ? '冻结' : '可用';
            this.data.push(i)
            alert('新增成功');
          })
      },
      handleUpdate(data, index) {
        if (!data.name || !data.username
          || data.name.trim() === '' || data.username.trim() === '') {
          alert("值不能为空");
          return;
        }
        const json = {id: data.id, name: data.name, username: data.username, freeze: data.freeze}
        Patch(API.user.update)
          .withJson(json)
          .withSuccessCode(204)
          .do(() => {
            this.initialize();
            alert('修改成功');
          })
      },
      handleDelete(data) {
        Delete(API.user.del + data.id)
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
