<template>
  <div class="flex-row">
    <div v-if="marqueeList.length > 0">
      <div class="flex-row">
        <div class="marque-wrap" :style="stylesWrap">
          <div class="list" :style="styles">
            <div v-for="(item, index) in marqueeList" :key="index" :style="stylesItem" class="item">
              {{item}}
            </div>
            <!-- 最后一个元素和第一个相同 -->
            <div v-if="marqueeList.length > 0" :style="stylesItem" class="item">
              {{marqueeList[0]}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const regNumber = /^\d+$/
  export default {
    name: 'VueMarquee',
    data() {
      return {
        indexMq: 0,
        timer: null,
        // 运动
        styles: {
          top: 0,
          transitionDuration: 0
        },
        // wrap样式
        stylesWrap: {
          width: this.width + 'px',
          height: this.height + 'px',
        },
        // item样式
        stylesItem: {
          height: this.height + 'px',
          lineHeight: this.height + 'px',
          fontSize: this.fontSize + 'px'
        }
      }
    },
    props: {
      // 	宽度（px）
      width: {
        validator(val) {
          return regNumber.test(val)
        },
        default: 200
      },
      // 	高度（px）
      height: {
        validator(val) {
          return regNumber.test(val)
        },
        default: 38
      },
      // fontSize (px)
      fontSize: {
        validator(val) {
          return regNumber.test(val)
        },
        default: 12
      },
      // 	自动播放时间（毫秒）
      autoplay: {
        validator(val) {
          return regNumber.test(val)
        },
        default: 3000
      },
      // 	切换速度（毫秒）
      speed: {
        validator(val) {
          return regNumber.test(val)
        },
        default: 500
      },
      marqueeList: Array
    },
    computed: {
      lenMq() {
        return this.marqueeList ? this.marqueeList.length : 0
      }
    },
    methods: {
      setTop(speed, top) {
        this.styles.transitionDuration = speed + 'ms'
        this.styles.top = top + 'px'
      }
    },
    mounted() {
      // 当前新1个
      // 1.跑马灯无缝循环播放原理：轮播到最后一个的时候，轮播新1而不是老1。
      // 2.轮播到新1后，结束动画后，让老一瞬间就到新一的位置（此应用内联css实现，不得用class实现，因为动态添加class，class再获取样式需要一定时间）
      // 3.以下代码实现，只能往当前的indexMq后面添加数据。若往前传数据，对应的indexMq得加瞬间加到对应位置（处理比较复杂）
      this.timer = setInterval(() => {
        this.setTop(this.speed, -(++this.indexMq * this.height))
        if (this.indexMq >= this.lenMq) {
          // 若当前是新1(最後一個)，
          setTimeout(() => {
            // 瞬间回到老1（第一个）
            this.indexMq = 0
            this.setTop(0, 0)
          }, this.speed)
        }
      }, this.autoplay)
    },
    destroyed() {
      clearInterval(this.timer)
      this.timer = null
      this.indexMq = 0
    }
  }
</script>

<style scoped>
  .flex-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .marque-wrap {
    overflow: hidden;
    position: relative;
  }

  .list {
    position: absolute;
    left: 0;
    top: 0;
  }

  .item {
    margin-left: 12px;

    overflow: hidden;
  }
</style>
