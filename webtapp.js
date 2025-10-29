class GameStats {
  constructor(serverKey = 'A') {
    this.server = serverKey;      // 'A' or 'B' - who served this game
    this.pointsTotal = 0;
    this.pointsWon = 0;           // points won by the player this game
    this.aces = 0;
    this.doubleFaults = 0;
    this.serviceWinners = 0;
    this.forehandWinners = 0;
    this.backhandWinners = 0;
    this.netWinners = 0;
    this.netPoints = 0;
    this.netPointsWon = 0;
    this.firstServePoints = 0;
    this.firstServePointsWon = 0;
    this.secondServePoints = 0;
    this.secondServePointsWon = 0;
    this.breakPointsFaced = 0;
    this.breakPointsWon = 0;
  }
}

class SetStats {
  constructor() {
    // Completed games in this set (array of GameStats for both players combined by convention)
    this.games = []; // we'll push objects like { winner: 'A', A: GameStats, B: GameStats }
    this.currentGame = {
      A: new GameStats('A'),
      B: new GameStats('A') // server field will be set by Match when a new game begins
    };

    // aggregate-type fields for the set (kept for convenience)
    this.aces = 0;
    this.doubleFaults = 0;
    this.serviceWinners = 0;
    this.forehandWinners = 0;
    this.backhandWinners = 0;
    this.netWinners = 0;
    this.netPoints = 0;
    this.netPointsWon = 0;
    this.firstServePoints = 0;
    this.firstServePointsWon = 0;
    this.secondServePoints = 0;
    this.secondServePointsWon = 0;
    this.breakPoints = 0;
    this.breaks = 0;
    this.pointsWon = 0;
    this.gamesWon = 0; // games won by the player who owns this SetStats (we'll store per-player sets on Player)
    this.serviceGamesWon = 0;
    this.serviceGamesLost = 0;
    this.returnGamesWon = 0;
    this.returnGamesLost = 0;
  }

  finishGame(winnerKey) {
    // winnerKey: 'A' or 'B'
    const gameSnapshot = {
      winner: winnerKey,
      A: this.currentGame.A,
      B: this.currentGame.B
    };
    this.games.push(gameSnapshot);

    // update set-level aggregates from the finished game for both players: 
    // sum the numeric fields (choose fields you want aggregated)
    for (const p of ['A', 'B']) {
      const g = gameSnapshot[p];
      this.aces += g.aces;
      this.doubleFaults += g.doubleFaults;
      this.serviceWinners += g.serviceWinners;
      this.forehandWinners += g.forehandWinners;
      this.backhandWinners += g.backhandWinners;
      this.netWinners += g.netWinners;
      this.netPoints += g.netPoints;
      this.netPointsWon += g.netPointsWon;
      this.firstServePoints += g.firstServePoints;
      this.firstServePointsWon += g.firstServePointsWon;
      this.secondServePoints += g.secondServePoints;
      this.secondServePointsWon += g.secondServePointsWon;
      this.breakPoints += g.breakPointsFaced;
      this.breaks += g.breakPointsWon;
      this.pointsWon += g.pointsWon;
    }

    // reset currentGame for next game; server will be set by Match.startGame()
    this.currentGame = { A: new GameStats(), B: new GameStats() };
  }

  // average aces per completed service game for a specific playerKey ('A' or 'B')
  avgAcesPerServiceGame(playerKey) {
    const svcGames = this.games.filter(g => {
      const server = (g.A.server === 'A' || g.B.server === 'A') ? 'A' : 'B';
      // service game for playerKey is true when server === playerKey
      return server === playerKey;
    });
    if (svcGames.length === 0) return '-';
    const total = svcGames.reduce((sum, g) => sum + g[playerKey].aces, 0);
    return (total / svcGames.length).toFixed(2);
  }

  // number of completed service games lost by playerKey
  serviceGamesLost(playerKey) {
    return this.games.filter(g => {
      const server = g.A.server; // both A.server & B.server should be the same in our model
      if (server !== playerKey) return false;
      // server lost when winner !== server
      return g.winner !== server;
    }).length;
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.sets = []; // array of SetStats (completed sets for this player)
    this.currentSet = new SetStats(); // in-progress set stats (for this player)
  }

  // Called when the current set completes; pushes currentSet into sets and starts new
  startNewSet() {
    this.sets.push(this.currentSet);
    this.currentSet = new SetStats();
  }

