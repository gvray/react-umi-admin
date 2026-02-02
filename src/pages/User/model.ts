import { getDepartmentTree } from '@/services/department';
import { listPosition } from '@/services/position';
import { listRole } from '@/services/role';
import { deleteUser, getUser, listUser } from '@/services/user';
import { useCallback, useEffect, useState } from 'react';

const useUpdateForm = (open: boolean) => {
  const [deptTree, setDeptTree] = useState<any[]>([]);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [positionList, setPositionList] = useState<any[]>([]);

  const getDepts = async () => {
    try {
      const res = await getDepartmentTree();
      if (res.data) {
        // const data = mapTree(res.data, (node) => ({
        //   value: node.departmentId,
        //   label: node.name,
        // }));
        setDeptTree(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRoles = async () => {
    try {
      const res = await listRole();
      if (res.data) {
        setRoleList(res.data);
      }
    } catch (error) {}
  };

  const getPositions = async () => {
    try {
      const res = await listPosition();
      if (res.data) {
        setPositionList(res.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (open) {
      getDepts();
      getRoles();
      getPositions();
    }
  }, [open]);

  return {
    deptTree,
    roleList,
    positionList,
  };
};
export default useUpdateForm;

export const useUserModel = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const getList = useCallback(async (params?: any) => {
    return listUser(params);
  }, []);
  const getDetail = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const res = (await getUser(userId)) as any;
      return res?.data ?? res;
    } finally {
      setLoading(false);
    }
  }, []);
  const deleteItem = useCallback(async (userId: string) => {
    setSubmitting(true);
    try {
      await deleteUser(userId);
    } finally {
      setSubmitting(false);
    }
  }, []);
  return {
    loading,
    submitting,
    getList,
    getDetail,
    deleteItem,
  };
};
