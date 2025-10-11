# umijs 鸡肋功能

| 功能 | 鸡肋理由 | 替代建议 |
| --- | --- | --- |
| ✅ **access 权限模型** | 简单场景好用，但复杂权限结构（资源级、角色组合）扩展难，类型提示不友好，和 wrappers 冲突多 | 用自定义 hooks + 权限组件，如 `<Permission>` 或更细粒度的策略系统 |
| ✅ **wrappers（高阶组件配置路由）** | 把权限、布局用路由配置绑定，有侵入性且难调试，不如 React 中常规 HOC/useEffect 写法清晰 | 自定义 Layout 或页面内部逻辑判断更灵活 |
| ✅ **request 插件（封装的** `umi-request`**）** | 封装层太重、依赖旧版 fetch polyfill，灵活性差，不如 axios 或 useRequest、react-query 灵活 | 替换为 axios + 自定义 hooks，或直接用 SWR/react-query |
| ✅ **@/models 全局状态管理** | 适合老项目或约定式开发，但模型共享复杂，异步逻辑不如 Redux Toolkit、zustand 明确 | 中大型项目建议直接用 Zustand、Redux Toolkit |
| ✅ **locale 国际化插件** | 强耦合约定式目录、ts 类型提示差，多语言资源集中管理不便 | 推荐用 `i18next` 或 `vue-i18n/react-i18next` 自主控制 |
| ✅ **约定式目录结构（特别是** `page/document.tsx`**,** `layouts`**,** `app.ts`**）** | 项目复杂后耦合度高，逻辑分散在多个文件中，不易统一维护 | 转向配置式或者 module-based 结构（如 routes.ts + 全局 layout） |
| ✅ **微前端 qiankun 集成插件** | 一般项目微前端用不了，插件配置繁琐，调试体验不如手写集成 | 自己手写 qiankun 接入（很简单，3-5 个生命周期） |
| ✅ **链式插件系统（插件套插件）** | 插件机制很强但调试和定制化麻烦，业务团队二次封装成本高 | 只启用必须插件，其余功能裸写更透明 |
| ✅ **内置 DVA 支持** | DVA 学习成本高，异步和副作用处理陈旧，现代项目极少使用 | 推荐 Zustand、RTK、Recoil 等现代状态库 |

注意: @umijs/max，黑盒比较严重，后期项目修改扩展成本太大。
