<template>
  <view class="content">
    <view class="upper-content">
      <!--      Remove listening, speaking, reading, writing temporarily-->
      <!--      <view>-->
      <!--        <uni-grid :column="4" :showBorder="false" @change="grid1Change">-->
      <!--          <uni-grid-item v-for="item in items1" :key="item.text">-->
      <!--            <view class="grid-item-box">-->
      <!--              <image :src="item.src" style="width: 3.7em; height: 3.7em" />-->
      <!--              <text>{{ item.text }}</text>-->
      <!--            </view>-->
      <!--          </uni-grid-item>-->
      <!--        </uni-grid>-->
      <!--      </view>-->
      <view style="margin-top: 10px;">
        <uni-grid :column="3" :showBorder="false" @change="grid2Change">
          <uni-grid-item v-for="(item, index) in items2" :index="index">
            <view class="grid-item-box">
              <image :src="item.src" style="width:  3.9em; height:  3.9em" />
              <text>{{ item.text }}</text>
            </view>
          </uni-grid-item>
        </uni-grid>
      </view>
    </view>
<!--    Remove daily Reading temporarily-->
<!--    <view class="dailyReading" @Click="goToArticleDetail">-->
<!--      <view class="top">-->
<!--        <view class="dailyReadyText">-->
<!--          <text>Daily Reading</text>-->
<!--        </view>-->
<!--        <view class="readingMore">-->
<!--          <text class="moreText">More</text>-->
<!--          <uni-icons size="20" type="right" color="rgb(209, 209, 209)" />-->
<!--        </view>-->
<!--      </view>-->
<!--      &lt;!&ndash; 图片 &ndash;&gt;-->
<!--      <view class="contentImage"></view>-->
<!--      &lt;!&ndash; 文章大致内容 &ndash;&gt;-->
<!--      <view class="mainContent">-->
<!--        <text>How Can AI Help Create Flavours?</text>-->
<!--      </view>-->
<!--      <view class="CNContent">-->
<!--        <text>食物味道, AI制造!</text>-->
<!--      </view>-->
<!--    </view>-->
<!--    &lt;!&ndash; 底部信息 &ndash;&gt;-->
<!--    <view class="endMsg">-->
<!--      <text>一 Done~ 一</text>-->
<!--    </view>-->
  </view>
  <!--  悬浮按钮-->
  <view>
    <uni-fab ref="fab" horizontal="right" vertical="bottom" />
  </view>
  <!-- In-Class Quiz Code 弹窗-->
  <view>
    <u-modal :show="isInClassQuizModalShowed" confirmText="Confirm" cancelText="Cancel" :showCancelButton="true"
      @confirm="confirmInClassQuizModal" @cancel="cancelInClassQuizModal" width="300px">
      <view class="inClassQuizModal">
        <view class="title">In-class Quiz</view>
        <u-form>
          <view class='inputBox'>
            <view class='inputLabel'>Code</view>
            <u-form-item borderBottom="true">
              <input v-model="inClassQuizCode" placeholder="Please input the code" />
            </u-form-item>
          </view>
        </u-form>
      </view>
    </u-modal>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {fetchInClassQuiz} from "@/api";
import {handleAccountExpired} from "@/api/permission";
import type {Response} from "@/type";

export default defineComponent({
  data() {
    return {
      items1: [
        { src: '../../static/images/listen.png', width: '100', height: '100', text: 'Listening' },
        { src: '../../static/images/speak.png', width: '100', height: '100', text: 'Speaking' },
        { src: '../../static/images/read.png', width: '100', height: '100', text: 'Reading' },
        { src: '../../static/images/write.png', width: '100', height: '100', text: 'Writing' }
      ],
      items2: [
        { src: '../../static/images/battle.png', width: '100', height: '100', text: 'Word Battle' },
        { src: '../../static/images/quiz.png', width: '100', height: '100', text: 'In-class Quiz' },
        {src: '../../static/images/game.png', width: '100', height: '100', text: 'In-class Game'}
      ],
      isInClassQuizModalShowed: false,
      inClassQuizCode: ""
    };
  },
  methods: {
    grid1Change(e: any) {
      console.log('grid1Change', e);
    },
    grid2Change(e: any) {
      const idx = e.detail.index;
      // Handle word battle
      if (idx === 0) {
        this.goToWordBattle();
      }
      // Handle in-class quiz
      else if (idx === 1) {
        this.showInClassQuizModal();
      }
      // Handle in-class activity
      else if (idx === 2) {
        this.goToInClassActivity();
      }
    },
    async handleInClassQuiz() {
      const data = {
        share_code: this.inClassQuizCode
      }
      let res = await fetchInClassQuiz(data) as Response<any>;
      if (res.code != 20000) {
        return
      }
      // 重置 Code
      this.inClassQuizCode = "";
      uni.setStorageSync("inClassQuiz", res.data);
      uni.showToast({
        title: "Begin in-class quiz!",
        icon: "success"
      })
      this.closeInClassQuizModal();
      this.goToInClassQuiz();
    },
    confirmInClassQuizModal() {
      this.handleInClassQuiz();
    },
    cancelInClassQuizModal() {
      this.closeInClassQuizModal();
    },
    showInClassQuizModal() {
      // 检查用户登录状态
      const token = uni.getStorageSync('token');
      if (!token) {
        handleAccountExpired();
        return;
      }
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
    },
    goToInClassActivity() {
      window.location.href = "http://114.55.87.45:8003/game";
    },
    goToWordBattle() {
      window.location.href = "http://114.55.87.45:8004";
    }
  },
});
</script>
<style lang="less" scoped>
@import './index.less';
</style>