<template>
  <view class="content">
    <view class="bookCard">
      <!-- 单词表的图片 -->
      <view class="bookImage"></view>
      <!-- 单词表的描述 -->
      <view class="bookDetails">
        <view class="bookName">
          <text>EAP033</text>
          <navigator hover-class="none" url="/pages/moduleChange/index">
            <view class="changeModule">
              <text>Change Module</text>
              <uni-icons color="#C0C0C0" size="18" type="refreshempty" style="margin-left: 5px;"/>

            </view>
          </navigator>
        </view>
        <view class="schedule">
          <text>{{ studiedWords }} / {{ remainWords }}</text>
        </view>
        <view class="progress">
          <progress :percent="studiedPercentage" stroke-width="14" activeColor="#78A4F4"/>
        </view>
      </view>
    </view>
    <view class="goalPicker">
      <view class="Divider">
        <uni-data-picker
            :localdata="alternativePlans"
            placeholder="Please select your study plan"
            popup-title="Please select your study plan"
            value="selectedDailyWordNum"
        />
      </view>
    </view>
    <navigator hover-class="none" url="/pages/index/index">

      <view class="saveBtn">
        <button type="primary">Save Plan</button>
      </view>
    </navigator>

  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import './index.less'

export default defineComponent({
  data() {
    return {
      remainWords: 3272,
      studiedWords: 666,
      alternativePlans: [] as { text: string; value: number } [],
      selectedDailyWordNum: 0,
    }
  },
  created() {
    this.initAlternativePlans()
  },
  computed: {
    studiedPercentage(): number {
      return this.studiedWords / this.remainWords * 100
    }
  },

  methods: {
    initAlternativePlans() {
      for (let i = 1; i <= 50; i++) {
        const dailyWordNum = i * 5
        const dayNum = Math.ceil(this.remainWords / dailyWordNum)
        this.alternativePlans.push({text: `${dailyWordNum} Words ${dayNum} Days`, value: dailyWordNum})
      }
      this.selectedDailyWordNum = this.alternativePlans[0].value
    },
  }
})
</script>
