# 猫猫机器人（MoeBot）— Markdown 演示插件

最小示例：演示 0.8.0 起的插件 Markdown 消息能力。安装并授权后，在群聊或私聊发送 `/md`，机器人会用 QQ Markdown 回复一条示例。

## 用户安装

1. 后端需要 0.8.0 或更新版本。
2. 从 [Releases](https://github.com/AnnaofArendelle/qq-bot-plugin-markdown-demo/releases) 下载 `markdown-demo-0.1.0.zip`，在 WebUI「插件管理」上传（不要用 GitHub 自动生成的源代码 ZIP）。
3. 展开该插件的「插件设置」，勾选「Markdown 消息」（默认关闭），启用插件，点击「保存并部署」。
4. 在群里发送 `/md` 查看 Markdown 效果；未授权时插件会回复文字提示，引导打开授权。

## 说明

- 插件在 `plugin.json` 声明 `reply.markdown` 能力；这是申请，不是授权。管理员不勾选时 `ctx.reply.markdown` 不存在，插件自动降级为文字。
- QQ 群聊/单聊的自定义 Markdown 已对全部机器人开放（无需申请模板）。支持的语法：标题、粗体、斜体、删除线、链接、图片（公网直链）、列表、引用、分割线。
- 0.7.x 及更早的核心会明确拒绝本插件（权限表校验），不会静默装上后出错。

## 开发

```sh
npm ci
npm run typecheck
npm test
npm run build   # 生成 dist/markdown-demo-0.1.0.zip
```

基于 [Plugin SDK](https://github.com/AnnaofArendelle/qq-bot-plugin-sdk) 构建，可对照 daily / essentials 两个官方插件。

许可证：[MIT](LICENSE)。
