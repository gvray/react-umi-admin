/**
 * 此文件由 scripts/gen-api-types.ts 自动生成
 * 生成时间: 2026-02-12T01:13:58.156Z
 * 数据来源: http://localhost:8001/api-json
 * 请勿手动修改此文件
 */

declare namespace API {
  interface RegisterDto {
    /** 用户邮箱 */
    email?: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 密码 */
    password: string;
  }

  interface LoginDto {
    /** 用户名/邮箱/手机号 */
    account: string;
    /** 密码 */
    password: string;
  }

  interface MenuMetaDto {
    /** 菜单路径 */
    path?: Record<string, unknown>;
    /** 菜单图标 */
    icon?: Record<string, unknown>;
    /** 是否隐藏 */
    hidden?: boolean;
    /** 组件标识 */
    component?: Record<string, unknown>;
    /** 排序 */
    sort?: number;
  }

  interface MenuResponseDto {
    /** 权限唯一标识符（UUID） */
    permissionId: string;
    /** 父级权限ID（菜单层级） */
    parentPermissionId?: Record<string, unknown>;
    /** 权限名称 */
    name: string;
    /** 权限代码 */
    code: string;
    /** 权限类型 */
    type: string;
    /** 操作类型 */
    action: string;
    /** 菜单元数据 */
    meta?: MenuMetaDto;
    /** 子节点 */
    children?: MenuResponseDto[];
  }

  interface CreateUserDto {
    /**
     * 用户唯一标识符（UUID）
     * @example 550e8400-e29b-41d4-a716-446655440000
     */
    readonly userId?: string;
    /**
     * 邮箱
     * @example user@example.com
     */
    email?: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /**
     * 手机号码
     * @example 13800138000
     */
    phone?: string;
    /**
     * 备注信息
     * @example 这是一个备注
     */
    remark?: string;
    /** 密码 */
    password: string;
    /** 头像URL */
    avatar?: string;
    /**
     * 性别
     * @example 1
     */
    gender?: 0 | 1 | 2 | 3;
    /**
     * 用户状态
     * @example 1
     */
    status?: 0 | 1 | 2 | 3;
    /**
     * 部门ID（UUID）
     * @example 550e8400-e29b-41d4-a716-446655440001
     */
    departmentId?: string;
    /** 岗位ID列表（UUID） */
    positionIds?: string[];
  }

  interface RoleResponseDto {
    /**
     * 角色唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    roleId: string;
    /** 角色标识键 */
    roleKey: string;
    /** 角色名称 */
    name: string;
    /** 角色描述 */
    description?: string;
    /** 备注信息 */
    remark?: string;
    /** 排序权重 */
    sort: number;
    /** 状态：0-禁用，1-启用 */
    status: number;
    /** 权限列表 */
    permissions?: RolePermissionResponseDto[];
    /** 用户列表 */
    users?: RoleUserResponseDto[];
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  interface DepartmentResponseDto {
    /**
     * 部门唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    departmentId: string;
    /** 部门名称 */
    name: string;
    /** 部门描述 */
    description?: string;
    /** 备注信息 */
    remark?: string;
    /** 负责人 */
    manager?: string;
    /** 联系电话 */
    phone?: string;
    /** 邮箱 */
    email?: string;
    /** 父部门ID */
    parentId: string;
    /** 状态 */
    status: number;
    /** 排序 */
    sort: number;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
    children: DepartmentResponseDto[][];
  }

