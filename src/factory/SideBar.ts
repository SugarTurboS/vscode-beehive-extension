/**
 * @description 侧边栏 typescript
 */
import * as vscode from 'vscode'

/**
 * @description 子节点
 * @param label 标题 [必选]
 * @param description 简介 [必选]
 * @param collapsibleState 状态[必选]
 */
class SideBarEntryItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly description?: string,
    public readonly path?: string
  ) {
    super(label, collapsibleState)
    this.path = `${this.path}`
    this.tooltip = `[BeeHive]: ${this.label}`
    this.description = `${this.description || ''}`
  }
}

/**
 * @description 父节点
 */
abstract class SideBarEntryListImplements implements vscode.TreeDataProvider<SideBarEntryItem> {
  abstract getChildren(
    element?: SideBarEntryItem
  ): vscode.ProviderResult<SideBarEntryItem[]>

  getTreeItem(element: SideBarEntryItem): vscode.TreeItem {
    return element
  }
}

export { SideBarEntryItem, SideBarEntryListImplements }
