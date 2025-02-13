<template>
  <view class="content">
    <view class="questionBox">

      <view class="word">
        <text>{{ curQuiz.word }}</text>
        
      </view>
      <view class="options">
        <radio-group @change="radioChange">
          <view v-for="(item, index) in curQuiz.options" :key="index">
            <view class="option">
              <radio :value="String(index)" :checked="index === curAnswer.selectedAnswer"/>
              <text>{{ item }}</text>
            </view>
          </view>
        </radio-group>
      </view>
      <!--        显示正确答案-->
      <view class="correctAnswer" v-if="isCorrectAnswerShowed">
        <text>Correct answer:</text>
        {{ curQuiz.options[curQuiz.answer] }}
      </view>
    </view>
    <view class="pagination">
      <!--翻页器-->
      <uni-pagination
          :total="totalQuizCount"
          :pageSize="1"
          :current="curQuizIdx + 1"
          :show-icon="true"
          @change="paginationChange"
      />
    </view>
    <view class="button">
      <u-button type="primary" shape="circle" @click.stop="handleConfirm">
        <text>Confirm</text>
      </u-button>
    </view>
    <view class="button" v-if="isLastQuiz">
      <u-button type='primary' :plain="true" shape="circle" @click.stop="handleSubmit">
        <text>Submit</text>
      </u-button>
    </view>
  </view>
    <!--    完成弹窗-->
  <view>
    <u-modal
        :show="isFinishedModalShowed"
        confirmText="Confirm"
        cancelText="Cancel"
        :showCancelButton="true"
        @confirm="confirmFinishedModal"
        @cancel="cancelFinishedModal"
        width="300px"
    >
      <text>You have finished all tests, do you want to submit?</text>
    </u-modal>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {setInClassQuizResult} from "@/api";
import type {Response} from "@/type";

export default defineComponent({
  created() {
    this.initQuiz();
    this.initAnswer();
  },
  data() {
    return {
      quizId: "",
      quizzes: [] as Quiz[],
      curQuizIdx: 0,
      answers: [] as Answer[],
      isTry: false,
      isFinishedModalShowed: false,
    }
  },
  computed: {
    totalQuizCount() {
      return this.quizzes.length;
    },
    curQuiz() {
      return this.quizzes[this.curQuizIdx];
    },
    curAnswer() {
      return this.answers[this.curQuizIdx];
    },
    isCorrectAnswerShowed() {
      return this.isTry && !this.curAnswer.isCorrect
    },
    correctRate() {
      return this.answers.filter(item => item.isCorrect).length / this.totalQuizCount;
    },
    isLastQuiz() {
      return this.curQuizIdx === this.totalQuizCount - 1;
    }
  },
  methods: {
    initQuiz() {
      const quiz = uni.getStorageSync('inClassQuiz');
      this.quizId = quiz.quiz_id;
      this.quizzes = quiz.quiz_ls;
    },
    initAnswer() {
      for (let i = 0; i < this.quizzes.length; i++) {
        this.answers.push({
          selectedAnswer: -1,
          isCorrect: false,
        });
      }
    },
    radioChange(e: any) {
      // 监听选择
      this.curAnswer.selectedAnswer = Number(e.detail.value)
    },
    paginationChange(e: any) {
      this.curQuizIdx = e.current - 1
      // 设置未作答
      this.isTry = false
    },
    handleConfirm() {
      // 设置已作答
      this.isTry = true
      // 设置正误情况
      this.curAnswer.isCorrect = Number(this.curAnswer.selectedAnswer) === this.curQuiz.answer
      if (this.curAnswer.isCorrect) {
        uni.showToast({
          title: 'Correct',
          icon: 'success'
        })
        // 设置未作答
        this.isTry = false
        if (this.isLastQuiz) {

        } else {
          // 翻页
          this.curQuizIdx++
          this.curQuizIdx = Math.min(this.curQuizIdx, this.totalQuizCount - 1)
        }
      } else {
        uni.showToast({
          title: 'Incorrect',
          icon: 'error'
        })
      }
    },
    handleSubmit() {
      this.showFinishedModal()
    },
    async confirmFinishedModal() {
      const data = {
        quiz_id: this.quizId,
        correct_rate: this.correctRate,
      }
      let res = await setInClassQuizResult(data) as Response<any>;
      if (res.code != 20000) {
        return
      }
      this.closeFinishedModal()
      uni.showToast({
        title: "Submit successfully!",
        icon: "success",
      })
      uni.navigateBack()
    },
    cancelFinishedModal() {
      this.closeFinishedModal()
    },
    showFinishedModal() {
      this.isFinishedModalShowed = true
    },
    closeFinishedModal() {
      this.isFinishedModalShowed = false
    }
  }
})

interface Quiz {
  word: string,
  options: string[],
  answer: number,
}

interface Answer {
  selectedAnswer: number;
  isCorrect: boolean;
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>