<template>
<!--  TODO getVocabularyLib-->
  <view class="content">
    <uni-collapse v-for="(module, index) in modules" :key="index" :accordion="true">
      <uni-collapse-item :title="module.title" icon="bookmark-fill">
        <uni-list>
          <uni-list-item v-for="(word, index) in module.words" :key="index">
            <template v-slot:body>
              <view class="item">
                <text>{{ word }}</text>
              </view>
            </template>
            <text>{{ word }}</text>
            <uni-icons type="right" size="14"></uni-icons>
          </uni-list-item>
        </uni-list>
      </uni-collapse-item>
    </uni-collapse>

  </view>
</template>

<script lang="ts">
import {defineComponent} from "vue";

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
  methods: {},
});

</script>
<style lang="less" scoped>
@import './index.less';
</style>