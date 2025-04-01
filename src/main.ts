import { createApp } from "vue";
import App from "./App.vue";
// 引入路由配置
import router from "./router";
// 引入Pinia状态管理
import { createPinia } from 'pinia';

// 引入Arco Design组件库
import ArcoVue from '@arco-design/web-vue';
// 引入Arco Design样式
import '@arco-design/web-vue/dist/arco.css';

// 创建应用实例
const app = createApp(App);

// 创建Pinia实例
const pinia = createPinia();

// 注册Arco Design组件库
app.use(ArcoVue);
// 注册Pinia
app.use(pinia);
// 注册路由
app.use(router);

// 挂载应用
app.mount("#app");
