<template>
  <view class="content">
    <view class="studentCard">
      <view class="studentInfo">
        <u-avatar
            size="100"
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
            <uni-icons color='#696969' size='20' type="right"></uni-icons>
          </view>
        </view>
      </view>

      <view class="divider">
        <u-divider/>
      </view>

      <view class="englishContent">
        <view class="bookInfo">
          <view class="bookName">
            <text>EAP033</text>
          </view>
          <view class="edit" @click="goToGoalSetting">
            <text>Change</text>
            <uni-icons color='rgb(195, 195, 195)' size='18' type="right"></uni-icons>
          </view>
        </view>
        <view class="progress">
          <u-line-progress
              :percentage="studiedPercentage"
              :showText="false"
              activeColor="#78A4F4"
          />
        </view>
        <view class="schedule">
          <view>
            <text>{{ studiedWords }} / {{ remainWords }}</text>
          </view>
          <view class="remainDays">
            <text>{{ remainDayNum }} days remaining</text>
          </view>
        </view>
      </view>
    </view>
    <view class="todayGoal">
      <text class="goalText">- Today Goal -</text>
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
      <u-button shape="circle" type='primary'>
        <text>Start Quiz !</text>
      </u-button>
    </view>

  </view>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import './index.less'
import {fetchUserInfo} from "@/services";

export default defineComponent({
  data() {
    return {
      userInfo: {} as { username: string; email: string },
      avatarUrl: "../../static/images/boy_avatar.png",
      remainWords: 3272,
      studiedWords: 666,
      remainDayNum: 100,
    };
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo') || {};
    this.getUserInfo()
    // console.log("onShow", this.userInfo)
  },
  computed: {
    emailUsername(): string {
      return this.userInfo.email ? this.userInfo.email.split('@')[0] : '';
    },
    studiedPercentage(): number {
      return this.studiedWords / this.remainWords * 100
    }
  },
  methods: {
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
    getUserInfo() {
      this.userInfo = uni.getStorageSync('userInfo')
      if (!this.userInfo) {
        const token = uni.getStorageSync('token')
        if (token != '') {
          fetchUserInfo().then((res: any) => {
            this.userInfo = res.data.data
            uni.setStorageSync('userInfo', this.userInfo)
          })
        }
      }
    }
  }
});
</script>