  // Backwards-compatible inc API: accept common stat labels and put them into currentSet or currentGame
  inc(stat, options = {}) {
    // options: {playerKey: 'A'|'B', serverKey: 'A'|'B'}
    const pKey = options.playerKey || 'A';
    const set = this.currentSet;
    // map legacy stat names to set/currentGame fields
    switch (stat) {
      case "Games":
        set.gamesWon++;
        break;
      case "Points":
        set.pointsWon++;
        break;
      case "First Serve Points":
        set.currentGame[pKey].firstServePoints++;
        set.firstServePoints++;
        break;
      case "Second Serve Points":
        set.currentGame[pKey].secondServePoints++;
        set.secondServePoints++;
        break;
      case "First Serve Points Won":
        set.currentGame[pKey].firstServePointsWon++;
        set.firstServePointsWon++;
        break;
      case "Second Serve Points Won":
        set.currentGame[pKey].secondServePointsWon++;
        set.secondServePointsWon++;
        break;
      case "Net Points":
        set.currentGame[pKey].netPoints++;
        set.netPoints++;
        break;
      case "Net Points Won":
        set.currentGame[pKey].netPointsWon++;
        set.netPointsWon++;
        break;
      case "Break Points":
        set.currentGame[pKey].breakPointsFaced++;
        set.breakPoints++;
        break;
      case "Break Points Won":
        set.currentGame[pKey].breakPointsWon++;
        set.breaks++;
        break;
      case "Aces":
        set.currentGame[pKey].aces++;
        set.aces++;
        break;
      case "Double Faults":
        set.currentGame[pKey].doubleFaults++;
        set.doubleFaults++;
        break;
      case "Forehand Winners":
        set.currentGame[pKey].forehandWinners++;
        set.forehandWinners++;
        break;
      case "Backhand Winners":
        set.currentGame[pKey].backhandWinners++;
        set.backhandWinners++;
        break;
      case "Net Winners":
        set.currentGame[pKey].netWinners++;
        set.netWinners++;
        break;
      case "Service Winners":
        set.currentGame[pKey].serviceWinners++;
        set.serviceWinners++;
        break;
      default:
        // unknown stat — try to increment set-level numeric field if present
        if (stat in set) set[stat]++;
    }
  }

  // helper getters so existing UI code stays compatible (these use totals = completed sets + currentSet)
  getTotalStats() {
    const total = new SetStats();
    // add completed sets
    for (const s of this.sets) {
      // add aggregate numerical values
      for (const k of Object.keys(s)) {
        if (typeof s[k] === 'number') total[k] = (total[k] || 0) + s[k];
      }
    }
    // add currentSet
    for (const k of Object.keys(this.currentSet)) {
      if (typeof this.currentSet[k] === 'number') total[k] = (total[k] || 0) + this.currentSet[k];
    }
    return total;
  }

  // Backwards compatible getters used in your UI:
  getAces() { return this.getTotalStats().aces || 0; }
  getDoubleFaults() { return this.getTotalStats().doubleFaults || 0; }
  getPointsWon() { return this.getTotalStats().pointsWon || 0; }
  getGamesWon() { return this.getTotalStats().gamesWon || 0; }
  getBreakPoints() { return this.getTotalStats().breakPoints || 0; }
  getBreakPointsWon() { return this.getTotalStats().breaks || 0; }
  getFirstServePoints() { return this.getTotalStats().firstServePoints || 0; }
  getSecondServePoints() { return this.getTotalStats().secondServePoints || 0; }
  getFirstServePointsWon() { return this.getTotalStats().firstServePointsWon || 0; }
  getSecondServePointsWon() { return this.getTotalStats().secondServePointsWon || 0; }
  getNetPoints() { return this.getTotalStats().netPoints || 0; }
  getNetPointsWon() { return this.getTotalStats().netPointsWon || 0; }
  getPointsServed() { return this.getTotalStats().firstServePoints + this.getTotalStats().secondServePoints || 0; }
  getServicePointsWon() { return this.getTotalStats().firstServePointsWon + this.getTotalStats().secondServePointsWon || 0; }

  // total of completed sets only
  completedServiceGamesLost() {
    return this.sets.reduce((s, set) => s + set.serviceGamesLost(), 0);
  }
}

class Match {
  constructor(playerAName, playerBName) {
    this.players = { A: new Player(playerAName), B: new Player(playerBName) };
    this.aPoints = 0;
    this.bPoints = 0;
    this.aGames = 0;
    this.bGames = 0;
    this.tiebreak = false;
    this.prevSets = []; // textual summaries like "6-4"
    this.currentServer = 'A'; // 'A' or 'B'
  }

  getPlayer(key) {
    return this.players[key];
  }

  // Start a new game — sets currentGame.server for both players so GameStats.server aligns
  startNewGame(serverKey) {
    // serverKey: 'A' or 'B'
    this.currentServer = serverKey;
    this.players.A.currentSet.currentGame.A.server = serverKey;
    this.players.A.currentSet.currentGame.B.server = serverKey;
    this.players.B.currentSet.currentGame.A.server = serverKey;
    this.players.B.currentSet.currentGame.B.server = serverKey;
  }

  finishGame(winnerKey) {
    const serverKey = this.currentServer;
    const returnerKey = serverKey === 'A' ? 'B' : 'A';

    this.players.A.currentSet.finishGame(winnerKey);
    this.players.B.currentSet.finishGame(winnerKey);

    // update games counters on match level
    if (winnerKey === 'A') this.aGames++;
    else this.bGames++;

    const winner = this.players[winnerKey];
    const loser = this.players[winnerKey === 'A' ? 'B' : 'A'];

    winner.currentSet.gamesWon++;

    if (serverKey === winnerKey) {
      winner.currentSet.serviceGamesWon++;
      loser.currentSet.returnGamesLost++;
    } else {
      winner.currentSet.returnGamesWon++;
      loser.currentSet.serviceGamesLost++;
    }
    this.toggleServer();
    this.startNewGame(this.currentServer);
  }

