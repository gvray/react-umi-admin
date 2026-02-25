import type { DictOption } from '@/types/dict';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import React from 'react';

export interface DictionarySelectProps extends Omit<SelectProps, 'options'> {
  options?: DictOption[];
}

const DictionarySelect: React.FC<DictionarySelectProps> = ({
  options = [],
  ...rest
}) => {
  return <Select options={options} {...rest} />;
};

export default DictionarySelect;
