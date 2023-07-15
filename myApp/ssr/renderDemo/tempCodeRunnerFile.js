
// 如何渲染组件
const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr'.split(',')
function renderElementVnode(Vnode){
    const { type: tag, props, children } = Vnode
    const isVoidTags = VOID_TAGS.includes(tag)
    let ret = `<${tag}`
    // 处理标签属性
    if(props){
        ret += renderArr(props)
    }
    // 开始标签的闭合
    ret += isVoidTags ? '/>' :'>'

    // 如果是闭合标签则直接返回结果，无需处理children，因为闭合标签没有children
    if(isVoidTags) return ret
    
    // 处理子节点
    if(typeof children === 'string'){
        ret += children
    }else if(Array.isArray(children)){
        children.forEach(child=>{
            ret += renderElementVnode(child)
        })
    }

    // 标签结束
    ret+= `</${tag}>`

    return ret
}

const shouldIgnoreProp = ['key','ref']
function renderArr(props){
    let ret = ''
    for(const key in props){
        if(
            // 如果是key和ref，以及事件属性，则跳过渲染
            shouldIgnoreProp.includes(key) || 
            /^on[^a-z]/.test(key)
        ){
            continue
        }
        const value = props[key]
        ret += renderDynaimcAttr(key,value)
    }
    return ret
}

const isBooleanAttr = (key) => {
    (`itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`+
    `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,` +
    `inert,loop,open,required,reversed,scoped,seamless,` +
    `checked,muted,multiple,selected`).split(',').includes(key)
}

const isSSRSafeAttrName = (key) => /[>/="'\u0009\u000a\u000c\u0020]/.test(key)

function renderDynaimcAttr(key,value){
    if(isBooleanAttr(key)){
        // 对于boolean attribute,如果值是false，这什么都不渲染，否则只需要渲染key即可
        return value === false ? '' : ` ${key}` 
    }else if(isSSRSafeAttrName){
        return value === '' ? ` ${key}` : ` ${key}="${escapeHtml(value)}"`
    }else{
        console.warn(
            `[@vue/server-render] skipped rendering unsafe attribute name : ${key}`
        )
        return ''
    }
}

// 对&,<,>,',"字符进行转义防止xss攻击
const escapeRE = /["'&<>]/

export function escapeHtml(string) {
  const str = '' + string
  const match = escapeRE.exec(str)

  if (!match) {
    return str
  }

  let html = ''
  let escaped
  let index
  let lastIndex = 0
  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escaped = '&quot;'
        break
      case 38: // &
        escaped = '&amp;'
        break
      case 39: // '
        escaped = '&#39;'
        break
      case 60: // <
        escaped = '&lt;'
        break
      case 62: // >
        escaped = '&gt;'
        break
      default:
        continue
    }

    if (lastIndex !== index) {
      html += str.slice(lastIndex, index)
    }

    lastIndex = index + 1
    html += escaped
  }

  return lastIndex !== index ? html + str.slice(lastIndex, index) : html
}


// 虚拟dom
const Element = {
    type:'div',
    props:{
        id: 'foo',
        class: '<bar/>""',
        ref: 'foo',
        key: 1,
        onClick:function(){
            console.log(123)
        }
    },
    children:[
        {
            type:'p',
            children:'hello'
        },
        {
            type: 'img',
            props:{
                src: 'https://avatars.githubusercontent.com/u/28656609?v=4'
            },
        }
    ]
}

// console.log(renderElementVnode(Element))

const myComponent = {
    setup(){
        return () => {
            return {
                type: 'div',
                children: 'hello'
            }
        }
    }
}
const CompVnode = {
    type: myComponent
}


function renderComponentVnode(vnode){
    let { type: { setup } } = vnode
    const render = setup()
    const subTree = render()
    return renderElementVnode(subTree)
}

const html = renderComponentVnode(CompVnode)
console.log(html) // 输出: <div>hello</div>