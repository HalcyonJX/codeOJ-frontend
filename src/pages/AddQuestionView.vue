<template>
  <div id="addQuestionView">
    <h2>{{ updatePage ? '修改题目' : '创建题目' }}</h2>
    <a-form
      :model="form"
      layout="vertical"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
    >
      <a-form-item label="标题" name="title" required>
        <a-input v-model:value="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="form.tags"
          mode="tags"
          placeholder="请选择标签"
          :token-separators="[',']"
          allow-clear
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="题目内容" name="content" required>
        <MdEditor
          :value="form.content"
          :handle-change="onContentChange"
          placeholder="请输入题目内容"
        />
      </a-form-item>
      <a-form-item label="答案" name="answer" required>
        <MdEditor
          :value="form.answer"
          :handle-change="onAnswerChange"
          placeholder="请输入答案"
        />
      </a-form-item>
      <a-form-item label="判题配置">
        <a-space direction="vertical" style="width: 100%">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="时间限制(ms)" name="judgeConfig.timeLimit">
                <a-input-number
                  v-model:value="form.judgeConfig.timeLimit"
                  placeholder="请输入时间限制"
                  :min="0"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="内存限制(MB)" name="judgeConfig.memoryLimit">
                <a-input-number
                  v-model:value="form.judgeConfig.memoryLimit"
                  placeholder="请输入内存限制"
                  :min="0"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="堆栈限制(MB)" name="judgeConfig.stackLimit">
                <a-input-number
                  v-model:value="form.judgeConfig.stackLimit"
                  placeholder="请输入堆栈限制"
                  :min="0"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-space>
      </a-form-item>
      <a-form-item label="测试用例配置">
        <div class="test-cases">
          <div v-for="(judgeCaseItem, index) of form.judgeCase" :key="index" class="test-case-item">
            <div class="test-case-header">
              <span>测试用例 #{{ index + 1 }}</span>
              <a-button type="link" danger @click="handleDelete(index)">删除</a-button>
            </div>
            <div class="test-case-content">
              <a-input
                v-model:value="judgeCaseItem.input"
                placeholder="请输入测试输入用例"
                class="case-input"
              />
              <a-input
                v-model:value="judgeCaseItem.output"
                placeholder="请输入测试输出用例"
                class="case-input"
              />
            </div>
          </div>
          <a-button type="dashed" block @click="handleAdd" class="add-case-btn">
            <plus-outlined />
            新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
        <a-button type="primary" :loading="submitting" @click="doSubmit" style="min-width: 200px">
          {{ updatePage ? '更新' : '提交' }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import MdEditor from '@/components/MdEditor.vue'
import {
  addQuestionUsingPost,
  updateQuestionUsingPost,
  getQuestionVoByIdUsingGet,
} from '@/api/questionController'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const submitting = ref(false)

// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes('update')

interface FormState {
  id?: number
  title: string
  tags: string[]
  content: string
  answer: string
  judgeConfig: {
    timeLimit: number
    memoryLimit: number
    stackLimit: number
  }
  judgeCase: {
    input: string
    output: string
  }[]
}

const form = ref<FormState>({
  title: '',
  tags: [],
  content: '',
  answer: '',
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: '',
      output: '',
    },
  ],
})

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id
  console.log(id)
  if (!id) {
    return
  }
  try {
    const res = await getQuestionVoByIdUsingGet({id:id});
    console.log(res)
    if (res.data.code === 0 && res.data.data) {
      const questionData = res.data.data
      form.value = {
        id: questionData.id,
        title: questionData.title || '',
        content: questionData.content || '',
        answer: questionData.answer || '',
        judgeCase: questionData.judgeCase
          ? JSON.parse(questionData.judgeCase as string)
          : [{ input: '', output: '' }],
        judgeConfig: questionData.judgeConfig
          ? {
            memoryLimit: Number(questionData.judgeConfig.memoryLimit) || 1000,
            stackLimit: Number(questionData.judgeConfig.stackLimit) || 1000,
            timeLimit: Number(questionData.judgeConfig.timeLimit) || 1000
          }
          : {
              memoryLimit: 1000,
              stackLimit: 1000,
              timeLimit: 1000,
            },
        tags: questionData.tags || [],
      }
    } else {
      message.error('加载失败，' + res.data.message)
    }
  } catch (error: any) {
    message.error('加载失败，' + error.message)
  }
}

onMounted(() => {
  loadData()
})

const doSubmit = async () => {
  if (!form.value.title?.trim()) {
    message.error('请输入题目标题')
    return
  }
  if (!form.value.content?.trim()) {
    message.error('请输入题目内容')
    return
  }
  if (!form.value.answer?.trim()) {
    message.error('请输入题目答案')
    return
  }

  try {
    submitting.value = true
    console.log('提交的表单数据：', form.value)


    if (updatePage) {
      const res = await updateQuestionUsingPost(
        form.value
      );
      if (res.data.code === 0) {
        message.success('更新成功')
        router.push('/admin/questionManage')
      } else {
        message.error('更新失败，' + res.message)
      }
    } else {
      const res = await addQuestionUsingPost(
        form.value
      );
      console.log(res)
      if (res.data.code === 0) {
        console.log("进入提交")
        message.success('创建成功')
        router.push('/admin/questionManage')
      } else {
        message.error('创建失败，' + res.message)
      }
    }
  } catch (error: any) {
    console.error('提交错误：', error)
    message.error('操作失败：' + (error.message || error.toString()))
  } finally {
    submitting.value = false
  }
}

const handleAdd = () => {
  form.value.judgeCase.push({
    input: '',
    output: '',
  })
}

const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1)
}

const onContentChange = (value: string) => {
  form.value.content = value
}

const onAnswerChange = (value: string) => {
  form.value.answer = value
}
</script>

<style scoped>
#addQuestionView {
  padding: 16px 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
}

h2 {
  margin: 0 0 16px 0;
  font-size: 18px;
}

:deep(.ant-form) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.ant-form-item) {
  margin-bottom: 8px !important;
}

/* 编辑器样式优化 */
:deep(.md-editor) {
  height: 180px !important;
  min-height: unset !important;
  max-height: unset !important;
}

/* 判题配置紧凑布局 */
:deep(.ant-row) {
  margin: 0 -8px !important;
}

:deep(.ant-col) {
  padding: 0 8px !important;
}

:deep(.ant-input-number) {
  width: 100% !important;
}

/* 测试用例卡片样式 */
.case-card {
  margin-bottom: 12px;
}

.case-card :deep(.ant-card-body) {
  padding: 12px;
}

.case-card :deep(.ant-form-item) {
  margin-bottom: 8px;
}

/* 当有多个测试用例时允许滚动 */
:deep(.ant-form-item:has(.case-card)) {
  max-height: calc(100vh - 600px);
  overflow-y: auto;
  padding-right: 4px;
}

/* 提交按钮样式 */
:deep(.ant-form-item:last-child) {
  margin: 16px 0 0 0 !important;
}

/* 滚动条美化 */
:deep(*::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: #d9d9d9;
  border-radius: 3px;
}

:deep(*::-webkit-scrollbar-track) {
  background: #f0f0f0;
  border-radius: 3px;
}

.test-cases {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.test-case-item {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background: #fafafa;
}

.test-case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.test-case-header span {
  font-size: 14px;
  color: #666;
}

.test-case-content {
  padding: 12px;
  display: grid;
  gap: 8px;
}

.case-input {
  width: 100%;
}

.add-case-btn {
  margin-top: 4px;
}
</style>
