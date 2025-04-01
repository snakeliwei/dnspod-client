<template>
  <a-card :title="`${domain} - 解析记录管理`" :bordered="false" :style="{ borderRadius: '12px' }">
    <a-input-search
      v-model="searchText"
      placeholder="输入关键词搜索"
      style="margin-bottom: 16px; width: 300px; border-radius: 8px; z-index: 1; padding: 8px 12px"
      @search="handleSearch"
    />
    <a-table 
      :columns="columns" 
      :data="records"
      :loading="loading"
      row-key="id"
      :style="{ borderRadius: '8px' }"
      :row-selection="{ 
        selectedRowKeys: Array.from(selectedRecords), 
        onChange: (keys) => { selectedRecords = new Set(keys) } 
      }"
    >
      <template #operations="{ record }">
        <a-space>
          <a-button type="text" @click="showEditModal(record)">编辑</a-button>
          <a-button type="text" status="danger" @click="handleDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
    
    <a-space>
      <a-button type="primary" @click="showAddModal" style="margin-top: 16px; border-radius: 6px" :transition-props="{ duration: 300 }">
        添加记录
      </a-button>
      <a-button 
        type="outline" 
        @click="showBatchModal" 
        style="margin-top: 16px; border-radius: 6px"
        :transition-props="{ duration: 300 }"
        :disabled="selectedRecords.size === 0"
      >
        批量操作
      </a-button>
    </a-space>
    
    <!-- 添加记录模态框 -->
    <a-modal 
      v-model:visible="addModalVisible" 
      title="添加解析记录"
      @ok="handleAdd"
      @cancel="addModalVisible = false"
    >
      <a-form :model="addForm">
        <a-form-item field="type" label="记录类型" required>
          <a-select v-model="addForm.type" placeholder="请选择记录类型" allow-clear>
            <a-option value="A">A</a-option>
            <a-option value="CNAME">CNAME</a-option>
            <a-option value="MX">MX</a-option>
            <a-option value="TXT">TXT</a-option>
            <a-option value="NS">NS</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="name" label="主机记录" required>
          <a-input v-model="addForm.name" placeholder="例如: www" allow-clear />
        </a-form-item>
        <a-form-item field="line_id" label="线路" required>
          <a-select v-model="addForm.line_id" placeholder="请选择线路" allow-clear>
            <a-option value="0">默认</a-option>
            <a-option value="7">国内</a-option>
            <a-option value="10">国外</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="value" label="记录值" required>
          <a-input v-model="addForm.value" placeholder="例如: 1.1.1.1" allow-clear />
        </a-form-item>
        <a-form-item field="ttl" label="TTL" required>
          <a-input-number v-model="addForm.ttl" :min="60" :max="604800" />
        </a-form-item>
        <a-form-item field="mx" label="MX优先级" required v-if="addForm.type === 'MX'">
          <a-input-number v-model="addForm.mx" :min="1" :max="20" />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select v-model="addForm.status">
            <a-option value="enable">启用</a-option>
            <a-option value="disable">禁用</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    
    <!-- 编辑记录模态框 -->
    <a-modal 
      v-model:visible="editModalVisible" 
      title="编辑解析记录"
      @ok="handleEdit"
      @cancel="editModalVisible = false"
    >
      <a-form :model="editForm">
        <a-form-item field="type" label="记录类型">
          <a-select v-model="editForm.type" disabled>
            <a-option value="A">A</a-option>
            <a-option value="CNAME">CNAME</a-option>
            <a-option value="MX">MX</a-option>
            <a-option value="TXT">TXT</a-option>
            <a-option value="NS">NS</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="name" label="主机记录" required>
          <a-input v-model="editForm.name" />
        </a-form-item>
        <a-form-item field="line_id" label="线路" required>
          <a-select v-model="editForm.line_id" placeholder="请选择线路" allow-clear>
            <a-option value="0">默认</a-option>
            <a-option value="7">国内</a-option>
            <a-option value="10">国外</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="value" label="记录值" required>
          <a-input v-model="editForm.value" />
        </a-form-item>
        <a-form-item field="ttl" label="TTL" required>
          <a-input-number v-model="editForm.ttl" :min="60" :max="604800" />
        </a-form-item>
        <a-form-item field="mx" label="MX优先级" required v-if="editForm.type === 'MX'">
          <a-input-number v-model="editForm.mx" :min="1" :max="20" />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select v-model="editForm.status">
            <a-option value="enable">启用</a-option>
            <a-option value="disable">禁用</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 批量操作模态框 -->
    <a-modal 
      v-model:visible="batchModalVisible" 
      title="批量操作"
      @ok="handleBatchUpdate"
      @cancel="batchModalVisible = false"
    >
      <a-form :model="batchForm">
        <a-form-item field="type" label="记录类型">
          <a-select v-model="batchForm.type" placeholder="请选择记录类型" allow-clear>
            <a-option value="A">A</a-option>
            <a-option value="CNAME">CNAME</a-option>
            <a-option value="MX">MX</a-option>
            <a-option value="TXT">TXT</a-option>
            <a-option value="NS">NS</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="line_id" label="线路">
          <a-select v-model="batchForm.line_id" placeholder="请选择线路" allow-clear>
            <a-option value="0">默认</a-option>
            <a-option value="7">国内</a-option>
            <a-option value="10">国外</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="value" label="记录值">
          <a-input v-model="batchForm.value" placeholder="留空则不修改" allow-clear />
        </a-form-item>
        <a-form-item field="ttl" label="TTL">
          <a-input-number v-model="batchForm.ttl" :min="60" :max="604800" />
        </a-form-item>
        <a-form-item field="mx" label="MX优先级" required v-if="batchForm.type === 'MX'">
          <a-input-number v-model="batchForm.mx" :min="1" :max="20" />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select v-model="batchForm.status" placeholder="请选择状态" allow-clear>
            <a-option value="enable">启用</a-option>
            <a-option value="disable">禁用</a-option>
          </a-select>
        </a-form-item>
        <a-button type="outline" status="danger" @click="handleBatchDelete" style="margin-top: 16px">
          批量删除选中记录
        </a-button>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRecordStore } from '@/stores/record'
