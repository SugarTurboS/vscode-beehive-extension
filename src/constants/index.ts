// 插件前缀
export const PREFIX = 'beehive'

// 版本配置
export const MATCH_CONFIG_MAPS = {
  LOW: 'lowMatch', // 低配
  MIDDLE: 'middleMatch', // 中配
  HIGH: 'highMatch', // 高配
}

// 脚本规则环境
export const RUN_ENVIRONMENT = [
  'dev',
  'test',
  'demo',
  'prod',
  'release',
  'publish',
]

export const RUN_ENVIRONMENT_MAPS: { [key: string]: any } = {
  dev: '开发环境',
  test: '测试环境',
  demo: 'demo环境',
  prod: '生产环境',
  release: '预发环境',
  publish: '发布环境',
  unknown: '未知环境',
}
