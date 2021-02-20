export const PREFIX = 'beehive'

export const MATCH_CONFIG_MAPS = {
  LOW: 'lowMatch', // 低配
  MIDDLE: 'middleMatch', // 中配
  HIGH: 'highMatch', // 高配
}

export const RUN_ENVIRONMENT = ['dev', 'test', 'test-1', 'test-2', 'prod']

export const RUN_ENVIRONMENT_MAPS: { [key: string]: any } = {
  dev: '开发环境',
  test: '测试环境',
  'test-1': '测试环境1',
  'test-2': '测试环境2',
  prod: '生产环境',
  unknown: '未知,建议修改',
}
