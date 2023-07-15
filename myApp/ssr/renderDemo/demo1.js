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
            type:'p',
            children:'hello'
        }
    ]
}

// 将虚拟dom渲染成html
function renderElementVnode(Vnode){
    const { type: tag, props, children } = Vnode
    let ret = `<${tag}`
    // 处理标签属性
    if(props){
        for(const attr in props){
            ret += ` ${attr}="${props[attr]}"`
        }
    }
    // 开始标签的闭合
    ret+= '>'

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

console.log(renderElementVnode(Element))

// 以上代码存在缺陷
// 需要考虑是否是自闭合标签
// 需要考虑名称是否合法，并且需要对属性值进行HTML转义
// 子节点的类型多种多样，可以是任意类型的虚拟节点，如fragment，组件，函数式组件，文本等，这些都需要处理
// 标签的子节点也需要进行html转义