  interface PositionResponseDto {
    /**
     * 岗位唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    positionId: string;
    /** 岗位名称 */
    name: string;
    /** 岗位编码 */
    code: string;
    /** 岗位描述 */
    description?: string;
    /** 备注信息 */
    remark?: string;
    /** 用户列表 */
    users?: PositionUserResponseDto[];
    /** 状态 */
    status: number;
    /** 排序 */
    sort: number;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  interface UserResponseDto {
    /** 用户数据库ID */
    id: number;
    /**
     * 用户唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    userId: string;
    /** 邮箱 */
    email?: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 手机号码 */
    phone?: string;
    /** 头像URL */
    avatar?: string;
    /**
     * 性别
     * @example 1
     */
    gender?: 0 | 1 | 2 | 3;
    /** 备注信息 */
    remark?: string;
    /**
     * 用户状态
     * @example 1
     */
    status: 0 | 1 | 2 | 3;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
    /** 用户角色列表 */
    roles?: RoleResponseDto[];
    /** 所属部门 */
    department?: DepartmentResponseDto;
    /** 所属岗位列表 */
    positions?: PositionResponseDto[];
  }

  interface UpdateUserDto {
    /**
     * 用户唯一标识符（UUID）
     * @example 550e8400-e29b-41d4-a716-446655440000
     */
    readonly userId?: string;
    /**
     * 邮箱
     * @example user@example.com
     */
    email?: string;
    /** 用户名 */
    username?: string;
    /** 昵称 */
    nickname?: string;
    /**
     * 手机号码
     * @example 13800138000
     */
    phone?: string;
    /**
     * 备注信息
     * @example 这是一个备注
     */
    remark?: string;
    /** 头像URL */
    avatar?: string;
    /**
     * 性别
     * @example 1
     */
    gender?: 0 | 1 | 2 | 3;
    /**
     * 用户状态
     * @example 1
     */
    status?: 0 | 1 | 2 | 3;
    /**
     * 部门ID（UUID）
     * @example 550e8400-e29b-41d4-a716-446655440001
     */
    departmentId?: string;
    /** 岗位ID列表（UUID） */
    positionIds?: string[];
  }

  interface AssignRolesDto {
    /** 角色ID列表（UUID） */
    roleIds: string[];
  }

  interface BatchDeleteUsersDto {
    /** 待删除用户ID列表 */
    ids: string[];
  }

  interface LoginLogResponseDto {
    /** 日志ID */
    id: number;
    /** 登录用户名/邮箱/手机号 */
    account: string;
    /** 登录IP地址 */
    ipAddress: string;
    /** 用户代理信息 */
    userAgent?: string;
    /** 登录状态：1-成功, 0-失败 */
    status: number;
    /** 登录类型 */
    loginType: string;
    /** 失败原因 */
    failReason?: string;
    /** 登录地点（可选，基于IP解析） */
    location?: string;
    /** 设备信息 */
    device?: string;
    /** 浏览器信息 */
    browser?: string;
    /** 操作系统信息 */
    os?: string;
    /** 创建时间 */
    createdAt: string;
  }

  interface BatchDeleteLoginLogsDto {
    /** 待删除日志ID列表 */
    ids: number[];
  }

  interface CleanLoginLogsDto {
    /**
     * 清理多少天之前的日志（不传则清空全部）
     * @example 7
     */
    days: number;
  }

  interface CreateRoleDto {
    /** 角色名称 */
    name: string;
    /** 角色标识键 */
    roleKey: string;
    /** 角色描述 */
    description?: string;
    /** 备注信息 */
    remark?: string;
    /**
     * 排序权重，数字越小越靠前
     * @example 0
     */
    sort?: number;
    /**
     * 状态：0-禁用，1-启用
     * @example 1
     */
    status?: number;
    /** 权限ID列表 */
    permissionIds?: string[];
  }

  interface UpdateRoleDto {
    /** 角色名称 */
    name?: string;
    /** 角色标识键 */
    roleKey?: string;
    /** 角色描述 */
    description?: string;
    /** 备注信息 */
    remark?: string;
    /**
     * 排序权重，数字越小越靠前
     * @example 0
     */
    sort?: number;
    /**
     * 状态：0-禁用，1-启用
     * @example 1
     */
    status?: number;
    /** 权限ID列表 */
    permissionIds?: string[];
  }

  interface AssignPermissionsDto {
    /** 权限ID列表 */
    permissionIds: string[];
  }

  interface AssignUsersDto {
    /** 用户ID列表 */
    userIds: string[];
  }

