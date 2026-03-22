// ==================== 工具函数 ====================
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ==================== 常量 ====================
const ROUND_NAMES = ['素描', '雕塑', '绘画', '文物'];

// 数字牌emoji映射
const NUMBER_EMOJIS = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

// 赃物配置：每轮都有 0,1,2,3,3,3,4,5 加上老板
// 白点分布规则：
// 第1轮：0有2个白点，其他没有，老板没有
// 第2轮：0有2个白点，1有1个白点，其他没有，老板没有
// 第3轮：0有2个白点，1有1个白点，2有1个白点，其他没有，老板没有
// 第4轮：0有2个白点，1,2,4,5各有1个白点，3没有，老板没有
const LOOT_POOLS = [
  // 第1轮：素描
  [
    { id: 'r1-0', value: 0, alibi: true, alibiCount: 2, isBoss: false },
    { id: 'r1-1', value: 1, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r1-2', value: 2, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r1-3a', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r1-3b', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r1-3c', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r1-4', value: 4, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r1-5', value: 5, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r1-boss', value: 5, alibi: false, alibiCount: 0, isBoss: true }
  ],
  // 第2轮：雕塑
  [
    { id: 'r2-0', value: 0, alibi: true, alibiCount: 2, isBoss: false },
    { id: 'r2-1', value: 1, alibi: true, alibiCount: 1, isBoss: false },
    { id: 'r2-2', value: 2, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r2-3a', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r2-3b', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r2-3c', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r2-4', value: 4, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r2-5', value: 5, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r2-boss', value: 5, alibi: false, alibiCount: 0, isBoss: true }
  ],
  // 第3轮：绘画
  [
    { id: 'r3-0', value: 0, alibi: true, alibiCount: 2, isBoss: false },
    { id: 'r3-1', value: 1, alibi: true, alibiCount: 1, isBoss: false },
    { id: 'r3-2', value: 2, alibi: true, alibiCount: 1, isBoss: false },
    { id: 'r3-3a', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r3-3b', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r3-3c', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r3-4', value: 4, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r3-5', value: 5, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r3-boss', value: 5, alibi: false, alibiCount: 0, isBoss: true }
  ],
  // 第4轮：文物
  [
    { id: 'r4-0', value: 0, alibi: true, alibiCount: 2, isBoss: false },
    { id: 'r4-1', value: 1, alibi: true, alibiCount: 1, isBoss: false },
    { id: 'r4-2', value: 2, alibi: true, alibiCount: 1, isBoss: false },
    { id: 'r4-3a', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r4-3b', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r4-3c', value: 3, alibi: false, alibiCount: 0, isBoss: false },
    { id: 'r4-4', value: 4, alibi: true, alibiCount: 1, isBoss: false },
    { id: 'r4-5', value: 5, alibi: true, alibiCount: 1, isBoss: false },
    { id: 'r4-boss', value: 5, alibi: false, alibiCount: 0, isBoss: true }
  ]
];

// ==================== 游戏状态 ====================
const state = {
  mode: 'local',
  isOnline: false,
  isHost: false,
  roomCode: null,
  myPlayerId: null,
  myPlayerIndex: -1,
  ws: null,
  players: [],
  currentPlayerIndex: 0,
  roundIndex: 0,
  deck: [],
  discardPile: [],
  centralLoot: [],
  bossOwner: null,
  dogOwner: null,
  dogInCenter: true,
  roundFinished: false,
  gameFinished: false,
  actionHistory: [], // 行动历史记录
  pendingAnimation: null // 待执行的飞行动画（用于联机同步）
};

// ==================== DOM 元素 ====================
const screens = {
  mode: document.getElementById('mode-screen'),
  setup: document.getElementById('setup-screen'),
  lobby: document.getElementById('lobby-screen'),
  waiting: document.getElementById('waiting-screen'),
  game: document.getElementById('game-screen')
};

const lobbyEls = {
  nickname: document.getElementById('player-nickname'),
  roomCode: document.getElementById('room-code-input'),
  createBtn: document.getElementById('create-room-btn'),
  joinBtn: document.getElementById('join-room-btn'),
  status: document.getElementById('connection-status')
};

const waitingEls = {
  roomCode: document.getElementById('room-code-display'),
  playerList: document.getElementById('waiting-players'),
  startBtn: document.getElementById('start-online-game-btn'),
  leaveBtn: document.getElementById('leave-room-btn')
};

const gameEls = {
  roundName: document.getElementById('round-name'),
  roundNumber: document.getElementById('round-number'),
  deckCount: document.getElementById('deck-count'),
  centralLoot: document.getElementById('central-loot'),
  dogOwner: document.getElementById('dog-owner-label'),
  roundBanner: document.getElementById('round-end-banner'),
  currentPlayer: document.getElementById('current-player-label'),
  handCards: document.getElementById('hand-cards'),
  cardCount: document.getElementById('my-card-count'),
  actionLog: document.getElementById('action-log'),
  nextPlayerBtn: document.getElementById('next-player-btn'),
  nextRoundBtn: document.getElementById('next-round-btn'),
  myLootPanel: document.getElementById('my-loot-panel'),
  myLootContent: document.getElementById('my-loot-content'),
  toggleLootBtn: document.getElementById('toggle-loot-btn'),
  playerPositions: {
    top: document.getElementById('player-top'),
    left: document.getElementById('player-left'),
    right: document.getElementById('player-right'),
    bottom: document.getElementById('player-bottom')
  },
  emojiPanel: document.getElementById('emoji-panel')
};

const dialogEls = {
  overlay: document.getElementById('dialog-overlay'),
  title: document.getElementById('dialog-title'),
  message: document.getElementById('dialog-message'),
  options: document.getElementById('dialog-options'),
  close: document.getElementById('dialog-close')
};

// ==================== WebSocket 联机功能 ====================
function connectWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}`;
  
  try {
    state.ws = new WebSocket(wsUrl);
    
    state.ws.onopen = () => {
      lobbyEls.status.textContent = '已连接';
      lobbyEls.status.classList.add('connected');
    };
    
    state.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleServerMessage(data);
    };
    
    state.ws.onclose = () => {
      lobbyEls.status.textContent = '连接已断开';
      lobbyEls.status.classList.remove('connected');
    };
    
    state.ws.onerror = (err) => {
      lobbyEls.status.textContent = '连接错误，请检查服务器';
      console.error('WebSocket error:', err);
      showToast('无法连接到服务器，将使用本地模式');
    };
  } catch (e) {
    showToast('WebSocket 不支持，将使用本地模式');
  }
}

function sendToServer(type, data) {
  if (state.ws && state.ws.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify({ type, ...data }));
  }
}

function handleServerMessage(data) {
  switch (data.type) {
    case 'roomCreated':
      state.roomCode = data.roomCode;
      state.myPlayerId = data.playerId;
      state.isHost = true;
      showWaitingScreen();
      break;
    case 'joinedRoom':
      state.roomCode = data.roomCode;
      state.myPlayerId = data.playerId;
      state.isHost = false;
      showWaitingScreen();
      break;
    case 'playerList':
      updateWaitingPlayers(data.players);
      break;
    case 'gameStarted':
      startOnlineGame(data.gameState);
      break;
    case 'gameState':
      syncGameState(data.state);
      break;
    case 'action':
      handleRemoteAction(data);
      break;
    case 'animation':
      // 接收远程飞行动画指令
      handleRemoteAnimation(data);
      break;
    case 'log':
      // 接收远程日志
      logAction(data.message);
      break;
    case 'dogDefense':
      // 关键修复：接收看门狗防御请求，显示选择对话框
      handleDogDefenseRequest(data);
      break;
    case 'robResult':
      // 关键修复：接收抢夺结果，更新状态
      handleRobResult(data);
      break;
    case 'gameEnd':
      // 关键修复：接收游戏结束消息
      syncGameState(data.gameState);
      showFinalResult();
      break;
    case 'emoji':
      // Emoji表情消息
      showEmojiBubble(data.playerIndex, data.emoji);
      break;
  }
}

// ==================== 大厅功能 ====================
document.getElementById('local-mode-btn').addEventListener('click', () => {
  state.mode = 'local';
  showScreen('setup');
});

document.getElementById('remote-mode-btn').addEventListener('click', () => {
  state.mode = 'remote';
  state.isOnline = true;
  showScreen('lobby');
  connectWebSocket();
});

document.getElementById('back-to-mode-btn').addEventListener('click', () => {
  showScreen('mode');
});

document.getElementById('back-to-mode-from-lobby-btn').addEventListener('click', () => {
  if (state.ws) state.ws.close();
  showScreen('mode');
});

lobbyEls.createBtn.addEventListener('click', () => {
  const nickname = lobbyEls.nickname.value.trim() || '玩家';
  sendToServer('createRoom', { nickname });
});

lobbyEls.joinBtn.addEventListener('click', () => {
  const nickname = lobbyEls.nickname.value.trim() || '玩家';
  const roomCode = lobbyEls.roomCode.value.trim().toUpperCase();
  if (!roomCode) {
    showToast('请输入房间号');
    return;
  }
  sendToServer('joinRoom', { nickname, roomCode });
});

waitingEls.startBtn.addEventListener('click', () => {
  if (state.isHost) {
    sendToServer('startGame', { roomCode: state.roomCode });
  }
});

waitingEls.leaveBtn.addEventListener('click', () => {
  if (state.ws) state.ws.close();
  state.isOnline = false;
  state.isHost = false;
  state.roomCode = null;
  showScreen('lobby');
});

function showScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  screens[screenName].classList.remove('hidden');
}

function showWaitingScreen() {
  waitingEls.roomCode.textContent = state.roomCode;
  showScreen('waiting');
}

function updateWaitingPlayers(players) {
  waitingEls.playerList.innerHTML = '';
  players.forEach(p => {
    const div = document.createElement('div');
    div.className = 'waiting-player' + (p.id === state.myPlayerId ? ' is-you' : '');
    div.textContent = p.name + (p.id === state.myPlayerId ? ' (你)' : '');
    waitingEls.playerList.appendChild(div);
  });
  
  if (state.isHost) {
    waitingEls.startBtn.disabled = players.length < 2 || players.length > 5;
    waitingEls.startBtn.textContent = `开始游戏 (${players.length}人)`;
  } else {
    waitingEls.startBtn.classList.add('hidden');
  }
}

// ==================== 本地游戏功能 ====================
const playerCountInput = document.getElementById('player-count');
const playerNamesDiv = document.getElementById('player-names');

function renderPlayerNameInputs() {
  let count = parseInt(playerCountInput.value, 10) || 3;
  if (count < 2) count = 2;
  if (count > 5) count = 5;
  
  playerNamesDiv.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const row = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = `玩家 ${i + 1}：`;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = `玩家${i + 1}`;
    row.appendChild(label);
    row.appendChild(input);
    playerNamesDiv.appendChild(row);
  }
}

playerCountInput.addEventListener('change', renderPlayerNameInputs);
renderPlayerNameInputs();

document.getElementById('start-game-btn').addEventListener('click', startLocalGame);

function startLocalGame() {
  const count = parseInt(playerCountInput.value, 10) || 3;
  const inputs = document.querySelectorAll('#player-names input');
  const names = [];
  for (let i = 0; i < count; i++) {
    names.push(inputs[i]?.value.trim() || `玩家${i + 1}`);
  }
  
  state.isOnline = false;
  state.isHost = true;
  state.myPlayerIndex = 0;
  
  initGame(names);
  showScreen('game');
  updateUI();
}

function startOnlineGame(gameState) {
  state.isOnline = true;
  syncGameState(gameState);
  showScreen('game');
  updateUI();
}

function syncGameState(serverState) {
  Object.assign(state, serverState);
  if (state.isOnline) {
    state.myPlayerIndex = state.players.findIndex(p => p.id === state.myPlayerId);
  }
  updateUI();
}

// ==================== 游戏初始化 ====================
function initGame(playerNames) {
  state.players = playerNames.map((name, idx) => ({
    id: 'local_' + idx,
    name: name,
    hand: [],
    loot: [],
    lootThisRound: [],
    alibi: 0,
    score: 0,
    cardCount: 0
  }));
  
  state.currentPlayerIndex = 0;
  state.roundIndex = 0;
  state.deck = buildDeck();
  state.discardPile = [];
  state.bossOwner = null;
  state.dogOwner = null;
  state.dogInCenter = true;
  state.roundFinished = false;
  state.gameFinished = false;
  state.actionHistory = [];
  
  dealInitialHands();
  startRound();
}

function buildDeck() {
  const deck = [];
  for (let i = 0; i < 36; i++) {
    deck.push({ type: 'number', value: i % 6 });
  }
  for (let i = 0; i < 6; i++) {
    deck.push({ type: 'boss' });
  }
  for (let i = 0; i < 6; i++) {
    deck.push({ type: 'dog' });
  }
  for (let i = 0; i < 7; i++) {
    deck.push({ type: 'greedy' });
  }
  return shuffle(deck);
}

function dealInitialHands() {
  const players = state.players;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < players.length; j++) {
      drawCardToPlayer(j);
    }
  }
}

function drawCardToPlayer(playerIndex) {
  // 如果牌堆空了，将弃牌堆洗牌放回
  if (state.deck.length === 0) {
    if (state.discardPile.length === 0) {
      return false;
    }
    state.deck = shuffle(state.discardPile.slice());
    state.discardPile = [];
    showToast('牌堆已洗牌');
  }

  const card = state.deck.pop();
  state.players[playerIndex].hand.push(card);
  state.players[playerIndex].cardCount = state.players[playerIndex].hand.length;
  return true;
}

function startRound() {
  state.centralLoot = JSON.parse(JSON.stringify(LOOT_POOLS[state.roundIndex]));
  state.roundFinished = false;
  state.bossOwner = null;

  // 隐藏本轮结束提示 - 关键修复
  if (gameEls.roundBanner) {
    gameEls.roundBanner.classList.add('hidden');
  }

  if (state.roundIndex > 0) {
    state.dogInCenter = false;
    // 关键修复：新一轮开始，有看门狗的人先出牌
    if (state.dogOwner !== null) {
      state.currentPlayerIndex = state.dogOwner;
    }
  }
}

// ==================== UI 渲染 ====================
function updateUI() {
  if (!state.players.length) return;
  
  gameEls.roundName.textContent = ROUND_NAMES[state.roundIndex];
  gameEls.roundNumber.textContent = state.roundIndex + 1;
  gameEls.deckCount.textContent = state.deck.length;
  
  renderCircularPlayers();
  renderCentralLoot();
  renderMyHand();
  renderMyLootPanel();
  renderActionButtons();
}

// 顺时针布局：下 -> 左 -> 上 -> 右
function renderCircularPlayers() {
  const playerCount = state.players.length;
  
  Object.values(gameEls.playerPositions).forEach(el => el.innerHTML = '');
  
  const myIndex = state.myPlayerIndex >= 0 ? state.myPlayerIndex : 0;
  
  for (let i = 0; i < playerCount; i++) {
    const player = state.players[i];
    const relativeIndex = (i - myIndex + playerCount) % playerCount;
    
    let position;
    if (relativeIndex === 0) {
      position = 'bottom';
    } else if (playerCount === 2) {
      position = 'top';
    } else if (playerCount === 3) {
      // 顺时针：下、左、右
      position = relativeIndex === 1 ? 'left' : 'right';
    } else if (playerCount === 4) {
      // 顺时针：下、左、上、右
      position = ['bottom', 'left', 'top', 'right'][relativeIndex];
    } else {
      // 5人顺时针：下、左、上、右、下-extra
      if (relativeIndex === 4) {
        position = 'bottom';
        // 为第5个玩家创建特殊样式
      } else {
        position = ['bottom', 'left', 'top', 'right'][relativeIndex];
      }
    }
    
    const card = createPlayerCard(player, i, relativeIndex === 0);
    
    // 5人时第5个玩家放在bottom位置但用flex并排
    if (playerCount === 5 && relativeIndex === 4) {
      card.style.marginLeft = '15px';
    }
    
    gameEls.playerPositions[position].appendChild(card);
  }
}

// 获取玩家位置元素（用于飞行动画）
function getPlayerPositionElement(playerIndex) {
  const playerCount = state.players.length;
  const myIndex = state.myPlayerIndex >= 0 ? state.myPlayerIndex : 0;
  const relativeIndex = (playerIndex - myIndex + playerCount) % playerCount;

  let position;
  if (relativeIndex === 0) {
    position = 'bottom';
  } else if (playerCount === 2) {
    position = 'top';
  } else if (playerCount === 3) {
    position = relativeIndex === 1 ? 'left' : 'right';
  } else if (playerCount === 4) {
    position = ['bottom', 'left', 'top', 'right'][relativeIndex];
  } else {
    if (relativeIndex === 4) {
      position = 'bottom';
    } else {
      position = ['bottom', 'left', 'top', 'right'][relativeIndex];
    }
  }

  return gameEls.playerPositions[position];
}

function createPlayerCard(player, index, isMe) {
  const div = document.createElement('div');
  const isCurrent = index === state.currentPlayerIndex && !state.roundFinished && !state.gameFinished;
  div.className = 'player-card' + (isCurrent ? ' current' : ' waiting-turn');
  
  const header = document.createElement('div');
  header.className = 'player-card-header';
  
  const main = document.createElement('div');
  main.className = 'player-card-main';
  
  const avatar = document.createElement('div');
  avatar.className = 'player-avatar';
  avatar.textContent = isCurrent ? '🤔' : '🦹';
  main.appendChild(avatar);
  
  const name = document.createElement('span');
  name.className = 'player-card-name';
  name.textContent = player.name + (isMe ? ' (你)' : '');
  main.appendChild(name);
  
  header.appendChild(main);
  
  const tags = document.createElement('div');
  tags.className = 'player-card-tags';
  if (state.dogOwner === index) {
    const dogTag = document.createElement('span');
    dogTag.className = 'tag dog';
    dogTag.textContent = '🐶';
    tags.appendChild(dogTag);
  }
  if (state.bossOwner === index) {
    const bossTag = document.createElement('span');
    bossTag.className = 'tag boss';
    bossTag.textContent = '👩‍💼';
    tags.appendChild(bossTag);
  }
  header.appendChild(tags);
  div.appendChild(header);
  
  const stats = document.createElement('div');
  stats.className = 'player-card-stats';
  
  // 只有自己能看到自己的白点数
  const myIndex = state.myPlayerIndex >= 0 ? state.myPlayerIndex : 0;
  const showAlibi = isMe || state.isOnline === false;
  const alibiCount = showAlibi ? countAlibi(player) : '?';
  
  stats.innerHTML = `
    <span>手牌<span class="stat-value">${player.cardCount || player.hand.length}</span></span>
    <span>本轮<span class="stat-value">${player.lootThisRound.length}</span></span>
    ${showAlibi ? `<span>白点<span class="stat-value">${alibiCount}</span></span>` : ''}
  `;
  div.appendChild(stats);
  
  // 显示本轮赃物（公开）- 圆形带白点
  if (player.lootThisRound.length > 0) {
    const lootDiv = document.createElement('div');
    lootDiv.className = 'player-round-loot';
    player.lootThisRound.forEach(loot => {
      const chip = document.createElement('span');
      // 关键修复：根据alibiCount显示两个白点
      const alibiClass = loot.alibi 
        ? (loot.alibiCount >= 2 ? ' alibi-double' : ' alibi')
        : '';
      chip.className = 'loot-chip' + (loot.isBoss ? ' boss' : '') + alibiClass;
      chip.textContent = loot.isBoss ? '5' : loot.value;

      // 构建提示文字
      let titleText = loot.isBoss ? '老板指示物' : `赃物 ${loot.value}`;
      if (loot.alibi && loot.alibiCount > 0) {
        titleText += ` (${loot.alibiCount}个白点)`;
      }
      chip.title = titleText;

      lootDiv.appendChild(chip);
    });
    div.appendChild(lootDiv);
  }
  
  return div;
}

function countAlibi(player) {
  let count = 0;
  player.loot.forEach(l => { 
    if (l.alibi) count += (l.alibiCount || 1); 
  });
  player.lootThisRound.forEach(l => { 
    if (l.alibi) count += (l.alibiCount || 1); 
  });
  return count;
}

function renderCentralLoot() {
  gameEls.centralLoot.innerHTML = '';
  
  if (state.centralLoot.length === 0 && !state.roundFinished) {
    gameEls.roundBanner.classList.remove('hidden');
    finishRound();
    return;
  }
  
  state.centralLoot.forEach(loot => {
    const div = document.createElement('div');
    // 关键修复：根据alibiCount显示两个白点
    const alibiClass = loot.alibi 
      ? (loot.alibiCount >= 2 ? ' alibi-double' : ' alibi')
      : '';
    div.className = 'loot-token' + (loot.isBoss ? ' boss' : '') + alibiClass;
    div.textContent = loot.isBoss ? '5' : loot.value;
    const alibiText = loot.alibi ? ` (${loot.alibiCount}个白点)` : '';
    div.title = loot.isBoss ? '老板指示物 (5分)' : `赃物 ${loot.value}${alibiText}`;
    div.dataset.id = loot.id;
    gameEls.centralLoot.appendChild(div);
  });
  
  gameEls.dogOwner.textContent = state.dogInCenter
    ? '在中央'
    : state.dogOwner === null
    ? '暂无'
    : state.players[state.dogOwner].name;
}

function renderMyHand() {
  const myIndex = state.myPlayerIndex >= 0 ? state.myPlayerIndex : state.currentPlayerIndex;
  const isMyTurn = myIndex === state.currentPlayerIndex && !state.roundFinished && !state.gameFinished;
  const current = state.players[myIndex];
  
  if (!current) return;
  
  const currentPlayerName = state.players[state.currentPlayerIndex]?.name || '';
  gameEls.currentPlayer.textContent = isMyTurn ? '轮到你了！' : `等待 ${currentPlayerName} 出牌`;
  gameEls.cardCount.textContent = `${current.hand.length} 张牌`;
  
  gameEls.handCards.innerHTML = '';
  
  if (state.roundFinished || state.gameFinished) {
    return;
  }
  
  current.hand.forEach((card, idx) => {
    const btn = document.createElement('button');
    btn.className = 'card ' + card.type;
    
    const icon = document.createElement('div');
    icon.className = 'card-icon';
    icon.textContent = getCardIcon(card);
    
    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = getCardTitle(card);
    
    const sub = document.createElement('div');
    sub.className = 'card-sub';
    sub.textContent = cardDescription(card);
    
    btn.appendChild(icon);
    btn.appendChild(title);
    btn.appendChild(sub);
    
    const canPlay = isMyTurn && (!state.isOnline || myIndex === state.currentPlayerIndex);
    btn.disabled = !canPlay;
    
    if (canPlay) {
      btn.addEventListener('click', () => playCard(idx));
    }
    
    gameEls.handCards.appendChild(btn);
  });
  
  if (current.hand.length < 5) {
    const notice = document.createElement('div');
    notice.className = 'card-count-notice';
    notice.textContent = `牌堆已耗尽，剩余 ${current.hand.length} 张牌`;
    gameEls.handCards.appendChild(notice);
  }
}

function renderActionButtons() {
  const myIndex = state.myPlayerIndex >= 0 ? state.myPlayerIndex : 0;
  const isMyTurn = myIndex === state.currentPlayerIndex;
  
  // 本地模式下，显示"下一位玩家"按钮（当不是当前玩家的回合时）
  if (!state.isOnline && !state.roundFinished && !state.gameFinished && !isMyTurn) {
    gameEls.nextPlayerBtn.classList.remove('hidden');
    gameEls.nextPlayerBtn.textContent = `→ ${state.players[state.currentPlayerIndex]?.name || '下一位'}`;
  } else {
    gameEls.nextPlayerBtn.classList.add('hidden');
  }
  
  // 下一轮按钮
  if (state.roundFinished && !state.gameFinished) {
    const canStartNext = !state.isOnline || state.isHost;
    if (canStartNext) {
      gameEls.nextRoundBtn.classList.remove('hidden');
      gameEls.nextRoundBtn.disabled = false;
    } else {
      gameEls.nextRoundBtn.classList.add('hidden');
    }
  } else {
    gameEls.nextRoundBtn.classList.add('hidden');
  }
}

function renderMyLootPanel() {
  const myIndex = state.myPlayerIndex >= 0 ? state.myPlayerIndex : 0;
  const me = state.players[myIndex];
  
  if (!me || me.loot.length === 0) {
    gameEls.myLootPanel.classList.add('hidden');
    return;
  }
  
  gameEls.myLootPanel.classList.remove('hidden');
  gameEls.myLootContent.innerHTML = '';
  
  const lootByRound = {};
  me.loot.forEach(loot => {
    const roundMatch = loot.id.match(/r(\d+)/);
    const round = roundMatch ? parseInt(roundMatch[1]) : 0;
    if (!lootByRound[round]) lootByRound[round] = [];
    lootByRound[round].push(loot);
  });
  
  Object.keys(lootByRound).sort().forEach(round => {
    const group = document.createElement('div');
    group.className = 'loot-round-group';
    
    const title = document.createElement('div');
    title.className = 'loot-round-title';
    title.textContent = `第${round}轮 ${ROUND_NAMES[round - 1] || ''}`;
    group.appendChild(title);
    
    const items = document.createElement('div');
    items.className = 'player-round-loot';
    lootByRound[round].forEach(loot => {
      const chip = document.createElement('span');
      // 关键修复：根据alibiCount显示两个白点
      const alibiClass = loot.alibi 
        ? (loot.alibiCount >= 2 ? ' alibi-double' : ' alibi')
        : '';
      chip.className = 'loot-chip' + (loot.isBoss ? ' boss' : '') + alibiClass;
      chip.textContent = loot.isBoss ? '5' : loot.value;

      // 构建提示文字
      let titleText = loot.isBoss ? '老板指示物' : `赃物 ${loot.value}`;
      if (loot.alibi && loot.alibiCount > 0) {
        titleText += ` (${loot.alibiCount}个白点)`;
      }
      chip.title = titleText;

      items.appendChild(chip);
    });
    group.appendChild(items);
    
    gameEls.myLootContent.appendChild(group);
  });
}

function getCardIcon(card) {
  if (card.type === 'number') return NUMBER_EMOJIS[card.value] || '🔢';
  if (card.type === 'boss') return '👩‍💼';
  if (card.type === 'dog') return '🐶';
  if (card.type === 'greedy') return '🦊';
  return '';
}

function getCardTitle(card) {
  if (card.type === 'number') return '数字 ' + card.value;
  if (card.type === 'boss') return '老板牌';
  if (card.type === 'dog') return '守卫犬';
  if (card.type === 'greedy') return '贪心贼';
  return '';
}

function cardDescription(card) {
  if (card.type === 'number') {
    return '优先拿中央同数字，没有则可抢别人';
  }
  if (card.type === 'boss') {
    return '若中央有老板则拿走，否则可抢别人老板';
  }
  if (card.type === 'dog') {
    return '获得守卫犬，被抢时可挡刀';
  }
  if (card.type === 'greedy') {
    return '从中央任选一个赃物';
  }
  return '';
}

// ==================== 游戏逻辑 ====================
function playCard(cardIndex) {
  const myIndex = state.myPlayerIndex >= 0 ? state.myPlayerIndex : state.currentPlayerIndex;
  if (myIndex !== state.currentPlayerIndex) return;
  if (state.roundFinished || state.gameFinished) return;
  
  const player = state.players[myIndex];
  const card = player.hand[cardIndex];
  if (!card) return;
  
  player.hand.splice(cardIndex, 1);
  player.cardCount = player.hand.length;
  state.discardPile.push(card);
  
  let ended = false;
  function done() {
    if (ended) return;
    ended = true;
    endTurn();
  }
  
  if (card.type === 'number') {
    resolveNumberCard(card, myIndex, done);
  } else if (card.type === 'boss') {
    resolveBossCard(myIndex, done);
  } else if (card.type === 'dog') {
    resolveDogCard(myIndex);
    done();
  } else if (card.type === 'greedy') {
    resolveGreedyCard(myIndex, done);
  } else {
    done();
  }
}

// 下一位玩家按钮（本地模式）
gameEls.nextPlayerBtn.addEventListener('click', () => {
  if (state.isOnline) return;
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  updateUI();
});

function endTurn() {
  if (state.roundFinished || state.gameFinished) {
    updateUI();
    return;
  }

  // 抽牌补充到5张（当前玩家抽牌）
  const player = state.players[state.currentPlayerIndex];
  while (player.hand.length < 5) {
    if (!drawCardToPlayer(state.currentPlayerIndex)) {
      break;
    }
  }

  // 关键修复：先切换到下一个玩家，再发送状态！
  const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  state.currentPlayerIndex = nextPlayerIndex;

  if (state.isOnline) {
    sendToServer('action', {
      roomCode: state.roomCode,
      action: 'playCard',
      gameState: getGameStateForSync()
    });
  }

  updateUI();
}

function resolveNumberCard(card, playerIndex, done) {
  const player = state.players[playerIndex];
  
  const matches = state.centralLoot.filter(l => l.value === card.value && !l.isBoss);
  if (matches.length > 0) {
    const loot = matches[0];
    takeLootFromCenter(loot, playerIndex, function () {
      logAction(`${player.name} 打出数字 ${card.value}，从中央拿走赃物 ${loot.value}`);
      broadcastLog(`${player.name} 打出数字 ${card.value}，从中央拿走赃物 ${loot.value}`);
      done && done();
    });
    return;
  }
  
  const victims = [];
  state.players.forEach((p, idx) => {
    if (idx === playerIndex) return;
    const hasLoot = p.lootThisRound.some(l => l.value === card.value && !l.isBoss);
    if (hasLoot) victims.push(idx);
  });
  
  if (victims.length === 0) {
    logAction(`${player.name} 打出数字 ${card.value}，但无人有此数字赃物`);
    broadcastLog(`${player.name} 打出数字 ${card.value}，但无人有此数字赃物`);
    done && done();
    return;
  }
  
  const options = victims.map(idx => ({
    text: `抢 ${state.players[idx].name}`,
    onClick: () => {
      closeDialog();
      robFromPlayer(playerIndex, idx, card.value, done);
    }
  }));
  
  showDialog('选择目标', '要抢谁的赃物？', options);
}

function resolveBossCard(playerIndex, done) {
  const player = state.players[playerIndex];
  
  const bossIndex = state.centralLoot.findIndex(l => l.isBoss);
  if (bossIndex >= 0) {
    const loot = state.centralLoot[bossIndex];
    takeLootFromCenter(loot, playerIndex, function () {
      logAction(`${player.name} 打出老板牌，拿走老板指示物`);
      broadcastLog(`${player.name} 打出老板牌，拿走老板指示物`);
      done && done();
    });
    return;
  }
  
  const carriers = [];
  state.players.forEach((p, idx) => {
    if (idx === playerIndex) return;
    const hasBoss = p.lootThisRound.some(l => l.isBoss);
    if (hasBoss) carriers.push(idx);
  });
  
  if (carriers.length === 0) {
    logAction(`${player.name} 打出老板牌，但场上没有老板指示物`);
    broadcastLog(`${player.name} 打出老板牌，但场上没有老板指示物`);
    done && done();
    return;
  }
  
  if (carriers.length === 1) {
    robBossFromPlayer(playerIndex, carriers[0], done);
  } else {
    const options = carriers.map(idx => ({
      text: `抢 ${state.players[idx].name} 的老板`,
      onClick: () => {
        closeDialog();
        robBossFromPlayer(playerIndex, idx, done);
      }
    }));
    showDialog('选择老板目标', '要抢谁的老板指示物？', options);
  }
}

function resolveDogCard(playerIndex) {
  const player = state.players[playerIndex];
  
  if (state.dogInCenter) {
    // 狗在中央，飞行动画到玩家
    const fromEl = document.getElementById('dog-token');
    const toEl = getPlayerPositionElement(playerIndex).querySelector('.player-card');
    
    animateDogMove(fromEl, toEl, function() {
      state.dogInCenter = false;
      state.dogOwner = playerIndex;
      logAction(`${player.name} 牵走了守卫犬`);
      broadcastLog(`${player.name} 牵走了守卫犬`);
      updateUI();
    });
    
    // 广播狗的飞行动画
    broadcastAnimation({
      type: 'dogMove',
      from: 'center',
      toPlayerIndex: playerIndex
    });
  } else if (state.dogOwner !== null && state.dogOwner !== playerIndex) {
    const oldOwner = state.players[state.dogOwner];
    
    // 狗从别人那里飞过来
    const fromEl = getPlayerPositionElement(state.dogOwner).querySelector('.player-card');
    const toEl = getPlayerPositionElement(playerIndex).querySelector('.player-card');
    
    animateDogMove(fromEl, toEl, function() {
      state.dogOwner = playerIndex;
      logAction(`${player.name} 从 ${oldOwner.name} 那里骗来了守卫犬`);
      broadcastLog(`${player.name} 从 ${oldOwner.name} 那里骗来了守卫犬`);
      updateUI();
    });
    
    // 广播狗的飞行动画
    broadcastAnimation({
      type: 'dogMove',
      fromPlayerIndex: state.dogOwner,
      toPlayerIndex: playerIndex
    });
  } else if (state.dogOwner === null) {
    state.dogOwner = playerIndex;
    logAction(`${player.name} 获得了守卫犬`);
    broadcastLog(`${player.name} 获得了守卫犬`);
  } else {
    logAction(`${player.name} 守卫犬已经在自己手里`);
    broadcastLog(`${player.name} 守卫犬已经在自己手里`);
  }
}

// 狗的飞行动画
function animateDogMove(fromEl, toEl, onDone) {
  if (!fromEl || !toEl) {
    if (typeof onDone === 'function') onDone();
    return;
  }
  
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  
  const token = document.createElement('div');
  token.className = 'flying-dog';
  token.textContent = '🐶';
  token.style.fontSize = '2rem';
  token.style.position = 'fixed';
  token.style.zIndex = '100';
  token.style.pointerEvents = 'none';
  token.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease-out';
  
  document.body.appendChild(token);
  
  const startX = fromRect.left + fromRect.width / 2;
  const startY = fromRect.top + fromRect.height / 2;
  const endX = toRect.left + toRect.width / 2;
  const endY = toRect.top + toRect.height / 2;
  
  token.style.left = startX + 'px';
  token.style.top = startY + 'px';
  token.style.transform = 'translate(-50%, -50%)';
  
  // 强制重绘
  token.getBoundingClientRect();
  
  const dx = endX - startX;
  const dy = endY - startY;
  token.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  token.style.opacity = '0';
  
  setTimeout(function() {
    if (token && token.parentNode) {
      token.parentNode.removeChild(token);
    }
    if (typeof onDone === 'function') {
      onDone();
    }
  }, 800);
}

function resolveGreedyCard(playerIndex, done) {
  const player = state.players[playerIndex];
  // 关键修复：确保贪心贼不能拿老板牌
  const available = state.centralLoot.filter(l => !l.isBoss);
  
  if (available.length === 0) {
    logAction(`${player.name} 打出贪心贼，但中央已无赃物`);
    broadcastLog(`${player.name} 打出贪心贼，但中央已无赃物`);
    done && done();
    return;
  }
  
  logAction(`${player.name} 打出贪心贼，请选择中央赃物`);
  broadcastLog(`${player.name} 打出贪心贼，请选择中央赃物`);
  
  // 关键修复：只渲染非老板赃物，确保不能点击老板牌
  gameEls.centralLoot.innerHTML = '';
  available.forEach(loot => {
    const div = document.createElement('div');
    div.className = 'loot-token selectable' + (loot.alibi ? ' alibi' : '');
    div.textContent = loot.value;
    div.dataset.id = loot.id;
    div.addEventListener('click', () => {
      // 双重检查：确保不能拿老板牌
      if (loot.isBoss) {
        showToast('贪心贼不能拿老板牌！');
        return;
      }
      takeLootFromCenter(loot, playerIndex, function () {
        logAction(`${player.name} 用贪心贼拿走赃物 ${loot.value}`);
        broadcastLog(`${player.name} 用贪心贼拿走赃物 ${loot.value}`);
        updateUI();
        done && done();
      });
    });
    gameEls.centralLoot.appendChild(div);
  });
}

function takeLootFromCenter(loot, playerIndex, onDone) {
  const idx = state.centralLoot.findIndex(l => l.id === loot.id);
  if (idx >= 0) {
    const fromEl = gameEls.centralLoot.querySelector('[data-id="' + loot.id + '"]');
    const toEl = getPlayerPositionElement(playerIndex).querySelector('.player-card');
    
    // 关键修复：先移除赃物，再执行动画
    state.centralLoot.splice(idx, 1);
    
    // 广播飞行动画给所有玩家
    broadcastAnimation({
      type: 'centerToPlayer',
      lootId: loot.id,
      fromPlayerIndex: -1, // 中央
      toPlayerIndex: playerIndex,
      loot: loot
    });
    
    // 本地执行动画
    animateLootMove(fromEl, toEl, loot.isBoss, loot.alibi, loot.value, null, function () {
      if (typeof onDone === 'function') onDone();
    });
  }
  
  const player = state.players[playerIndex];
  player.lootThisRound.push(loot);
  if (loot.isBoss) {
    state.bossOwner = playerIndex;
  }
}

function robFromPlayer(attackerIndex, victimIndex, value, onDone) {
  const attacker = state.players[attackerIndex];
  const victim = state.players[victimIndex];
  
  const sourceArray = victim.lootThisRound;
  const targetIdx = sourceArray.findIndex(l => l.value === value && !l.isBoss);
  
  if (targetIdx < 0) {
    logAction(`${attacker.name} 试图抢劫但失败`);
    broadcastLog(`${attacker.name} 试图抢劫但失败`);
    if (typeof onDone === 'function') onDone();
    return;
  }
  
  const loot = sourceArray[targetIdx];
  
  // 关键修复：远程联机模式下有看门狗时，发送请求给服务器协调
  if (state.dogOwner === victimIndex) {
    if (state.isOnline) {
      // 联机模式：发送看门狗防御请求给服务器
      logAction(`${victim.name} 拥有守卫犬，等待其选择...`);
      sendToServer('dogDefense', {
        roomCode: state.roomCode,
        attackerIndex,
        victimIndex,
        value,
        isBoss: false
      });
      if (typeof onDone === 'function') onDone();
    } else {
      // 本地模式：直接显示对话框
      showDogDefenseDialog(attackerIndex, victimIndex, value, false, onDone);
    }
  } else {
    // 没有守卫犬，直接抢夺
    sourceArray.splice(targetIdx, 1);
    attacker.lootThisRound.push(loot);
    
    // 广播飞行动画
    broadcastAnimation({
      type: 'playerToPlayer',
      fromPlayerIndex: victimIndex,
      toPlayerIndex: attackerIndex,
      loot: loot
    });
    
    const fromEl = getPlayerPositionElement(victimIndex).querySelector('.player-round-loot');
    const toEl = getPlayerPositionElement(attackerIndex).querySelector('.player-card');
    animateLootMove(fromEl, toEl, loot.isBoss, loot.alibi, loot.value, null, function () {
      logAction(`${attacker.name} 从 ${victim.name} 抢走了 ${value}`);
      broadcastLog(`${attacker.name} 从 ${victim.name} 抢走了 ${value}`);
      updateUI();
      if (typeof onDone === 'function') onDone();
    });
  }
}

// 本地模式看门狗防御对话框
function showDogDefenseDialog(attackerIndex, victimIndex, value, isBoss, onDone) {
  const attacker = state.players[attackerIndex];
  const victim = state.players[victimIndex];
  const sourceArray = victim.lootThisRound;
  
  if (isBoss) {
    showDialog('守卫犬防御', 
      `${attacker.name} 想抢你的老板，你有守卫犬，请选择：`, [
        {
          text: '让他抢走老板',
          onClick: () => {
            closeDialog();
            const targetIdx = sourceArray.findIndex(l => l.isBoss);
            if (targetIdx >= 0) {
              const loot = sourceArray[targetIdx];
              sourceArray.splice(targetIdx, 1);
              attacker.lootThisRound.push(loot);
              state.bossOwner = attackerIndex;
              updateUI();
            }
            if (typeof onDone === 'function') onDone();
          }
        },
        {
          text: '送出守卫犬保住老板',
          onClick: () => {
            closeDialog();
            state.dogOwner = attackerIndex;
            logAction(`${victim.name} 送出守卫犬，保住了老板`);
            updateUI();
            if (typeof onDone === 'function') onDone();
          }
        }
      ]);
  } else {
    // 关键修复：本地模式下也只能给出被抢的赃物或看门狗
    showDialog('守卫犬防御', 
      `${attacker.name} 想抢你的 ${value}，你有守卫犬，请选择：`, [
        {
          text: `让他抢走 ${value}`,
          onClick: () => {
            closeDialog();
            const targetIdx = sourceArray.findIndex(l => l.value === value && !l.isBoss);
            if (targetIdx >= 0) {
              const loot = sourceArray[targetIdx];
              sourceArray.splice(targetIdx, 1);
              attacker.lootThisRound.push(loot);
              updateUI();
            }
            if (typeof onDone === 'function') onDone();
          }
        },
        {
          text: '送出守卫犬保住赃物',
          onClick: () => {
            closeDialog();
            state.dogOwner = attackerIndex;
            logAction(`${victim.name} 送出守卫犬，保住了赃物`);
            updateUI();
            if (typeof onDone === 'function') onDone();
          }
        }
      ]);
  }
}

function robBossFromPlayer(attackerIndex, victimIndex, onDone) {
  const attacker = state.players[attackerIndex];
  const victim = state.players[victimIndex];
  
  const sourceArray = victim.lootThisRound;
  const targetIdx = sourceArray.findIndex(l => l.isBoss);
  
  if (targetIdx < 0) {
    logAction(`${attacker.name} 想抢老板但对方没有`);
    broadcastLog(`${attacker.name} 想抢老板但对方没有`);
    if (typeof onDone === 'function') onDone();
    return;
  }
  
  const loot = sourceArray[targetIdx];
  
  // 关键修复：远程联机模式下有看门狗时，发送请求给服务器协调
  if (state.dogOwner === victimIndex) {
    if (state.isOnline) {
      // 联机模式：发送看门狗防御请求给服务器
      logAction(`${victim.name} 拥有守卫犬，等待其选择...`);
      sendToServer('dogDefense', {
        roomCode: state.roomCode,
        attackerIndex,
        victimIndex,
        value: 5,
        isBoss: true
      });
      if (typeof onDone === 'function') onDone();
    } else {
      // 本地模式：直接显示对话框
      showDogDefenseDialog(attackerIndex, victimIndex, 5, true, onDone);
    }
  } else {
    // 没有守卫犬，直接抢夺
    sourceArray.splice(targetIdx, 1);
    attacker.lootThisRound.push(loot);
    state.bossOwner = attackerIndex;
    
    // 广播飞行动画
    broadcastAnimation({
      type: 'playerToPlayer',
      fromPlayerIndex: victimIndex,
      toPlayerIndex: attackerIndex,
      loot: loot
    });
    
    const fromEl = getPlayerPositionElement(victimIndex).querySelector('.player-round-loot');
    const toEl = getPlayerPositionElement(attackerIndex).querySelector('.player-card');
    animateLootMove(fromEl, toEl, loot.isBoss, loot.alibi, loot.value, null, function () {
      logAction(`${attacker.name} 从 ${victim.name} 抢走了老板指示物`);
      broadcastLog(`${attacker.name} 从 ${victim.name} 抢走了老板指示物`);
      updateUI();
      if (typeof onDone === 'function') onDone();
    });
  }
}

function finishRound() {
  if (state.roundFinished) return; // 防止重复调用
  
  if (state.bossOwner !== null) {
    const owner = state.players[state.bossOwner];
    const hasBoss = owner.lootThisRound.some(l => l.isBoss);
    const hasHigh = owner.lootThisRound.some(l => !l.isBoss && l.value >= 4);
    if (hasBoss && !hasHigh) {
      owner.lootThisRound = owner.lootThisRound.filter(l => !l.isBoss);
      state.bossOwner = null;
      logAction('老板不满意，老板指示物被没收');
      broadcastLog('老板不满意，老板指示物被没收');
    }
  }
  
  state.players.forEach(player => {
    player.loot.push(...player.lootThisRound);
    player.lootThisRound = [];
  });
  
  state.roundFinished = true;
  
  // 关键修复：联机模式下广播本轮结束状态给所有玩家
  if (state.isOnline) {
    sendToServer('action', {
      roomCode: state.roomCode,
      action: 'roundFinished',
      gameState: getGameStateForSync()
    });
  }
  
  if (state.roundIndex >= 3) {
    state.gameFinished = true;
    // 关键修复：广播游戏结束状态给所有玩家（包括自己）
    if (state.isOnline) {
      sendToServer('gameEnd', {
        roomCode: state.roomCode,
        gameState: getGameStateForSync()
      });
    }
    showFinalResult();
  }
}

function showFinalResult() {
  state.players.forEach(p => {
    // 计算白点总数（考虑 alibiCount）
    p.alibi = p.loot.reduce((sum, l) => {
      if (l.alibi) return sum + (l.alibiCount || 1);
      return sum;
    }, 0);
    p.score = p.loot.reduce((sum, l) => sum + l.value, 0);
  });
  
  const minAlibi = Math.min(...state.players.map(p => p.alibi));
  const eliminated = state.players.filter(p => p.alibi === minAlibi);
  const candidates = state.players.filter(p => p.alibi > minAlibi);
  
  let msg = `不在场证明最少（${minAlibi}个）者淘汰：\n`;
  eliminated.forEach(p => {
    msg += `· ${p.name}：${p.score}分（淘汰）\n`;
  });
  
  if (candidates.length > 0) {
    msg += `\n其余玩家：\n`;
    candidates.forEach(p => {
      msg += `· ${p.name}：${p.score}分，白点${p.alibi}个\n`;
    });
    const winner = candidates.reduce((best, p) => p.score > best.score ? p : best);
    msg += `\n🏆 最终大盗：${winner.name}！`;
  } else {
    msg += '\n所有人都被淘汰，博物馆获胜！';
  }
  
  showDialog('游戏结束', msg, [{
    text: '返回大厅',
    onClick: () => {
      closeDialog();
      if (state.ws) state.ws.close();
      showScreen('mode');
    }
  }]);
}

function logAction(text) {
  // 添加到历史记录
  state.actionHistory.push({
    text: text,
    time: Date.now()
  });

  // 只保留最近10条记录
  if (state.actionHistory.length > 10) {
    state.actionHistory.shift();
  }

  // 显示最新的几条记录
  const recentActions = state.actionHistory.slice(-3);
  gameEls.actionLog.innerHTML = recentActions.map(a => 
    `<div class="action-item">${a.text}</div>`
  ).join('');
}

// 广播日志给所有玩家
function broadcastLog(message) {
  if (state.isOnline) {
    sendToServer('log', {
      roomCode: state.roomCode,
      message: message
    });
  }
}

// 广播动画指令给所有玩家
function broadcastAnimation(animationData) {
  if (state.isOnline) {
    sendToServer('animation', {
      roomCode: state.roomCode,
      animation: animationData
    });
  }
}

// 处理远程动画
function handleRemoteAnimation(data) {
  const anim = data.animation;
  if (!anim) return;
  
  // 延迟执行动画，等待UI更新
  setTimeout(() => {
    if (anim.type === 'centerToPlayer') {
      // 从中央到玩家
      const fromEl = gameEls.centralLoot.querySelector('[data-id="' + anim.lootId + '"]');
      const toEl = getPlayerPositionElement(anim.toPlayerIndex)?.querySelector('.player-card');
      if (fromEl && toEl) {
        animateLootMove(fromEl, toEl, anim.loot.isBoss, anim.loot.alibi, anim.loot.value);
      }
    } else if (anim.type === 'playerToPlayer') {
      // 从玩家到玩家
      const fromEl = getPlayerPositionElement(anim.fromPlayerIndex)?.querySelector('.player-round-loot');
      const toEl = getPlayerPositionElement(anim.toPlayerIndex)?.querySelector('.player-card');
      if (fromEl && toEl) {
        animateLootMove(fromEl, toEl, anim.loot.isBoss, anim.loot.alibi, anim.loot.value);
      }
    } else if (anim.type === 'dogMove') {
      // 狗的飞行动画
      if (anim.from === 'center') {
        const fromEl = document.getElementById('dog-token');
        const toEl = getPlayerPositionElement(anim.toPlayerIndex)?.querySelector('.player-card');
        if (fromEl && toEl) {
          animateDogMove(fromEl, toEl);
        }
      } else {
        const fromEl = getPlayerPositionElement(anim.fromPlayerIndex)?.querySelector('.player-card');
        const toEl = getPlayerPositionElement(anim.toPlayerIndex)?.querySelector('.player-card');
        if (fromEl && toEl) {
          animateDogMove(fromEl, toEl);
        }
      }
    }
  }, 100);
}

// ==================== 对话框 ====================
function showDialog(title, message, options) {
  dialogEls.title.textContent = title;
  dialogEls.message.textContent = message;
  dialogEls.options.innerHTML = '';
  
  if (options && options.length) {
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = opt.text;
      btn.addEventListener('click', opt.onClick);
      dialogEls.options.appendChild(btn);
    });
    dialogEls.close.classList.add('hidden');
  } else {
    dialogEls.close.classList.remove('hidden');
  }
  
  dialogEls.overlay.classList.remove('hidden');
}

function closeDialog() {
  dialogEls.overlay.classList.add('hidden');
}

dialogEls.close.addEventListener('click', closeDialog);

// ==================== 飞行动画 ====================
function animateLootMove(fromEl, toEl, isBoss, hasAlibi, value, label, onDone) {
  if (!fromEl || !toEl) {
    if (typeof onDone === 'function') onDone();
    return;
  }
  
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  
  const token = document.createElement('div');
  let cls = 'flying-token';
  if (isBoss) cls += ' boss';
  if (hasAlibi) cls += ' alibi';
  token.className = cls;
  token.textContent = label || value || (isBoss ? '5' : '?');
  
  document.body.appendChild(token);
  
  const startX = fromRect.left + fromRect.width / 2;
  const startY = fromRect.top + fromRect.height / 2;
  const endX = toRect.left + toRect.width / 2;
  const endY = toRect.top + toRect.height / 2;
  
  token.style.left = startX + 'px';
  token.style.top = startY + 'px';
  
  token.getBoundingClientRect();
  
  const dx = endX - startX;
  const dy = endY - startY;
  token.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  token.style.opacity = '0';
  
  setTimeout(function () {
    if (token && token.parentNode) {
      token.parentNode.removeChild(token);
    }
    if (typeof onDone === 'function') {
      onDone();
    }
  }, 600);
}

// ==================== 下一轮按钮 ====================
gameEls.nextRoundBtn.addEventListener('click', () => {
  if (!state.roundFinished || state.gameFinished) return;
  
  state.roundIndex++;
  state.currentPlayerIndex = 0;
  state.roundFinished = false;
  
  // 关键修复：确保隐藏本轮结束提示
  if (gameEls.roundBanner) {
    gameEls.roundBanner.classList.add('hidden');
  }
  
  if (state.roundIndex <= 3) {
    startRound();
    
    if (state.isOnline && state.isHost) {
      sendToServer('action', {
        roomCode: state.roomCode,
        action: 'nextRound',
        gameState: getGameStateForSync()
      });
    }
    
    updateUI();
  }
});

// ==================== 历史赃物面板切换 ====================
gameEls.toggleLootBtn.addEventListener('click', () => {
  const content = gameEls.myLootContent;
  const btn = gameEls.toggleLootBtn;
  if (content.style.display === 'none') {
    content.style.display = 'block';
    btn.textContent = '收起';
  } else {
    content.style.display = 'none';
    btn.textContent = '展开';
  }
});

// ==================== 状态同步 ====================
function getGameStateForSync() {
  return {
    players: state.players,
    currentPlayerIndex: state.currentPlayerIndex,
    roundIndex: state.roundIndex,
    deck: state.deck,
    discardPile: state.discardPile,
    centralLoot: state.centralLoot,
    bossOwner: state.bossOwner,
    dogOwner: state.dogOwner,
    dogInCenter: state.dogInCenter,
    roundFinished: state.roundFinished,
    gameFinished: state.gameFinished
  };
}

function handleRemoteAction(data) {
  // 关键修复：同步游戏状态
  if (data.gameState) {
    // 只更新需要同步的字段，保留本地玩家信息
    const myPlayerIndex = state.myPlayerIndex;
    const myPlayerId = state.myPlayerId;
    Object.assign(state, data.gameState);
    state.myPlayerIndex = myPlayerIndex;
    state.myPlayerId = myPlayerId;
  }
  
  // 关键修复：处理本轮结束状态
  if (data.action === 'roundFinished') {
    // 确保显示本轮结束提示
    if (gameEls.roundBanner) {
      gameEls.roundBanner.classList.remove('hidden');
    }
  }
  
  updateUI();
}

// 关键修复：处理看门狗防御请求（被抢者收到）
let pendingDoneCallback = null;

function handleDogDefenseRequest(data) {
  const { attackerIndex, victimIndex, value, isBoss } = data;
  const attacker = state.players[attackerIndex];
  const victim = state.players[victimIndex];
  
  // 只处理自己被抢的情况
  if (victimIndex !== state.myPlayerIndex) return;
  
  const sourceArray = victim.lootThisRound;
  
  if (isBoss) {
    // 抢老板
    const targetIdx = sourceArray.findIndex(l => l.isBoss);
    if (targetIdx < 0) return;
    
    showDialog('守卫犬防御', 
      `${attacker.name} 想抢你的老板，你有守卫犬，请选择：`, [
        {
          text: '让他抢走老板',
          onClick: () => {
            closeDialog();
            // 发送选择结果给服务器
            sendToServer('dogDefense', {
              roomCode: state.roomCode,
              attackerIndex,
              victimIndex,
              value,
              isBoss,
              action: 'giveLoot'
            });
          }
        },
        {
          text: '送出守卫犬保住老板',
          onClick: () => {
            closeDialog();
            sendToServer('dogDefense', {
              roomCode: state.roomCode,
              attackerIndex,
              victimIndex,
              value,
              isBoss,
              action: 'giveDog'
            });
          }
        }
      ]);
  } else {
    // 抢普通赃物 - 关键修复：只能给出被抢的赃物或看门狗
    // 找到被抢的赃物（value匹配）
    const targetLoot = sourceArray.find(l => l.value === value && !l.isBoss);
    if (!targetLoot) return;
    
    // 只显示两个选项：给出被抢的赃物 或 送出看门狗
    showDialog('守卫犬防御', 
      `${attacker.name} 想抢你的 ${value}，你有守卫犬，请选择：`, [
        {
          text: `让他抢走 ${value}`,
          onClick: () => {
            closeDialog();
            sendToServer('dogDefense', {
              roomCode: state.roomCode,
              attackerIndex,
              victimIndex,
              value,
              isBoss,
              action: 'giveLoot'
            });
          }
        },
        {
          text: '送出守卫犬保住赃物',
          onClick: () => {
            closeDialog();
            sendToServer('dogDefense', {
              roomCode: state.roomCode,
              attackerIndex,
              victimIndex,
              value,
              isBoss,
              action: 'giveDog'
            });
          }
        }
      ]);
  }
}

// 关键修复：处理抢夺结果（所有玩家收到）
function handleRobResult(data) {
  const { attackerIndex, victimIndex, value, isBoss, action, lootId } = data;
  const attacker = state.players[attackerIndex];
  const victim = state.players[victimIndex];
  
  if (action === 'giveDog') {
    // 送出守卫犬
    state.dogOwner = attackerIndex;
    logAction(`${victim.name} 送出守卫犬，保住了${isBoss ? '老板' : '赃物'}`);
    updateUI();
  } else if (action === 'giveLoot') {
    // 给出赃物
    const sourceArray = victim.lootThisRound;
    let targetIdx;
    if (lootId) {
      targetIdx = sourceArray.findIndex(l => l.id === lootId);
    } else {
      targetIdx = isBoss 
        ? sourceArray.findIndex(l => l.isBoss)
        : sourceArray.findIndex(l => l.value === value && !l.isBoss);
    }
    
    if (targetIdx >= 0) {
      const loot = sourceArray[targetIdx];
      sourceArray.splice(targetIdx, 1);
      attacker.lootThisRound.push(loot);
      if (isBoss) state.bossOwner = attackerIndex;
      
      // 飞行动画
      const fromEl = getPlayerPositionElement(victimIndex)?.querySelector('.player-round-loot');
      const toEl = getPlayerPositionElement(attackerIndex)?.querySelector('.player-card');
      animateLootMove(fromEl, toEl, loot.isBoss, loot.alibi, loot.value, null, function () {
        logAction(`${attacker.name} ${isBoss ? '抢走了老板指示物' : '从 ' + victim.name + ' 抢走了 ' + value}`);
        updateUI();
      });
    }
  }
}

// ==================== Emoji表情功能 ====================
function initEmojiPanel() {
  if (!gameEls.emojiPanel) return;
  
  const emojiBtns = gameEls.emojiPanel.querySelectorAll('.emoji-btn');
  emojiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji');
      sendEmoji(emoji);
    });
  });
}

function sendEmoji(emoji) {
  const myIndex = state.myPlayerIndex >= 0 ? state.myPlayerIndex : 0;
  
  // 本地显示
  showEmojiBubble(myIndex, emoji);
  
  // 联机模式下广播
  if (state.isOnline) {
    sendToServer('emoji', {
      roomCode: state.roomCode,
      playerIndex: myIndex,
      emoji: emoji
    });
  }
}

function showEmojiBubble(playerIndex, emoji) {
  const playerEl = getPlayerPositionElement(playerIndex);
  if (!playerEl) return;
  
  const playerCard = playerEl.querySelector('.player-card');
  if (!playerCard) return;
  
  // 创建emoji气泡
  const bubble = document.createElement('div');
  bubble.className = 'emoji-bubble';
  bubble.textContent = emoji;
  
  // 定位在玩家卡片上方
  const rect = playerCard.getBoundingClientRect();
  bubble.style.position = 'fixed';
  bubble.style.left = (rect.left + rect.width / 2) + 'px';
  bubble.style.top = (rect.top - 30) + 'px';
  bubble.style.transform = 'translateX(-50%)';
  bubble.style.fontSize = '2rem';
  bubble.style.zIndex = '100';
  bubble.style.pointerEvents = 'none';
  bubble.style.animation = 'emojiFloat 2s ease-out forwards';
  
  document.body.appendChild(bubble);
  
  // 2秒后移除
  setTimeout(() => {
    if (bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
    }
  }, 2000);
}

// ==================== 初始化 ====================
showScreen('mode');
initEmojiPanel();
console.log('抢劫艺术联机版已加载');
