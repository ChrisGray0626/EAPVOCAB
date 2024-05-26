<template>
  <view class="content">
    <view>
      <uni-fab
          ref="fab"
          horizontal="right"
          vertical="bottom"
      />
    </view>
    <view>
      <uni-grid :column="4" :showBorder="false" @change="grid1Change">
        <uni-grid-item v-for="item in items1" :key="item.text">
          <view class="grid-item-box">
            <image :src="item.src" style="width: 100px; height: 100px"/>
            <text>{{ item.text }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>
    <view>
      <uni-grid :column="3" :showBorder="false" @change="grid2Change">
        <uni-grid-item v-for="(item, index) in items2" :index="index">
          <view class="grid-item-box">
            <image :src="item.src" style="width: 100px; height: 100px"/>
            <text>{{ item.text }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>
    <view class="dailyReading" @Click="goToArticleDetail">
      <view class="top">
        <view class="dailyReadyText">
          <text>Daily Reading</text>
        </view>
        <view class="readingMore">
          <text class="moreText">More</text>
          <uni-icons size="20" type="right" color="rgb(209, 209, 209)"/>
        </view>
      </view>
      <!-- 图片 -->
      <view class="contentImage"></view>
      <!-- 文章大致内容 -->
      <view class="mainContent">
        <text>How Can AI Help Create Flavours?</text>
      </view>
      <view class="CNContent">
        <text>食物味道, AI制造!</text>
      </view>
    </view>
    <!-- 底部信息 -->
    <view class="endMsg">
      <text>一 Done~ 一</text>
    </view>
  </view>
  <!-- In-Class Quiz Code 弹窗-->
  <view>
    <u-modal
        :show="isInClassQuizModalShowed"
        confirmText="Confirm"
        cancelText="Cancel"
        :showCancelButton="true"
        @confirm="confirmInClassQuizModal"
        @cancel="cancelInClassQuizModal"
        width="300px"
    >
      <view class="inClassQuizModal">
        <view class="title">In-Class Quiz</view>
        <u-form>
          <view class='inputBox'>
            <view class='inputLabel'>Code</view>
            <u-form-item borderBottom="true">
              <input
                  v-model="inClassQuizCode"
                  placeholder="Please input the code"
              />
            </u-form-item>
          </view>
        </u-form>
      </view>
    </u-modal>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {fetchInClassQuiz} from "@/services";

export default defineComponent({
  data() {
    return {
      items1: [
        {src: '../../static/images/listen.png', width: '100', height: '100', text: 'Listening'},
        {src: '../../static/images/speak.png', width: '100', height: '100', text: 'Speaking'},
        {src: '../../static/images/read.png', width: '100', height: '100', text: 'Reading'},
        {src: '../../static/images/write.png', width: '100', height: '100', text: 'Writing'}
      ],
      items2: [
        {src: '../../static/images/battle.png', width: '100', height: '100', text: 'Word Battle'},
        {src: '../../static/images/quiz.png', width: '100', height: '100', text: 'In-Class Quiz'},
        {src: '../../static/images/game.png', width: '100', height: '100', text: 'Class Activity'}
      ],
      isInClassQuizModalShowed: false,
      inClassQuizCode: ""
    };
  },
  methods: {
    init() {
      this.inClassQuizCode = "";
    },
    grid1Change(e: any) {
      console.log('grid1Change', e);
    },
    grid2Change(e: any) {
      const idx = e.detail.index;
      if (idx === 1) {
        this.showInClassQuizModal();
      }
    },
    handleInClassQuiz() {
      const data = {
        share_code: this.inClassQuizCode
      }
      fetchInClassQuiz(data).then((res: any) => {
        const code = res.data.code;
        if (code === 20000) {
          this.init();
          uni.setStorageSync("inClassQuiz", res.data.data);
          uni.showToast({
            title: "Begin in-class quiz!",
            icon: "success"
          })
          this.closeInClassQuizModal();
          this.goToInClassQuiz();
        } else {
          uni.showToast({
            title: "Share code is wrong or quiz closed.",
            icon: 'error'
          })
          console.error(res.data)
        }
      })

    },
    confirmInClassQuizModal() {
      this.handleInClassQuiz();
    },
    cancelInClassQuizModal() {
      this.closeInClassQuizModal();
    },
    showInClassQuizModal() {
      this.isInClassQuizModalShowed = true;
    },
    closeInClassQuizModal() {
      this.isInClassQuizModalShowed = false;
    },
    goToInClassQuiz() {
      uni.navigateTo({
        url: '/pages/inClassQuiz/index'
      })
    },
    goToArticleDetail() {
      uni.navigateTo({
        url: '/pages/articleDetail/index'
      })
    }
  },
});
</script>
<style lang="less" scoped>
@import './index.less';
</style>