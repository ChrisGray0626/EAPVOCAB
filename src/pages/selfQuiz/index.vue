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
      <!--        显示正确答案-->
      <view class="correctAnswer" v-if="isCorrectAnswerShowed">
        <text>Correct answer:</text>
        {{ curQuestion.options[curQuestion.answer] }}
      </view>
    </view>
    <!--        翻页器-->
    <view class="pagination">
      <uni-pagination
          :total="curTotalQuestionCount"
          :pageSize="1"
          :current="curQuestionIdx + 1"
          :show-icon="true"
          @change="paginationChange"
      />
    </view>
    <view class="button">
      <u-button type="primary" shape="circle" @click.stop="handleConfirm">
        <text>Confirm</text>
      </u-button>
    </view>
    <view class="button" v-if="!isLastWord">
      <u-button type='primary' :plain="true" shape="circle" @click.stop="handleNextWord">
        <text>Next word</text>
      </u-button>
    </view>
    <view class="button" v-if="isLastWord">
      <u-button type='primary' :plain="true" shape="circle" @click.stop="handleSubmit">
        <text>Submit</text>
      </u-button>
    </view>
  </view>
  <!--    完成弹窗-->
  <view>
    <u-modal
        :show="isSubmitModalShowed"
        confirmText="Confirm"
        cancelText="Cancel"
        :showCancelButton="true"
        @confirm="confirmOfSubmitModal"
        @cancel="cancelOfSubmitModal"
        width="300px"
    >
      <text>You have finished all tests, do you want to submit?</text>
    </u-modal>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {fetchSelfQuiz, setWordQuizPass} from "@/services";

export default defineComponent({
  data() {
    return {
      wordQuizzes: [] as WordQuiz[],
      answers: [] as Answer[][],
      curWordQuizIdx: 0,
      curQuestionIdx: 0,
      isTry: false,
      isSubmitModalShowed: false,
    };
  },
  mounted() {
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
    isCorrectAnswerShowed() {
      return this.isTry && !this.curAnswer.isCorrect
    },
    isLastWord() {
      return this.curWordQuizIdx === this.totalWordQuizCount - 1
    },
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
        this.initAnswer()
        uni.hideLoading()
      })
    },
    initAnswer() {
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
      // 设置未作答
      this.isTry = false
    },
    handleConfirm() {
      // 设置已作答
      this.isTry = true
      // 判断正误情况
      // console.log("answers", this.answers)
      this.curAnswer.isCorrect = Number(this.curAnswer.selectedAnswer) === this.curQuestion.answer
      if (this.curAnswer.isCorrect) {
        uni.showToast({
          title: 'Correct',
          icon: 'success'
        })
        // 设置未作答
        this.isTry = false
        // 判断是否为最后一题
        const isLastQuestion = this.curQuestionIdx === this.curTotalQuestionCount - 1
        if (isLastQuestion) {
          // 判断单词是否通过
          const isWordPass = this.answers[this.curWordQuizIdx].some((answer: Answer) => answer.isCorrect)
          if (isWordPass) {
            const data = {
              word_id: this.curWordQuiz.word_id
            }
            // 发送通过请求
            setWordQuizPass(data).then((res: any) => {
              // console.log("passWordQuiz", res)
            })
          }
        } else {
          // 翻页至下一题
          this.curQuestionIdx++
          this.curQuestionIdx = Math.min(this.curQuestionIdx, this.curTotalQuestionCount - 1)
        }
      } else {
        uni.showToast({
          title: 'Incorrect',
          icon: 'error'
        })
      }
    },
    handleNextWord() {
      // 翻页至下一词
      this.curWordQuizIdx++
      this.curWordQuizIdx = Math.min(this.curWordQuizIdx, this.totalWordQuizCount - 1)
      this.curQuestionIdx = 0
      // 设置未作答
      this.isTry = false
    },
    handleSubmit() {
      this.showFinishedModal()
    },
    confirmOfSubmitModal() {
      this.closeFinishedModal()
      uni.showToast({
        title: 'Submit successfully',
        icon: 'success'
      })
      this.goBack()
    },
    cancelOfSubmitModal() {
      this.closeFinishedModal()
    },
    showFinishedModal() {
      this.isSubmitModalShowed = true
    },
    closeFinishedModal() {
      this.isSubmitModalShowed = false
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