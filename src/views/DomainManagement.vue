<template>
  <a-card title="域名管理" :bordered="false" :style="{ borderRadius: '12px' }">
    <a-input-search
      v-model="searchText"
      placeholder="输入域名关键词搜索"
      style="margin-bottom: 16px; width: 300px; border-radius: 8px"
      @search="handleSearch"
    />
    <a-table 
      :columns="columns" 
      :data="domains"
      :loading="loading"
      row-key="id"
      :style="{ borderRadius: '8px' }"
      :row-selection="{ 
        selectedRowKeys: Array.from(selectedDomains),
        onChange: (keys: (string | number)[]) => { selectedDomains = new Set(keys) }
      }"
    >
      <template #operations="{ record }">
        <a-space>
          <a-button type="text" @click="showRecordManagement(record)">管理解析</a-button>
          <a-button type="text" status="danger" @click="handleDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
    
    <a-space>
      <a-button type="primary" @click="showAddModal" style="margin-top: 16px; border-radius: 6px" :transition-props="{ duration: 300 }"
>
        添加域名
      </a-button>
      <a-button 
        type="outline" 
        @click="showBatchModal" 
        style="margin-top: 16px; border-radius: 6px"
        :disabled="selectedDomains.size === 0"
        :transition-props="{ duration: 300 }"
      >
        批量操作
      </a-button>
    </a-space>
    
    <a-modal 
      v-model:visible="addModalVisible" 
      title="添加域名"
      @ok="handleAdd"
      @cancel="addModalVisible = false"
    >
      <a-form :model="addForm">
        <a-form-item field="domain" label="域名">
          <a-input v-model="addForm.domain" placeholder="请输入域名" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 批量操作模态框 -->
    <a-modal 
      v-model:visible="batchModalVisible" 
      title="批量操作"
      @ok="handleBatchDelete"
      @cancel="batchModalVisible = false"
    >
      <a-alert>确定要删除选中的域名吗？此操作不可撤销。</a-alert>
    </a-modal>
  </a-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDomainStore } from '@/stores/domain'
import { Message } from '@arco-design/web-vue'

// 定义域名对象的类型
interface Domain {
  id: string | number;
  name: string;
  grade: string;
  status: string;
}

const router = useRouter()

const domainStore = useDomainStore()
const loading = ref(false)
const domains = ref<Domain[]>([]) // 明确声明类型为 Domain[]
const allDomains = ref<Domain[]>([])
const searchText = ref('')
const addModalVisible = ref(false)
const batchModalVisible = ref(false)
const selectedDomains = ref(new Set())
const addForm = ref({
  domain: ''
})

const columns = [
  {
    title: '域名',
    dataIndex: 'name'
  },
  {
    title: '类型',
    dataIndex: 'grade'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status: string) => status === 'enable' ? '启用' : '禁用'
  },
  {
    title: '操作',
    slotName: 'operations'
  }
]

const fetchDomains = async () => {
  try {
    loading.value = true
    console.log('开始获取域名列表...')
    const data = await domainStore.listDomains()
    console.log('API返回的数据:', data)
    console.log('记录数据类型:', typeof data, Array.isArray(data))
    console.log('记录数据结构:', JSON.stringify(data))
    if (data && (Array.isArray(data) || typeof data === 'object')) {
      // 处理可能返回的对象或数组
      const domainData = Array.isArray(data) ? data : [data]
        // 格式化记录数据以匹配表格列定义
        domains.value = domainData.map((domain: any) => ({
        id: domain.id || '',
        name: domain.name || '',
        grade: domain.grade || '',
        status: domain.status || 'enable'
      }))
    allDomains.value = domains.value
    console.log('域名列表获取成功:', data)
  } else {
      console.error('记录数据格式不正确，无法显示')
      domains.value = []
      allDomains.value = []
    }
  } catch (error) {
    console.error('获取域名列表失败:', error)
    Message.error(`获取域名列表失败: ${(error as Error).message || '未知错误'}`)
  } finally {
    loading.value = false
  }
}


const handleSearch = () => {
  if (!searchText.value) {
    domains.value = allDomains.value
    return
  }
  
  const search = searchText.value.toLowerCase()
  domains.value = allDomains.value.filter(domain => 
(domain as { name: string }).name.toLowerCase().includes(search)
  )
}

const showAddModal = () => {
  addModalVisible.value = true
}

const handleAdd = async () => {
  try {
    await domainStore.createDomain(addForm.value.domain)
    Message.success('添加成功')
    addModalVisible.value = false
    fetchDomains()
  } catch (error) {
    Message.error('添加域名失败')
  }
}

const handleDelete = async (record: { id: string | number }) => {
  try {
    await domainStore.deleteDomain(String(record.id))
    Message.success('删除成功')
    fetchDomains()
  } catch (error) {
    Message.error('删除域名失败')
  }
}

const showRecordManagement = (domain: { name: string }) => {
  router.push({
    name: 'RecordManagement',
    query: { domain: domain.name }
  })
}

const showBatchModal = () => {
  batchModalVisible.value = true
}

const handleBatchDelete = async () => {
  try {
    const promises = Array.from(selectedDomains.value).map(id => 
      domainStore.deleteDomain(String(id))
    )
    await Promise.all(promises)
    Message.success(`成功删除${promises.length}个域名`)
    selectedDomains.value.clear()
    batchModalVisible.value = false
    fetchDomains()
  } catch (error) {
    Message.error(`批量删除失败: ${(error as any).response?.data?.message || (error as Error).message}`)
  }
}

// 初始化加载域名列表
fetchDomains()
</script>