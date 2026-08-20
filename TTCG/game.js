// TTCG 对战系统基础 —— 玩家 vs 电脑
// 规则：30 血英雄；每回合能量上限+1（最多10）；随从入场有召唤失调（冲锋除外）；
// 嘲讽强制拦截；战吼/亡语见 cards.js。

"use strict";

const DECK_SIZE = 20;
const MAX_BOARD = 6;
const MAX_HAND = 10;
const HERO_HP = 30;
const MAX_ENERGY = 10;

let game = null;
let uidCounter = 0;

// ---------- 工具 ----------

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDeck() {
  // 从 30 张卡池中随机抽 DECK_SIZE 张组成牌库（不重复）
  return shuffle(CARD_POOL).slice(0, DECK_SIZE);
}

function makeMinion(card) {
  return {
    uid: ++uidCounter,
    card,
    atk: card.atk,
    hp: card.hp,
    maxHp: card.hp,
    canAttack: false,
    taunt: card.keywords.includes("taunt"),
  };
}

// ---------- 头像与图鉴 ----------

let playerAvatarId = null;
try { playerAvatarId = localStorage.getItem("ttcg_avatar"); } catch (e) { /* 无 localStorage 环境 */ }

function avatarCard(id) { return CARD_POOL.find(c => c.id === id) || null; }

function ensurePlayerAvatar() {
  if (!avatarCard(playerAvatarId)) {
    playerAvatarId = CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)].id;
  }
}

function setPlayerAvatar(id) {
  playerAvatarId = id;
  try { localStorage.setItem("ttcg_avatar", id); } catch (e) { /* ignore */ }
  buildGallery();
  render();
}

function buildGallery() {
  const grid = $("#gallery-grid");
  grid.innerHTML = "";
  for (const c of CARD_POOL) {
    const el = document.createElement("div");
    el.className = "g-card" + (c.id === playerAvatarId ? " chosen" : "");
    el.innerHTML = `
      <div class="g-cost">${c.cost}</div>
      <img src="${c.art}" alt="">
      <div class="g-name">${c.name}</div>
      <div class="g-title">${c.title}</div>
      <div class="g-stats"><span class="atk">⚔ ${c.atk}</span><span class="hp">❤ ${c.hp}</span></div>
      <div class="g-effect">${cardEffectText(c) || "—"}</div>
      <div class="g-flavor">${c.flavor}</div>
    `;
    el.onclick = () => setPlayerAvatar(c.id);
    grid.appendChild(el);
  }
}

// ---------- 游戏状态 ----------

function newGame() {
  uidCounter = 0;
  game = {
    players: [
      { name: "你", hp: HERO_HP, energy: 0, maxEnergy: 0, deck: makeDeck(), hand: [], board: [], fatigue: 0 },
      { name: "对手", hp: HERO_HP, energy: 0, maxEnergy: 0, deck: makeDeck(), hand: [], board: [], fatigue: 0 },
    ],
    turn: 0,           // 0 = 玩家, 1 = AI
    over: false,
    selected: null,    // 选中的我方进攻随从 uid
    log: [],
  };
  for (let i = 0; i < 3; i++) { drawCard(0, true); drawCard(1, true); }
  drawCard(1, true); // 后手补一张
  ensurePlayerAvatar();
  game.aiAvatar = CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)];
  addLog("对局开始！你先手。");
  addLog(`对手这局顶着「${game.aiAvatar.name}」的头像登场。`);
  startTurn(0);
}

function addLog(msg, cls) {
  game.log.push({ msg, cls: cls || "" });
  if (game.log.length > 60) game.log.shift();
}

function drawCard(p, silent) {
  const pl = game.players[p];
  if (pl.deck.length === 0) {
    pl.fatigue += 1;
    pl.hp -= pl.fatigue;
    if (!silent) addLog(`${pl.name} 的牌库空了，疲劳受到 ${pl.fatigue} 点伤害！`, "bad");
    checkGameOver();
    return;
  }
  const card = pl.deck.pop();
  if (pl.hand.length >= MAX_HAND) {
    if (!silent) addLog(`${pl.name} 手牌已满，「${card.name}」被烧掉了！`, "bad");
    return;
  }
  pl.hand.push(card);
  if (!silent && p === 0) addLog(`你抽到了「${card.name}」。`);
  if (!silent && p === 1) addLog(`对手抽了一张牌。`);
}

