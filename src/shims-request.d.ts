// src/shims-request.d.ts
declare module '@/request' {
  import { AxiosInstance } from 'axios';

  // 根据你的实际导出，声明类型
  const myAxios: AxiosInstance;
  export default myAxios;
}
