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
  addLog("对局开始！你先手。");
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
  const steps = [];

  // 出牌：按费用从高到低尽量铺场
  steps.push(() => {
    let played = true;
    while (played) {
      played = false;
      const pl = game.players[1];
      const playable = pl.hand
        .map((c, i) => ({ c, i }))
        .filter(x => x.c.cost <= pl.energy && pl.board.length < MAX_BOARD)
        .sort((a, b) => b.c.cost - a.c.cost);
      if (playable.length > 0) {
        playCard(1, playable[0].i);
        played = true;
      }
    }
  });

  // 攻击：优先解掉嘲讽；能安全吃掉的随从就换，否则打脸
  steps.push(() => {
    const pl = game.players[1];
    for (const m of pl.board.filter(x => x.canAttack && x.atk > 0)) {
      if (game.over) break;
      const myTaunts = enemyTaunts(1); // 玩家方的嘲讽
      let target = null;
      if (myTaunts.length > 0) {
        target = { type: "minion", uid: myTaunts[0].uid };
      } else {
        const kills = game.players[0].board.filter(t => t.hp <= m.atk && t.atk < m.hp);
        if (kills.length > 0) {
          kills.sort((a, b) => b.atk - a.atk);
          target = { type: "minion", uid: kills[0].uid };
        } else {
          target = { type: "face" };
        }
      }
      attack(1, m.uid, target);
    }
  });

  steps.push(() => { if (!game.over) startTurn(0); });

  // 分步执行，便于观战
  let delay = 400;
  for (const s of steps) {
    setTimeout(() => { s(); render(); }, delay);
    delay += 800;
  }
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
  newGame();
});
