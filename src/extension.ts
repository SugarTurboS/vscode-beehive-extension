import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('BeeHive 插件已启动，忙去吧～')
  require('./container/commandSet')(context)
}

export function deactivate() {}
