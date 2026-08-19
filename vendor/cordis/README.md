# Cordis 历史快照边界

此目录原样保全 TaiChiOS 建仓父提交所继承的 Cordis 包与测试。固定来源为 `cordiverse/cordis@8cc9e33fab69e2d0476d126baaf2acb24e6a6ab4`，MIT 许可证保存在 `../licenses/cordis-MIT.txt`。

`upstream.json` 是机器可读的来源与本地补丁队列。当前没有行为补丁；只有把 TypeScript 配置从 `packages/*` 移到 `vendor/cordis/packages/*` 后所需的相对路径调整。运行 `corepack yarn compat:cordis` 可逐文件验证此声明，原 Cordis 测试继续由根 `corepack yarn test` 执行。

更新时先固定新的不可变提交，审查上游许可证与全部差异，再更新 manifest 并运行 lint、原测试与兼容性检查。TaiChiOS 运行时不从这里加载 Cordis；当迁移期测试不再依赖此快照时，删除整个 `vendor/cordis` 工作区即可，Git 历史仍保留来源。

## English summary

This directory preserves the inherited Cordis source and tests at the immutable parent commit recorded in `upstream.json`. It is an audit/test boundary, not the TaiChiOS runtime. The only local patch adjusts TypeScript config paths after relocation. The exit strategy is complete removal once TaiChiOS no longer needs the legacy suite.
