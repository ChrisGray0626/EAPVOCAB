<template>
  <view class="content">
    <view class="studentCard">
      <view class="studentInfo">
        <u-avatar :src="avatarUrl" size="65" class="avatar" />
        <view class="info">
          <view class="username" v-if="userInfo.username">{{
            userInfo.username
          }}</view>
          <view class="username" v-else @click="goToLogin">Log In</view>
          <view class="userid" v-if="userInfo.username"
            >ID: {{ emailUsername }}</view
          >
        </view>
        <!-- <view class="editMyInfo">
          <uni-icons type="gear" size="40" color="#696969"></uni-icons>
        </view> -->
      </view>
    </view>
    <view class="learnedState" v-if="userInfo.username">
      <view class="stateItem">
        <view>Learned</view>
        <text>{{ learnedWordTotalNum }}</text>
      </view>
      <view class="stateItem">
        <view>Consecutive Days</view>
        <text>{{ consecutiveDayNum }}</text>
      </view>
    </view>
    <view class="studentFunctions">
      <uni-list :border="false">
        <uni-list-item
          clickable
          link
          v-for="(item, index) in functions"
          :to="item.url"
          :key="index"
        >
          <template v-slot:body>
            <view class="functionItem">
              <text>{{ item.title }}</text>
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
    <view class="quitButton" v-show="isLogin">
      <u-button type="error" @click="toLogout">Log Out</u-button>
    </view>

  </view>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  fetchConsecutiveDayNum,
  fetchLearnedWordTotalNum,
  handleLogout,
} from "@/api";
import type { UserInfo } from "@/type";

export default defineComponent({
  data() {
    return {
      userInfo: {} as UserInfo,
      isLogin: false,
      show:true,
      avatarUrl: "../../static/images/boy_avatar.png",
      consecutiveDayNum: 0,
      learnedWordTotalNum: 0,
      functions: [
        {
          title: "Learning Calendar",
          url: "/pages/learningCalendar/index",
        },
        {
          title: "Word Bank",
          url: "/pages/wordBank/index",
        },
        {
          title: "Vocabulary Test",
          url: "/pages/vocabularyTest/index",
        },
        {
          title: "Goal Setting",
          url: "/pages/goalSetting/index",
        },
      ],
    };
  },
  onShow() {
    const token = uni.getStorageSync("token");
    if (token === "") {
      return;
    }
    this.isLogin = true;
    this.userInfo = uni.getStorageSync("userInfo");
    this.getLearnedProgress();
  },
  computed: {
    emailUsername(): string {
      return this.userInfo.email ? this.userInfo.email.split("@")[0] : "";
    },
  },
  methods: {
    async getLearnedProgress() {
      let res = (await fetchConsecutiveDayNum()) as any;
      if (res.code != 20000) {
        return;
      }
      this.consecutiveDayNum = res.data.consecutive_days;
      res = (await fetchLearnedWordTotalNum()) as any;
      if (res.code != 20000) {
        return;
      }
      this.learnedWordTotalNum = res.data.words_learned;
    },
    goToLogin() {
      uni.navigateTo({
        url: "/pages/login/index",
      });
    },
    async toLogout() {
      uni.showModal({
        title: 'Warning',
        content: 'Are you sure you want to log out?',
        success: async (res) => {
            if (res.confirm) {
                await handleLogout();
                uni.showToast({title: "Log out successfully!", icon:'success'})
                uni.clearStorageSync();
                this.userInfo = {};
                this.isLogin = false;
                await uni.navigateTo({
                    url: '/pages/login/index'
                })
            }
        }
    });

    },
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>