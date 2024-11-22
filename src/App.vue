<script lang="ts" setup>
import {onHide, onLaunch, onShow} from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import "uview-ui/index.scss";
</style>
<style lang="less">
@import "./index.less";
</style>