  // Finish a set: move current set into each player's .sets and add textual prevSet
  finishSet() {
    this.players.A.startNewSet();
    this.players.B.startNewSet();
    this.prevSets.push(`${this.aGames}-${this.bGames}`);
    this.aGames = 0;
    this.bGames = 0;
    this.aPoints = 0;
    this.bPoints = 0;
    this.tiebreak = false;
  }

  // Toggle server helper useful for your existing code
  toggleServer() {
    this.currentServer = (this.currentServer === 'A') ? 'B' : 'A';
  }

  // convenience totals
  getTotalPoints() { return this.players.A.getPointsWon() + this.players.B.getPointsWon(); }
  getTotalGames() { return this.players.A.getGamesWon() + this.players.B.getGamesWon(); }
}


let match = new Match("Catten Sims", "Aidan Sims");
let PlayerA = match.getPlayer('A');
let PlayerB = match.getPlayer('B');

match.startNewGame('A');
let server = match.currentServer;
let divserver = document.querySelector(".server");
divserver.textContent = "Serving: " + match.getPlayer(server).name;


// Update all "PlayerA" elements
document.querySelectorAll(".PlayerA").forEach(el => {
  el.textContent = PlayerA.name;
});

// Update all "PlayerB" elements
document.querySelectorAll(".PlayerB").forEach(el => {
  el.textContent = PlayerB.name;
});


let gameScores = [0, 15, 30, 40];
const score = document.querySelector('.score')
score.textContent = match.getPoints(PlayerA) + '-' + match.getPoints(PlayerB);
var statmode = 'Overview'

var tiebreak = 0;
var tbserver = '';
var divserver = document.querySelector(".server");
divserver.textContent = "Serving: " + server.name;
var startTime = new Date();


const dateDiv = document.querySelector('.date');
dateDiv.textContent = dateDiv.textContent = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
}).format(new Date());

function serverWonPoint(winner, serverKey) {
  if (!serverKey) return false;
  if (winner === 'Awon' && serverKey === 'A') return true;
  if (winner === 'Bwon' && serverKey === 'B') return true;
  return false;
}

// manage howwon options
function updateHowWonOptions() {
  const winnerInput = document.querySelector('input[name="whowon"]:checked');
  const serveInInput = document.querySelector('input[name="serveIn"]:checked');

  const aceOption = document.querySelector('input[name="howwon"][value="ace"]');
  const swinnerOption = document.querySelector('input[name="howwon"][value="swinner"]');
  const dfOption = document.querySelector('input[name="howwon"][value="df"]');
  const nwOption = document.querySelector('input[name="howwon"][value="nw"]');
  const neOption = document.querySelector('input[name="howwon"][value="ne"]');

  // reset everything
  [aceOption, swinnerOption, dfOption, nwOption, neOption].forEach(opt => {
    opt.disabled = false;
  });

  // rule 1: if serve was in, DF not possible
  if (serveInInput && serveInInput.value === "servein") {
    dfOption.disabled = true;
    dfOption.checked = false;
  }

  // rule 2: if server won → DF not possible
  if (winnerInput && serverWonPoint(winnerInput.value, server)) {
    dfOption.disabled = true;
    dfOption.checked = false;
  }

  // rule 3: if server lost → Ace + Service Winner not possible
  if (winnerInput && !serverWonPoint(winnerInput.value, server)) {
    aceOption.disabled = true;
    swinnerOption.disabled = true;
    if (aceOption.checked) aceOption.checked = false;
    if (swinnerOption.checked) swinnerOption.checked = false;
  }

  // --- NEW NET LOGIC ---
  if (winnerInput) {
    const winnerAtNet =
      (winnerInput.value === "Awon" && document.querySelector('input[name="whocame"][value="Acame"]').checked) ||
      (winnerInput.value === "Bwon" && document.querySelector('input[name="whocame"][value="Bcame"]').checked);

    const loserAtNet =
      (winnerInput.value === "Awon" && document.querySelector('input[name="whocame"][value="Bcame"]').checked) ||
      (winnerInput.value === "Bwon" && document.querySelector('input[name="whocame"][value="Acame"]').checked);

    // if winner not at net → no Net Winner
    if (!winnerAtNet) {
      nwOption.disabled = true;
      nwOption.checked = false;
    }

    // if loser not at net → no Net Error
    if (!loserAtNet) {
      neOption.disabled = true;
      neOption.checked = false;
    }
  }
}

// attach listeners
document.querySelectorAll('input[name="serveIn"]').forEach(input => {
  input.addEventListener('change', updateHowWonOptions);
});
document.querySelectorAll('input[name="whowon"]').forEach(input => {
  input.addEventListener('change', updateHowWonOptions);
});
document.querySelectorAll('input[name="whocame"]').forEach(input => {
  input.addEventListener('change', updateHowWonOptions);
});


function resetPointInputs() {
  // clear all radios
  document.querySelectorAll('input[type="radio"]').forEach(r => {
    r.checked = false;
    r.disabled = false; // restore enabled state
  });

  // clear all checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(c => {
    c.checked = false;
    c.disabled = false; // restore enabled state
  });
}

