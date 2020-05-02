<template>
  <div>
    <crud-table title="学生出勤管理" :headers="headers" :data="data" :data-loading="isLoading"
                @save="handleSave" @update="handleUpdate" @delete="handleDelete">
      <template v-slot="{editedItem,isModify}">
        <v-row>
          <v-col cols="4">
            <v-autocomplete :disabled="isModify" :items="userData" v-model="editedItem.userId"
                            label="出勤人"></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field v-model="editedItem.date" label="出勤日期"
                              prepend-icon="mdi-calendar-multiple" readonly v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="editedItem.date" @input="menu = false"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="4">
            <v-menu ref="menu" v-model="menu2" :close-on-content-click="false"
                    :nudge-right="40" :return-value.sync="editedItem.time"
                    transition="scale-transition" offset-y max-width="290px" min-width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field v-model="editedItem.time" label="出勤时间" prepend-icon="mdi-clock-outline"
                              readonly v-on="on"></v-text-field>
              </template>
              <v-time-picker v-if="menu2" v-model="editedItem.time" use-seconds format="24hr" :scrollable="true"
                             full-width @click:second="$refs.menu.save(editedItem.time)"></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
      </template>
    </crud-table>
  </div>
</template>

<script>
  import CrudTable from "../../components/CrudTable";
  import {API} from "../../api";
  import {Delete, Get, Post} from "@itning/axios-helper";
  import {formatItemResponseDateTime, formatResponseDateTime} from "../../util";
  import dayjs from "dayjs";

  export default {
    name: "StudentAttendanceManagement",
    components: {CrudTable},
    data: () => ({
      isLoading: false,
      headers: [
        {text: '姓名', align: 'start', value: 'user.name',},
        {text: '出勤时间', value: 'gmtModified'},
        {text: '操作', value: 'actions', sortable: false},
      ],
      menu: false,
      menu2: false,
      data: [],
      userData: []
    }),
    methods: {
      initUser() {
        Get(API.student.all)
          .withSuccessCode(200)
          .do(response => {
            this.userData = response.data.data.map(item => {
              item.text = item.name;
              item.value = item.id;
              return item;
            });
          })
      },
      initialize() {
        this.isLoading = true;
        Get(`${API.attendance.all}?roleId=c`)
          .withSuccessCode(200)
          .do(response => {
            this.data = formatResponseDateTime(response.data.data).map(item => {
              item.date = dayjs(item.gmtModified).format("YYYY-MM-DD");
              item.time = dayjs(item.gmtModified).format("HH:mm:ss");
              return item;
            })
            console.log(response.data.data)
          })
          .doAfter(() => {
            this.isLoading = false;
          });
      },
      handleSave(data) {
        if (!data.date || !data.time || !data.userId
          || data.date.trim() === '' || data.time.trim() === '' || data.userId.trim() === '') {
          alert("值不能为空");
          return;
        }
        console.log(JSON.stringify(data));
        Post(API.attendance.addByAdmin)
          .withURLSearchParams({userId: data.userId, date: `${data.date} ${data.time}`})
          .withSuccessCode(201)
          .do(response => {
            const i = formatItemResponseDateTime(response.data.data);
            i.date = dayjs(i.gmtModified).format("YYYY-MM-DD");
            i.time = dayjs(i.gmtModified).format("HH:mm:ss");
            this.data.push(i)
            alert('新增成功');
          })
      },
      handleUpdate(data, index) {
        if (!data.date || !data.time
          || data.date.trim() === '' || data.time.trim() === '') {
          alert("值不能为空");
          return;
        }
        const json = {id: data.id, date: `${data.date} ${data.time}`}
        console.log(`index ${index} data: ${JSON.stringify(data)}`);
        Post(API.attendance.update)
          .withURLSearchParams(json)
          .withSuccessCode(204)
          .do(() => {
            this.initialize();
            alert('修改成功');
          })
      },
      handleDelete(data) {
        console.log(JSON.stringify(data));
        Delete(API.attendance.del + data.id)
          .withSuccessCode(204)
          .do(() => {
            const index = this.data.indexOf(data)
            this.data.splice(index, 1)
            alert('删除成功');
          })
      }
    },
    created() {
      this.initUser();
      this.initialize();
    }
  }
</script>

<style scoped>

</style>
