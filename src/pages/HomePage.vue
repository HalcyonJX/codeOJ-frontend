<template>
  <div id="homePage">
    <div class="hero-section">
      <h1 class="title">欢迎来到编程刷题网</h1>
      <p class="subtitle">提升编程能力，开启你的技术之旅</p>
      <div class="action-buttons">
        <a-button type="primary" size="large" @click="toQuestions">
          <template #icon>
            <code-outlined />
          </template>
          开始刷题
        </a-button>
      </div>
    </div>

    <div class="features-section">
      <h2 class="section-title">为什么选择我们？</h2>
      <a-row :gutter="[24, 24]">
        <a-col :span="8">
          <div class="feature-card">
            <rocket-outlined class="feature-icon" />
            <h3>丰富的题目库</h3>
            <p>包含算法、数据结构、数据库等多个领域的精选题目</p>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="feature-card">
            <thunderbolt-outlined class="feature-icon" />
            <h3>实时判题系统</h3>
            <p>快速的判题反馈，帮助你及时发现问题并改进</p>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="feature-card">
            <trophy-outlined class="feature-icon" />
            <h3>能力提升</h3>
            <p>循序渐进的难度设置，助你稳步提升编程实力</p>
          </div>
        </a-col>
      </a-row>
    </div>

    <div class="stats-section">
      <a-row :gutter="[24, 24]">
        <a-col :span="8">
          <div class="stat-card">
            <h2>1000+</h2>
            <p>精选题目</p>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="stat-card">
            <h2>10000+</h2>
            <p>活跃用户</p>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="stat-card">
            <h2>50000+</h2>
            <p>提交次数</p>
          </div>
        </a-col>
      </a-row>
    </div>

    <div class="start-section">
      <h2>准备好开始你的编程之旅了吗？</h2>
      <p>点击下方按钮，立即开始你的刷题之路</p>
      <a-button type="primary" size="large" @click="toQuestions">
        立即开始
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  CodeOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()

const toQuestions = () => {
  router.push('/questions')
}
</script>

<style scoped>
#homePage {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-section {
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  border-radius: 16px;
  margin-bottom: 60px;
}

.title {
  font-size: 48px;
  color: #1f2937;
  margin-bottom: 16px;
  font-weight: bold;
}

.subtitle {
  font-size: 20px;
  color: #4b5563;
  margin-bottom: 32px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.section-title {
  text-align: center;
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 40px;
}

.features-section {
  margin-bottom: 60px;
}

.feature-card {
  text-align: center;
  padding: 32px 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 36px;
  color: #2563eb;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  color: #1f2937;
  margin-bottom: 12px;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
}

.stats-section {
  margin-bottom: 60px;
}

.stat-card {
  text-align: center;
  padding: 32px;
  background: #f3f4f6;
  border-radius: 12px;
}

.stat-card h2 {
  font-size: 36px;
  color: #2563eb;
  margin-bottom: 8px;
}

.stat-card p {
  font-size: 16px;
  color: #4b5563;
}

.start-section {
  text-align: center;
  padding: 60px;
  background: linear-gradient(135deg, #e4e7eb 0%, #f5f7fa 100%);
  border-radius: 16px;
}

.start-section h2 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 16px;
}

.start-section p {
  font-size: 18px;
  color: #4b5563;
  margin-bottom: 32px;
}

:deep(.anticon) {
  vertical-align: -0.125em;
}
</style>
