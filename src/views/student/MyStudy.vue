<template>
  <div>
    <v-select class="px-4" :items="learningContent.data" label="学习内容"
              :loading="learningContent.isLoading" :value="learningContent.data[0]"
              @change="handleLearningContentChange"></v-select>
    <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered vjs-fluid mb-4" controls
           preload="auto"></video>
    <v-row v-if="learningContent.data.length!==0">
      <v-col cols="4">
        <v-card class="elevation-16 mx-auto">
          <v-card-title class="headline" primary-title>文件下载</v-card-title>
          <v-card-actions class="justify-start">
            <v-btn color="primary" @click="downloadLearningContent('video')">视频（{{nowLearningContent.size}}）</v-btn>
            <v-btn color="primary" @click="downloadLearningContent('aid')">资料（{{nowLearningContent.aidSize}}）</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="elevation-16 mx-auto">
          <v-card-title class="headline" primary-title>作业上传</v-card-title>
          <v-card-text>
            <v-file-input show-size label="上传作业" v-model="uploadFile"></v-file-input>
            <span>上次上传：{{studentWork.gmtModified?studentWork.gmtModified:'未上传过'}}</span>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="uploadWork">{{studentWork.fileUri?'重新上传':'上传'}}</v-btn>
            <v-btn color="primary" v-if="studentWork.fileUri" @click="downloadWork">下载上次上传的作业（{{studentWork.size}}）
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="elevation-16 mx-auto">
          <v-card-title class="headline" primary-title>教师建议</v-card-title>
          <v-card-text>
            {{studentWork.suggest}}
            <div class="text-center mt-9">
              <v-rating readonly
                        v-model="studentWork.score" color="yellow darken-3"
                        background-color="grey darken-1" empty-icon="$ratingFull" half-increments hover></v-rating>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import {API} from "../../api";
  import {Download, Get, Post} from "@itning/axios-helper";
  import videoLoader from "../../http/videoLoader";
  import {formatFileSize, formatItemResponseDateTime} from "../../util";

  export default {
    name: "MyStudy",
    data() {
      return {
        learningContent: {
          isLoading: false,
          data: [],
          nowId: null
        },
        videoInstance: null,
        videoSrc: null,
        studentWork: {score: 0, suggest: '教师未给出建议和评分'},
        uploadFile: null
      }
    },
    computed: {
      nowLearningContent: function () {
        const learningContent = this.learningContent.data.find(item => item.id === this.learningContent.nowId);
        if (learningContent) {
          learningContent.size = formatFileSize(learningContent.size);
          learningContent.aidSize = formatFileSize(learningContent.aidSize);
          return learningContent;
        } else {
          return {};
        }
      }
    },
    methods: {
      downloadWork() {
        Download(API.studentWork.download + this.studentWork.id, () => "学生作业." + this.studentWork.extensionName)
      },
      uploadWork() {
        const learningContent = this.learningContent.data.find(item => item.id === this.learningContent.nowId);
        if (!this.uploadFile) {
          alert('请选择文件');
          return;
        }
        Post(API.studentWork.upload)
          .withSuccessCode(201)
          .withFormData({studentLearningId: learningContent.studentLearningId, file: this.uploadFile})
          .do(() => {
            this.uploadFile = null;
            this.initStudentWork(this.learningContent.nowId);
            alert('上传成功');
          })
      },
      handleLearningContentChange(id) {
        this.learningContent.nowId = id;
        this.initStudentWork(id);
        this.initialize(id);
      },
      initLearningContent() {
        Get(API.studentLearning.all)
          .withSuccessCode(200)
          .do(response => {
            this.learningContent.data = response.data.data.map(item => {
              item.text = item.name;
              item.value = item.id;
              return item;
            });
            if (this.learningContent.data.length !== 0) {
              this.learningContent.nowId = this.learningContent.data[0].id;
              this.initStudentWork(this.learningContent.data[0].id);
              this.initialize(this.learningContent.data[0].id);
            }
          })
      },
      initialize(id) {
        console.log(`id: ${id}`);
        const videoSrc = this.videoSrc = `http://localhost:8888/video/${id}.m3u8`;
        if (this.videoInstance) {
          this.videoInstance.src(this.videoSrc);
          return;
        }
        const that = this;
        console.log(`加载：${videoSrc}`)
        videojs(this.$refs.videoPlayer, {
          preload: 'auto',
          playbackRates: [0.5, 1, 1.5, 2, 2.5, 3],
        }).ready(function () {
          console.log('videojs ready')
          that.videoInstance = this;
          that.videoInstance.src(that.videoSrc);
        });
      },
      initStudentWork(id) {
        Get(`${API.studentWork.own}?learningContentId=${id}`)
          .withSuccessCode(200)
          .do(response => {
            let data = response.data.data;
            if (data) {
              data = formatItemResponseDateTime(data);
              data.size = formatFileSize(data.size);
              if (!data.suggest) {
                data = {...data, score: 0, suggest: '教师未给出建议和评分'};
              }
            } else {
              data = {score: 0, suggest: '教师未给出建议和评分'};
            }
            this.studentWork = data;
          })
      },
      downloadLearningContent(type) {
        const api = `${API.learningContent.download}${type}/${this.learningContent.nowId}`;
        Download(api, () => `教师资料.${type === 'video' ? this.nowLearningContent.extensionName : this.nowLearningContent.aidExtensionName}`)
      }
    },
    created() {
      videoLoader().then(videojs => {
        console.log('videojs加载状态：' + (videojs !== undefined));
        this.initLearningContent();
      }, e => {
        console.log('videojs加载失败', e)
      });
    },
    beforeDestroy() {
      if (this.videoInstance) {
        this.videoInstance.dispose();
        console.log('videoInstance dispose');
      }
    }
  }
</script>

<style scoped>

</style>