// ---------- 回合流程 ----------

function startTurn(p) {
  const pl = game.players[p];
  game.turn = p;
  game.selected = null;
  pl.maxEnergy = Math.min(MAX_ENERGY, pl.maxEnergy + 1);
  pl.energy = pl.maxEnergy;
  pl.board.forEach(m => (m.canAttack = true));
  drawCard(p);
  addLog(`—— ${pl.name}的回合（能量 ${pl.energy}/${pl.maxEnergy}）——`, "turn");
  render();
  if (p === 1 && !game.over) setTimeout(aiTurn, 700);
}

function endTurn() {
  if (game.over || game.turn !== 0) return;
  startTurn(1);
}

function checkGameOver() {
  if (game.over) return;
  const [me, ai] = game.players;
  if (me.hp <= 0 || ai.hp <= 0) {
    game.over = true;
    me.hp = Math.max(me.hp, 0); ai.hp = Math.max(ai.hp, 0);
    const win = ai.hp <= 0 && me.hp > 0;
    addLog(win ? "🎉 你赢了！" : "💀 你输了……", "turn");
    render();
    showOverlay(win ? "胜利！" : "失败……", win);
  }
}

// ---------- 出牌与技能 ----------

function playCard(p, handIndex) {
  const pl = game.players[p];
  const card = pl.hand[handIndex];
  if (!card || game.over) return false;
  if (pl.energy < card.cost || pl.board.length >= MAX_BOARD) return false;

  pl.energy -= card.cost;
  pl.hand.splice(handIndex, 1);
  const m = makeMinion(card);
  if (card.keywords.includes("charge")) m.canAttack = true;
  pl.board.push(m);
  addLog(`${pl.name} 打出了「${card.name}」（${card.atk}/${card.hp}）。`, p === 0 ? "good" : "");

  if (card.battlecry) resolveEffect(p, card.battlecry, `「${card.name}」的战吼`);
  cleanupDeaths();
  checkGameOver();
  return true;
}

function resolveEffect(owner, eff, label) {
  const me = game.players[owner];
  const foe = game.players[1 - owner];
  switch (eff.type) {
    case "heal_hero": {
      const before = me.hp;
      me.hp = Math.min(HERO_HP, me.hp + eff.amount);
      addLog(`${label}：${me.name}回复了 ${me.hp - before} 点生命。`, "good");
      break;
    }
    case "draw": {
      for (let i = 0; i < eff.amount; i++) drawCard(owner);
      addLog(`${label}：抽 ${eff.amount} 张牌。`);
      break;
    }
    case "damage_face": {
      foe.hp -= eff.amount;
      addLog(`${label}：对${foe.name}造成 ${eff.amount} 点伤害。`, "bad");
      break;
    }
    case "damage_random": {
      if (foe.board.length > 0) {
        const t = foe.board[Math.floor(Math.random() * foe.board.length)];
        t.hp -= eff.amount;
        addLog(`${label}：对「${t.card.name}」造成 ${eff.amount} 点伤害。`, "bad");
      } else {
        foe.hp -= eff.amount;
        addLog(`${label}：场上没有目标，${eff.amount} 点伤害打在${foe.name}脸上。`, "bad");
      }
      break;
    }
    case "damage_all": {
      foe.board.forEach(t => (t.hp -= eff.amount));
      addLog(`${label}：对敌方全体随从造成 ${eff.amount} 点伤害。`, "bad");
      break;
    }
    case "buff_all_atk": {
      me.board.forEach(t => { if (t.card !== null) t.atk += eff.amount; });
      addLog(`${label}：我方随从攻击力 +${eff.amount}。`, "good");
      break;
    }
  }
}