  interface RolePermissionResponseDto {
    /**
     * 权限唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    permissionId: string;
    /** 权限名称 */
    name: string;
    /** 权限代码 */
    code: string;
    /** 操作类型 */
    action: string;
  }

  interface RoleUserResponseDto {
    /**
     * 用户唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    userId: string;
    /** 用户名 */
    username: string;
    /** 用户昵称 */
    nickname: string;
    /** 用户邮箱 */
    email: string;
    /** 用户状态：0-禁用，1-启用 */
    status: number;
  }

  interface AssignDataScopeDto {
    /**
     * 数据权限类型：1-仅本人, 2-本部门, 3-本部门及以下, 4-自定义, 5-全部
     * @example 4
     */
    dataScope: number;
    /** 部门ID列表（当dataScope为4-自定义时必填） */
    departmentIds?: string[];
  }

  interface BatchDeleteRolesDto {
    /** 待删除角色ID列表 */
    ids: string[];
  }

  interface CreateMenuMetaDto {
    /** 菜单路径 */
    path?: string;
    /** 菜单图标 */
    icon?: string;
    /** 菜单是否隐藏 */
    hidden?: boolean;
    /** 组件标识 */
    component?: string;
    /** 排序 */
    sort?: number;
  }

  interface CreatePermissionDto {
    /** 权限名称 */
    name: string;
    /** 权限代码（唯一） */
    code: string;
    /** 权限类型 */
    type: 'DIRECTORY' | 'MENU' | 'BUTTON' | 'API';
    /** 父级菜单的权限ID（仅非菜单时需要） */
    parentPermissionId?: string;
    /** 操作类型（菜单默认为access） */
    action?:
      | 'access'
      | 'view'
      | 'create'
      | 'update'
      | 'delete'
      | 'export'
      | 'import';
    /** 权限描述 */
    description?: string;
    /** 菜单元信息（仅菜单） */
    menuMeta?: CreateMenuMetaDto;
  }

  interface UpdatePermissionDto {
    /** 权限名称 */
    name?: string;
    /** 权限代码（唯一） */
    code?: string;
    /** 权限类型 */
    type?: 'DIRECTORY' | 'MENU' | 'BUTTON' | 'API';
    /** 父级菜单的权限ID（仅非菜单时需要） */
    parentPermissionId?: string;
    /** 操作类型（菜单默认为access） */
    action?:
      | 'access'
      | 'view'
      | 'create'
      | 'update'
      | 'delete'
      | 'export'
      | 'import';
    /** 权限描述 */
    description?: string;
    /** 菜单元信息（仅菜单） */
    menuMeta?: CreateMenuMetaDto;
  }

  interface BatchDeletePermissionsDto {
    /** 待删除权限ID列表 */
    ids: string[];
  }

  interface CreateDepartmentDto {
    /** 部门名称 */
    name: string;
    /** 部门描述 */
    description?: string;
    /** 备注信息 */
    remark?: string;
    /** 负责人 */
    manager?: string;
    /** 联系电话 */
    phone?: string;
    /** 邮箱 */
    email?: string;
    /** 父部门ID（UUID） */
    parentId?: string;
    /** 状态 */
    status?: number;
    /** 排序 */
    sort?: number;
  }

  interface UpdateDepartmentDto {
    /** 部门名称 */
    name?: string;
    /** 部门描述 */
    description?: string;
    /** 备注信息 */
    remark?: string;
    /** 负责人 */
    manager?: string;
    /** 联系电话 */
    phone?: string;
    /** 邮箱 */
    email?: string;
    /** 父部门ID（UUID） */
    parentId?: string;
    /** 状态 */
    status?: number;
    /** 排序 */
    sort?: number;
  }

  interface BatchDeleteDepartmentsDto {
    /** 待删除部门ID列表 */
    ids: string[];
  }

  interface CreatePositionDto {
    /** 岗位名称 */
    name: string;
    /** 岗位编码 */
    code: string;
    /** 岗位描述 */
    description?: string;
    /** 备注信息 */
    remark?: string;
    /** 状态 */
    status?: number;
    /** 排序 */
    sort?: number;
  }

