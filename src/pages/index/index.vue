<template>
  <view class="content">
    <view class="studentCard">
      <view class="studentInfo">
        <u-avatar
            size="65"
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
          <view class="edit" @click="goToGoalSetting">
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
            <text>{{ learnedWordNum }} / {{ remainingWordNum }}</text>
          </view>
          <view class="remainDays">
            <text>{{ remainingDayNum }} days remaining</text>
          </view>
        </view>
      </view>
    </view>
    <view class="todayGoal">
      <text class="goalText">- Today's Goal -</text>
      <view class="goalContent">
        <view class="newWords">
          <text>15</text>
          <text>New</text>
        </view>
        <view class="newWords">
          <text>10</text>
          <text>Review</text>
        </view>
        <view class="newWords">
          <text>25</text>
          <text>Total</text>
        </view>
      </view>
    </view>
    <view class='startWords'>
      <u-button shape="circle" type='primary' @click.stop="goToWordTest">
        <text>Start self-test quiz!</text>
      </u-button>
    </view>

  </view>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

import {fetchUserInfo, fetchVocLibLearningPlan} from "@/services";

export default defineComponent({
  data() {
    return {
      userInfo: {} as {
        username: string;
        email: string,
        role: string,
        cur_lib: number,
        cur_lib_name: string,
      },
      avatarUrl: "../../static/images/boy_avatar.png",
      curLibName: "",
      learnedWordNum: -1,
      totalWordNum: -1,
      dailyWordNum: -1,
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
      return this.totalWordNum - this.learnedWordNum
    },
    learnedPercentage(): number {
      return this.learnedWordNum / this.remainingWordNum * 100
    },
    remainingDayNum(): number {
      return Math.ceil(this.remainingWordNum / this.dailyWordNum)
    }
  },
  methods: {
    async getUserInfo() {
      const res = await fetchUserInfo() as any;
      this.userInfo = res.data.data
      uni.setStorageSync('userInfo', this.userInfo)
    },
    async getCurLibInfo() {
      const data = {
        voc_lib_id: uni.getStorageSync('userInfo').cur_lib
      }
      const res = await fetchVocLibLearningPlan(data) as any;
      this.dailyWordNum = res.data.data.word_per_day;
      this.learnedWordNum = res.data.data.learned_words;
      this.totalWordNum = res.data.data.total_words;
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