function cleanupDeaths() {
  let died = true;
  while (died) {
    died = false;
    for (const p of [0, 1]) {
      const pl = game.players[p];
      for (let i = pl.board.length - 1; i >= 0; i--) {
        const m = pl.board[i];
        if (m.hp <= 0) {
          pl.board.splice(i, 1);
          addLog(`「${m.card.name}」倒下了。`);
          if (m.card.deathrattle) resolveEffect(p, m.card.deathrattle, `「${m.card.name}」的亡语`);
          died = true;
        }
      }
    }
  }
}

// ---------- 战斗 ----------

function enemyTaunts(p) {
  return game.players[1 - p].board.filter(m => m.taunt);
}

function canTarget(p, target) {
  // target: {type:"minion", uid} | {type:"face"}
  const taunts = enemyTaunts(p);
  if (taunts.length === 0) return true;
  return target.type === "minion" && taunts.some(m => m.uid === target.uid);
}

function attack(p, attackerUid, target) {
  const pl = game.players[p];
  const foe = game.players[1 - p];
  const atkM = pl.board.find(m => m.uid === attackerUid);
  if (!atkM || !atkM.canAttack || atkM.atk <= 0 || game.over) return;
  if (!canTarget(p, target)) return;

  atkM.canAttack = false;
  if (target.type === "face") {
    foe.hp -= atkM.atk;
    addLog(`「${atkM.card.name}」攻击${foe.name}，造成 ${atkM.atk} 点伤害！`, p === 0 ? "good" : "bad");
  } else {
    const defM = foe.board.find(m => m.uid === target.uid);
    if (!defM) return;
    defM.hp -= atkM.atk;
    atkM.hp -= defM.atk;
    addLog(`「${atkM.card.name}」⚔「${defM.card.name}」。`);
  }
  cleanupDeaths();
  checkGameOver();
}

// ---------- AI ----------

function aiTurn() {
  if (game.over) return;
  setTimeout(() => {
    aiPlaySeq(() => aiAttackStep(() => {
      if (!game.over) setTimeout(() => startTurn(0), 400);
    }));
  }, 500);
}

// —— 出牌阶段：枚举手牌子集，在能量/场地限制内选总价值最高的组合，逐张打出 ——

// 根据当前局势给卡牌附加分（基础分 = 费用*10，保证优先花光能量）
function aiCardBonus(card) {
  const ai = game.players[1];
  const me = game.players[0];
  let b = 0;
  const bc = card.battlecry;
  if (bc) {
    switch (bc.type) {
      case "heal_hero": // 受伤越多越值，满血则浪费
        b += Math.min(bc.amount, HERO_HP - ai.hp) * 4 - bc.amount;
        break;
      case "draw": // 手牌越少越需要补充
        b += Math.max(0, 6 - ai.hand.length) * 3;
        break;
      case "damage_face": // 玩家残血时更有价值
        b += bc.amount * 3 + (me.hp <= 10 ? bc.amount * 4 : 0);
        break;
      case "damage_random":
        if (me.board.length === 0) b += me.hp <= 10 ? bc.amount * 3 : -6;
        else b += me.board.some(t => t.hp <= bc.amount) ? 10 : 4;
        break;
      case "damage_all": { // 有可斩杀目标才痛快放，空场宁可留一手
        const kills = me.board.filter(t => t.hp <= bc.amount).length;
        b += kills * 10 + (me.board.length - kills) * 3 + (me.board.length === 0 ? -15 : 0);
        break;
      }
      case "buff_all_atk": // 场上有自己人才有意义
        b += ai.board.length * 4 + (ai.board.length === 0 ? -10 : 0);
        break;
    }
  }
  if (card.keywords.includes("taunt")) { // 对面攻击力越高/自己越残，越需要嘲讽
    const threat = me.board.reduce((s, t) => s + t.atk, 0);
    b += Math.min(threat, 10) + (ai.hp <= 15 ? 6 : 0);
    if (ai.hp <= threat + 5) b += 12; // 快被打死了，急需人墙
  }
  if (card.keywords.includes("charge")) b += me.hp <= 12 ? 8 : 2; // 抢血
  return b;
}

