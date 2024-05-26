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
    <view class="confirmButton">
      <u-button type="primary" shape="circle" @click.stop="confirmAnswer">
        <text>Confirm</text>
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
import {setInClassQuizResult, setWordQuizPass} from "@/services";

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
    correctRate() {
      return this.answers.filter(item => item.isCorrect).length / this.totalQuizCount;
    },
    isFinished() {
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
    },
    confirmAnswer() {
      // 设置正误情况
      this.curAnswer.isCorrect = Number(this.curAnswer.selectedAnswer) === this.curQuiz.answer
      // 判断完成情况
      if (this.isFinished) {
        this.showFinishedModal()
        return
      }
      // 翻页
      this.curQuizIdx++
      this.curQuizIdx = Math.min(this.curQuizIdx, this.totalQuizCount - 1)
    },
    confirmFinishedModal() {
      const data = {
        quiz_id: this.quizId,
        correct_rate: this.correctRate,
      }
      setInClassQuizResult(data).then((res: any) => {
        if (res.data.code === 20000) {
          this.closeFinishedModal()
          uni.showToast({
            title: "Submit successfully!",
            icon: "success",
          })
          uni.navigateBack()
        }
        else {
          uni.showToast({
            title: "Submit failed!",
            icon: "error",
          })
          console.error(res.data.msg)
        }
      })
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