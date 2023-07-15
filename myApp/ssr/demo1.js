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