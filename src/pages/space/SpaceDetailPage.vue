<template>
  <div id="SpaceDetailPage">
    <!-- 空间信息 -->
    <a-flex justify="space-between" style="margin-bottom: 16px">
      <h2>{{ space.spaceName }}（私有空间）</h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/add_picture?spaceId=${props.id}`" target="_blank">
          + 创建图片
        </a-button>
        <a-button v-if="canEdit" type="default" @click="doEdit">
          编辑
          <template #icon>
            <EditOutlined />
          </template>
        </a-button>
        <a-button v-if="canEdit" danger @click="doDelete">
          删除
          <template #icon>
            <DeleteOutlined />
          </template>
        </a-button>
        <a-button type="primary" @click="doDownload">
          免费下载
          <template #icon>
            <DownloadOutlined />
          </template>
        </a-button>
        <a-tooltip
          :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`"
        >
          <a-progress
            type="circle"
            :percent="((space.totalSize * 100) / space.maxSize).toFixed(1)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>
    
    <!-- 图片列表 -->
    <PictureList
      :dataList="dataList"
      :loading="loading"
      showOp
      :onReload="fetchData"
    />
    
    <!-- 分页器 -->
    <a-pagination
      style="text-align: right; margin-top: 16px"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="() => `图片总数 ${total} / ${space.maxCount}`"
      @change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { listPictureVoByPageUsingPost } from '@/api/pictureController'
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import router from '@/router'
import { downloadImage, formatSize } from '@/utils'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController'
import PictureList from '@/components/PictureList.vue'
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const props = defineProps<{
  id: string | number
}>()
const space = ref<API.SpaceVO>({})

// 获取空间详情
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取空间详情失败：' + e.message)
  }
}

onMounted(() => {
  fetchSpaceDetail()
})

// 数据
const dataList = ref([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const onPageChange = (page, pageSize) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 转换搜索参数，确保 spaceId 是数字类型
    const params: API.PictureQueryRequest = {
      spaceId: typeof props.id === 'string' ? Number(props.id) : props.id,
      ...searchParams,
    }
    const res = await listPictureVoByPageUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data.records ?? []
      total.value = res.data.data.total ?? 0
    } else {
      message.error('获取数据失败，' + (res.data.message || '未知错误'))
    }
  } catch (error: any) {
    message.error('获取数据失败：' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

const loginUserStore = useLoginUserStore()
// 是否具有编辑权限
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser
  // 未登录不可编辑
  if (!loginUser.id) {
    return false
  }
  // 仅本人或管理员可编辑
  const spaceUserId = space.value.userId
  return loginUser.id === spaceUserId || loginUser.userRole === 'admin'
})

// 编辑空间
const doEdit = () => {
  router.push({
    path: '/add_space',
    query: {
      id: props.id,
    },
  })
}

// 删除空间
const doDelete = async () => {
  // TODO: 实现删除空间的逻辑
  message.warning('删除空间功能待实现')
}

// 下载空间所有图片
const doDownload = () => {
  // TODO: 实现批量下载功能
  message.warning('批量下载功能待实现')
}
</script>

<style scoped></style>
