import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DnsPodApi } from '@/api/dnspod'

export const useDomainStore = defineStore('domain', {
  state: () => ({
    domains: [],
    records: []
  }),
  
  actions: {
    setDomains(newDomains: any[]) {
      this.domains = newDomains
    },
    
    setRecords(newRecords: any[]) {
      this.records = newRecords
    },
    
    async listDomains() {
      try {
        console.log('开始获取域名列表...')
        const response = await DnsPodApi.listDomains()
        console.log('域名列表API响应:', response)
        
        if (response && response.status && response.status.code === '1') {
          this.domains = response.domains || []
          console.log('成功获取域名列表:', this.domains)
          return this.domains
        } else {
          const errorMsg = response?.status?.message || '获取域名列表失败'
          console.error('域名列表API返回错误:', errorMsg)
          throw new Error(errorMsg)
        }
      } catch (error) {
        console.error('获取域名列表失败:', error)
        throw error
      }
    },
    
    async createDomain(domain: string) {
      // 这里应该调用API创建域名
      return {}
    },
    
    async deleteDomain(id: string) {
      // 这里应该调用API删除域名
      return {}
    }
  }
})