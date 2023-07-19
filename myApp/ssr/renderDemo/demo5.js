const myComponent = {
    props:{
        name:'hello'
    },
    setup(){
        return ()=>{
            return {
                type:'div',
                children:'hello'
            }
        }
    }
}
const VNode = {
    type: myComponent
}

function renderComponentVNode(vnode) {
    const isFunction = typeof vnode.type === 'function'
    let componentOptions = vnode.type
    if (isFunction) {
        componentOptions = {
        	render: vnode.type, 
            props: vnode.type.props
    	}
    }
    let { render, data, setup, beforeCreate, created, props: propsOption } = componentOptions
    beforeCreate && beforeCreate()
    
    // 无需使用reactive(）创建data的响应式版本
    const state = data ? data() : null
    const [ props, attrs ] = resolveProps(propsOption, vnode.props)
    const slots = vnode.children || {}
    const instance = {
        state,
        props, // props 无需 shallowReactive 
        isMounted: false, 
        subtree: null,
        slots, 
        mounted: [],
        keepAliveCtx: null
    }
    function emit(event,...payload) {
        const eventName = `on${event[0].toUpperCase() + event.slice(1)}`
        const handler = instance.props[eventName]
        if (handler) {
            handler (...payload)
        }else{
            console.error("事件不存在")
        }
    }
    // setup
    let setupState = null
    if (setup){
        const setupContext = {attrs, emit, slots }
        const prevInstance = seCurrentInstance (instance)
        const setupResult = setup(shallowReadonly(instance.props), setupContext)
        setCurrentInstance(prevInstance)
        if (typeof setupResult === 'function') {
            if (render) console.error('setup 函数返回盒染函数，render 选项将被忽略')
            render = setupResult
        }else{
            setupState = setupContext
        }
    }
    vnode.component = instance
    const renderContext = new Proxy (instance, {
        get(t, k, r){
            const { state, props, slots } = t
            if(k === '$slots') return slots
            if (state && k in state) {
                return state[k]
            } else if (k in props) {
                return props [k]
            } else if (setupState && k in setupState) {
                return setupState[k]
            }else {
                console.error ('不存在')
            }
        },
        set(t, K, V, r) {
            const { state, props } = t
            if (state && k in state) {
                state[K]= v
            } else if (k in props) {
                props[k] = v
            } else if (setupState && k in setupState) {
                setupState[k] = V
            }else{
                console.error('不存在')
            }
        }
    })
    created && created.call(renderContext)
    const subTree = render.call(renderContext,renderContext)
    return renderVNode(subTree)
}