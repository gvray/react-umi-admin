/**
 * 树形数据工具函数
 */

/**
 * 虚拟根节点配置
 */
export interface VirtualRootConfig {
  /** 虚拟根节点的 ID 字段名 */
  idField: string;
  /** 虚拟根节点的 ID 值 */
  idValue: string;
  /** 虚拟根节点的显示名称字段名 */
  nameField: string;
  /** 虚拟根节点的显示名称 */
  nameValue: string;
  /** 父节点 ID 字段名 */
  parentIdField: string;
}

/**
 * 为树形数据添加虚拟根节点
 * @param data 原始树形数据
 * @param config 虚拟根节点配置
 * @returns 添加虚拟根节点后的数据
 *
 * @example
 * ```ts
 * const data = [
 *   { id: '1', name: 'Node 1', parentId: null },
 *   { id: '2', name: 'Node 2', parentId: '1' }
 * ];
 *
 * const result = withVirtualRoot(data, {
 *   idField: 'id',
 *   idValue: '00000000-0000-0000-0000-000000000000',
 *   nameField: 'name',
 *   nameValue: '顶级节点',
 *   parentIdField: 'parentId'
 * });
 * ```
 */
export const withVirtualRoot = <T extends Record<string, any>>(
  data: T[],
  config: VirtualRootConfig,
): T[] => {
  const { idField, idValue, nameField, nameValue, parentIdField } = config;

  // 创建虚拟根节点
  const virtualRoot = {
    [idField]: idValue,
    [nameField]: nameValue,
    [parentIdField]: null,
  } as T;

  // 将所有顶级节点（parentId 为 null）的父节点设置为虚拟根节点
  const processedData = data.map((item) => ({
    ...item,
    [parentIdField]:
      item[parentIdField] === null || item[parentIdField] === undefined
        ? idValue
        : item[parentIdField],
  }));

  return [virtualRoot, ...processedData];
};

/**
 * 将表单数据中的虚拟根节点 ID 转换为 null（用于提交到后端）
 * @param values 表单数据
 * @param virtualRootId 虚拟根节点的 ID 值
 * @param parentIdField 父节点 ID 字段名
 * @returns 转换后的数据
 *
 * @example
 * ```ts
 * const formValues = {
 *   name: 'New Node',
 *   parentId: '00000000-0000-0000-0000-000000000000'
 * };
 *
 * const result = normalizeVirtualRoot(formValues, '00000000-0000-0000-0000-000000000000', 'parentId');
 * // result: { name: 'New Node', parentId: null }
 * ```
 */
export const normalizeVirtualRoot = <T extends Record<string, any>>(
  values: T,
  virtualRootId: string,
  parentIdField: string,
): T => {
  return {
    ...values,
    [parentIdField]:
      values[parentIdField] === virtualRootId ? null : values[parentIdField],
  };
};

/**
 * 常用的虚拟根节点 ID（全零 UUID）
 */
export const VIRTUAL_ROOT_ID = '00000000-0000-0000-0000-000000000000';
