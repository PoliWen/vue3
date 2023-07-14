let fetchCache:any = {}

export const initSSRCache = () => {
  // 数据注水
  if(globalThis.__MY_CACHE__) { 
    fetchCache = globalThis.__MY_CACHE__
  }
}

initSSRCache()

export default fetchCache