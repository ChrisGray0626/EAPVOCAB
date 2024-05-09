<template>
  <view class="content">
    <view class="title">
      <text>Sign Up</text>
    </view>
    <u--form :modelValue='userInfo'>
      <view class="inputBox">
        <view class="inputLabel">Nickname</view>
        <u-form-item borderBottom="true">
          <u--input
              placeholder="Please Input Your Nickname"
              v-model="userInfo.nickname"
              border="none"
          />
        </u-form-item>
      </view>
      <view class="inputBox">
        <view class="inputLabel">Password</view>
        <u-form-item borderBottom="true">
          <u--input
              placeholder="Please Input Your Password"
              v-model="userInfo.password"
              border="none"
          />
        </u-form-item>
      </view>
      <view class="inputBox">
        <view class="inputLabel">XJTLU Email</view>
        <u-form-item borderBottom="true">
          <u--input
              placeholder="Please Input Your Email"
              v-model="userInfo.email"
              border="none"
          />
        </u-form-item>
      </view>
      <view class="inputBox">
        <view class="inputLabel">Verification Code</view>
        <view class="formContent">
          <u-form-item borderBottom="true">
            <u--input
                placeholder="Verification Code"
                v-model="verificationCode"
                border="none"
            />
          </u-form-item>
          <u-button type='primary' class="sendCodeButton" @click="sendCode">
            {{ isSending ? 'Sending..' : countDown > 0 ? `$Try again in {countDown} seconds` : 'Send Verification Code' }}
          </u-button>
        </view>
      </view>
      <u-button type='primary' @click="signUp">Submit</u-button>
    </u--form>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import './index.less'

import {handleRegister, sendVerificationCode} from "../../services/index"

export default defineComponent({
  data() {
    return {
      userInfo: {} as {
        nickname: string;
        email: string;
        password: string;
      },
      verificationCode: '',
      isSending: false,
      countDown: 0,
    }
  },
  methods: {
    sendCode() {
      if (this.countDown > 0 || this.isSending) {
        return;
      }
      this.isSending = true;
      const data = {
        email: this.userInfo.email,
      };
      sendVerificationCode(data).then(res => {
        if (res.statusCode !== 500) {
          if (res.data.code == 0) {
            // TODO Popup Error Message
            // Taro.atMessage({
            //   message: res.data.msg,
            //   type: 'warning'
            // });
          } else {
            // TODO Popup Success Message
            // Taro.atMessage({
            //   message: "Please check your email",
            //   type: 'success'
            // });
            this.initCountDown();
          }
          this.isSending = false;
        }
      })
    },
    signUp() {
      const data = {
        username: this.userInfo.nickname,
        email: this.userInfo.email,
        password: this.userInfo.password,
        captcha: this.verificationCode,
      };
      this.goToLogin();
      handleRegister(data).then(res => {
        if (res.data.code === 0) {
          // TODO Popup Error Message
          // Taro.atMessage({
          //   message: res.data.msg,
          //   type: 'warning'
          // });
        }
        if (res.data.code === 20000) {
          // TODO Popup Success Message
          // Taro.showToast({title: "Registration successful!", icon: 'success', duration: 2000})
          this.goToLogin();
        }
      })
    },
    goToLogin() {
      uni.redirectTo({
        url: '/pages/login/index'
      })
    },
    initCountDown() {
      this.countDown = 60;
      const timer = setInterval(() => {
        this.countDown--;
        if (this.countDown === 0) {
          clearInterval(timer);
          this.isSending = false;
        }
      }, 1000);
    }
  }
});
</script>