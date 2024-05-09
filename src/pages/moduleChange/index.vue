<template>
  <view class="content">
    <u-collapse v-for="(module, index) in modules" :key="index" accordion :border="false">
      <u-collapse-item :title="module.title" disabled icon="bookmark-fill" class="title">
          <view v-for="(word, index) in module.words" :key="index" class="item">
            <text>{{ word }}</text>
            <uni-icons type="right" size="14"></uni-icons>
          </view>
      </u-collapse-item>
    </u-collapse>

  </view>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import './index.less'

export default defineComponent({
  data() {
    return {
      openList: [],
      modules: [
        {title: 'EAP033', words: ['This is list 1', 'This is list 2', 'This is list 3']},
        {title: 'EAP015', words: ['Test 1', 'Test 2', 'Test 3', 'Test 4']},
      ],
    };
  },
  methods: {
  },
});

</script>