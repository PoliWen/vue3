
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

// 组件渲染的步骤，组件的渲染函数用来描述组件的渲染内容，
// 它的返回值是虚拟dom，我们执行组件的渲染函数得到虚拟dom，
// 然后将该虚拟dom渲染为真实的dom

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

// 1. subTree render函数可以是任意类型的虚拟节点，

// 例如
// 普通标签
// const vNode = {
//     type:'div'
// }
// // 组件
// const vNode = {
//     type: myComponent
// }
// // 片段
// const vNode = {
//     type:Fragement
// }
// // 文本节点
// const vNode = {
//     type:Text
// }

// 2. 执行setUp函数时，应该提供setupContext对象，执行渲染函数时候应该将this指向setupContext对象，还需要初始化data，得到setup的执行结果，并且检查setup函数的返回值是函数还是setupSate，和第十二章组件的渲染流程基本一致

// 通过封装一个renderVnode方法来解决
function renderVnode(vnode){
    const type = typeof vnode.type
    if(type === 'string'){
        // 普通标签
        return renderElementVnode(vnode)
    }else if(type==='object' || type === 'function'){
        // 组件
        return renderComponentVnode(vnode)
    }else if(type === Text){
        // 文本节点
        
    }else if(type === Fragement){
        // 片段
    }
}

function renderComponentVnode(vnode){
    let { type: { setup } } = vnode
    const render = setup()
    const subTree = render()
    return renderVnode(subTree)
}

const CompVnode = {
    type: myComponent
}

const html = renderComponentVnode(CompVnode)
console.log(html) // 输出: <div>hello</div>

// 客户端激活的原理
// 对于同构应用，组件会在客户端和服务端分别执行一次，
// 浏览器渲染了由服务端发送过来的html之后，页面中已经存在html了，当组件代码在客户端运行时，不会在重新创建dom，而是做了以下两件事情
// 1. 通过hydrate方法将虚拟dom和真实dom关联起来
// 2. 为页面中的dom元素添加事件绑定
// 我们知道一个虚拟节点被挂载之后，为了后续程序更新不需要重新渲染dom，
// 需要通过该虚拟节点的vnode.el属性存储对真实dom对象的引用，因此激活做的第一步就是将虚拟dom跟真实的dom进行相关联
// 在服务端渲染过程中，我们已经忽略了事件的绑定，和一些相关的props，因此在激活的过程中，还需要为页面中的dom元素添加事件绑定

// render.render(vnode,container)
// 对于同构应用使用
// // render.hydrate(vnode,container) 来进行激活

// 可以用代码简单模拟一下渲染过程
const html = renderComponentVnode(CompVnode)
const container = document.querySelector('#app')
container.innerHTML = html

// 激活
render.hydrate(CompVnode,container)

function cretedRenderer(options){
    function hydrate(node,vnode){
        // ...
    }
    return {
        render,
        hydrate
    }
}

function hydrate(vnode,container){
    hydrateNode(container.firstChild,vnode)
}

// 传入两个参数，一个是真实的dom，一个是虚拟dom节点
function hydrateNode(node,vnode){
    const { type } = vnode
    vnode.el = node
    if(typeof type === 'Object'){
        mountComponent(vnode,container,null)
    }else if(typeof type === 'string'){
        if(node.nodeType !== 1){
            console.log('mismatch')
            console.log('服务端渲染的真实DOM节点是', node)
            console.log('客户端渲染的虚拟DOM节点是', vnode)
        }
    }else{
        hydrateElement(node,vnode)
    }
    return node.nextSibling
}


function hydrateElement(el,vnode){
    if(vnode.props){
        for(const key in vnode.props){
            if(/^on/.test(key)){
                patchProps(el,key,null,vnode.props[key])
            }
        }
    }
    if(Array.isArray(vnode.children)){
        let nextNode = el.firstChild
        const len = vnode.children.length
        for(let i=0;i<len;i++){
            nextNode = hydrateNode(nextNode,vnode.children[i])
        }
    }
}
