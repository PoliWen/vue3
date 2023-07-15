const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr'.split(',')
function renderElementVnode(Vnode){
    const { type: tag, props, children } = Vnode
    const isVoidTags = VOID_TAGS.includes(tag)
    let ret = `<${tag}`
    // 处理标签属性
    if(props){
        for(const attr in props){
            ret += ` ${attr}="${props[attr]}"`
        }
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


// 虚拟dom
const Element = {
    type:'div',
    props:{
        id: 'foo',
        class: 'bar'
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

console.log(renderElementVnode(Element))

// 还需要处理boolean的attriute,有指令就代表true，无就代表false
// 选中的 <input type="checkbox" checked/>
// 未选中的 <input type="checkbox/>
// 还需要考虑属性安全问题，不合法的属性不能够渲染，码点范围是[0x01,0x1f]和[0x7f,0x9f]
// 在服务端渲染中，属性的key仅用于虚拟dom的diff算法，在服务端是不存在update钩子的，所以无需渲染，除此之外一些事件绑定，以及ref属性操作dom也需要渲染。
// 基于以上问题，我们需要进一步完善代码