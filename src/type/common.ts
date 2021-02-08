// 工程文件类型
export interface FolderType {
  name: string
  path: string
}

// 插件信息
export interface VscodeExtensionType {
  name: string
  version: string
  author: string
}

// 命令
export interface ShellType {
  key: string
  value: string
  environment?: string
}
