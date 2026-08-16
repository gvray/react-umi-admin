import { LOGIN_PATH } from '@/constants';
import { useFeedback } from '@/hooks';
import {
  changePassword,
  queryProfileLoginLogs,
  queryProfilePermissions,
} from '@/services/profile';
import { useAuthStore, useSettingStore } from '@/stores';
import { logger, tokenManager } from '@/utils';
import { runtimeConfig } from '@/utils/runtime-config';
import { FormInstance } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { history } from 'umi';
import {
  buildPermissionTree,
  type PermissionTreeNode,
} from '../Permission/model';

export type LoginLogDateRange = [Dayjs | null, Dayjs | null] | null;

// 默认头像从环境变量读取，空值则走组件层文字兜底

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  enabled: { label: '正常', color: 'green' },
  disabled: { label: '停用', color: 'default' },
  pending: { label: '待激活', color: 'gold' },
  banned: { label: '封禁', color: 'red' },
};

export function getAccountStatusMeta(
  status?: API.CurrentUserProfileDto['status'],
) {
  return status ? STATUS_MAP[status] : { label: '未知', color: 'default' };
}

export function collectPermissionKeys(nodes: PermissionTreeNode[]): string[] {
  const keys: string[] = [];
  for (const node of nodes) {
    keys.push(node.permissionId);
    if (node.children?.length)
      keys.push(...collectPermissionKeys(node.children));
  }
  return keys;
}

export function useProfilePageModel() {
  const me = useAuthStore((s) => s.profile);
  const meProfile = (me as any)?.profile;

  const statusMeta = getAccountStatusMeta(me?.profile?.status);

  const completenessChecks = useMemo(
    () => [
      {
        key: 'avatar',
        label: '头像',
        done: !!meProfile?.avatar,
      },
      {
        key: 'email',
        label: '邮箱',
        done: !!meProfile?.email,
      },
      {
        key: 'phone',
        label: '手机',
        done: !!meProfile?.phone,
      },
      { key: 'nickname', label: '昵称', done: !!meProfile?.nickname },
      { key: 'department', label: '部门', done: !!me?.department?.name },
      { key: 'position', label: '岗位', done: !!me?.positions?.[0]?.name },
    ],
    [meProfile, me],
  );

  const doneCount = completenessChecks.filter((item) => item.done).length;
  const completenessPercent = Math.round(
    (doneCount / completenessChecks.length) * 100,
  );

  return {
    me,
    profile: me,
    avatarSrc:
      (meProfile?.avatar as string) ||
      runtimeConfig.get().user.defaultAvatar ||
      __APP_DEFAULT_AVATAR_URL__ ||
      undefined,
    avatarText: (meProfile?.nickname?.trim() || me?.username)?.[0] ?? '?',
    displayName: meProfile?.nickname || me?.username || '用户名',
    accountStatusLabel: statusMeta.label,
    accountStatusColor: statusMeta.color,
    isEnabled: me?.profile?.status === 'enabled',
    completenessChecks,
    doneCount,
    completenessPercent,
    updatedAt: undefined,
  };
}

export function useProfileSecurityModel(passwordForm: FormInstance) {
  const [passwordLoading, setPasswordLoading] = useState(false);
  const profile = useAuthStore((s) => s.profile);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { message } = useFeedback();

  const handleChangePassword = async (values: API.ChangePasswordDto) => {
    try {
      setPasswordLoading(true);
      const res = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success(res.message || '密码修改成功，请重新登录');
      passwordForm.resetFields();
      tokenManager.clearTokens();
      clearAuth();
      history.push(LOGIN_PATH);
    } catch (error) {
      logger.error(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  return {
    profile,
    passwordLoading,
    handleChangePassword,
  };
}

export function useProfilePermissionsModel() {
  const intl = useIntl();
  const [keyword, setKeyword] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [permData, setPermData] =
    useState<API.UserPermissionsResponseDto | null>(null);

  useEffect(() => {
    queryProfilePermissions()
      .then((res) => {
        if (res?.data) setPermData(res.data);
      })
      .catch(() => {
        // 全局 errorHandler 已提示
      })
      .finally(() => setLoading(false));
  }, []);

  const getLabel = useCallback(
    (id: string, fallback: string) => {
      const msg = intl.formatMessage({ id });
      return msg === id ? fallback : msg;
    },
    [intl],
  );

  const tree = useMemo<PermissionTreeNode[]>(() => {
    if (!permData?.permissions) return [];
    const kw = keyword.trim().toLowerCase();
    const filtered = kw
      ? permData.permissions.filter(
          (p) =>
            p.code?.toLowerCase().includes(kw) ||
            p.name?.toLowerCase().includes(kw),
        )
      : permData.permissions;
    // buildPermissionTree expects PermissionResponseDto[]; UserPermissionSimpleDto
    // is a structural subset that buildPermissionTree only reads `code`/`name`/
    // `permissionId` from, so the cast is safe.
    return buildPermissionTree(
      filtered as unknown as API.PermissionResponseDto[],
      getLabel,
    );
  }, [permData, keyword, getLabel]);

  useEffect(() => {
    setExpandedKeys(collectPermissionKeys(tree));
  }, [tree]);

  return {
    keyword,
    setKeyword,
    expandedKeys,
    setExpandedKeys,
    loading,
    permData,
    tree,
  };
}

export function useProfileLoginLogModel() {
  const { pageSize } = useSettingStore();
  const [data, setData] = useState<API.LoginLogResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<LoginLogDateRange>(null);

  const fetchData = useCallback(
    async (overrides?: Partial<API.LoginLogsFindAllParams>) => {
      setLoading(true);
      try {
        const range = dateRange;
        const params: API.LoginLogsFindAllParams = {
          page,
          pageSize,
          ...overrides,
        };
        if (statusFilter !== undefined) (params as any).status = statusFilter;
        if (range?.[0])
          params.createdAtStart = dayjs(range[0]).format('YYYY-MM-DD');
        if (range?.[1])
          params.createdAtEnd = dayjs(range[1]).format('YYYY-MM-DD');
        const res = await queryProfileLoginLogs(params);
        if (res?.data) {
          setData(res.data.items || []);
          setTotal(res.data.total || 0);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    },
    [dateRange, page, pageSize, statusFilter],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setPage(1);
    fetchData({ page: 1 });
  };

  const handleStatusChange = (value: string | undefined) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleReset = () => {
    setStatusFilter(undefined);
    setDateRange(null);
    setPage(1);
  };

  return {
    data,
    loading,
    total,
    page,
    pageSize,
    setPage,
    statusFilter,
    dateRange,
    setDateRange,
    fetchData,
    handleSearch,
    handleStatusChange,
    handleReset,
  };
}
