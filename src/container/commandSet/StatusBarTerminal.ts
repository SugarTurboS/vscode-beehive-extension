import * as vscode from 'vscode'
import { MyTerminalOptions } from '../../type/common'

/**
 * @description 终端
 * @property {number} terminalIndex 终端下标
 * @property {object} terminalOptions 配置参数
 * 具体参数可阅读: https://code.visualstudio.com/api/references/vscode-api#TerminalOptions
 */
export class StatusBarTerminal {
  private _item: vscode.StatusBarItem
  private _terminal: vscode.Terminal

  constructor(terminalIndex: number, terminalOptions: MyTerminalOptions) {
    this._item = vscode.window.createStatusBarItem()
    this.setTerminalIndex(terminalIndex)
    this._item.show()

    this._terminal = vscode.window.createTerminal({
      cwd: terminalOptions?.terminalCwd,
      name: terminalOptions?.terminalName,
    })

    if (terminalOptions?.terminalAutoInputText) {
      if (terminalOptions?.terminalText) {
        this._terminal.sendText(
          terminalOptions.terminalText,
          terminalOptions.terminalAutoRun
        )
      }
    }
    this._terminal.show()
  }

  public show(): void {
    this._terminal.show()
  }

  public setTerminalIndex(index: number): void {
    this._item.text = `$(terminal)${index + 1}`
  }

  public hasTerminal(terminal: vscode.Terminal): boolean {
    return this._terminal === terminal
  }

  public dispose(): void {
    this._item.dispose()
    this._terminal.dispose()
  }
}