function chooseAiPlays() {
  const ai = game.players[1];
  const space = MAX_BOARD - ai.board.length;
  const n = ai.hand.length;
  if (n === 0 || space <= 0) return [];
  const val = ai.hand.map(c => c.cost * 10 + aiCardBonus(c));

  let best = null;
  for (let mask = 1; mask < (1 << n); mask++) {
    let cost = 0, v = 0, cnt = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) { cost += ai.hand[i].cost; v += val[i]; cnt++; }
    }
    if (cost > ai.energy || cnt > space) continue;
    if (!best || v > best.v) best = { mask, v };
  }
  if (!best || best.v <= 0) return [];

  const cards = [];
  for (let i = 0; i < n; i++) if (best.mask & (1 << i)) cards.push(ai.hand[i]);
  // 出牌顺序：清场型战吼先手，全体加攻留到最后，其余按费用从高到低
  const rank = c => {
    if (c.battlecry && (c.battlecry.type === "damage_all" || c.battlecry.type === "damage_random")) return 0;
    if (c.battlecry && c.battlecry.type === "buff_all_atk") return 2;
    return 1;
  };
  cards.sort((a, b) => rank(a) - rank(b) || b.cost - a.cost);
  return cards;
}

function aiPlaySeq(done) {
  if (game.over) return;
  const plan = chooseAiPlays(); // 每打一张都重新规划（战吼抽牌可能带来新选择）
  if (plan.length === 0) { done(); return; }
  const idx = game.players[1].hand.indexOf(plan[0]);
  if (idx >= 0) playCard(1, idx);
  render();
  if (game.over) return;
  setTimeout(() => aiPlaySeq(done), 700);
}

// —— 攻击阶段：每 600ms 出一刀，先算斩杀，再解嘲讽，然后评估换血是否划算 ——

function aiAttackStep(done) {
  if (game.over) return;
  const ai = game.players[1];
  const me = game.players[0];
  const attackers = ai.board.filter(m => m.canAttack && m.atk > 0);
  if (attackers.length === 0) { done(); return; }

  const taunts = me.board.filter(m => m.taunt);
  const totalAtk = attackers.reduce((s, m) => s + m.atk, 0);
  let atkM = null, target = null;

  if (taunts.length === 0 && totalAtk >= me.hp) {
    // 斩杀线：全部打脸
    atkM = attackers[0];
    target = { type: "face" };
  } else if (taunts.length > 0) {
    // 解嘲讽：先杀血最少的；优先用能击杀且自己不死的最小攻击者
    const t = taunts.slice().sort((a, b) => a.hp - b.hp)[0];
    const killers = attackers.filter(m => m.atk >= t.hp);
    const safe = killers.filter(m => t.atk < m.hp).sort((a, b) => a.atk - b.atk);
    atkM = safe[0]
      || killers.sort((a, b) => b.atk - a.atk)[0]
      || attackers.slice().sort((a, b) => b.atk - a.atk)[0];
    target = { type: "minion", uid: t.uid };
  } else {
    // 自由选择：评估所有(攻击者, 目标)组合，找收益超过打脸机会成本的最佳换血
    const threat = me.board.reduce((s, t) => s + t.atk, 0);
    const desperate = ai.hp <= threat + 2; // 再不清场，下回合可能被打死
    let best = null;
    for (const m of attackers) {
      const faceCost = desperate ? 0 : m.atk * (me.hp <= 12 ? 3.5 : 1.8); // 打脸的机会成本
      for (const t of me.board) {
        if (m.atk < t.hp) continue; // 杀不掉的不换
        const survives = t.atk < m.hp;
        let v = t.atk * 3 + t.card.cost * 2;          // 清掉威胁的收益
        v += survives ? 6 : -m.card.cost * 2;          // 白吃加分，阵亡扣分
        v -= Math.max(0, m.atk - t.hp);                // 惩罚大牛换小虾
        if (v > faceCost && (!best || v > best.v)) best = { m, t, v };
      }
    }
    if (best) {
      atkM = best.m;
      target = { type: "minion", uid: best.t.uid };
    } else if (desperate && me.board.length > 0) {
      // 绝境：即使一刀杀不死，也要往最大的威胁身上砍
      const t = me.board.slice().sort((a, b) => b.atk - a.atk)[0];
      atkM = attackers.slice().sort((a, b) => b.atk - a.atk)[0];
      target = { type: "minion", uid: t.uid };
    } else {
      atkM = attackers.slice().sort((a, b) => b.atk - a.atk)[0];
      target = { type: "face" };
    }
  }

  attack(1, atkM.uid, target);
  // 防呆：若攻击因故未生效（canAttack 未被消耗），强制标记已行动，避免死循环
  if (atkM.hp > 0 && atkM.canAttack) atkM.canAttack = false;
  render();
  if (game.over) return;
  setTimeout(() => aiAttackStep(done), 600);
}

