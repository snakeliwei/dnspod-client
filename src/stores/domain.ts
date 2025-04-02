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

interface DoMain {
  id: string;
  name: string;
  grade: string;
  status: string;
  // Add other properties as needed
}

export const useDomainStore = defineStore('domain', {
  state: () => ({
    domains: [] as DoMain[],
    records: [] as DnsRecord[]
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
    }
  }
})