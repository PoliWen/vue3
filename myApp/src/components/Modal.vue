
<script setup lang="ts">
</script>

<template>
   <teleport to="body">
   <div class="modal">
      <div class="modal-content">
        <div class="modal-title">弹窗标题</div>
        <div class="modal-body">弹框内容</div>
        <div class="modal-footer">弹框底部</div>
        <slot></slot>
      </div>
      <div class="mask"></div>
    </div>
</teleport>
</template>
<style lang="scss" scoped>
.modal{
    position: fixed;
    text-align: left;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    &-content{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 480px;
        height: 500px;
        background: #fff;
        z-index: 2;
        border-radius: 8px;
    }
    &-title{
        padding: 5px 15px;
        height: 30px;
        line-height: 30px;
        text-align: left;
    }
    &-body,&-footer{
        padding: 15px;
    }
}

:global(.mask){
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,.3);
    z-index: 1;
}
.slot{
    background: yellow;
}
:slotted(.slot){
    background: red;
}
</style>

