type TreeNode = {
  children?: TreeNode[];
  [key: string]: any;
};

export function pruneEmptyChildren(tree: TreeNode[]): TreeNode[] {
  const stack: TreeNode[] = [...tree];

  while (stack.length) {
    const node = stack.pop()!;

    if (Array.isArray(node.children)) {
      if (node.children.length === 0) {
        delete node.children;
      } else {
        // 非空才继续遍历
        for (let i = 0; i < node.children.length; i++) {
          stack.push(node.children[i]);
        }
      }
    }
  }

  return tree;
}
