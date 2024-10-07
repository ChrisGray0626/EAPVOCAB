<template>
  <view class="content">
    <view class="studentCard">
      <view class="studentInfo">
        <u-avatar :src="avatarUrl" size="65" class="avatar"/>
        <view class="info">
          <view class="username" v-if="userInfo.username" >{{userInfo.username}}</view>
          <view class="username" v-else @click="goToLogin">Log In</view>
          <view class="userid" v-if="userInfo.username">ID: {{ emailUsername }}</view>
        </view>
        <view class="editMyInfo">
          <uni-icons type="gear" size="40" color="#696969"></uni-icons>
        </view>
      </view>
    </view>
    <view class="studentState">
      <view class="stateItem">
        <view>Learned</view>
        <text>900</text>
      </view>
      <view class="stateItem">
        <view>Consecutive Days</view>
        <text>40</text>
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
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  data() {
    return {
      userInfo: {} as { username: string; email: string },
      avatarUrl: "../../static/images/boy_avatar.png",
      functions: [
        {
          title: 'Learning Calendar',
          url: '/pages/learningCalendar/index',
        },
        {
          title: 'Word Bank',
          url: '/pages/wordBank/index',
        },
        {
          title: 'Vocabulary Test',
          url: '/pages/vocabularyTest/index',
        },
        {
          title: 'Goal Setting',
          url: '/pages/goalSetting/index',
        },
      ],
    };
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo') || {};
  },
  computed: {
    emailUsername(): string {
      return this.userInfo.email ? this.userInfo.email.split('@')[0] : '';
    },
  },
  methods: {
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/index'
      })
    },
  }
})
</script>
<style lang="less" scoped>
@import './index.less';
</style>