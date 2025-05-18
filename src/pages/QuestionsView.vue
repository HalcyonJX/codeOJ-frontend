<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline" class="search-form">
      <a-form-item field="title" label="名称" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-select
          v-model:value="searchParams.tags"
          placeholder="请选择标签"
          mode="multiple"
          allow-clear
          style="width: 100%"
        >
          <a-select-option v-for="tag in allTags" :key="tag" :value="tag">
            {{ tag }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="doSubmit">搜索</a-button>
          <a-button @click="resetSearch">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :columns="columns"
      :data-source="dataList"
      :loading="loading"
      :pagination="{
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
        size: 'small'
      }"
      @change="handleTableChange"
      size="small"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="(tag, index) of record.tags" :key="index" color="blue">
              {{ tag }}
            </a-tag>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'acceptedRate'">
          {{
            `${
              record.submitNum ? ((record.acceptedNum / record.submitNum) * 100).toFixed(1) : '0.0'
            }% (${record.acceptedNum || 0}/${record.submitNum || 0})`
          }}
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a-space>
            <a-button type="primary" size="small" @click="toQuestionPage(record)">做题</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listQuestionVoByPageUsingPost } from '@/api/questionController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const loading = ref(false)
const dataList = ref([])
const total = ref(0)
const allTags = ref<string[]>([])

const searchParams = ref({
  title: '',
  tags: [],
  pageSize: 10,
  current: 1,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const router = useRouter()

const extractTags = (questions: any[]) => {
  const tagSet = new Set<string>()
  questions.forEach(question => {
    if (Array.isArray(question.tags)) {
      question.tags.forEach(tag => tagSet.add(tag))
    }
  })
  allTags.value = Array.from(tagSet)
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await listQuestionVoByPageUsingPost(searchParams.value)
    if (res.data.code === 0) {
      dataList.value = res.data.data.records || []
      total.value = res.data.data.total || 0
      extractTags(dataList.value)
    } else {
      message.error('加载失败，' + res.data.message)
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
  },
  {
    title: '题目名称',
    dataIndex: 'title',
    width: 200,
    ellipsis: true,
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 200,
  },
  {
    title: '提交数',
    dataIndex: 'submitNum',
    width: 100,
  },
  {
    title: '通过数',
    dataIndex: 'acceptedNum',
    width: 100,
  },
  {
    title: '通过率',
    dataIndex: 'acceptedRate',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 100,
  },
]

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

const resetSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    title: '',
    tags: [],
    current: 1,
  }
  loadData()
}

const toQuestionPage = (question: any) => {
  router.push({
    path: `/question/${question.id}`,
  })
}

const doSubmit = () => {
  searchParams.value.current = 1
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px;
}

.search-form {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
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

:deep(.ant-tag) {
  margin: 1px;
  padding: 0 4px;
  font-size: 12px;
  line-height: 18px;
}

:deep(.ant-btn-sm) {
  font-size: 12px;
  padding: 0 4px;
  height: 22px;
  line-height: 20px;
}

:deep(.ant-select-multiple .ant-select-selection-item) {
  padding: 0 4px;
  font-size: 12px;
  line-height: 18px;
  height: 20px;
}

:deep(.ant-select-dropdown) {
  font-size: 12px;
}
</style>
