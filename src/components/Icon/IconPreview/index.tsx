import { Input, Tabs } from 'antd';
import React, { useState } from 'react';
import { styled } from 'umi';
import Icon from '../index';
import { iconMap, type IconKey } from '../map';

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
  gap: 4px;
  height: 180px;
  overflow-y: auto;
  padding: 0 10px 20px 10px;
`;

const IconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  font-size: 16px;
  color: var(--gvray-text-color-secondary);
  background-color: var(--gvray-fill-color);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: var(--gvray-fill-color-secondary);
  }
`;

const collectByType = () => {
  const result: Record<string, IconKey[]> = {};

  (Object.keys(iconMap) as IconKey[]).forEach((key) => {
    const cfg = iconMap[key];
    const label = cfg.type;
    if (!result[label]) result[label] = [];
    result[label].push(key);
  });

  return result;
};

interface IconPreviewProps {
  onChange?: (icon: IconKey) => void;
}

const IconPreview: React.FC<IconPreviewProps> = ({ onChange }) => {
  const groups = collectByType();
  const [search, setSearch] = useState('');

  const renderIcons = (iconNames: IconKey[]) => (
    <IconGrid>
      {iconNames.map((name) => (
        <IconItem key={name} onClick={() => onChange?.(name)}>
          <Icon name={name} />
        </IconItem>
      ))}
    </IconGrid>
  );

  const tabItems = Object.entries(groups).map(([type, names]) => ({
    key: type,
    label: type.toUpperCase(),
    children: renderIcons(
      names.filter((n) => n.toLowerCase().includes(search.toLowerCase())),
    ),
  }));

  return (
    <Tabs
      tabBarExtraContent={
        <Input.Search
          placeholder="搜索图标"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      }
      defaultActiveKey="antd"
      items={tabItems}
    />
  );
};

export default IconPreview;
