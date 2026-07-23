import type { TableProColumnsType } from '@/components/TablePro';

/**
 * 缓存键列表表格列配置
 */
export const getCacheKeyColumns =
  (): TableProColumnsType<API.CacheKeyInfoDto> => {
    return [
      {
        title: '缓存 Key',
        dataIndex: 'key',
        key: 'key',
        ellipsis: true,
      },
      {
        title: '剩余 TTL',
        dataIndex: 'ttl',
        key: 'ttl',
        width: 120,
        align: 'center',
      },
      {
        title: '大小',
        dataIndex: 'size',
        key: 'size',
        width: 120,
        align: 'center',
      },
    ];
  };