function changeTitles(top, mid, bot) {
  const thead = document.querySelector('.btt');
  thead.textContent = top;
  const mhead = document.querySelector('.btm');
  mhead.textContent = mid;
  const bhead = document.querySelector('.btb');
  bhead.textContent = bot;
}

function formatTotalTime(t) {
  let hours = Math.floor(t / 3600000);
  let minutes = Math.floor((t - (hours * 3600000)) / 60000);
  return hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
}

//Here
function toggleServer() {
  match.toggleServer();
  server = match.currentServer;
  document.querySelector(".server").textContent = "Serving: " + match.getPlayer(server).name;
}

function changeValue(code, lef, mid, rig) {
  const left = document.querySelector('.' + code[0] + 'l' + code[1])
  left.textContent = lef

  const middle = document.querySelector('.' + code[0] + 'm' + code[1])
  middle.textContent = mid

  const right = document.querySelector('.' + code[0] + 'r' + code[1])
  right.textContent = rig
}

function isBreakPoint(serverKey, aPoints, bPoints) {
  const serverPoints = [0, 15, 30];

  if (serverKey === 'A') {
    if (
      (bPoints === 40 && serverPoints.includes(aPoints)) ||
      bPoints === 'AD'
    ) {
      return true;
    }
  }
  else if (serverKey === 'B') {
    if (
      (aPoints === 40 && serverPoints.includes(bPoints)) ||
      aPoints === 'AD'
    ) {
      return true;
    }
  }
  return false;
}

function updateRow(section, index, label, leftVal, rightVal) {
  const l = document.querySelector(`.${section}l${index}`);
  const m = document.querySelector(`.${section}m${index}`);
  const r = document.querySelector(`.${section}r${index}`);
  if (l) l.textContent = leftVal ?? '';
  if (m) m.textContent = label ?? '';
  if (r) r.textContent = rightVal ?? '';
}
function safeDiv(a, b) {
  return b === 0 ? 0 : a / b;
}
function percent(a, b) {
  return b === 0 ? '-' : (100 * a / b).toFixed(2);
}
function ratio(a, b) {
  if (a === 0 && b === 0) return '-';
  if (b === 0) return 'inf';
  return (a / b).toFixed(2);
}

function getServiceGamesLostPerSet(playerKey) {
  const player = match.getPlayer(playerKey);
  const totalSetsCompleted = match.prevSets.length; // only finished sets
  const serviceGamesLost = player.stats["Service Games Lost"] ?? 0;
  return totalSetsCompleted === 0 ? '-' : (serviceGamesLost / totalSetsCompleted).toFixed(2);
}

function totalbf() {
  statmode = 'Total'
  changeTitles('Points', 'Games', 'Time')

  const eTime = new Date() - startTime;
  const totalPoints = match.getTotalPoints();
  const totalGames = match.getTotalGames();

  const pointTime = totalPoints === 0 ? '-' : ((eTime / 1000) / totalPoints).toFixed(1);
  const matchTime = formatTotalTime(eTime);

  // ─────── TOP (Points Summary) ───────
  const topRows = [
    { label: 'Points Played', valueA: totalPoints, valueB: totalPoints },
    { label: 'Points Won', valueA: PlayerA.getPointsWon(), valueB: PlayerB.getPointsWon() },
    {
      label: 'Points Won %',
      valueA: totalPoints === 0 ? '-' : (100 * PlayerA.getPointsWon() / totalPoints).toFixed(2),
      valueB: totalPoints === 0 ? '-' : (100 * PlayerB.getPointsWon() / totalPoints).toFixed(2),
    },
    {
      label: 'Rtn. to Svc. Points Ratio',
      valueA: (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0)
        ? '-'
        : (PlayerB.getPointsServed() / PlayerA.getPointsServed()).toFixed(2),
      valueB: (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0)
        ? '-'
        : (PlayerA.getPointsServed() / PlayerB.getPointsServed()).toFixed(2),
    },
  ];

  topRows.forEach((r, i) => updateRow('t', i + 1, r.label, r.valueA, r.valueB));

  // ─────── MIDDLE (Game Summary) ───────
  const midRows = [
    { label: 'Games Played', valueA: totalGames, valueB: totalGames },
    { label: 'Games Won', valueA: PlayerA.getGamesWon(), valueB: PlayerB.getGamesWon() },
    {
      label: 'Games Won %',
      valueA: totalGames === 0 ? '-' : (100 * PlayerA.getGamesWon() / totalGames).toFixed(2),
      valueB: totalGames === 0 ? '-' : (100 * PlayerB.getGamesWon() / totalGames).toFixed(2),
    },
  ];

  midRows.forEach((r, i) => updateRow('m', i + 1, r.label, r.valueA, r.valueB));

  // ─────── BOTTOM (Timing Summary) ───────
  const bottomRows = [
    { label: 'Avg. Point Time (Sec)', valueA: pointTime, valueB: pointTime },
    { label: 'Avg. Game Time (min)', valueA: '', valueB: '' },
    { label: 'Avg. Service Game Time (min)', valueA: '', valueB: '' },
    { label: 'Avg. Set Time (min)', valueA: '', valueB: '' },
    { label: 'Match Time', valueA: matchTime, valueB: matchTime },
  ];

  bottomRows.forEach((r, i) => updateRow('b', i + 1, r.label, r.valueA, r.valueB));

}

