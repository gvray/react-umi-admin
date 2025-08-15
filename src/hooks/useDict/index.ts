import { getDictionaryTypesBatch } from '@/services/dictionary';
import { useEffect, useState } from 'react';

const useDict = (codes: string[]) => {
  const [dict, setDict] = useState<any[]>([]);
  useEffect(() => {
    const fetchDict = async () => {
      try {
        const res: any = await getDictionaryTypesBatch(codes.join(','));
        setDict(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDict();
  }, [codes.join(',')]);
  return dict;
};

export default useDict;
