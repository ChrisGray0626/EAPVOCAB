<template>
  <view class="container">
<!--    TODO word test-->
    <view class="questionBox">
      <view class="question">
        <text>{{ currentQuestion.question }}</text>
      </view>
      <view class="options">
        <radio-group @change="radioChange">
          <view class="option" v-for="(item, index) in currentQuestion.options" :key="index">
            <radio :value="index" :checked="index === selectedAnswer"/>
            <text>{{ item }}</text>
          </view>
        </radio-group>
      </view>
      <view class="submit">
        <u-button type="primary" @click="confirmAnswer">Confirm</u-button>
      </view>
    </view>

    <uni-pagination
        :total="questionCount"
        :pageSize="1"
        :value="currentIndex"
        :current="currentIndex"
        :show-icon="true"
        @change="paginationChange"
    />
  </view>
  <view>{{currentQuestion}}</view>
  <view>{{currentIndex}}</view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {fetchAIQuestion4Word} from "@/services";

export default defineComponent({
  data() {
    return {
      currentIndex: 1,
      questions: [] as Question[],
      question: "What is the definition of fantasy?",
      options: [
        "A genre of fiction that involves magic and supernatural elements",
        "A type of science fiction that takes place in the future",
        "A type of non-fiction that explores real life events",
        "A form of poetry that uses vivid imagery"
      ],
      answer: 1,
      selectedAnswer: -1
    };
  },
  created() {
    this.questions.push({
      question: this.question + "1",
      options: this.options,
      answer: this.answer
    })
    this.questions.push({
      question: this.question + "2",
      options: this.options,
      answer: this.answer
    })
    this.questions.push({
      question: this.question + "3",
      options: this.options,
      answer: this.answer
    })
    // this.getAIQuiz()
  },
  computed: {
    questionCount() {
      return this.questions.length
    },
    currentQuestion() {
      return this.questions[this.currentIndex - 1]
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
    radioChange(e) {
      this.selectedAnswer = e.detail.value
      console.log("selectedAnswer1", this.selectedAnswer)
    },
    paginationChange(e) {
      this.currentIndex = e.current
    },
    confirmAnswer() {
      console.log("selectedAnswer2", this.selectedAnswer)
      console.log("currentQuestion", this.currentQuestion.answer)
      const isCorrect = this.selectedAnswer === this.currentQuestion.answer
      if (isCorrect) {
        uni.showToast({
          title: 'Correct',
          icon: 'success'
        })

        this.currentIndex++
      } else {
        uni.showToast({
          title: 'Incorrect',
          icon: 'error'
        })
      }
      setTimeout(() => {
        this.selectedAnswer = -1
      }, 1000)
    },
  }
})

interface Question {
  question: string;
  options: string[];
  answer: number;
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>