  interface PositionUserResponseDto {
    /**
     * 用户唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    userId: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 邮箱 */
    email?: string;
  }

  interface UpdatePositionDto {
    /** 岗位名称 */
    name?: string;
    /** 岗位编码 */
    code?: string;
    /** 岗位描述 */
    description?: string;
    /** 备注信息 */
    remark?: string;
    /** 状态 */
    status?: number;
    /** 排序 */
    sort?: number;
  }

  interface BatchDeletePositionsDto {
    /** 待删除岗位ID列表 */
    ids: string[];
  }

  interface CreateDictionaryTypeDto {
    /**
     * 字典类型编码
     * @example user_status
     */
    code: string;
    /**
     * 字典类型名称
     * @example 用户状态
     */
    name: string;
    /**
     * 描述
     * @example 用户状态字典类型
     */
    description?: string;
    /**
     * 状态：0-禁用, 1-启用
     * @example 1
     */
    status?: number;
    /**
     * 排序权重
     * @example 0
     */
    sort?: number;
    /**
     * 备注信息
     * @example 用户状态字典类型备注
     */
    remark?: string;
  }

  interface DictionaryTypeResponseDto {
    /**
     * 字典类型ID（UUID）
     * @example 550e8400-e29b-41d4-a716-446655440001
     */
    typeId: string;
    /**
     * 字典类型编码
     * @example user_status
     */
    code: string;
    /**
     * 字典类型名称
     * @example 用户状态
     */
    name: string;
    /**
     * 描述
     * @example 用户状态字典类型
     */
    description?: string;
    /**
     * 状态：0-禁用, 1-启用
     * @example 1
     */
    status: number;
    /**
     * 排序权重
     * @example 0
     */
    sort: number;
    /**
     * 备注信息
     * @example 用户状态字典类型备注
     */
    remark?: string;
    /**
     * 创建时间
     * @example 2025-01-01T00:00:00.000Z
     */
    createdAt: string;
    /**
     * 更新时间
     * @example 2025-01-01T00:00:00.000Z
     */
    updatedAt: string;
  }

  interface UpdateDictionaryTypeDto {
    /**
     * 字典类型编码
     * @example user_status
     */
    code?: string;
    /**
     * 字典类型名称
     * @example 用户状态
     */
    name?: string;
    /**
     * 描述
     * @example 用户状态字典类型
     */
    description?: string;
    /**
     * 状态：0-禁用, 1-启用
     * @example 1
     */
    status?: number;
    /**
     * 排序权重
     * @example 0
     */
    sort?: number;
    /**
     * 备注信息
     * @example 用户状态字典类型备注
     */
    remark?: string;
  }

  interface BatchDeleteDictionaryTypesDto {
    /** 待删除字典类型ID列表 */
    ids: string[];
  }

  interface CreateDictionaryItemDto {
    /**
     * 字典类型编码
     * @example user_status
     */
    typeCode: string;
    /**
     * 字典项值
     * @example 1
     */
    value: string;
    /**
     * 显示标签
     * @example 启用
     */
    label: string;
    /**
     * 描述
     * @example 用户启用状态
     */
    description?: string;
    /**
     * 状态：0-禁用, 1-启用
     * @example 1
     */
    status?: number;
    /**
     * 排序权重
     * @example 0
     */
    sort?: number;
    /**
     * 备注信息
     * @example 用户启用状态备注
     */
    remark?: string;
  }