// ---------- 渲染 ----------

const $ = sel => document.querySelector(sel);

function cardEffectText(card) {
  const parts = [];
  const kw = card.keywords.map(k => (k === "taunt" ? "【嘲讽】" : "【冲锋】"));
  if (kw.length) parts.push(kw.join(""));
  if (card.battlecry) parts.push("战吼：" + effectDesc(card.battlecry));
  if (card.deathrattle) parts.push("亡语：" + effectDesc(card.deathrattle));
  return parts.join("　");
}

function showPreview(card, atk, hp) {
  $("#p-img").src = card.art;
  $("#p-cost").textContent = card.cost;
  $("#p-name").textContent = card.name;
  $("#p-title").textContent = card.title;
  $("#p-atk").textContent = "⚔ " + (atk ?? card.atk);
  $("#p-hp").textContent = "❤ " + (hp ?? card.hp);
  $("#p-effect").textContent = cardEffectText(card);
  $("#p-flavor").textContent = card.flavor;
  $("#preview").classList.remove("hidden");
}

function hidePreview() {
  $("#preview").classList.add("hidden");
}

function minionEl(m, side) {
  const el = document.createElement("div");
  el.className = "minion";
  if (m.taunt) el.classList.add("taunt");
  if (side === 0 && m.canAttack && game.turn === 0) el.classList.add("ready");
  if (game.selected === m.uid) el.classList.add("selected");
  el.innerHTML = `
    <img src="${m.card.art}" alt="">
    <div class="mname">${m.card.name}</div>
    <div class="stats"><span class="atk">${m.atk}</span><span class="hp ${m.hp < m.maxHp ? "hurt" : ""}">${m.hp}</span></div>
  `;
  el.onmouseenter = () => showPreview(m.card, m.atk, m.hp);
  el.onmouseleave = hidePreview;

  if (side === 0) {
    el.onclick = () => {
      if (game.turn !== 0 || game.over) return;
      if (m.canAttack && m.atk > 0) {
        game.selected = game.selected === m.uid ? null : m.uid;
        render();
      }
    };
  } else {
    el.onclick = () => {
      if (game.turn !== 0 || game.over || game.selected === null) return;
      const t = { type: "minion", uid: m.uid };
      if (!canTarget(0, t)) { addLog("必须先攻击嘲讽随从！", "bad"); render(); return; }
      attack(0, game.selected, t);
      game.selected = null;
      render();
    };
  }
  return el;
}

