<style lang="scss">
@import "uview-ui/index.scss";
</style>

<script lang="ts" setup>
import {onHide, onLaunch, onShow} from "@dcloudio/uni-app";
import { handlePermission } from "./services/permission";

onLaunch(() => {
  console.log("App Launch");
  handlePermission();
  uni.clearStorageSync();
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>