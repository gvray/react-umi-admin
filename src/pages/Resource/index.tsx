import { useResourceModel } from './model';

export default function ResourcePage() {
  useResourceModel();
  return (
    <div>
      <h1>资源管理</h1>
    </div>
  );
}
