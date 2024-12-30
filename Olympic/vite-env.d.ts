/// <reference types="vite/client" />

interface ImportMetaEnv {
    BASE_URL: string;  // 保持 readonly 一致
    // 你可以在这里添加其他的环境变量
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  