<template>
  <view class="content">
    <view class="studentCard">
      <view class="studentInfo">
        <u-avatar :src="avatarUrl" size="100" class="avatar"/>
        <view class="info">
          <view class="userName">ZiXuan</view>
          <view class="userid">ID: 123456</view>
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
import './index.less'

export default defineComponent({
  data() {
    return {
      avatarUrl: '',
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
})
</script>


