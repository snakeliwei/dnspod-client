import { useAuthStore } from '@/stores/auth'

export class DnsPodApi {
  private static readonly BASE_URL = '/api'
  
  static async request(endpoint: string, data: Record<string, any> = {}) {
    const authStore = useAuthStore()
    
    // 检查认证信息是否存在
    if (!authStore.token || !authStore.secret) {
      throw new Error('认证信息不存在，请先登录。当前token: ' + authStore.token + ', secret: ' + authStore.secret)
    }
    
    const formData = new FormData()
    formData.append('login_token', `${authStore.token},${authStore.secret}`)
    formData.append('format', 'json')
    
    // 添加其他数据到表单
    for (const key in data) {
      formData.append(key, data[key])
    }
    
    try {
      // 使用Tauri的HTTP插件发送请求，避免CORS限制
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData
      })
      
      // 检查HTTP响应状态
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log(`API响应 ${endpoint}:`, result)
      return result
    } catch (error) {
      console.error(`API请求失败 ${endpoint}:`, error)
      throw error
    }
  }
  
  // 域名相关API
  static async listDomains() {
    return this.request('/Domain.List')
  }
  
  // 记录相关API
  static async listRecords(domain: string) {
    return this.request('/Record.List', { domain })
  }
  
  static async createRecord(domain: string, record: Record<string, any>) {
    return this.request('/Record.Create', { domain, ...record })
  }
  
  static async updateRecord(domain: string, recordId: string, record: Record<string, any>) {
    return this.request('/Record.Modify', { 
      domain, 
      record_id: recordId,
      ...record 
    })
  }
  
  static async deleteRecord(domain: string, recordId: string) {
    return this.request('/Record.Remove', { domain, record_id: recordId })
  }
}