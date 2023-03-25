export function createSharedComposable(composable){
    let state
    return function(){
        if(!state){
            state = composable()
        }
        return state
    }
}