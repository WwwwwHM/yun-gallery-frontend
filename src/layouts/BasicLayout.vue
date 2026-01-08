<template>
  <div id="basicLayout">
    <!-- 根布局：最小高度占满屏幕 -->
    <!-- 顶部栏 -->
    <a-layout-header class="header">
      <GlobalHeader />
    </a-layout-header>
    <a-layout style="min-height: 100vh">
      <!-- ✅ 核心1：侧边栏必须用 <a-layout-sider> 官方标签包裹，和右侧布局平级 -->
      <a-layout-sider class="sider">
        <GlobalSider />
      </a-layout-sider>
      <!-- 中间内容区 -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <!-- 底部栏 -->
      <a-layout-footer class="footer">
        <a href="https://www.codefather.cn" target="_blank">编程导航 by 程序员鱼皮</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '../components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue'
</script>

<style scoped>
#basicLayout .header {
  background: white;
  color: unset;
  margin-bottom: 1px;
  padding-inline: 20px;
}

#basicLayout .content {
  padding: 28px;
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 20px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

#basicLayout .sider {
  background: #fff;
  padding-top: 20px;
  border-right: 0.5px solid #eee;
}

#basicLayout :deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}
</style>