function overviewbf() {
  changeTitles('Serve', 'Return', 'Total')
  statmode = 'Overview'
  const eTime = new Date() - startTime;

  const rows = [
    // ─────── Serve (top) ───────
    { section: 't', label: 'Aces', valueA: () => PlayerA.getAces(), valueB: () => PlayerB.getAces() },
    { section: 't', label: 'Double Faults', valueA: () => PlayerA.getDoubleFaults(), valueB: () => PlayerB.getDoubleFaults() },
    { section: 't', label: '1st Serve %', valueA: () => percent(PlayerA.getFirstServePoints(), PlayerA.getPointsServed()), valueB: () => percent(PlayerB.getFirstServePoints(), PlayerB.getPointsServed()) },
    { section: 't', label: '1st Serve Won %', valueA: () => percent(PlayerA.getFirstServePointsWon(), PlayerA.getFirstServePoints()), valueB: () => percent(PlayerB.getFirstServePointsWon(), PlayerB.getFirstServePoints()) },
    { section: 't', label: '2nd Serve Won %', valueA: () => percent(PlayerA.getSecondServePointsWon(), PlayerA.getSecondServePoints()), valueB: () => percent(PlayerB.getSecondServePointsWon(), PlayerB.getSecondServePoints()) },
    { section: 't', label: 'Break Points', valueA: () => `${PlayerA.getBreakPointsWon()}/${PlayerA.getBreakPoints()}`, valueB: () => `${PlayerB.getBreakPointsWon()}/${PlayerB.getBreakPoints()}` },
    { section: 't', label: 'Service Points Won %', valueA: () => percent(PlayerA.getServicePointsWon(), PlayerA.getPointsServed()), valueB: () => percent(PlayerB.getServicePointsWon(), PlayerB.getPointsServed()) },

    // ─────── Return (middle) ───────
    { section: 'm', label: '1st Serve Return Won %', valueA: () => percent(PlayerB.getFirstServePoints() - PlayerB.getFirstServePointsWon(), PlayerB.getFirstServePoints()), valueB: () => percent(PlayerA.getFirstServePoints() - PlayerA.getFirstServePointsWon(), PlayerA.getFirstServePoints()) },
    { section: 'm', label: '2nd Serve Return Won %', valueA: () => percent(PlayerB.getSecondServePoints() - PlayerB.getSecondServePointsWon(), PlayerB.getSecondServePoints()), valueB: () => percent(PlayerA.getSecondServePoints() - PlayerA.getSecondServePointsWon(), PlayerA.getSecondServePoints()) },
    { section: 'm', label: 'Return Points Won %', valueA: () => percent(PlayerB.getPointsServed() - PlayerB.getServicePointsWon(), PlayerB.getPointsServed()), valueB: () => percent(PlayerA.getPointsServed() - PlayerA.getServicePointsWon(), PlayerA.getPointsServed()) },

    // ─────── Total (bottom) ───────
    {
      section: 'b', label: 'Points Dominance', valueA: () => {
        if (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0) return '-';
        const Ahold = PlayerA.getServicePointsWon() / PlayerA.getPointsServed();
        const Bhold = PlayerB.getServicePointsWon() / PlayerB.getPointsServed();
        return ((1 - Bhold) / (1 - Ahold)).toFixed(2);
      },
      valueB: () => {
        if (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0) return '-';
        const Ahold = PlayerA.getServicePointsWon() / PlayerA.getPointsServed();
        const Bhold = PlayerB.getServicePointsWon() / PlayerB.getPointsServed();
        return ((1 - Ahold) / (1 - Bhold)).toFixed(2);
      }
    },
    { section: 'b', label: 'Total Points Won', valueA: () => PlayerA.getPointsWon(), valueB: () => PlayerB.getPointsWon() },
    { section: 'b', label: 'Match Time', valueA: () => formatTotalTime(eTime), valueB: () => formatTotalTime(eTime) }
  ];

  rows.forEach((r, i) => updateRow(r.section, i + 1, r.label, r.valueA(), r.valueB()));
}

