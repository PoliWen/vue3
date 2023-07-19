function mountComponent(vnode,container,anchor){
    instance.update = effect(()=>{
        const subTree = render.call(renderContext,renderContext)
        if(!instance.isMounted){
                beforeMount && beforeMount.call(renderContext)
                // 如果vnode.el存在，这意味着要执行激活
                if(vnode.el){
                    hydrateNode(vnode.el,subTree)
                }else{
                    patch(null,subTree,container,anchor)
                }
                instance.isMounted = true
                mounted && mounted.call(renderContext)
                instance.mounted && instance.mounted.forEach(hook=>hook.call(renderContext))
            }else{
                beforeUpdate && beforeUpdate.call(renderContext)
                patch(instance.subTree,subTree,container,anchor)
                update && update.call(renderContext)
            }
            instance.subTree = subTree
        },{
            scheduler:queueJob
        }
    )
}