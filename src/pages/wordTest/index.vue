<template>
  <view class="content">
    <!--    TODO word test-->
    <view class="questionBox">
      <view class="question">
        <text>{{ currentQuestion.question }}</text>
      </view>
      <view class="options">
        <radio-group @change="radioChange">
          <view v-for="(item, index) in currentQuestion.options" :key="index">
            <view class="option">
              <radio :value="index.toString()" :checked="index === answers[currentIndex - 1].selectedAnswer"/>
              <text>{{ item }}</text>
            </view>
          </view>
        </radio-group>
      </view>
    </view>
    <view class="pagination">
      <!--        翻页器-->
      <uni-pagination
          :total="questionCount"
          :pageSize="1"
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
import {fetchAIQuestion4Word} from "@/services";

export default defineComponent({
  data() {
    return {
      questions: [] as Question[],
      answers: [] as Answer[],
      currentIndex: 1,
      // selectedAnswer: -1,
      isShowFinishedModal: false,
    };
  },
  created() {
    // this.getAIQuiz()
    const question = "What is the definition of fantasy?";
    const options = [
      "A genre of fiction that involves magic and supernatural elements",
      "A type of science fiction that takes place in the future",
      "A type of non-fiction that explores real life events",
      "A form of poetry that uses vivid imagery"
    ];
    const answer = 1;
    this.questions.push({
      question: question + "1",
      options: options,
      answer: answer
    })
    this.questions.push({
      question: question + "2",
      options: options,
      answer: answer
    })
    this.questions.push({
      question: question + "3",
      options: options,
      answer: answer
    })
    // 初始化答案
    this.answers = new Array(this.questions.length).fill({selectedAnswer: -1, isCorrect: false})
  },
  computed: {
    questionCount() {
      return this.questions.length
    },
    currentQuestion() {
      return this.questions[this.currentIndex - 1]
    },
    // currentAnswer() {
    //   return this.answers[this.currentIndex - 1]
    // },
    isFinished() {
      console.log("answers", this.answers)
      return this.answers.every(item => item.isCorrect)
    }
  },
  methods: {
    // getAIQuiz() {
    //   uni.showLoading({
    //     title: 'Loading'
    //   });
    //   const data = {word: "fantasy"}
    //   fetchAIQuestion4Word(data).then(response => {
    //     console.log(response)
    //     uni.hideLoading()
    //   })
    // },
    radioChange(e: any) {
      // 监听选择
      this.answers.splice(this.currentIndex - 1, 1, {selectedAnswer: e.detail.value, isCorrect: false})
      // this.answers[this.currentIndex - 1].selectedAnswer = e.detail.value
      console.log("answers", this.answers)
    },
    paginationChange(e: any) {
      this.currentIndex = e.current
    },
    confirmAnswer() {
      // console.log("answers", this.answers)
      this.answers[this.currentIndex - 1].isCorrect = Number(this.answers[this.currentIndex - 1].selectedAnswer) === this.currentQuestion.answer
      if (this.answers[this.currentIndex - 1].isCorrect) {
        uni.showToast({
          title: 'Correct',
          icon: 'success'
        })
        // 判断完成情况
        if (this.isFinished) {
          this.isShowFinishedModal = true
          return
        }
        // 翻页
        this.currentIndex++
        this.currentIndex = Math.min(this.currentIndex, this.questionCount)

      } else {
        uni.showToast({
          title: 'Incorrect',
          icon: 'error'
        })
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

interface Question {
  question: string;
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