function servingbf() {
  statmode = 'Serving'
  changeTitles('Serve', 'Points', 'Games')

  const rows = [
    // ─────── TOP: Serve effectiveness ───────
    {
      section: 't', label: '1st Serve %',
      valueA: () => percent(PlayerA.getFirstServePoints(), PlayerA.getPointsServed()),
      valueB: () => percent(PlayerB.getFirstServePoints(), PlayerB.getPointsServed())
    },
    {
      section: 't', label: '2nd Serve %',
      valueA: () => percent(1 - safeDiv(PlayerA.getDoubleFaults(), PlayerA.getSecondServePoints()), 1),
      valueB: () => percent(1 - safeDiv(PlayerB.getDoubleFaults(), PlayerB.getSecondServePoints()), 1)
    },
    {
      section: 't', label: '1st Serve Won %',
      valueA: () => percent(PlayerA.getFirstServePointsWon(), PlayerA.getFirstServePoints()),
      valueB: () => percent(PlayerB.getFirstServePointsWon(), PlayerB.getFirstServePoints())
    },
    {
      section: 't', label: '2nd Serve Won %',
      valueA: () => percent(PlayerA.getSecondServePointsWon(), PlayerA.getSecondServePoints()),
      valueB: () => percent(PlayerB.getSecondServePointsWon(), PlayerB.getSecondServePoints())
    },
    { section: 't', label: '1st Serve Reliance', valueA: () => '-', valueB: () => '-' },
    { section: 't', label: 'Serve Rating', valueA: () => '-', valueB: () => '-' },

    // ─────── MIDDLE: Service point and break defense ───────
    {
      section: 'm', label: 'Service Points Won %',
      valueA: () => percent(PlayerA.getServicePointsWon(), PlayerA.getPointsServed()),
      valueB: () => percent(PlayerB.getServicePointsWon(), PlayerB.getPointsServed())
    },
    { section: 'm', label: 'Service In-Play Points Won', valueA: () => '-', valueB: () => '-' },
    { section: 'm', label: 'Points Per Service Game', valueA: () => '-', valueB: () => '-' },
    { section: 'm', label: 'Points Lost per Service Game', valueA: () => '-', valueB: () => '-' },
    { section: 'm', label: 'Break Points', valueA: () => '-', valueB: () => '-' },
    { section: 'm', label: 'BPs Faced per Service Game', valueA: () => '-', valueB: () => '-' },
    { section: 'm', label: 'BPs Faced per Set', valueA: () => '-', valueB: () => '-' },

    // ─────── BOTTOM: Game-level serve metrics ───────
    { section: 'b', label: 'Service Games Won %', valueA: () => '-', valueB: () => '-' },
    {
      section: 'b', label: 'Service Games Lost per Set',
      valueA: () => getServiceGamesLostPerSet('A'),
      valueB: () => getServiceGamesLostPerSet('B')
    },
  ];

  rows.forEach((r, i) => updateRow(r.section, i + 1, r.label, r.valueA(), r.valueB()));
}

function returnbf() {
  statmode = 'Returning';
  changeTitles("Return", "Points", "Games");

  const rows = [
    // ─────── TOP: Serve return efficiency ───────
    {
      section: 't', label: '1st Serve Return Won %',
      valueA: () => percent(PlayerB.getFirstServePoints() - PlayerB.getFirstServePointsWon(), PlayerB.getFirstServePoints()),
      valueB: () => percent(PlayerA.getFirstServePoints() - PlayerA.getFirstServePointsWon(), PlayerA.getFirstServePoints())
    },
    { section: 't', label: '2nd Serve Return Won %', valueA: () => '-', valueB: () => '-' },
    { section: 't', label: 'Return Rating', valueA: () => '-', valueB: () => '-' },

    // ─────── MIDDLE: Return points and break opportunities ───────
    {
      section: 'm', label: 'Return Points Won %',
      valueA: () => percent(PlayerB.getPointsServed() - PlayerB.getServicePointsWon(), PlayerB.getPointsServed()),
      valueB: () => percent(PlayerA.getPointsServed() - PlayerA.getServicePointsWon(), PlayerA.getPointsServed())
    },
    { section: 'm', label: 'Return In-Play Points Won', valueA: () => '-', valueB: () => '-' },
    { section: 'm', label: 'Points Per Return Game', valueA: () => '-', valueB: () => '-' },
    { section: 'm', label: 'Points Won per Return Game', valueA: () => '-', valueB: () => '-' },
    { section: 'm', label: 'Break Points', valueA: () => '-', valueB: () => '-' },
    { section: 'm', label: 'BPs per Return Game', valueA: () => '-', valueB: () => '-' },
    { section: 'm', label: 'BPs per Set', valueA: () => '-', valueB: () => '-' },

    // ─────── BOTTOM: Game-level return stats ───────
    { section: 'b', label: 'Return Games Won %', valueA: () => '-', valueB: () => '-' },
    { section: 'b', label: 'Return Games Won per Set', valueA: () => '-', valueB: () => '-' },
  ];

  rows.forEach((r, i) => updateRow(r.section, i + 1, r.label, r.valueA(), r.valueB()));
}

