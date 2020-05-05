<template>
  <div>
    <crud-table title="个人信息" :headers="headers" :data="data" :data-loading="isLoading"
                @save="handleSave" @update="handleUpdate" @delete="handleDelete">
      <template v-slot="{editedItem,isModify}">
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="editedItem.attributeKey" label="属性"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="editedItem.attributeValue" label="值"></v-text-field>
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
    name: "PersonalInformation",
    components: {CrudTable},
    data: () => ({
      isLoading: false,
      headers: [
        {text: '属性', align: 'start', value: 'attributeKey',},
        {text: '值', value: 'attributeValue'},
        {text: '创建时间', value: 'gmtCreate'},
        {text: '修改时间', value: 'gmtModified'},
        {text: '操作', value: 'actions', sortable: false},
      ],
      data: []
    }),
    methods: {
      initialize() {
        this.isLoading = true;
        Get(API.teacherInfo.all)
          .withSuccessCode(200)
          .do(response => {
            this.data = formatResponseDateTime(response.data.data)
          })
          .doAfter(() => {
            this.isLoading = false;
          });
      },
      handleSave(data) {
        if (!data.attributeKey || data.attributeKey.trim() === '' ||
          !data.attributeValue || data.attributeValue.trim() === '') {
          alert("值不能为空");
          return;
        }
        Post(API.teacherInfo.add)
          .withURLSearchParams(data)
          .withSuccessCode(201)
          .do(response => {
            this.data.push(formatItemResponseDateTime(response.data.data))
            alert('新增成功');
          })
      },
      handleUpdate(data, index) {
        if (!data.attributeKey || data.attributeKey.trim() === '' ||
          !data.attributeValue || data.attributeValue.trim() === '') {
          alert("值不能为空");
          return;
        }
        const json = {id: data.id, attributeKey: data.attributeKey, attributeValue: data.attributeValue}
        Patch(API.teacherInfo.update)
          .withJson(json)
          .withSuccessCode(204)
          .do(() => {
            this.initialize();
            alert('修改成功');
          })
      },
      handleDelete(data) {
        Delete(API.teacherInfo.del + data.id)
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