  interface DictionaryItemResponseDto {
    /**
     * 字典项ID（UUID）
     * @example 550e8400-e29b-41d4-a716-446655440001
     */
    itemId: string;
    /**
     * 字典类型编码
     * @example user_status
     */
    typeCode: string;
    /**
     * 字典项值
     * @example 1
     */
    value: string;
    /**
     * 显示标签
     * @example 启用
     */
    label: string;
    /**
     * 描述
     * @example 用户启用状态
     */
    description?: string;
    /**
     * 状态：0-禁用, 1-启用
     * @example 1
     */
    status: number;
    /**
     * 排序权重
     * @example 0
     */
    sort: number;
    /**
     * 备注信息
     * @example 用户启用状态备注
     */
    remark?: string;
    /**
     * 创建时间
     * @example 2025-01-01T00:00:00.000Z
     */
    createdAt: string;
    /**
     * 更新时间
     * @example 2025-01-01T00:00:00.000Z
     */
    updatedAt: string;
  }

  interface UpdateDictionaryItemDto {
    /**
     * 字典类型编码
     * @example user_status
     */
    typeCode?: string;
    /**
     * 字典项值
     * @example 1
     */
    value?: string;
    /**
     * 显示标签
     * @example 启用
     */
    label?: string;
    /**
     * 描述
     * @example 用户启用状态
     */
    description?: string;
    /**
     * 状态：0-禁用, 1-启用
     * @example 1
     */
    status?: number;
    /**
     * 排序权重
     * @example 0
     */
    sort?: number;
    /**
     * 备注信息
     * @example 用户启用状态备注
     */
    remark?: string;
  }

  interface BatchDeleteDictionaryItemsDto {
    /** 待删除字典项ID列表 */
    ids: string[];
  }

  interface CreateConfigDto {
    /** 配置键 */
    key: string;
    /** 配置值 */
    value: string;
    /** 配置名称 */
    name: string;
    /** 描述 */
    description?: string;
    /** 配置类型 */
    type: string;
    /** 配置分组 */
    group: string;
    /** 状态 */
    status: number;
    /** 排序权重 */
    sort: number;
    /** 备注信息 */
    remark?: string;
  }

  interface ConfigResponseDto {
    /** 配置ID */
    configId: string;
    /** 配置键 */
    key: string;
    /** 配置值 */
    value: string;
    /** 配置名称 */
    name: string;
    /** 描述 */
    description: string;
    /** 配置类型 */
    type: string;
    /** 配置分组 */
    group: string;
    /** 状态 */
    status: number;
    /** 排序权重 */
    sort: number;
    /** 备注信息 */
    remark: string;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  interface UpdateConfigDto {
    /** 配置键 */
    key?: string;
    /** 配置值 */
    value?: string;
    /** 配置名称 */
    name?: string;
    /** 描述 */
    description?: string;
    /** 配置类型 */
    type?: string;
    /** 配置分组 */
    group?: string;
    /** 状态 */
    status?: number;
    /** 排序权重 */
    sort?: number;
    /** 备注信息 */
    remark?: string;
  }

  interface BatchDeleteConfigsDto {
    /** 待删除配置ID列表 */
    ids: string[];
  }

  interface PermissionResponseDto {
    /** 权限ID */
    id: number;
    /**
     * 权限唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    permissionId: string;
    /** 权限名称 */
    name: string;
    /** 权限代码 */
    code: string;
    /** 权限描述 */
    description?: string;
  }

  interface CurrentUserRoleResponseDto {
    /** 角色ID */
    id: number;
    /**
     * 角色唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    roleId: string;
    /** 角色名称 */
    name: string;
    /** 角色标识（用于判断是否超管） */
    roleKey?: string;
    /** 角色描述 */
    description?: string;
    /** 角色权限列表 */
    permissions?: PermissionResponseDto[];
  }

  interface CurrentUserDepartmentResponseDto {
    /** 部门ID */
    id: number;
    /**
     * 部门唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    departmentId: string;
    /** 部门名称 */
    name: string;
    /** 部门描述 */
    description?: string;
  }

  interface CurrentUserPositionResponseDto {
    /** 岗位ID */
    id: number;
    /**
     * 岗位唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    positionId: string;
    /** 岗位名称 */
    name: string;
    /** 岗位描述 */
    description?: string;
  }

