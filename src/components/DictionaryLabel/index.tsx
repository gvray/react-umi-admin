import type { DictOption } from '@/types/dict';
import React from 'react';

export interface DictionaryLabelProps {
  value?: string | number;
  options?: DictOption[];
  defaultLabel?: string;
}

const DictionaryLabel: React.FC<DictionaryLabelProps> = ({
  value,
  options = [],
  defaultLabel = '-',
}) => {
  if (value === undefined || value === null) {
    return <>{defaultLabel}</>;
  }

  const option = options.find((opt) => opt.value === value);
  return <>{option?.label || defaultLabel}</>;
};

export default DictionaryLabel;