function handCardEl(card, index) {
  const pl = game.players[0];
  const el = document.createElement("div");
  el.className = "card";
  const affordable = game.turn === 0 && pl.energy >= card.cost && pl.board.length < MAX_BOARD;
  if (affordable) el.classList.add("playable");
  const kw = card.keywords.map(k => k === "taunt" ? "嘲讽" : "冲锋");
  const effText = [];
  if (kw.length) effText.push(kw.join("·"));
  if (card.battlecry) effText.push("战吼：" + effectDesc(card.battlecry));
  if (card.deathrattle) effText.push("亡语：" + effectDesc(card.deathrattle));
  el.innerHTML = `
    <div class="cost">${card.cost}</div>
    <img src="${card.art}" alt="">
    <div class="cname">${card.name}</div>
    <div class="ceffect">${effText.join("；") || card.title}</div>
    <div class="stats"><span class="atk">${card.atk}</span><span class="hp">${card.hp}</span></div>
  `;
  el.onmouseenter = () => showPreview(card);
  el.onmouseleave = hidePreview;
  el.onclick = () => {
    if (!affordable || game.over) return;
    playCard(0, index);
    render();
  };
  return el;
}

function effectDesc(eff) {
  switch (eff.type) {
    case "heal_hero": return `回复我方英雄 ${eff.amount} 点生命`;
    case "draw": return `抽 ${eff.amount} 张牌`;
    case "damage_face": return `对敌方英雄造成 ${eff.amount} 点伤害`;
    case "damage_random": return `对随机敌方随从造成 ${eff.amount} 点伤害`;
    case "damage_all": return `对敌方全体随从造成 ${eff.amount} 点伤害`;
    case "buff_all_atk": return `我方随从攻击力 +${eff.amount}`;
    default: return "";
  }
}

function render() {
  hidePreview(); // 重建 DOM 前收起预览，避免残留
  const [me, ai] = game.players;

  const pa = avatarCard(playerAvatarId);
  if (pa) { $("#my-avatar").src = pa.art; $("#my-name").textContent = "你 · " + pa.name; }
  if (game.aiAvatar) { $("#ai-avatar").src = game.aiAvatar.art; $("#ai-name").textContent = "对手 · " + game.aiAvatar.name; }

  $("#ai-hp").textContent = ai.hp;
  $("#my-hp").textContent = me.hp;
  $("#ai-hand-count").textContent = ai.hand.length;
  $("#ai-deck-count").textContent = ai.deck.length;
  $("#my-deck-count").textContent = me.deck.length;
  $("#my-energy").textContent = `${me.energy}/${me.maxEnergy}`;

  const aiBoard = $("#ai-board"); aiBoard.innerHTML = "";
  ai.board.forEach(m => aiBoard.appendChild(minionEl(m, 1)));

  const myBoard = $("#my-board"); myBoard.innerHTML = "";
  me.board.forEach(m => myBoard.appendChild(minionEl(m, 0)));

  const hand = $("#my-hand"); hand.innerHTML = "";
  me.hand.forEach((c, i) => hand.appendChild(handCardEl(c, i)));

  // 敌方英雄可作为攻击目标
  const aiHero = $("#ai-hero");
  aiHero.classList.toggle("targetable", game.turn === 0 && game.selected !== null && canTarget(0, { type: "face" }));

  $("#end-turn").disabled = game.turn !== 0 || game.over;

  const logEl = $("#log");
  logEl.innerHTML = game.log.map(l => `<div class="${l.cls}">${l.msg}</div>`).join("");
  logEl.scrollTop = logEl.scrollHeight;
}

function showOverlay(text, win) {
  const ov = $("#overlay");
  ov.classList.remove("hidden");
  $("#overlay-text").textContent = text;
  $("#overlay-text").className = win ? "win" : "lose";
}

// ---------- 入口 ----------

window.addEventListener("DOMContentLoaded", () => {
  $("#end-turn").onclick = endTurn;
  $("#ai-hero").onclick = () => {
    if (game.turn !== 0 || game.over || game.selected === null) return;
    if (!canTarget(0, { type: "face" })) { addLog("必须先攻击嘲讽随从！", "bad"); render(); return; }
    attack(0, game.selected, { type: "face" });
    game.selected = null;
    render();
  };
  $("#restart").onclick = () => { $("#overlay").classList.add("hidden"); newGame(); };
  $("#open-gallery").onclick = () => { buildGallery(); $("#gallery").classList.remove("hidden"); };
  $("#close-gallery").onclick = () => $("#gallery").classList.add("hidden");
  newGame();
});
