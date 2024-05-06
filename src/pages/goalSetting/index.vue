<template>
    <view class="index">
        <view class="bookCard">
            <!-- 单词表的图片 -->
            <view class="bookImage"></view>
            <!-- 单词表的描述 -->
            <view class="bookDetails">
                <view class="bookName">
                    EAP033
                    <view class="changeModule" @click="goToChangeModule">
                        <!-- TODO -->
                      <text>Change Module&nbsp;</text>
                      <uni-icons type="refreshempty" size="20" color="#C0C0C0" />
                    </view>
                </view>
                <view class="schedule">
                    <text>{{ studiedWords }} / {{ remainWords }}</text>
                </view>
                <view class="progress">
                    <progress :percent="studiedPercentage" stroke-width="10"/>
                </view>
            </view>
        </view>
        <view class="goalPicker">
            <view class="Divider">
                <view class="msg">
                    <text>Study Plan</text>
                </view>
              <uni-data-picker
                  value="selectedDailyWordNum"
                  placeholder="Please select your study plan"
                  :localdata="alternativePlans"
                  popup-title="Please select your study plan"
              />
            </view>
        </view>
        <view class="saveBtn">
            <button type="primary" @click="goToIndex">Save Plan</button>
        </view>
    </view>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import './index.less'

export default defineComponent({
    data() {
        return {
            remainWords: 3272,
            studiedWords: 666,
            studiedPercentage: 0,
            alternativePlans: [] as {text: string; value: number} [],
            selectedDailyWordNum: 0,
        }
    },
    created() {
        this.studiedPercentage = this.studiedWords / this.remainWords * 100
        for (let i = 1; i <= 50; i++) {
            const dailyWordNum = i * 5
            const dayNum = Math.ceil(this.remainWords / dailyWordNum)
            this.alternativePlans.push({text: `${dailyWordNum} Words ${dayNum} Days`, value: dailyWordNum})
        }
        this.selectedDailyWordNum = this.alternativePlans[0].value
    },
    methods: {
        goToChangeModule() {
            this.$router.push("/changeModule")
        },
        goToIndex() {
            this.$router.push("/index")
        },
    }
})
</script>