import { Message } from '@arco-design/web-vue'

const route = useRoute()
const recordStore = useRecordStore()
const domain = ref(route.query.domain as string)
const loading = ref(false)
const records = ref([])
const allRecords = ref([])
const searchText = ref('')
const addModalVisible = ref(false)
const editModalVisible = ref(false)
const batchModalVisible = ref(false)
const selectedRecords = ref(new Set())
const batchForm = ref({
  type: '',
  value: '',
  line_id: '0',
  ttl: '600',
  mx: '5',
  status: 'enable'
})

const addForm = ref({
  type: 'A',
  name: '',
  value: '',
  line_id: '0',
  ttl: '600',
  mx: '5',
  status: 'enable'
})

const editForm = ref({
  id: '',
  type: 'A',
  name: '',
  value: '',
  line_id: 'default',
  ttl: '600',
  mx: '5',
  status: 'enable',
  line: '默认'
})

const columns = [
  {
    title: '主机记录',
    dataIndex: 'name'
  },
  {
    title: '记录类型',
    dataIndex: 'type'
  },
  {
    title: '线路',
    dataIndex: 'line'
  },
  {
    title: '记录值',
    dataIndex: 'value'
  },
  {
    title: 'TTL',
    dataIndex: 'ttl'
  },
  {
    title: 'MX优先级',
    dataIndex: 'mx'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status: string) => status === 'enable' ? '启用' : '禁用'
  },
  {
    title: '更新时间',
    dataIndex: 'updated_on'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    slotName: 'operations'
  }
]

