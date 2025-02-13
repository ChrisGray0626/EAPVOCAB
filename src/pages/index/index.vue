<template>
  <view class="content">
    <view class="studentCard">
      <view class="studentInfo">
        <u-avatar
            :size="avatarSize"
            :src="avatarUrl"
        />
        <view v-if="userInfo.username" class="info">
          <view class="username">Hi, {{ userInfo.username }}</view>
          <view class="userid">{{ emailUsername }}</view>
        </view>
        <view v-else class="login" @click="goToLogin">
          <text>Log In</text>
        </view>
        <view class="wordBank" @click="goToWordBank">
          <text>Word Bank</text>
          <view class="rightIcon">
            <uni-icons color='#696969' size='15' type="right"></uni-icons>
          </view>
        </view>
      </view>

      <view class="divider">
        <u-divider/>
      </view>

      <view class="englishContent" v-if="userInfo.cur_lib_name">
        <view class="bookInfo">
          <view class="bookName">
            <text>{{ userInfo.cur_lib_name }}</text>
          </view>
          <view class="change" @click="goToGoalSetting">
            <text>Change</text>
            <uni-icons color='rgb(195, 195, 195)' size='18' type="right"></uni-icons>
          </view>
        </view>
        <view class="progress">
          <u-line-progress
              :percentage="learnedPercentage"
              :showText="false"
              activeColor="#78A4F4"
          />
        </view>
        <view class="schedule">
          <view>
            <text>{{ learnedWordNum }} / {{ wordTotalNum }}</text>
          </view>
          <view class="remainDays">
            <text>{{ remainingDayNum }} days remaining</text>
          </view>
        </view>
      </view>
    </view>
    <!--    Remove today goal-->
    <!--    <view class="todayGoal">-->
    <!--      <text class="goalText">- Today's Goal -</text>-->
    <!--      <view class="goalContent">-->
    <!--        <view class="newWords">-->
    <!--          <text>15</text>-->
    <!--          <text>New</text>-->
    <!--        </view>-->
    <!--        <view class="newWords">-->
    <!--          <text>10</text>-->
    <!--          <text>Review</text>-->
    <!--        </view>-->
    <!--        <view class="newWords">-->
    <!--          <text>25</text>-->
    <!--          <text>Total</text>-->
    <!--        </view>-->
    <!--      </view>-->
    <!--    </view>-->
    <view class='startWords'>
      <u-button shape="circle" type='primary' @click.stop="goToWordTest">
        <text>Start self-test quiz!</text>
      </u-button>
    </view>

  </view>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

import {fetchUserInfo, fetchVocLibLearningPlan} from "@/api";
import type {Response, UserInfo} from "@/type";

export default defineComponent({
  data() {
    return {
      userInfo: {} as UserInfo,
      avatarUrl: "../../static/images/boy_avatar.png",
      curLibName: "",
      learnedWordNum: 0,
      wordTotalNum: 0,
      dailyWordNum: 0,
      learnedPercentage: 0
    };
  },
  async onShow() {
    const token = uni.getStorageSync('token')
    if (token === '') {
      return
    }
    await this.getUserInfo()
    this.getCurLibInfo()
  },
  computed: {
    emailUsername(): string {
      return this.userInfo.email ? this.userInfo.email.split('@')[0] : '';
    },
    remainingWordNum(): number {
      return this.wordTotalNum - this.learnedWordNum
    },
    // learnedPercentage(): number {
    //   return this.learnedWordNum / this.remainingWordNum * 100
    // },
    remainingDayNum(): number {
      return Math.ceil(this.remainingWordNum / this.dailyWordNum)
    },
    avatarSize(): number {
      if (window.innerWidth <= 420) {
        return 50; 
      } else if (window.innerWidth <= 1024) {
        return 65; // 屏幕宽度小于等于1024px时，头像大小为65
      } else {
        return 80; // 屏幕宽度大于1024px时，头像大小为80
      }
    }
  },
  methods: {
    async getUserInfo() {
      const res = await fetchUserInfo() as Response<any>;
      if (res.code != 20000) {
        return
      }
      this.userInfo = res.data
      uni.setStorageSync('userInfo', this.userInfo)
    },
    async getCurLibInfo() {
      const data = {
        voc_lib_id: uni.getStorageSync('userInfo').cur_lib
      }
      const res = await fetchVocLibLearningPlan(data) as Response<any>;
      if (res.code != 20000) {
        return
      }
      console.log(res.data)
      this.dailyWordNum = res.data.word_per_day;
      this.learnedWordNum = res.data.learned_words;
      this.wordTotalNum = res.data.total_words;
      this.learnedPercentage = this.learnedWordNum / this.wordTotalNum * 100
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/index'
      })
    },
    goToWordBank() {
      uni.navigateTo({
        url: '/pages/wordBank/index'
      })
    },
    goToGoalSetting() {
      uni.navigateTo({
        url: '/pages/goalSetting/index'
      })
    },
    goToWordTest() {
      uni.navigateTo({
        url: '/pages/selfQuiz/index'
      })
    }
  }
});
</script>
<style lang="less" scoped>
@import './index.less';
</style>