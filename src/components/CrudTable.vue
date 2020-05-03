<template>
  <v-data-table :headers="headers" :items="data" :search="search"
                :disable-sort="disableSort" :loading="dataLoading">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>{{title}}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field append-icon="mdi-magnify" v-model="search"
                      label="搜索" single-line hide-details></v-text-field>
        <v-divider v-if="!disableAdd" class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn v-show="!disableAdd" color="primary" dark class="mb-2" v-on="on">新增</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <slot :editedItem="editedItem" :isModify="editedIndex!==-1"></slot>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">取消</v-btn>
              <v-btn color="blue darken-1" text @click="save">保存</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }" v-if="!disableDel||!disableEdit">
      <v-icon v-if="!disableEdit" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon v-if="!disableDel" small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    props: {
      // 标题
      title: String,
      // 表头
      headers: Array,
      // 数据
      data: Array,
      // 禁用排序
      disableSort: Boolean,
      // 数据加载中
      dataLoading: Boolean,
      // 禁用新增
      disableAdd: Boolean,
      // 禁用修改
      disableEdit: Boolean,
      // 禁用删除
      disableDel: Boolean
    },
    name: "CrudTable",
    data: () => ({
      dialog: false,
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      search: ''
    }),
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? '新增' : '修改'
      },
    },
    watch: {
      dialog(val) {
        val || this.close()
      },
    },
    methods: {
      editItem(item) {
        this.editedIndex = this.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem(item) {
        if (confirm('确定删除该项？')) {
          this.$emit('delete', item);
        }
      },
      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save() {
        if (this.editedIndex > -1) {
          this.$emit('update', this.editedItem, this.editedIndex);
        } else {
          this.$emit('save', this.editedItem);
        }
        this.close()
      },
    }
  }
</script>

<style scoped>

</style>
