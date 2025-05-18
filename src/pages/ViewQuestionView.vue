<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { getQuestionVoByIdUsingGet,doQuestionSubmitUsingPost } from '@/api/questionController'
import CodeEditor from '@/components/CodeEditor.vue'

const route = useRoute()
const activeTab = ref('question')
const submitting = ref(false)

const question = ref<any>(null)
const judgeConfig = ref<any>({
  timeLimit: 1000,
  memoryLimit: 256,
  stackLimit: 256,
})

const form = ref({
  language: 'java',
  code: '',
  questionId: '',
})

// 加载题目数据
const loadData = async () => {
  const questionId = route.params.id
  if (!questionId) {
    message.error('题目ID不能为空')
    return
  }

  try {
    const res = await getQuestionVoByIdUsingGet({ id: questionId })
    if (res.data.code === 0) {
      question.value = res.data.data
      if (question.value?.judgeConfig) {
        judgeConfig.value = question.value.judgeConfig
      }
      form.value.questionId = questionId as string
    } else {
      message.error('加载失败，' + res.data.message)
    }
  } catch (error: any) {
    message.error('加载失败，' + error.message)
  }
}

// 提交方法
const doSubmit = async () => {
  if (!form.value.code.trim()) {
    message.error('请输入代码')
    return
  }

  try {
    submitting.value = true

    // 构造请求参数（根据QuestionSubmitAddRequest结构）
    const submitData = {
      questionId: form.value.questionId,
      code: form.value.code,
      language: form.value.language
    }

    // 调用提交接口
    const res = await doQuestionSubmitUsingPost(submitData)

    if (res.data.code === 0) {
      console.log(res)
      message.success('提交成功')
      // 可选的后续操作：跳转到提交记录页面
      // router.push(`/question/submit/${res.data.data}`)
    } else {
      message.error('提交失败：' + res.message)
    }
  } catch (error: any) {
    message.error('提交失败：' + (error.message || error.toString()))
  } finally {
    submitting.value = false
  }
}

const handleCodeChange = (code: string) => {
  form.value.code = code;
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="question" tab="题目">
            <a-card v-if="question">
              <!-- 题目标题 -->
              <h2 class="question-title">{{ question.title }}</h2>

              <!-- 标签 -->
              <div class="question-meta">
                <a-space wrap>
                  <a-tag v-for="(tag, index) of question.tags" :key="index" color="blue">
                    {{ tag }}
                  </a-tag>
                </a-space>
              </div>

              <!-- 判题条件 -->
              <a-card class="judge-conditions" size="small" title="判题条件">
                <a-row :gutter="[16, 16]">
                  <a-col :span="8">
                    <div class="condition-item">
                      <div class="condition-label">时间限制</div>
                      <div class="condition-value">{{ judgeConfig.timeLimit }}ms</div>
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="condition-item">
                      <div class="condition-label">内存限制</div>
                      <div class="condition-value">{{ judgeConfig.memoryLimit }}MB</div>
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="condition-item">
                      <div class="condition-label">堆栈限制</div>
                      <div class="condition-value">{{ judgeConfig.stackLimit }}MB</div>
                    </div>
                  </a-col>
                </a-row>
              </a-card>

              <!-- 题目描述 -->
              <div class="question-section">
                <h3>题目描述</h3>
                <div class="content-wrapper">{{ question.content || '' }}</div>
              </div>

              <!-- 输入描述 -->
              <div class="question-section" v-if="question.inputDesc">
                <h3>输入描述</h3>
                <div class="content-wrapper">{{ question.inputDesc }}</div>
              </div>

              <!-- 输出描述 -->
              <div class="question-section" v-if="question.outputDesc">
                <h3>输出描述</h3>
                <div class="content-wrapper">{{ question.outputDesc }}</div>
              </div>

              <!-- 示例 -->
              <div class="question-section" v-if="question.examples?.length">
                <h3>示例</h3>
                <div v-for="(example, index) in question.examples" :key="index" class="example-item">
                  <a-card size="small" :title="'示例 ' + (index + 1)">
                    <div class="example-content">
                      <div class="example-input">
                        <strong>输入：</strong>
                        <pre>{{ example.input }}</pre>
                      </div>
                      <div class="example-output">
                        <strong>输出：</strong>
                        <pre>{{ example.output }}</pre>
                      </div>
                      <div v-if="example.explanation" class="example-explanation">
                        <strong>解释：</strong>
                        <div>{{ example.explanation }}</div>
                      </div>
                    </div>
                  </a-card>
                </div>
              </div>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="answer" tab="答案">
            <a-card v-if="question">
              <div class="answer-wrapper">
                {{ question.answer || '暂无答案' }}
              </div>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <div class="code-section">
          <a-form :model="form" layout="inline" class="code-form">
            <a-form-item label="编程语言" style="min-width: 240px">
              <a-select
                v-model:value="form.language"
                style="width: 320px"
                placeholder="请选择编程语言"
              >
                <a-select-option value="java">Java</a-select-option>
                <a-select-option value="cpp">C++</a-select-option>
                <a-select-option value="python">Python</a-select-option>
                <a-select-option value="javascript">JavaScript</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
          <CodeEditor
            :value="form.code"
            :language="form.language"
            :handleChange="handleCodeChange"
            class="code-editor"
          />
          <div class="submit-section">
            <a-button
              type="primary"
              :loading="submitting"
              style="min-width: 200px"
              @click="doSubmit"
            >
              提交代码
            </a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.question-title {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 600;
}

.question-meta {
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.judge-conditions {
  margin-bottom: 24px;
  background: #fafafa;
}

.condition-item {
  text-align: center;
}

.condition-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.condition-value {
  font-size: 16px;
  font-weight: 500;
  color: #1890ff;
}

.question-section {
  margin-bottom: 24px;
}

.question-section h3 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
}

.content-wrapper {
  white-space: pre-wrap;
  line-height: 1.6;
}

.answer-wrapper {
  white-space: pre-wrap;
}

.code-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.code-form {
  margin-bottom: 16px;
}

.code-editor {
  font-family: monospace;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  min-height: 400px;
  height: 60vh;
}

.submit-section {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

:deep(.ant-card-head) {
  min-height: 48px;
  padding: 0 16px;
}

:deep(.ant-card-body) {
  padding: 16px;
}

:deep(.ant-descriptions-header) {
  margin-bottom: 16px;
}

:deep(.ant-tag) {
  margin: 2px;
}

.example-item {
  margin-bottom: 16px;
}

.example-item:last-child {
  margin-bottom: 0;
}

.example-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.example-input pre,
.example-output pre {
  margin: 8px 0;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-family: monospace;
}

.example-explanation {
  margin-top: 8px;
  padding: 8px;
  background: #f0f9ff;
  border-radius: 4px;
}
</style>
