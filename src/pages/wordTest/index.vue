<template>
  <view class="content">
    <view class="questionBox">
      <view class="word">
        <text>{{ curWordQuiz.word }}</text>
      </view>
      <view class="question">
        <text>{{ curQuestion.text }}</text>
      </view>
      <view class="options">
        <radio-group @change="radioChange">
          <view v-for="(item, index) in curQuestion.options" :key="index">
            <view class="option">
              <radio :value="String(index)" :checked="index === curAnswer.selectedAnswer"/>
              <text>{{ item }}</text>
            </view>
          </view>
        </radio-group>
      </view>
    </view>
    <view class="pagination">
      <!--        翻页器-->
      <uni-pagination
          :total="curTotalQuestionCount"
          :pageSize="1"
          :current="curQuestionIdx + 1"
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
  <view>
    <!--    完成弹窗-->
    <u-modal
        :show="isShowFinishedModal"
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
import {fetchSelfQuiz, passWordQuiz} from "@/services";

export default defineComponent({
  data() {
    return {
      wordQuizzes: [] as WordQuiz[],
      answers: [] as Answer[][],
      curWordQuizIdx: 0,
      curQuestionIdx: 0,
      isShowFinishedModal: false,
    };
  },
  created() {
    this.getSelfQuiz()
    // console.log("answers", this.answers)
  },
  computed: {
    totalWordQuizCount() {
      return this.wordQuizzes.length
    },
    curWordQuiz() {
      return this.wordQuizzes[this.curWordQuizIdx]
    },
    curQuestions() {
      return this.curWordQuiz.questions
    },
    curTotalQuestionCount() {
      return this.curQuestions.length
    },
    curQuestion() {
      return this.curQuestions[this.curQuestionIdx]
    },
    curAnswer() {
      return this.answers[this.curWordQuizIdx][this.curQuestionIdx]
    },
    isCurWordQuizFinished() {
      return this.curQuestionIdx === this.curTotalQuestionCount - 1
    },
    isCurWordQuizPass() {
      // 任意一题正确即为通过
      // console.log("curAnswer", this.answers[this.curWordQuizIdx])
      return this.answers[this.curWordQuizIdx].some((answer: Answer) => answer.isCorrect)
    },
    isFinished() {
      // console.log("curWordIdx", this.curWordQuizIdx)
      // console.log("curQuestionIdx", this.curQuestionIdx)
      return (this.curWordQuizIdx === this.totalWordQuizCount - 1) && (this.curQuestionIdx === this.curTotalQuestionCount - 1)
    }
  },
  methods: {
    getSelfQuiz() {
      uni.showLoading({
        title: "Loading quiz!"
      });
      const vocLibId = uni.getStorageSync('userInfo').cur_lib

      const data = {
        voc_lib_id: vocLibId
      }
      fetchSelfQuiz(data).then((res: any) => {
        this.wordQuizzes = res.data.data
        // console.log("wordQuestions", this.wordQuestions)
        // 初始化答案
        this.initAnswers()
        uni.hideLoading()
      })
    },
    initAnswers() {
      for (let i = 0; i < this.totalWordQuizCount; i++) {
        const totalQuestionCount = this.wordQuizzes[i].questions.length
        this.answers[i] = new Array(totalQuestionCount)
        for (let j = 0; j < totalQuestionCount; j++) {
          this.answers[i][j] = {
            selectedAnswer: -1,
            isCorrect: false
          }
        }
      }
    },
    radioChange(e: any) {
      // 监听选择
      this.curAnswer.selectedAnswer = Number(e.detail.value)
      // console.log("answers", this.answers)
    },
    paginationChange(e: any) {
      this.curQuestionIdx = e.current - 1
    },
    confirmAnswer() {
      // console.log("answers", this.answers)
      // 判断正误情况
      this.curAnswer.isCorrect = Number(this.curAnswer.selectedAnswer) === this.curQuestion.answer
      if (this.curAnswer.isCorrect) {
        uni.showToast({
          title: 'Correct',
          icon: 'success'
        })
      } else {
        uni.showToast({
          title: 'Incorrect',
          icon: 'error'
        })
      }
      // console.log("isCurWordQuizFinished", this.isCurWordQuizFinished)
      // console.log("isCurWordQuizPass", this.isCurWordQuizPass)
      // 判断当前单词的完成情况
      if (this.isCurWordQuizFinished) {
        // 当前单词测试通过情况
        if (this.isCurWordQuizPass) {
          const data = {
            word_id: this.curWordQuiz.word_id
          }
          // 发送通过请求
          passWordQuiz(data).then((res: any) => {
            // console.log("passWordQuiz", res)
          })
        }
      }
      // 判断完成情况
      if (this.isFinished) {
        this.isShowFinishedModal = true
        return
      }
      // 翻页
      this.curQuestionIdx++
      if (this.curQuestionIdx === this.curTotalQuestionCount) {
        this.curWordQuizIdx++
        this.curQuestionIdx = 0
      }
    },
    confirmFinishedModal() {
      this.isShowFinishedModal = false
      uni.showToast({
        title: 'Submit successfully',
        icon: 'success'
      })
      this.goBack()
    },
    cancelFinishedModal() {
      this.isShowFinishedModal = false
    },
    goBack() {
      uni.navigateBack()
    },
  }
})

interface WordQuiz {
  word_id: number;
  word: string;
  questions: Question[];
}

interface Question {
  qus_id: number;
  text: string;
  options: string[];
  answer: number;
}

interface Answer {
  selectedAnswer: number;
  isCorrect: boolean;
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>