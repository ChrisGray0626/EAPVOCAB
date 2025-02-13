<template>
  <view class="content">
    <view class="bookCard">
      <!-- 单词表的图片 -->
      <view>
        <libIcon :libName="userInfo.cur_lib_name.split(' ')[0]"/>
      </view>
      <!-- 单词表的描述 -->
      <view class="bookDetails">
        <view class="bookName">
          <text>{{ userInfo.cur_lib_name }}</text>
          <navigator hover-class="none" url="/pages/moduleChange/index">
            <view class="changeModule">
              <text>Change Module</text>
              <uni-icons color="#C0C0C0" size="18" style="margin-left: 5px;" type="refreshempty"/>
            </view>
          </navigator>
        </view>
        <view class="schedule">
          <text>{{ learnedWordNum }} / {{ wordTotalNum }}</text>
        </view>
        <view class="progress">
          <u-line-progress
              :percentage="learnedPercentage"
              :showText="false"
              activeColor="#78A4F4"
          />
        </view>
      </view>
    </view>
    <u-divider/>

    <view class="goalPicker">
      <view class="selectedPlan" @click="show">
        <text>Learning Plan: {{ selectedDailyWordNum }} words {{ selectedDayNum }} days</text>
      </view>
      <view>
        <picker-view :value="pickerIdx" @change="pickerChange">
          <picker-view-column>
            <view style="line-height: 35px;" class="item" v-for="(item, index) in dailyWordNums" :key="index">{{ item }} words</view>
          </picker-view-column>
          <picker-view-column>
            <view style="line-height: 35px;" class="item" v-for="(item, index) in dayNums" :key="index">{{ item }} days</view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
    <view class="saveBtn">
      <u-button shape="circle" type="primary" @click.stop="savePlan">Save Plan</u-button>
    </view>

  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {fetchVocLibLearningPlan, setVocLibLearningPlan} from "@/api";
import type {Response, UserInfo} from "@/type";

export default defineComponent({
  data() {
    return {
      userInfo: {} as UserInfo,
      isShow: true,
      wordTotalNum: 0,
      learnedWordNum: 0,
      dailyWordNum: 0,
      alternativePlans: [] as string[][],
      selectedPlan: "",
      dailyWordNums: [] as Number[],
      dayNums: [] as Number[],
      pickerIdx: [0, 0],
      learnedPercentage: 0
    }
  },
  created() {
  },
  async onShow() {
    this.dailyWordNums = []
    this.dayNums = []
    this.alternativePlans = []
    this.userInfo = uni.getStorageSync('userInfo');
    console.log("userInfo", this.userInfo)
    await this.getCurLibInfo();

    this.initAlternativePlans()
  },
  computed: {
    remainingWordNum(): number {
      return this.wordTotalNum - this.learnedWordNum
    },

    selectedDailyWordNum() {
      return this.dailyWordNums[this.pickerIdx[0]]
    },
    selectedDayNum() {
      return this.dayNums[this.pickerIdx[1]]
    },
  },

  methods: {
    initAlternativePlans() {
      // Init alternative plans
      let ll = []
      for (let i = 1; i <= this.remainingWordNum / 5; i++) {
        const dailyWordNum = i * 5
        const dayNum = Math.ceil(this.remainingWordNum / dailyWordNum)
        if (this.dayNums.slice(-1)[0] === dayNum) {
          continue
        }
        this.dailyWordNums.push(dailyWordNum)
        this.dayNums.push(dayNum)
        ll.push(`${dailyWordNum} Words ${dayNum} Days`)
      }
      this.alternativePlans.push(ll)
      this.selectedPlan = this.alternativePlans[0][0]
      // Init picker index
      const tmp = this.dailyWordNum / 5 - 1
      this.pickerIdx = [tmp, tmp]
    },
    async getCurLibInfo() {
      const data = {
        voc_lib_id: this.userInfo.cur_lib
      }
      const res = await fetchVocLibLearningPlan(data) as Response<any>;
      if (res.code != 20000) {
        return
      }
      this.dailyWordNum = res.data.word_per_day;
      this.learnedWordNum = res.data.learned_words;
      this.wordTotalNum = res.data.total_words;
      this.learnedPercentage = this.learnedWordNum / this.wordTotalNum * 100
    },
    pickerChange(e: any) {
      // console.log(e)
      // 分别比较两个值，如果一个有变化则同步更新另一个
      const changedValues = e.detail.value
      let updatedValue = -1
      if (changedValues[0] !== this.pickerIdx[0]) {
        updatedValue = changedValues[0]
      }
      else if (changedValues[1] !== this.pickerIdx[1]) {
        updatedValue = changedValues[1]
      }
      this.pickerIdx = [updatedValue, updatedValue]
    },
    confirm(e: any) {
      this.isShow = false
      this.selectedPlan = e.value[0]
    },
    cancel() {
      this.isShow = false
    },
    show() {
      this.isShow = true
    },
    async savePlan() {
      const data = {
        voc_lib_id: this.userInfo.cur_lib,
        new_word_per_day: this.selectedDailyWordNum,
      }
      const res = await setVocLibLearningPlan(data) as Response<any>;
      if (res.code != 20000) {
        return
      }
      uni.showToast({title: "Save successfully!", icon: 'success'})
      this.goBack();
    },
    goBack() {
      uni.navigateBack()
    }
  },
})
</script>
<style lang="less" scoped>
@import './index.less';
</style>