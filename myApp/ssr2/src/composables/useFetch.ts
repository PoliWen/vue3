import { ofetch } from "ofetch"
import type { FetchOptions } from 'ofetch'
import { getCurrentInstance } from "vue"

let ssrDataCache:any = {}
export const useFetch = async (requestInfo:RequestInfo, options?:FetchOptions) => {
  const app = getCurrentInstance()?.root
  
  const url = typeof requestInfo === 'string'? requestInfo : requestInfo.url

  // 请求在客户端执行的话，直接从window.__SSR_DATA__中获取数据
  if(!import.meta.env?.SSR && window?.__SSR_DATA__) {
    ssrDataCache = window?.__SSR_DATA__
  }

  if(ssrDataCache[url]) {
    const ssrData = JSON.parse(JSON.stringify(ssrDataCache[url].data))

    // 简单判断下 如果是在浏览器端获取一次后 就删除，避免下次接口的缓存
    if(typeof window !== 'undefined') {
      delete ssrDataCache[url]
    }
    
    return ssrData
  }

  const data = await ofetch(requestInfo, options)
  
  // 如果是服务端渲染将接口返回的数据缓存到app.__data__中
  if(import.meta.env?.SSR && app && app?.appContext?.app?.__data__) {
    app.appContext.app.__data__[url] = {
      data,
      mode: 'ssr'
    }
  }

  return data
}