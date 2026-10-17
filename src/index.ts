import { definePlugin } from '@qq-bot/plugin-sdk';

// 最小 Markdown 演示：声明 reply.markdown 能力，等管理员在控制台显式授权后
// ctx.reply.markdown 才会存在；未授权（或旧核心）时降级为文字提示。
export default definePlugin<{ title: string }>({
  async onCommand(ctx) {
    if (typeof ctx.reply.markdown !== 'function') {
      await ctx.reply.text(
        [
          '尚未获得 Markdown 消息授权。',
          '请在 WebUI「插件管理 → 插件设置」中勾选「Markdown 消息」，保存并部署后再发送 /md。',
        ].join('\n'),
      );
      return;
    }
    const channel = ctx.message.channelType === 'group' ? '群聊' : '私聊';
    const time = new Date(Date.now() + 8 * 3600000).toISOString().replace('T', ' ').slice(0, 19);
    const lines = [
      `# ${ctx.config.title}`,
      '',
      `这里是 **Markdown 消息** 演示，来自 ${channel} 的被动回复。`,
      '',
      '- 支持 **加粗**、*斜体*、~~删除线~~',
      '- 支持 [链接](https://github.com/MoeBotOfficial/MoeBot-Plugin-Markdown-Demo) 与 `<https://bot.q.qq.com>` 自动链接',
      '- 支持有序列表：',
      '  1. 插件声明 `reply.markdown` 能力',
      '  2. 管理员在控制台授权',
      '  3. 群里发送 `/md` 查看效果',
      '',
      `> 当前时间：${time}（UTC+8）`,
      '',
      '***',
      '- 插件版本：0.1.0 · 来自 猫猫机器人（MoeBot）',
    ];
    await ctx.reply.markdown(lines.join('\n'));
  },
});
