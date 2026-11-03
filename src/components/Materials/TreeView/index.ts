export type TreeNodeId = number | string;

export interface TreeNode {
  id: TreeNodeId;
  title: string;
  children?: TreeNode[];
}
