import { Tabs } from 'antd';
import React from 'react';
import { styled } from 'umi';
import AntIcon, { antdIcons } from '../AntIcon';

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
  gap: 4px;
`;

const IconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  color: #555;
  background-color: #ebebeb;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #d6d6d6; // 或你喜欢的颜色
  }
`;

const categorizeIcons = () => {
  const categories = {
    Outlined: [] as string[],
    Filled: [] as string[],
    TwoTone: [] as string[],
  };

  antdIcons.forEach((key) => {
    if (key.endsWith('Outlined')) categories.Outlined.push(key);
    else if (key.endsWith('Filled')) categories.Filled.push(key);
    else if (key.endsWith('TwoTone')) categories.TwoTone.push(key);
  });

  return categories;
};

interface AllIconsPreviewProps {
  onChange?: (icon: string) => void;
}

const AllIconsPreview: React.FC<AllIconsPreviewProps> = ({ onChange }) => {
  const iconGroups = categorizeIcons();
  const renderIcons = (iconNames: string[]) => (
    <IconGrid>
      {iconNames.map((name) => {
        return (
          <IconItem key={name} onClick={() => onChange?.(name)}>
            <AntIcon icon={name} />
          </IconItem>
        );
      })}
    </IconGrid>
  );

  return (
    <Tabs
      defaultActiveKey="Outlined"
      items={[
        {
          key: 'Outlined',
          label: 'Outlined 图标',
          children: renderIcons(iconGroups.Outlined),
        },
        {
          key: 'Filled',
          label: 'Filled 图标',
          children: renderIcons(iconGroups.Filled),
        },
        {
          key: 'TwoTone',
          label: 'TwoTone 图标',
          children: renderIcons(iconGroups.TwoTone),
        },
      ]}
    />
  );
};

export default AllIconsPreview;
