<template>
  <div id="manageQuestionView">
    <div class="header">
      <h2>题目管理</h2>
      <a-button type="primary" @click="toAddQuestion">创建题目</a-button>
    </div>

    <!-- 搜索表单 -->
    <a-form layout="inline" class="search-form">
      <a-form-item label="标题">
        <a-input
          v-model:value="searchParams.title"
          placeholder="请输入题目标题"
          allow-clear
          @change="handleSearch"
        />
      </a-form-item>
      <a-form-item label="标签">
        <a-select
          v-model:value="searchParams.tag"
          placeholder="请选择标签"
          allow-clear
          style="min-width: 200px"
          @change="handleSearch"
        >
          <a-select-option v-for="tag in allTags" :key="tag" :value="tag">
            {{ tag }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="resetSearch">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>

    <!-- 批量操作 -->
    <div class="table-operations" v-if="selectedRowKeys.length">
      <a-space>
        <span>已选择 {{ selectedRowKeys.length }} 项</span>
        <a-popconfirm title="确定要删除选中的题目吗？" @confirm="handleBatchDelete">
          <a-button danger>批量删除</a-button>
        </a-popconfirm>
      </a-space>
    </div>

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
      :row-selection="{
        selectedRowKeys,
        onChange: onSelectChange,
        columnWidth: 40,
        type: 'checkbox',
        preserveSelectedRowKeys: true,
        rowKey: (record) => record.id
      }"
      :row-key="(record) => record.id"
      @change="handleTableChange"
      bordered
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="(tag, index) of record.tags" :key="index" color="blue">
              {{ tag }}
            </a-tag>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'judgeConfig'">
          {{ formatJudgeConfig(record.judgeConfig) }}
        </template>
        <template v-else-if="column.dataIndex === 'judgeCase'">
          {{ formatJudgeCase(record.judgeCase) }}
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ formatDate(record.createTime) }}
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a-space>
            <a-button type="primary" size="small" @click="doUpdate(record)">修改</a-button>
            <a-popconfirm title="确定要删除这道题目吗？" @confirm="doDelete(record)">
              <a-button danger size="small">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listQuestionVoByPageUsingPost, deleteQuestionUsingPost } from '@/api/questionController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

const router = useRouter()
const loading = ref(false)
const selectedRowKeys = ref<(string | number)[]>([])
const allTags = ref<string[]>([])

const dataList = ref([])
const total = ref(0)
const searchParams = ref({
  pageSize: 10,
  current: 1,
  sortField: 'createTime',
  sortOrder: 'descend',
  title: '',
  tag: undefined,
})

// 获取所有标签
const loadAllTags = () => {
  const tags = new Set<string>()
  dataList.value.forEach((item: any) => {
    if (Array.isArray(item.tags)) {
      item.tags.forEach((tag: string) => tags.add(tag))
    }
  })
  allTags.value = Array.from(tags)
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await listQuestionVoByPageUsingPost(searchParams.value)
    console.log(res)
    if (res.data.code === 0) {
      dataList.value = res.data.data.records || []
      total.value = res.data.data.total || 0
      loadAllTags()
    } else {
      message.error('加载失败，' + res.message)
    }
  } catch (error: any) {
    message.error('加载失败，' + error.message)
  } finally {
    loading.value = false
  }
}

const columns = [
  {
    title: '题号',
    dataIndex: 'id',
    width: 80,
    sorter: true,
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: 120,
    ellipsis: true,
  },
  {
    title: '内容',
    dataIndex: 'content',
    width: 150,
    ellipsis: true,
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 100,
  },
  {
    title: '提交数',
    dataIndex: 'submitNum',
    width: 70,
    sorter: true,
  },
  {
    title: '通过数',
    dataIndex: 'acceptedNum',
    width: 70,
    sorter: true,
  },
  {
    title: '通过率',
    dataIndex: 'acceptedRate',
    width: 70,
    customRender: ({ record }: any) => {
      const rate = record.submitNum
        ? ((record.acceptedNum / record.submitNum) * 100).toFixed(1)
        : '0.0'
      return `${rate}%`
    },
    sorter: true,
  },
  {
    title: '判题配置',
    dataIndex: 'judgeConfig',
    width: 200,
    ellipsis: true,
  },
  {
    title: "用户id",
    dataIndex: "userId",
    width: 90,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 130,
    sorter: true,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 100,
  },
]

const formatJudgeConfig = (judgeConfig: string) => {
  try {
    const config = JSON.parse(judgeConfig)
    return `时间限制: ${config.timeLimit}ms, 内存限制: ${config.memoryLimit}MB`
  } catch {
    return judgeConfig
  }
}

const formatJudgeCase = (judgeCase: string) => {
  try {
    const cases = JSON.parse(judgeCase)
    return `${cases.length} 个测试用例`
  } catch {
    return judgeCase
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
    title: '',
    tag: undefined,
  }
  loadData()
}

const onSelectChange = (keys: (string | number)[], selectedRows: any[]) => {
  selectedRowKeys.value = keys
}

const handleBatchDelete = async () => {
  try {
    loading.value = true
    for (const id of selectedRowKeys.value) {
      await deleteQuestionUsingPost({ id })
    }
    message.success('批量删除成功')
    selectedRowKeys.value = []
    loadData()
  } catch (error: any) {
    message.error('批量删除失败，' + error.message)
  } finally {
    loading.value = false
  }
}

const doDelete = async (record: any) => {
  try {
    loading.value = true
    const res = await deleteQuestionUsingPost({ id: record.id })
    if (res.data.code === 0) {
      message.success('删除成功')
      loadData()
    } else {
      message.error('删除失败，' + res.data.message)
    }
  } catch (error: any) {
    message.error('删除失败，' + error.message)
  } finally {
    loading.value = false
  }
}

const doUpdate = (record: any) => {
  router.push({
    path: '/update_question',
    query: {
      id: record.id,
    },
  })
}

const toAddQuestion = () => {
  router.push('/add_question')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
#manageQuestionView {
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

.table-operations {
  margin-bottom: 8px;
  padding: 4px 12px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
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

:deep(.ant-tag) {
  margin: 1px;
  padding: 0 4px;
  font-size: 12px;
  line-height: 18px;
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
</style>