function wenbf() {
  statmode = 'Wen'
  changeTitles('Winners & Errors', 'Net', "Dominance")
  const rows = [
    // ─────── TOP: Winners vs Errors ───────
    { section: 't', label: 'Winner %', valueA: () => '-', valueB: () => '-' },
    { section: 't', label: 'Error %', valueA: () => '-', valueB: () => '-' },
    { section: 't', label: 'Winners per Error', valueA: () => '-', valueB: () => '-' },
    { section: 't', label: 'Winners per Opp. Error', valueA: () => '-', valueB: () => '-' },

    // ─────── MIDDLE: Net play ───────
    {
      section: 'm', label: 'Net Points %',
      valueA: () => (match.getTotalPoints() === 0) ? '-' : (PlayerA.getNetPoints() / match.getTotalPoints()).toFixed(2),
      valueB: () => (match.getTotalPoints() === 0) ? '-' : (PlayerB.getNetPoints() / match.getTotalPoints()).toFixed(2)
    },
    {
      section: 'm', label: 'Net Points Won %',
      valueA: () => (PlayerA.getNetPoints() === 0) ? '-' : (PlayerA.getNetPointsWon() / PlayerA.getNetPoints()).toFixed(2),
      valueB: () => (PlayerB.getNetPoints() === 0) ? '-' : (PlayerB.getNetPointsWon() / PlayerB.getNetPoints()).toFixed(2)
    },
    {
      section: 'm', label: 'Points Won at Net %',
      valueA: () => (PlayerA.getPointsWon() === 0) ? '-' : (PlayerA.getNetPointsWon() / PlayerA.getPointsWon()).toFixed(2),
      valueB: () => (PlayerB.getPointsWon() === 0) ? '-' : (PlayerB.getNetPointsWon() / PlayerB.getPointsWon()).toFixed(2)
    },
    { section: 'm', label: 'Net Effectiveness', valueA: () => '-', valueB: () => '-' },

    // ─────── BOTTOM: Dominance ───────
    { section: 'b', label: 'Points Dominance', valueA: () => '-', valueB: () => '-' },
    { section: 'b', label: 'Game Dominance', valueA: () => '-', valueB: () => '-' },
    { section: 'b', label: 'Dominance Ratio', valueA: () => '-', valueB: () => '-' },
  ];

  rows.forEach((r, i) => updateRow(r.section, i + 1, r.label, r.valueA(), r.valueB()));
}

function adfbf() {
  statmode = 'Adf'
  changeTitles("Aces", "Double Faults", "Other")
  const rows = [
    // --- TOP (Aces section) ---
    { section: 't', label: 'Aces', valueA: () => PlayerA.getAces(), valueB: () => PlayerB.getAces() },
    { section: 't', label: 'Ace %', valueA: () => percent(PlayerA.getAces(), PlayerA.getPointsServed()), valueB: () => percent(PlayerB.getAces(), PlayerB.getPointsServed()) },
    { section: 't', label: 'Aces per Service Game', valueA: () => '-', valueB: () => '-' },
    { section: 't', label: 'Aces per Set', valueA: () => '-', valueB: () => '-' },

    // --- MIDDLE (Double faults section) ---
    { section: 'm', label: 'Double Faults', valueA: () => PlayerA.getDoubleFaults(), valueB: () => PlayerB.getDoubleFaults() },
    { section: 'm', label: 'Double Fault %', valueA: () => percent(PlayerA.getDoubleFaults(), PlayerA.getPointsServed()), valueB: () => percent(PlayerB.getDoubleFaults(), PlayerB.getPointsServed()) },
    { section: 'm', label: 'DFs per 2nd Serve', valueA: () => safeDiv(PlayerA.getDoubleFaults(), PlayerA.getSecondServePoints()).toFixed(2), valueB: () => safeDiv(PlayerB.getDoubleFaults(), PlayerB.getSecondServePoints()).toFixed(2) },
    { section: 'm', label: 'DFs per Service Game', valueA: () => '-', valueB: () => '-' },
    { section: 'm', label: 'DFs per Set', valueA: () => '-', valueB: () => '-' },

    // --- BOTTOM (Ratios/Other) ---
    { section: 'b', label: 'Ace/DF Ratio', valueA: () => ratio(PlayerA.getAces(), PlayerA.getDoubleFaults()), valueB: () => ratio(PlayerB.getAces(), PlayerB.getDoubleFaults()) }
  ];
  rows.forEach((r, i) => {
    updateRow(r.section, i + 1, r.label, r.valueA(), r.valueB());
  });
}

function makeScore() {
  const sets = match.prevSets;
  const aGames = match.aGames;
  const bGames = match.bGames;
  const aPts = match.aPoints;
  const bPts = match.bPoints;

  const parts = [];
  if (sets.length > 0) {
    const formattedSets = sets.map(set => set.replace(/\s*\(\s*(\d+)\s*\)/, "($1)"));
    parts.push(formattedSets.join(", "));
  }

  if (aGames > 0 || bGames > 0) {
    parts.push(`${aGames}-${bGames}`);
  }

  parts.push(`${aPts}-${bPts}`);

  return parts.join(", ");
}

function makeStats(winner, event, fsin, ps) {
  const winnerKey = winner === 'Awon' ? 'A' : 'B';
  const serverKey = ps === 'Player A' ? 'A' : 'B';

  const selections = Array.from(document.querySelectorAll('input[name="whocame"]:checked')).map(el => el.value);
  for (const playerKey of ['A', 'B']) {
    const cameTag = playerKey + 'came';
    if (selections.includes(cameTag)) {
      match.getPlayer(playerKey).inc("Net Points", { playerKey });
      if (winnerKey === playerKey) {
        match.getPlayer(playerKey).inc("Net Points Won", { playerKey });
      }
    }
  }

  const server = match.getPlayer(serverKey);
  const isFirstServe = (fsin === 'servein');

  if (isFirstServe) {
    server.inc("First Serve Points", { playerKey: serverKey });
    if (winnerKey === serverKey) {
      server.inc("First Serve Points Won", { playerKey: serverKey });
    }
  } else {
    server.inc("Second Serve Points", { playerKey: serverKey });
    if (winnerKey === serverKey) {
      server.inc("Second Serve Points Won", { playerKey: serverKey });
    }
  }

  match.getPlayer(winnerKey).inc("Points", { playerKey: winnerKey });

  switch (event) {
    case 'ace':
      match.getPlayer(serverKey).inc("Aces", { playerKey: serverKey });
      break;

    case 'df':
      match.getPlayer(serverKey).inc("Double Faults", { playerKey: serverKey });
      break;

    case 'swinner':
      match.getPlayer(winnerKey).inc("Service Winners", { playerKey: winnerKey });
      break;

    case 'fhw':
      match.getPlayer(winnerKey).inc("Forehand Winners", { playerKey: winnerKey });
      break;

    case 'bhw':
      match.getPlayer(winnerKey).inc("Backhand Winners", { playerKey: winnerKey });
      break;

    case 'nw':
      match.getPlayer(winnerKey).inc("Net Winners", { playerKey: winnerKey });
      break;
  }

  switch (statmode) {
    case 'Total': totalbf(); break;
    case 'Overview': overviewbf(); break;
    case 'Wen': wenbf(); break;
    case 'Returning': returnbf(); break;
    case 'Adf': adfbf(); break;
    case 'Serving': servingbf(); break;
  }
}