  interface CurrentUserResponseDto {
    /** 用户数据库ID */
    id: number;
    /**
     * 用户唯一标识符（UUID）
     * @example a3d7d76e-5a4e-4f0a-93c3-d0b2b27d471e
     */
    userId: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 头像 */
    avatar?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    phone?: string;
    /**
     * 用户状态
     * @example 1
     */
    status: 0 | 1 | 2 | 3;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
    /** 是否为超级管理员 */
    isSuperAdmin?: boolean;
    /** 权限代码聚合（超管返回 ["*:*:*"]） */
    permissionCodes?: string[];
    /** 用户角色列表（包含权限信息） */
    roles?: CurrentUserRoleResponseDto[];
    /** 所属部门 */
    department?: CurrentUserDepartmentResponseDto;
    /** 所属岗位 */
    positions?: CurrentUserPositionResponseDto[];
    /** 用户偏好设置 */
    preferences?: Record<string, unknown>;
  }

  interface UpdateProfileDto {
    /**
     * 昵称
     * @example 小明
     */
    nickname?: string;
    /** 头像URL */
    avatar?: string;
    /**
     * 手机号码
     * @example 13800138000
     */
    phone?: string;
    /** 性别：0-未知, 1-男, 2-女, 3-其他 */
    gender?: 0 | 1 | 2 | 3;
  }

  interface ChangePasswordDto {
    /** 当前密码 */
    oldPassword: string;
    /** 新密码 */
    newPassword: string;
  }

  interface BatchDeleteOperationLogsDto {
    /** 待删除操作日志ID列表 */
    ids: string[];
  }

  interface CleanOperationLogsDto {
    /**
     * 清理多少天之前的操作日志
     * @example 7
     */
    days: number;
  }

  // ─── Query 参数类型 ─────────────────────────

  interface UsersFindAllParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 排序字段 */
    sortBy?: string;
    /** 排序方向 */
    sortOrder?: 'asc' | 'desc';
    /** 用户名（模糊查询） */
    username?: string;
    /** 昵称（模糊查询） */
    nickname?: string;
    /** 手机号（模糊查询） */
    phone?: string;
    /** 用户状态 */
    status?: 0 | 1 | 2 | 3;
    /** 创建时间开始（YYYY-MM-DD） */
    createdAtStart?: string;
    /** 创建时间结束（YYYY-MM-DD） */
    createdAtEnd?: string;
  }

  interface LoginLogsFindAllParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 登录用户名/邮箱/手机号 */
    account?: string;
    /** 登录IP地址 */
    ipAddress?: string;
    /** 登录状态：1-成功, 0-失败 */
    status?: number;
    /** 创建时间开始（YYYY-MM-DD） */
    createdAtStart?: string;
    /** 创建时间结束（YYYY-MM-DD） */
    createdAtEnd?: string;
    /** 登录地点 */
    location?: string;
    /** 设备信息 */
    device?: string;
    /** 浏览器信息 */
    browser?: string;
    /** 操作系统信息 */
    os?: string;
    /** 登录类型 */
    loginType?: string;
  }

  interface LoginLogsGetStatsParams {
    days?: number;
  }

  interface RolesFindAllParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 角色名称（支持模糊查询） */
    name?: string;
    /** 角色描述（支持模糊查询） */
    description?: string;
    /** 角色状态（0: 禁用, 1: 启用） */
    status?: number;
    /** 角色键（支持模糊查询） */
    roleKey?: string;
    /** 创建开始日期 */
    createdAtStart?: string;
    /** 创建结束日期 */
    createdAtEnd?: string;
  }