const fetchRecords = async () => {
  try {
    loading.value = true
    const data = await recordStore.listRecords(domain.value)
    console.log('API返回的记录数据:', data)
    console.log('记录数据类型:', typeof data, Array.isArray(data))
    console.log('记录数据结构:', JSON.stringify(data))
    
    if (data && (Array.isArray(data) || typeof data === 'object')) {
      // 处理可能返回的对象或数组
      const recordsData = Array.isArray(data) ? data : [data]
      
      // 格式化记录数据以匹配表格列定义
      records.value = recordsData.map(record => ({
        id: record.id || '',
        name: record.name || '',
        type: record.type || '',
        line: record.line || '默认',
        value: record.value || '',
        ttl: record.ttl || '600',
        mx: record.mx || '',
        status: record.status || record.status_v1 || 'enable',
        updated_on: record.updated_on || '',
        remark: record.remark || ''
      }))
      
      allRecords.value = records.value
      console.log('成功设置记录数据，数量:', records.value.length)
    } else {
      console.error('记录数据格式不正确，无法显示')
      records.value = []
      allRecords.value = []
    }
  } catch (error) {
    Message.error('获取解析记录失败')
    console.error('获取解析记录失败详情:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (!searchText.value) {
    records.value = allRecords.value
    return
  }
  
  const search = searchText.value.toLowerCase()
  records.value = allRecords.value.filter(record => 
    record.name.toLowerCase().includes(search) || 
    record.value.toLowerCase().includes(search) ||
    record.type.toLowerCase().includes(search) ||
    record.line.toLowerCase().includes(search) ||
    (record.status === 'enable' && '启用'.includes(search)) ||
    (record.status === 'disable' && '禁用'.includes(search))
  )
}



const showAddModal = () => {
  addModalVisible.value = true
}

const showEditModal = (record) => {
  editForm.value = { ...record }
  editModalVisible.value = true
}

const handleAdd = async () => {
  try {
    // 确保数据类型与API期望的一致
    const recordData = {
      sub_domain: addForm.value.name,
      record_type: addForm.value.type,
      value: addForm.value.value.toString(),
      record_line_id: '0',
      ttl: addForm.value.ttl.toString(),
      mx: addForm.value.mx?.toString() || '',
      status: addForm.value.status
    }
    
    await recordStore.createRecord(domain.value, recordData)
    Message.success('添加成功')
    addModalVisible.value = false
    fetchRecords()
  } catch (error) {
    Message.error('添加记录失败: ' + (error.message || '未知错误'))
  }
}

const handleEdit = async () => {
  try {
    // 确保数据类型与API期望的一致
    const recordData = {
      record_id: editForm.value.id,
      sub_domain: editForm.value.name,
      record_type: editForm.value.type,
      value: editForm.value.value,
      record_line_id: '0',
      ttl: editForm.value.ttl.toString(),
      mx: editForm.value.mx?.toString() || '',
      status: editForm.value.status
    }
    
    await recordStore.updateRecord(domain.value, editForm.value.id, recordData)
    Message.success('更新成功')
    editModalVisible.value = false
    fetchRecords()
  } catch (error) {
    Message.error('更新记录失败: ' + (error.message || '未知错误'))
  }
}

const handleDelete = async (record) => {
  try {
    await recordStore.deleteRecord(domain.value, record.id)
    Message.success('删除成功')
    selectedRecords.value.delete(record.id)
    fetchRecords()
  } catch (error) {
    Message.error(`删除记录失败: ${error.response?.data?.message || error.message}`)
  }
}

const handleBatchDelete = async () => {
  try {
    const promises = Array.from(selectedRecords.value).map(id => 
      recordStore.deleteRecord(domain.value, id)
    )
    await Promise.all(promises)
    Message.success(`成功删除${promises.length}条记录`)
    selectedRecords.value.clear()
    fetchRecords()
  } catch (error) {
    Message.error(`批量删除失败: ${error.response?.data?.message || error.message}`)
  }
}

const handleBatchUpdate = async () => {
  try {
    const updates = Array.from(selectedRecords.value).map(id => {
      const updateData = { ...batchForm.value }
      
      // 移除空值字段
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key]
        }
      })
      
      // 确保数据类型与API期望的一致
      if (updateData.ttl) updateData.ttl = updateData.ttl.toString()
      if (updateData.mx) updateData.mx = updateData.mx.toString()
      
      // 如果不是MX记录类型，删除mx字段
      if (updateData.type !== 'MX') delete updateData.mx
      
      return recordStore.updateRecord(domain.value, id, updateData)
    })
    
    await Promise.all(updates)
    Message.success(`成功更新${updates.length}条记录`)
    batchModalVisible.value = false
    selectedRecords.value.clear()
    fetchRecords()
  } catch (error) {
    Message.error(`批量更新失败: ${error.response?.data?.message || error.message}`)
  }
}

const toggleRecordSelection = (record) => {
  if (selectedRecords.value.has(record.id)) {
    selectedRecords.value.delete(record.id)
  } else {
    selectedRecords.value.add(record.id)
  }
}

const showBatchModal = () => {
  batchModalVisible.value = true
}

// 初始化加载记录列表
fetchRecords()
</script>