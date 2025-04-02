<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const dnspodId = ref("");
const dnspodToken = ref("");
const loading = ref(false);

async function handleLogin() {
  if (!dnspodId.value || !dnspodToken.value) {
    Message.error('请输入DNSPod ID和Token');
    return;
  }
  
  try {
    loading.value = true;
    await authStore.login(dnspodId.value, dnspodToken.value);
    Message.success('认证成功');
    router.push('/domain-management');
  } catch (error) {
    Message.error('认证失败: ' + (error instanceof Error ? error.message : 'Unknown error'));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <!-- 未登录时显示登录界面 -->
    <main v-if="!authStore.isLoggedIn" class="container">
      <h1>DNSPod客户端</h1>
      
      <a-card class="login-card">
        <h2>DNSPod认证</h2>
        <form @submit.prevent="handleLogin">
          <a-form-item label="DNSPod ID" required>
            <a-input v-model="dnspodId" placeholder="请输入DNSPod ID" />
          </a-form-item>
          <a-form-item label="DNSPod Token" required>
            <a-input-password v-model="dnspodToken" placeholder="请输入DNSPod Token" />
          </a-form-item>
          <a-button 
            type="primary" 
            html-type="submit" 
            :loading="loading"
            style="width: 100%"
          >
            登录
          </a-button>
        </form>
      </a-card>
    </main>
    
    <!-- 登录后显示路由内容 -->
    <router-view v-else />
  </div>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}

.login-card {
  width: 420px;
  margin: 0 auto;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 32px;
  font-size: 20px;
  font-weight: 500;
  color: #1d2129;
}

.a-form-item {
  margin-bottom: 20px;
}

.a-input, .a-input-password {
  border-radius: 6px;
  padding: 12px 16px;
  width: 100%;
  border: 1px solid #e5e6eb;
  transition: border-color 0.2s;
  margin-bottom: 16px;
}

.a-input:hover, .a-input-password:hover {
  border-color: #c9cdd4;
}

.a-input:focus, .a-input-password:focus {
  border-color: #165dff;
}

</style>
<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.tauri:hover {
  filter: drop-shadow(0 0 2em #24c8db);
}

.row {
  display: flex;
  justify-content: center;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}

</style>