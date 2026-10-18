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

 test('command and callback buttons use the SDK grant and interaction interfaces',async()=>{
 const t=createTestContext({config:{title:'按钮'},command:{id:'buttons'},keyboard:true});await plugin.onCommand(t.context);
 assert.equal(t.keyboards[0].rows[0].buttons[0].action.type,2);assert.equal(t.keyboards[0].rows[0].buttons[0].action.data,'/md');assert.equal(t.keyboards[0].rows[0].buttons[1].action.type,1);
 const callback=createTestContext({interaction:{buttonId:'callback-confirm',data:'confirm'}});await plugin.onInteraction(callback.context);assert.deepEqual(callback.responses,[0]);assert.match(callback.replies[0],/按钮回调成功/);
 const denied=createTestContext({config:{title:'按钮'},command:{id:'buttons'}});await plugin.onCommand(denied.context);assert.match(denied.replies[0],/尚未获得 Markdown 按钮授权/);assert.deepEqual(denied.markdowns,[]);
 });