function makePbp(winner, event) {
  const pbp = document.querySelector('.pbp');
  if (winner === 'Awon') {
    pbp.textContent += 'A won the point';
    pbp.textContent += '\n'
  } else if (winner === 'Bwon') {
    pbp.textContent += 'B won the point \n';
  }
}

function increment() {
  var div = document.querySelector(".score");
  let winner = document.querySelector('input[name="whowon"]:checked').value;
  const winnerKey = (winner === 'Awon') ? 'A' : 'B';
  const loserKey = (winnerKey === 'A') ? 'B' : 'A';
  const serverKey = match.currentServer; // 'A' or 'B'
  const isTiebreak = tiebreak === 7;

  if (isBreakPoint(serverKey, match.aPoints, match.bPoints)) {
    const returnerKey = serverKey === "A" ? "B" : "A";
    match.getPlayer(returnerKey).inc("Break Points", { playerKey: returnerKey });
    if (winnerKey === returnerKey) {
      match.getPlayer(returnerKey).inc("Break Points Won", { playerKey: returnerKey });
    }
  }
  match.getPlayer(winnerKey).inc("Points", { playerKey: winnerKey });
  if (isTiebreak) {
    match.setPoints(winnerKey === "A" ? PlayerA : PlayerB, match.getPoints(winnerKey === "A" ? PlayerA : PlayerB) + 1);
    const aPts = match.getPoints(PlayerA);
    const bPts = match.getPoints(PlayerB);
    if ((winnerKey === "A" && aPts >= 7 && aPts > bPts + 1) ||
      (winnerKey === "B" && bPts >= 7 && bPts > aPts + 1)) {

      match.finishGame(winnerKey);
      match.addPrevSets(match.aGames + '-' + match.bGames + ' (' + (winnerKey === "A" ? bPts : aPts) + ')');
      match.finishSet();
      tiebreak = 0;
    }
    if ((aPts + bPts) % 2 === 1) toggleServer();
    div.innerHTML = makeScore();
    return;
  }

  const aPts = match.getPoints(PlayerA);
  const bPts = match.getPoints(PlayerB);

  if (winnerKey === "A") {
    if (aPts === 40 && bPts === "AD") {
      match.setPoints(PlayerB, 40);
    } else if (aPts === 40 && bPts === 40) {
      match.setPoints(PlayerA, "AD");
    } else if (aPts === 40 || aPts === "AD") {
      match.finishGame("A");

      if ((match.getGames(PlayerA) === 6 && match.getGames(PlayerB) < 5) ||
        match.getGames(PlayerA) === 7) {
        match.addPrevSets(match.aGames + '-' + match.bGames);
        match.finishSet();
      } else if (match.getGames(PlayerA) === 6 && match.getGames(PlayerB) === 6) {
        tiebreak = 7;
        tbserver = serverKey;
      }
    } else {
      match.setPoints(PlayerA, gameScores[gameScores.indexOf(aPts) + 1]);
    }
  }

  else if (winnerKey === "B") {
    if (bPts === 40 && aPts === "AD") {
      match.setPoints(PlayerA, 40);
    } else if (bPts === 40 && aPts === 40) {
      match.setPoints(PlayerB, "AD");
    } else if (bPts === 40 || bPts === "AD") {
      match.finishGame("B");
      if ((match.getGames(PlayerB) === 6 && match.getGames(PlayerA) < 5) ||
        match.getGames(PlayerB) === 7) {
        match.addPrevSets(match.aGames + '-' + match.bGames);
        match.finishSet();
      } else if (match.getGames(PlayerB) === 6 && match.getGames(PlayerA) === 6) {
        tiebreak = 7;
        tbserver = serverKey;
      }
    } else {
      match.setPoints(PlayerB, gameScores[gameScores.indexOf(bPts) + 1]);
    }
  }
  div.innerHTML = makeScore();
}

const selection = document.querySelector('input[name="howwon"]:checked').value;
const servein = document.querySelector('input[name="serveIn"]:checked').value;

div.textContent = makeScore();
makePbp(winner, 0)
makeStats(winner, selection, servein, prevserver)
