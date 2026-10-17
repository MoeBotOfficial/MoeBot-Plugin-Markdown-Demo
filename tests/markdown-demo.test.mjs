import test from 'node:test';
import assert from 'node:assert/strict';
import plugin from '../dist/plugin.mjs';
import { createTestContext } from '@qq-bot/plugin-sdk/testing';

test('sends a bounded markdown sample when granted', async () => {
  const t = createTestContext({ config: { title: '标题' }, command: { id: 'demo' } });
  await plugin.onCommand(t.context);
  assert.deepEqual(t.replies, []);
  assert.equal(t.markdowns.length, 1);
  const md = t.markdowns[0];
  assert.match(md, /# 标题/);
  assert.match(md, /\*\*Markdown 消息\*\*/);
  assert.match(md, /\[链接\]\(https:\/\/github\.com\//);
  assert.match(md, /^> 当前时间：\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/m);
  assert.match(md, /\*\*\*/);
  assert.ok(md.length <= 4000);
});

test('degrades to plain text without the grant or on older cores', async () => {
  const t = createTestContext({ config: { title: '标题' }, command: { id: 'demo' }, markdown: false });
  await plugin.onCommand(t.context);
  assert.deepEqual(t.markdowns, []);
  assert.match(t.replies[0], /尚未获得 Markdown 消息授权/);
  assert.match(t.replies[0], /插件设置/);
});
