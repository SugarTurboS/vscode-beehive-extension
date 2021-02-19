/**
 * @description 侧边栏 typescript
 */
import * as vscode from 'vscode'

/**
 * @description 子节点
 * @param label 标题 [必选]
 * @param collapsibleState 状态[必须]
 * @param description 简介 [可选]
 * @param projectName 项目名称 [可选]
 * @param path 项目路径 [可选]
 */
class SideBarEntryItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly description?: string,
    public readonly projectName?: string,
    public readonly path?: string
  ) {
    super(label, collapsibleState)
    this.path = `${this.path}`
    this.tooltip = `[BeeHive]: ${this.label}`
    this.projectName = `${this.projectName}`
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
