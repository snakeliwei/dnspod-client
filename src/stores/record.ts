import { defineStore } from 'pinia'
import { DnsPodApi } from '@/api/dnspod'

interface DnsRecord {
  id: string;
  name: string;
  type: string;
  line: string;
  value: string;
  ttl?: number;
  status?: string;
  // Add other properties as needed
}

export const useRecordStore = defineStore('record', {
  state: () => ({
    records: [] as DnsRecord[]
  }),
  
  actions: {
    setRecords(newRecords: any[]) {
      this.records = newRecords
    },
    
    async listRecords(domain: string) {
      try {
        console.log('开始获取域名解析记录，域名:', domain)
        const response = await DnsPodApi.listRecords(domain)
        console.log('API响应数据结构:', JSON.stringify(response))
        console.log('API响应状态:', response.status)
        console.log('API响应数据:', response.records)
        console.log('API响应结果:', response.result)
        
        if (response.status.code === '1') {
          let records = response.data?.records || response.result?.records || response.records || response.data || response.result;
          
          // 确保records是数组
          if (!Array.isArray(records)) {
            records = records ? [records] : [];
          }
          
          console.log('解析后的记录数据:', records)
          console.log('解析记录数量:', records.length)
          this.records = records
          return this.records
        } else {
          throw new Error(response.status.message || '获取解析记录失败')
        }
      } catch (error) {
        console.error('获取解析记录失败:', error)
        throw error
      }
    },
    
    async createRecord(domain: string, record: Record<string, any>) {
      try {
        const response = await DnsPodApi.createRecord(domain, record)
        if (response.status.code === '1') {
          return response.record
        } else {
          throw new Error(response.status.message || '创建解析记录失败')
        }
      } catch (error) {
        console.error('创建解析记录失败:', error)
        throw error
      }
    },
    
    async updateRecord(domain: string, recordId: string, record: Record<string, any>) {
      try {
        const response = await DnsPodApi.updateRecord(domain, recordId, record)
        if (response.status.code === '1') {
          return response.record
        } else {
          throw new Error(response.status.message || '更新解析记录失败')
        }
      } catch (error) {
        console.error('更新解析记录失败:', error)
        throw error
      }
    },
    
    async deleteRecord(domain: string, recordId: string) {
      try {
        const response = await DnsPodApi.deleteRecord(domain, recordId)
        if (response.status.code === '1') {
          return true
        } else {
          throw new Error(response.status.message || '删除解析记录失败')
        }
      } catch (error) {
        console.error('删除解析记录失败:', error)
        throw error
      }
    }
  }
})