import { ofetch } from "ofetch"
import type { FetchOptions } from 'ofetch'
import fetchCache from './cache'
import { getCurrentInstance } from "vue"

export const useFetch = async (requestInfo:RequestInfo, options?:FetchOptions) => {
  const app = getCurrentInstance()?.root
  
  // 简单处理
  const url = typeof requestInfo === 'string'? requestInfo : requestInfo.url

  // 判断是否有数据
  if(fetchCache[url]) {
    const requestData = JSON.parse(JSON.stringify(fetchCache[url].data))

    // 简单判断下 如果是在浏览器端获取一次后 就删除，避免下次接口的缓存
    if(typeof window !== 'undefined') {
      delete fetchCache[url]
    }
    
    return requestData
  }
  const data = await ofetch(requestInfo, options)
  
  // 如果是服务端渲染加入缓存，用于脱水
  if(import.meta.env?.SSR && app && app?.appContext?.app?.__data__) {
    app.appContext.app.__data__[url] = {
      data,
      mode: 'ssr'
    }
  }
  return data
}