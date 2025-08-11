import { getDepartmentTree } from '@/services/department';
import { listPosition } from '@/services/position';
import { listRole } from '@/services/role';
import { useEffect, useState } from 'react';

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