  interface PermissionsFindAllParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 排序字段 */
    sortBy?: string;
    /** 排序方向 */
    sortOrder?: 'asc' | 'desc';
    /** 权限名称 */
    name?: string;
    /** 权限代码 */
    code?: string;
    /** 操作类型 */
    action?: string;
    /** 权限类型 */
    type?: string;
    /** 父权限ID */
    parentPermissionId?: string;
    /** 创建时间开始（YYYY-MM-DD） */
    createdAtStart?: string;
    /** 创建时间结束（YYYY-MM-DD） */
    createdAtEnd?: string;
  }

  interface PermissionsGetTreeParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 排序字段 */
    sortBy?: string;
    /** 排序方向 */
    sortOrder?: 'asc' | 'desc';
    /** 权限名称 */
    name?: string;
    /** 权限代码 */
    code?: string;
    /** 操作类型 */
    action?: string;
    /** 权限类型 */
    type?: string;
    /** 父权限ID */
    parentPermissionId?: string;
    /** 创建时间开始（YYYY-MM-DD） */
    createdAtStart?: string;
    /** 创建时间结束（YYYY-MM-DD） */
    createdAtEnd?: string;
  }

  interface DepartmentsFindAllParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 部门名称 */
    name?: string;
    /** 状态 */
    status?: number;
    /** 父部门ID（UUID） */
    parentId?: string;
    /** 创建时间开始（YYYY-MM-DD） */
    createdAtStart?: string;
    /** 创建时间结束（YYYY-MM-DD） */
    createdAtEnd?: string;
  }

  interface DepartmentsGetTreeParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 部门名称 */
    name?: string;
    /** 状态 */
    status?: number;
    /** 父部门ID（UUID） */
    parentId?: string;
    /** 创建时间开始（YYYY-MM-DD） */
    createdAtStart?: string;
    /** 创建时间结束（YYYY-MM-DD） */
    createdAtEnd?: string;
  }

  interface PositionsFindAllParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 岗位名称 */
    name?: string;
    /** 岗位编码 */
    code?: string;
    /** 状态 */
    status?: number;
    /** 创建时间开始（YYYY-MM-DD） */
    createdAtStart?: string;
    /** 创建时间结束（YYYY-MM-DD） */
    createdAtEnd?: string;
  }

  interface DictionariesFindAllDictionaryTypesParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 字典类型编码 */
    code?: string;
    /** 字典类型名称 */
    name?: string;
    /** 状态：0-禁用, 1-启用 */
    status?: number;
    /** 创建时间开始（YYYY-MM-DD） */
    createdAtStart?: string;
    /** 创建时间结束（YYYY-MM-DD） */
    createdAtEnd?: string;
  }

  interface DictionariesGetDictionaryItemsByTypeCodesParams {
    typeCodes?: string;
  }

  interface DictionariesFindAllDictionaryItemsParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 字典类型编码 */
    typeCode?: string;
    /** 字典项标签 */
    label?: string;
    /** 字典项值 */
    value?: string;
    /** 状态：0-禁用, 1-启用 */
    status?: number;
  }

  interface ConfigsFindAllParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 配置键 */
    key?: string;
    /** 配置名称 */
    name?: string;
    /** 配置类型 */
    type?: string;
    /** 配置分组 */
    group?: string;
    /** 状态 */
    status?: number;
    /** 创建时间开始（YYYY-MM-DD） */
    createdAtStart?: string;
    /** 创建时间结束（YYYY-MM-DD） */
    createdAtEnd?: string;
  }

  interface ConfigsGetConfigsByKeysParams {
    keys?: string;
  }

  interface OperationLogsFindManyParams {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** ID 精确匹配 */
    id?: number;
    /** 用户名 模糊匹配 */
    username?: string;
    /** 用户ID 精确匹配 */
    userId?: string;
    /** 模块名 模糊匹配 */
    module?: string;
    /** 动作 create/update/delete 等 */
    action?: string;
    /** 状态 1成功/0失败 */
    status?: number;
    /** 路径 模糊匹配 */
    path?: string;
    /** 关键字：匹配 message/path/resource */
    keyword?: string;
    /** 开始时间(ISO字符串) */
    createdAtStart?: string;
    /** 结束时间(ISO字符串) */
    createdAtEnd?: string;
  }

  // ─── 通用类型 ───────────────────────────────

  interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  }

  interface Response<T = unknown> {
    success: boolean;
    code: number;
    message: string;
    data: T;
    timestamp?: string;
    path?: string;
  }
}
