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
              placeholder="Please Input Your Email"
              @change="changeEmail"
              border="none"
          />
        </u-form-item>
      </view>
      <view class='inputBox'>
        <text class='inputLabel'>Password</text>
        <u-form-item borderBottom="true">
          <u-input
              placeholder="Please Input Your Password"
              @change="changePassword"
              border="none"
              password
          />
        </u-form-item>
      </view>
      <u-button type='primary' class='SignInButton' @click="login">Sign in</u-button>
      <u-button type='primary' plain="true" class='SignUpButton' @click="goToRegister">Sign up</u-button>
    </u-form>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import './index.less'

import {getUserInfo, handleLogin} from "@/services"

export default defineComponent({
  data() {
    return {
      email: '123',
      password: '',
    };
  },
  computed: {},
  methods: {
    login: async function () {
      let data = {
        email: this.email,
        password: this.password
      }
      // TODO const res = await
      handleLogin(data).then((res: any) => {
        if (res.data.code == 20000) {
          getUserInfo().then((res: any) => {
            uni.setStorageSync('userInfo', res.data.data)
            uni.showToast({title: "Login successful!", icon: 'success'})
            uni.switchTab({
              url: "/pages/index/index"
            })
          })
          this.gotoIndex()
        } else {
          uni.showToast({title: "Login failed. Please check your email and password!", icon: 'error'})
        }
      })
    },
    gotoIndex() {
      uni.switchTab({
        url: '/pages/index/index'
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