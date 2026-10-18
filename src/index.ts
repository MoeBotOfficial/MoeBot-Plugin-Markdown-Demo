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
    if (ctx.command.id === 'buttons') {
      if (ctx.reply.keyboard !== true) {
        await ctx.reply.text('尚未获得 Markdown 按钮授权。请在 WebUI 插件设置中开启 Markdown 消息和 Markdown 按钮，保存并部署后再发送 /mdbuttons。');
        return;
      }
      await ctx.reply.markdown(`# ${ctx.config.title}\n\n点击「查看 Markdown」发送 /md；点击「确认回调」体验互动回应。`, {
        keyboard: { rows: [{ buttons: [
          { id: 'command-md', render_data: { label: '查看 Markdown', visited_label: '再次查看', style: 0 }, action: { type: 2, permission: { type: 2 }, data: '/md', reply: true, enter: true, unsupport_tips: '请升级 QQ 客户端或手动发送 /md' } },
          { id: 'callback-confirm', render_data: { label: '确认回调', visited_label: '再次确认', style: 1 }, action: { type: 1, permission: { type: 2 }, data: 'confirm', unsupport_tips: '请升级 QQ 客户端' } },
        ] }] },
      });
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
      '- 插件版本：0.2.0 · 来自 猫猫机器人（MoeBot）',
    ];
    await ctx.reply.markdown(lines.join('\n'));
  },
  async onInteraction(ctx) {
    if (!ctx.interaction) return;
    if (ctx.interaction.buttonId !== 'callback-confirm' || ctx.interaction.data !== 'confirm') {
      await ctx.interaction.respond(4);
      return;
    }
    await ctx.interaction.respond(0);
    await ctx.reply.text('按钮回调成功！已收到确认，并通过 QQ 互动接口回应。');
  },
});
