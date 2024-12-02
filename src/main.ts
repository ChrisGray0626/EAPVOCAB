import {createSSRApp} from "vue";
import App from "./App.vue";
import {handlePermission} from "@/api/permission";
import uView from "uview-ui";

export function createApp() {
  const app = createSSRApp(App);
  // Handle permission
  handlePermission();
  // Clear storage
  // uni.clearStorageSync();
  return {
    app,
  };
}
