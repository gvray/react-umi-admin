import { getDictionaryItemsByTypeCodes } from '@/services/dictionary';
import { logger } from '@/utils';
import { useEffect, useState } from 'react';

const useDict = <T = Record<string, API.DictionaryItemResponseDto[]>>(
  codes: string[],
) => {
  const [dict, setDict] = useState<T>({} as T);
  const codeString = codes.join(',');
  useEffect(() => {
    const fetchDict = async () => {
      try {
        const res = await getDictionaryItemsByTypeCodes({
          typeCodes: codeString,
        });
        if (res.data) {
          setDict(res.data as T);
        }
      } catch (error) {
        logger.error(
          `获取字典类型失败，字典类型编码：${codeString} ，错误信息：${error}`,
        );
      }
    };
    fetchDict();
  }, [codeString]);
  return dict;
};

export default useDict;
