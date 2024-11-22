<template>
  <view class='content'>
    <view class='title'>
      <text>Welcome!</text>
    </view>
    <u-form>
      <view class='inputBox'>
        <view class='inputLabel'>Email</view>
        <u-form-item borderBottom="true">
          <u-input
              placeholder="Please input your email"
              @change="changeEmail"
              border="none"
          />
        </u-form-item>
      </view>
      <view class='inputBox'>
        <text class='inputLabel'>Password</text>
        <u-form-item borderBottom="true">
          <u-input
              placeholder="Please input your password"
              @change="changePassword"
              border="none"
              password
          />
        </u-form-item>
      </view>
      <u-button type='primary' class='SignInButton' @click.stop="login">Sign in</u-button>
      <u-button type='primary' :plain="true" class='SignUpButton' @click.stop="goToRegister">Sign up</u-button>
    </u-form>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

import {fetchUserInfo, handleLogin} from "@/api"
import {checkEmail, checkFieldIsEmpty} from "@/util/fieldUtil";
import type {Response} from "@/type";

export default defineComponent({
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {},
  methods: {
    login: async function () {
      // Check email
      if (!checkEmail(this.email)) {
        return;
      }
      // Check password
      if (checkFieldIsEmpty(this.password, 'password')) {
        return;
      }
      let data = {
        email: this.email,
        password: this.password
      }
      let res = await handleLogin(data) as Response<any>;
      if (res.code === 0) {
        uni.showToast({title: "Login failed. Please check your email and password!", icon: 'error'})
        return
      }
      if (res.code != 20000) {
        return
      }
      res = await fetchUserInfo() as Response<any>;
      if (res.code != 20000) {
        return
      }
      uni.setStorageSync('userInfo', res.data)
      uni.showToast({title: "Login successfully!", icon: 'success'})
      this.gotoIndex()
    },
    gotoIndex() {
      uni.switchTab({
        url: '/pages/index/index',
      })
    },
    goToRegister() {
      uni.navigateTo({
        url: '/pages/register/index'
      })
    },
    changeEmail(value: string) {
      this.email = value
    },
    changePassword(value: string) {
      this.password = value
    }

  }
});
</script>
<style lang="less" scoped>
@import './index.less';
</style>