import { request } from '@/utils/request';

export const getDashboardOverview = () => {
  return request('/dashboard/overview', {
    method: 'GET',
  });
};

export const getRoleDistribution = () => {
  return request('/dashboard/role-distribution', {
    method: 'GET',
  });
};

export const getLoginTrend = () => {
  return request('/dashboard/login-trend', {
    method: 'GET',
  });
};
