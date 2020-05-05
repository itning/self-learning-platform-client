<template>
  <div>
    <v-select class="px-4" :items="subjectData" label="科目"
              :loading="isSubjectLoading" :value="subjectData[0]" @change="handleSubjectChange"></v-select>
    <crud-table title="学习内容管理" :headers="headers" :data="data" :data-loading="isLoading"
                :disable-add="subjectData.length===0"
                @save="handleSave" @update="handleUpdate" @delete="handleDelete">
      <template v-slot="{editedItem,isModify}">
        <v-row>
          <v-col cols="4">
            <v-text-field v-model="editedItem.name" label="名称"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-file-input :disabled="isModify" show-size accept="video/*" v-model="editedItem.file"
                          label="视频文件"></v-file-input>
          </v-col>
          <v-col cols="4">
            <v-file-input :disabled="isModify" show-size v-model="editedItem.aid"
                          label="资料文件"></v-file-input>
          </v-col>
        </v-row>
      </template>
    </crud-table>
    <v-dialog v-model="isUploadDialogVisible" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">正在上传</v-card-title>
        <v-card-text>
          <v-row justify="center">
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="uploadProgress"
              color="teal"
            >
              {{ uploadProgress }}
            </v-progress-circular>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="isUploadDialogVisible = false">后台上传</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </div>
</template>

<script>
  import CrudTable from "../../components/CrudTable";
  import {API} from "../../api";
  import {Delete, Get, Patch, Post} from "@itning/axios-helper";
  import {formatFileSize, formatItemResponseDateTime, formatResponseDateTime} from "../../util";

  export default {
    name: "LearningContent",
    components: {CrudTable},
    data: () => ({
      isUploadDialogVisible: false,
      isSubjectLoading: false,
      isLoading: false,
      uploadProgress: 0,
      headers: [
        {text: '名称', align: 'start', value: 'name',},
        {text: '视频大小', value: 'size',},
        {text: '视频扩展名', value: 'extensionName',},
        {text: '资料大小', value: 'aidSize',},
        {text: '资料扩展名', value: 'aidExtensionName',},
        {text: '创建时间', value: 'gmtCreate'},
        {text: '修改时间', value: 'gmtModified'},
        {text: '操作', value: 'actions', sortable: false},
      ],
      data: [],
      subjectData: [],
      nowSubjectId: null
    }),
    methods: {
      handleSubjectChange(id) {
        this.nowSubjectId = id;
        this.initialize(id);
      },
      initSubjects() {
        this.isSubjectLoading = true;
        Get(API.subject.all)
          .withSuccessCode(200)
          .do(response => {
            this.subjectData = response.data.data.map(item => {
              item.text = item.name;
              item.value = item.id;
              return item;
            });
            if (this.subjectData.length !== 0) {
              this.nowSubjectId = this.subjectData[0].id;
              this.initialize(this.subjectData[0].id);
            }
          })
          .doAfter(() => {
            this.isSubjectLoading = false;
          });
      },
      initialize(id) {
        this.isLoading = true;
        Get(`${API.learningContent.all}?subjectId=${id}`)
          .withSuccessCode(200)
          .do(response => {
            this.data = formatResponseDateTime(response.data.data).map(item => {
              item.size = formatFileSize(item.size);
              item.aidSize = formatFileSize(item.aidSize);
              return item;
            });
          })
          .doAfter(() => {
            this.isLoading = false;
          });
      },
      handleSave(data) {
        if (!data.name || !data.file || !data.aid || data.name.trim() === '') {
          alert("值不能为空");
          return;
        }
        this.uploadProgress = 0;
        this.isUploadDialogVisible = true;
        Post(API.learningContent.add)
          .withFormData({...data, subjectId: this.nowSubjectId}, progress => {
            this.uploadProgress = progress;
          })
          .withSuccessCode(201)
          .do(response => {
            const i = formatItemResponseDateTime(response.data.data);
            i.size = formatFileSize(i.size);
            this.data.push(i);
            alert('新增成功');
          })
          .doAfter(() => {
            this.isUploadDialogVisible = false;
          })
      },
      handleUpdate(data, index) {
        if (!data.name || data.name.trim() === '') {
          alert("值不能为空");
          return;
        }
        const json = {id: data.id, name: data.name}
        Patch(API.learningContent.update)
          .withJson(json)
          .withSuccessCode(204)
          .do(() => {
            this.initialize(this.nowSubjectId);
            alert('修改成功');
          })
      },
      handleDelete(data) {
        Delete(API.learningContent.del + data.id)
          .withSuccessCode(204)
          .do(() => {
            const index = this.data.indexOf(data)
            this.data.splice(index, 1)
            alert('删除成功');
          })
      }
    },
    created() {
      this.initSubjects();
    }
  }
</script>

<style scoped>

</style>
