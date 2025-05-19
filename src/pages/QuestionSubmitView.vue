<template>
  <div id="manageQuestionSubmitView">
    <div class="header">
      <h2>提交管理</h2>
    </div>

    <!-- 搜索表单 -->
    <a-form layout="inline" class="search-form">
      <a-form-item label="题目ID">
        <a-input
          v-model:value="searchParams.questionId"
          placeholder="请输入题目ID"
          allow-clear
          @change="handleSearch"
        />
      </a-form-item>
      <a-form-item label="用户ID">
        <a-input
          v-model:value="searchParams.userId"
          placeholder="请输入用户ID"
          allow-clear
          @change="handleSearch"
        />
      </a-form-item>
      <a-form-item label="编程语言">
        <a-select
          v-model:value="searchParams.language"
          placeholder="请选择编程语言"
          allow-clear
          style="min-width: 120px"
          @change="handleSearch"
        >
          <a-select-option value="java">Java</a-select-option>
          <a-select-option value="cpp">C++</a-select-option>
          <a-select-option value="go">Go</a-select-option>
          <a-select-option value="html">HTML</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态">
        <a-select
          v-model:value="searchParams.status"
          placeholder="请选择状态"
          allow-clear
          style="min-width: 120px"
          @change="handleSearch"
        >
          <a-select-option value="0">等待中</a-select-option>
          <a-select-option value="1">判题中</a-select-option>
          <a-select-option value="2">成功</a-select-option>
          <a-select-option value="3">失败</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="resetSearch">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>

    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="{
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
        size: 'small',
      }"
      :loading="loading"
      :row-key="(record) => record.id"
      @change="handleTableChange"
      bordered
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
            <a-button
              v-if="record.status === 0 || record.status === 1"
              type="link"
              size="small"
              @click="refreshStatus(record)"
              style="margin-left: 4px; padding: 0"
            >
              <reload-outlined />
            </a-button>
          </a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'judgeInfo'">
          {{ formatJudgeInfo(record.judgeInfo) }}
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ formatDate(record.createTime) }}
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a-button type="primary" size="small" @click="refreshRow(record)">刷新</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listQuestionSubmitByPageUsingPost } from '@/api/questionController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import moment from 'moment'
import { ReloadOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const loading = ref(false)

const dataList = ref([])
const total = ref(0)
const searchParams = ref({
  pageSize: 10,
  current: 1,
  sortField: 'createTime',
  sortOrder: 'descend',
  questionId: undefined,
  userId: undefined,
  language: undefined,
  status: undefined,
})

const loadData = async () => {
  try {
    loading.value = true
    const res = await listQuestionSubmitByPageUsingPost(searchParams.value)
    if (res.data.code === 0) {
      dataList.value = res.data.data.records || []
      total.value = res.data.data.total || 0
    } else {
      message.error('加载失败，' + res.data.message)
    }
  } catch (error: any) {
    message.error('加载失败，' + error.message)
  } finally {
    loading.value = false
  }
}

const refreshRow = async (record: any) => {
  try {
    loadData()
    message.success('刷新成功')
  } catch (error) {
    message.error('刷新失败')
  }
}

const refreshStatus = async (record: any) => {
  try {
    event?.stopPropagation()
    loadData()
    message.success('状态已刷新')
  } catch (error) {
    message.error('刷新状态失败')
  }
}

const columns = [
  {
    title: '提交ID',
    dataIndex: 'id',
    width: 80,
    sorter: true,
  },
  {
    title: '题目ID',
    dataIndex: 'questionId',
    width: 80,
    sorter: true,
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    width: 80,
    sorter: true,
  },
  {
    title: '编程语言',
    dataIndex: 'language',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: '判题信息',
    dataIndex: 'judgeInfo',
    width: 200,
    ellipsis: true,
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 150,
    sorter: true,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 80,
  },
]

const getStatusText = (status: number) => {
  const statusMap = {
    0: '等待中',
    1: '判题中',
    2: '成功',
    3: '失败'
  }
  return statusMap[status] || '未知状态'
}

const getStatusColor = (status: number) => {
  const colorMap = {
    0: 'orange',
    1: 'blue',
    2: 'green',
    3: 'red'
  }
  return colorMap[status] || 'gray'
}

const formatJudgeInfo = (judgeInfo: string) => {
  try {
    const info = JSON.parse(judgeInfo)
    if (info.message) {
      return info.message
    }
    return `用时: ${info.time}ms, 内存: ${info.memory}KB`
  } catch {
    return judgeInfo
  }
}

const formatDate = (date: string) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  searchParams.value = {
    ...searchParams.value,
    current: pagination.current,
    pageSize: pagination.pageSize,
    sortField: sorter.field || 'createTime',
    sortOrder: sorter.order || 'descend',
  }
  loadData()
}

const handleSearch = () => {
  searchParams.value.current = 1
  loadData()
}

const resetSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
    questionId: undefined,
    userId: undefined,
    language: undefined,
    status: undefined,
  }
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
#manageQuestionSubmitView {
  padding: 16px;
  height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.search-form {
  margin-bottom: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
}

:deep(.ant-table-wrapper) {
  flex: 1;
  overflow: hidden;
}

:deep(.ant-table) {
  height: 100%;
}

:deep(.ant-table-cell) {
  font-size: 12px;
  padding: 4px 6px !important;
  line-height: 1.2;
}

:deep(.ant-table-thead > tr > th) {
  padding: 6px 6px !important;
  font-size: 12px;
  line-height: 1.2;
}

:deep(.ant-table-row) {
  height: 28px;
}

h2 {
  margin: 0;
  font-size: 18px;
}

:deep(.ant-form-item) {
  margin-bottom: 0;
}

:deep(.ant-space) {
  gap: 4px !important;
}

:deep(.ant-btn-sm) {
  font-size: 12px;
  padding: 0 4px;
  height: 22px;
  line-height: 20px;
}

:deep(.ant-tag) {
  margin: 0;
  padding: 0 4px;
  font-size: 12px;
  line-height: 18px;
}

:deep(.ant-btn-link) {
  color: rgba(0, 0, 0, 0.45);
}
:deep(.ant-btn-link:hover) {
  color: #1890ff;
}
</style>
