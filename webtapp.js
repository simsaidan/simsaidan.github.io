
class Player {
  constructor(name) {
    this.name = name;
    this.aces = 0;
    this.pointsWon = 0;
    this.gamesWon = 0;
    this.dfs = 0;
    this.firstServePoints = 0;
    this.firstServePointsWon = 0;
    this.secondServePoints = 0;
    this.secondServePointsWon = 0;
    this.netPoints = 0;
    this.netPointsWon = 0;
    this.breakPoints = 0;
    this.breaks = 0;
    this.serviceWinners = 0;
    this.forehandWinners = 0;
    this.backhandWinners = 0;
    this.netWinners = 0;


  }
  getPointsWon() {
    return this.pointsWon;
  }

  getGamesWon() {
    return this.gamesWon;
  }
  getPointsServed() {
    return this.firstServePoints + this.secondServePoints;
  }
  getServicePointsWon() {
    return this.firstServePointsWon + this.secondServePointsWon;
  }
  getFirstServePoints() {
    return this.firstServePoints;
  }

  getSecondServePoints() {
    return this.secondServePoints;
  }

  getFirstServePointsWon() {
    return this.firstServePointsWon;
  }

  getSecondServePointsWon() {
    return this.secondServePointsWon;
  }
  getDoubleFaults() {
    return this.dfs;
  }

  getAces() {
    return this.aces;
  }
  getBreakPoints() {
    return this.breakPoints;
  }

  getBreakPointsWon() {
    return this.breaks;
  }
  getNetPoints() {
    return this.netPoints;
  }

  getNetPointsWon() {
    return this.netPointsWon;
  }

  getTotalWinners() {
    return (
      this.aces +
      this.forehandWinners +
      this.backhandWinners +
      this.netWinners +
      this.serviceWinners
    );
  }

  inc(stat) {
    switch (stat) {
      case "Games": this.gamesWon++; break;
      case "Points": this.pointsWon++; break;
      case "First Serve Points": this.firstServePoints++; break;
      case "Second Serve Points": this.secondServePoints++; break;
      case "First Serve Points Won": this.firstServePointsWon++; break;
      case "Second Serve Points Won": this.secondServePointsWon++; break;
      case "Net Points": this.netPoints++; break;
      case "Net Points Won": this.netPointsWon++; break;
      case "Break Points": this.breakPoints++; break;
      case "Break Points Won": this.breaks++; break;
      case "Aces": this.aces++; break;
      case "Double Faults": this.dfs++; break;
      case "Forehand Winners": this.forehandWinners++; break;
      case "Backhand Winners": this.backhandWinners++; break;
      case "Net Winners": this.netWinners++; break;
      case "Service Winners": this.serviceWinners++; break;
    }
  }
}

class Match {
  constructor(player1, player2) {
    this.players = [player1, player2];
    this.aPoints = 0;
    this.bPoints = 0;
    this.aGames = 0;
    this.bGames = 0;
    this.done = false;
    this.prevSets = []
  }
  getTotalPoints() {
    return this.players[0].pointsWon + this.players[1].pointsWon;
  }
  getTotalGames() {
    return this.players[0].gamesWon + this.players[1].gamesWon;
  }
  getPoints(player) {
    if (player === this.players[0]) {
      return this.aPoints;
    }
    else {
      return this.bPoints;
    }
  }
  getGames(player) {
    if (player === this.players[0]) {
      return this.aGames;
    }
    else {
      return this.bGames;
    }
  }
  setPoints(player, points) {
    if (player === this.players[0]) {
      this.aPoints = points;
    }
    else {
      this.bPoints = points;
    }
  }

  setGames(player, value) {
    if (player === this.players[0]) {
      this.aGames = value;
    }
    else {
      this.bGames = value;
    }
  }
  reset(set = false) {
    this.aPoints = 0;
    this.bPoints = 0;
    if (set) {
      this.aGames = 0;
      this.bGames = 0;
    }
  }
  getPrevSets() {
    return this.prevSets;
  }

  addPrevSets(set) {
    this.prevSets.push(set);
  }
}

let PlayerA = new Player("Player A");
let PlayerB = new Player("Player B");
let match = new Match(PlayerA, PlayerB);

let gameScores = [0, 15, 30, 40];
const score = document.querySelector('.score')
score.textContent = match.getPoints(PlayerA) + '-' + match.getPoints(PlayerB);
var statmode = 'Overview'

var tiebreak = 0;
var server = "Player A";
var tbserver = '';
var divserver = document.querySelector(".server");
divserver.textContent = "Serving: " + server;
var startTime = new Date();


const dateDiv = document.querySelector('.date');
dateDiv.textContent = dateDiv.textContent = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
}).format(new Date());


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

function toggleServer() {
  var divserver = document.querySelector(".server");

  if (divserver.textContent === "Serving: Player A") {
    divserver.textContent = "Serving: Player B";
    server = "Player B"
  } else {
    divserver.textContent = "Serving: Player A";
    server = "Player A"
  }
}
function changeValue(code, lef, mid, rig) {
  const left = document.querySelector('.' + code[0] + 'l' + code[1])
  left.textContent = lef

  const middle = document.querySelector('.' + code[0] + 'm' + code[1])
  middle.textContent = mid

  const right = document.querySelector('.' + code[0] + 'r' + code[1])
  right.textContent = rig
}

function isBreakPoint(server, playerAPoints, playerBPoints) {
  let serverPoints = [0, 15, 30]
  if (server === 'Player A') {
    if ((playerBPoints === 40 && serverPoints.indexOf(playerAPoints) != -1) || playerBPoints === 'AD') {
      return true;
    }
  }
  else if (server === 'Player B') {
    if ((playerAPoints === 40 && serverPoints.indexOf(playerBPoints) != -1) || playerAPoints === 'AD') {
      return true;
    }
  }
  return false;
}

function totalbfbottom() {
  var eTime = new Date() - startTime;
  var pointTime = match.getTotalPoints() === 0 ? '-' : ((eTime / 1000) / match.getTotalPoints()).toFixed(1)
  changeValue('b1', pointTime, 'Avg. Point Time (Sec)', pointTime)
  changeValue('b2', '', 'Avg. Game Time (min)', '')
  changeValue('b3', '', 'Avg. Service Game Time (min)', '')
  changeValue('b4', '', 'Avg. Set Time (min)', '')
  changeValue('b5', formatTotalTime(eTime), 'Match Time', formatTotalTime(eTime))


}
function totalbfmiddle() {
  changeValue('m1', match.getTotalGames(), 'Games Played', match.getTotalGames())
  changeValue('m2', PlayerA.getGamesWon(), 'Games Won', PlayerB.getGamesWon())
  changeValue('m4', '', '', '')
  changeValue('m5', '', '', '')
  changeValue('m6', '', '', '')
  changeValue('m7', '', '', '')

  const ml3 = document.querySelector('.ml3');
  ml3.textContent = (match.getTotalGames() === 0) ? '-' : (100 * PlayerA.getGamesWon() / (match.getTotalGames())).toFixed(2)
  const mm3 = document.querySelector('.mm3');
  mm3.textContent = 'Games Won %'
  const mr3 = document.querySelector('.mr3');
  mr3.textContent = (match.getTotalGames() === 0) ? '-' : (100 * PlayerB.getGamesWon() / (match.getTotalGames())).toFixed(2)
}
function totalbf() {
  statmode = 'Total'
  changeTitles('Points', 'Games', 'Time')

  const tl1 = document.querySelector('.tl1');
  tl1.textContent = match.getTotalPoints()
  const tm1 = document.querySelector('.tm1');
  tm1.textContent = 'Points Played'
  const tr1 = document.querySelector('.tr1');
  tr1.textContent = match.getTotalPoints()
  const tl2 = document.querySelector('.tl2');
  tl2.textContent = PlayerA.getPointsWon()
  const tm2 = document.querySelector('.tm2');
  tm2.textContent = 'Points Won'
  const tr2 = document.querySelector('.tr2');
  tr2.textContent = PlayerB.getPointsWon()
  const tl3 = document.querySelector('.tl3');
  tl3.textContent = (match.getTotalPoints() === 0) ? '-' : (100 * PlayerA.getPointsWon() / match.getTotalPoints()).toFixed(2)
  const tm3 = document.querySelector('.tm3');
  tm3.textContent = 'Points Won %'
  const tr3 = document.querySelector('.tr3');
  tr3.textContent = (match.getTotalPoints() === 0) ? '-' : (100 * PlayerB.getPointsWon() / (match.getTotalPoints())).toFixed(2)
  const tl4 = document.querySelector('.tl4');
  tl4.textContent = (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0) ? '-' : (PlayerB.getPointsServed() / PlayerA.getPointsServed()).toFixed(2)
  const tm4 = document.querySelector('.tm4');
  tm4.textContent = 'Rtn. to Svc. Points Ratio'
  const tr4 = document.querySelector('.tr4');
  tr4.textContent = (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0) ? '-' : (PlayerA.getPointsServed() / PlayerB.getPointsServed()).toFixed(2)

  changeValue('t5', '', '', '')
  changeValue('t6', '', '', '')
  changeValue('t7', '', '', '')
  totalbfbottom()
  totalbfmiddle()

}
function overviewbfbottom() {
  var eTime = new Date() - startTime;
  var apd = (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0) ? '-' : ((1 - ((PlayerB.getServicePointsWon()) / (PlayerB.getPointsServed()))) / (1 - ((PlayerA.getServicePointsWon()) / (PlayerA.getPointsServed())))).toFixed(2)
  var bpd = (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0) ? '-' : ((1 - ((PlayerA.getServicePointsWon()) / PlayerA.getPointsServed())) / (1 - (PlayerB.getServicePointsWon() / PlayerB.getPointsServed()))).toFixed(2)
  changeValue('b1', apd, 'Points Dominance', bpd)
  changeValue('b2', PlayerA.getPointsWon(), 'Total Points Won', PlayerB.getPointsWon())
  changeValue('b3', formatTotalTime(eTime), 'Match Time', formatTotalTime(eTime))
  changeValue('b4', '', '', '')
  changeValue('b5', '', '', '')

}
function overviewbfmiddle() {

  changeValue('m4', '', '', '')
  changeValue('m5', '', '', '')
  changeValue('m6', '', '', '')
  changeValue('m7', '', '', '')


  const ml3 = document.querySelector('.ml3');
  ml3.textContent = (PlayerB.getPointsServed() === 0) ? '-' : (100 - (100 * (PlayerB.getServicePointsWon()) / (PlayerB.getPointsServed()))).toFixed(2)
  const mm3 = document.querySelector('.mm3');
  mm3.textContent = 'Return Points Won %'
  const mr3 = document.querySelector('.mr3');
  mr3.textContent = (PlayerA.getPointsServed() === 0) ? '-' : (100 - (100 * PlayerA.getServicePointsWon() / PlayerA.getPointsServed())).toFixed(2)
  const ml2 = document.querySelector('.ml2');
  ml2.textContent = (PlayerB.getSecondServePoints() === 0) ? '-' : (100 - (100 * PlayerB.getSecondServePointsWon() / PlayerB.getSecondServePoints())).toFixed(2)
  const mm2 = document.querySelector('.mm2');
  mm2.textContent = '2nd Serve Return Won %'
  const mr2 = document.querySelector('.mr2');
  mr2.textContent = (PlayerA.getSecondServePoints() === 0) ? '-' : (100 - (100 * PlayerA.getSecondServePointsWon() / PlayerA.getSecondServePoints())).toFixed(2)
  const ml1 = document.querySelector('.ml1');
  ml1.textContent = (PlayerB.getFirstServePoints() === 0) ? '-' : (100 - (100 * PlayerB.getFirstServePointsWon() / PlayerB.getFirstServePoints())).toFixed(2)
  const mm1 = document.querySelector('.mm1');
  mm1.textContent = '1st Serve Return Won %'
  const mr1 = document.querySelector('.mr1');
  mr1.textContent = (PlayerA.getFirstServePoints() === 0) ? '-' : (100 - (100 * PlayerA.getFirstServePointsWon() / PlayerA.getFirstServePoints())).toFixed(2)

}
function overviewtopbf() {
  changeValue('t1', PlayerA.getAces(), 'Aces', PlayerB.getAces())
  changeValue('t2', PlayerA.getDoubleFaults(), 'Double Faults', PlayerB.getDoubleFaults())


  const tl3 = document.querySelector('.tl3');
  tl3.textContent = ((PlayerA.getPointsServed()) === 0) ? '-' : (100 * PlayerA.getFirstServePoints() / PlayerA.getPointsServed()).toFixed(2)
  const tm3 = document.querySelector('.tm3');
  tm3.textContent = '1st Serve %'
  const tr3 = document.querySelector('.tr3');
  tr3.textContent = ((PlayerB.getPointsServed()) === 0) ? '-' : (100 * PlayerB.getFirstServePoints() / PlayerB.getPointsServed()).toFixed(2)
  const tl4 = document.querySelector('.tl4');
  tl4.textContent = (PlayerA.getFirstServePoints() === 0) ? '-' : (100 * PlayerA.getFirstServePointsWon() / PlayerA.getFirstServePoints()).toFixed(2)
  const tm4 = document.querySelector('.tm4');
  tm4.textContent = '1st Serve Won %'
  const tr4 = document.querySelector('.tr4');
  tr4.textContent = (PlayerB.getFirstServePoints() === 0) ? '-' : (100 * PlayerB.getFirstServePointsWon() / PlayerB.getFirstServePoints()).toFixed(2)
  const tl5 = document.querySelector('.tl5');
  tl5.textContent = (PlayerA.getSecondServePoints() === 0) ? '-' : (100 * PlayerA.getSecondServePointsWon() / PlayerA.getSecondServePoints()).toFixed(2)
  const tm5 = document.querySelector('.tm5');
  tm5.textContent = '2nd Serve Won %'
  const tr5 = document.querySelector('.tr5');
  tr5.textContent = (PlayerB.getSecondServePoints() === 0) ? '-' : (100 * PlayerB.getSecondServePointsWon() / PlayerB.getSecondServePoints()).toFixed(2)

  const tl6 = document.querySelector('.tl6');
  tl6.textContent = PlayerA.getBreakPointsWon() + "/" + PlayerA.getBreakPoints()
  const tm6 = document.querySelector('.tm6');
  tm6.textContent = 'Break Points'
  const tr6 = document.querySelector('.tr6');
  tr6.textContent = PlayerB.getBreakPointsWon() + "/" + PlayerB.getBreakPoints()


  const tl7 = document.querySelector('.tl7');
  tl7.textContent = (PlayerA.getPointsServed() === 0) ? '-' : (100 * PlayerA.getServicePointsWon() / PlayerA.getPointsServed()).toFixed(2)
  const tm7 = document.querySelector('.tm7');
  tm7.textContent = 'Service Points Won %'
  const tr7 = document.querySelector('.tr7');
  tr7.textContent = (PlayerB.getPointsServed() === 0) ? '-' : (100 * PlayerB.getServicePointsWon() / PlayerB.getPointsServed()).toFixed(2)

  overviewbfmiddle()
}
function overviewbf() {
  changeTitles('Serve', 'Return', 'Total')
  statmode = 'Overview'
  overviewtopbf()
  overviewbfbottom()
}

function servingbfbottom() {
  changeValue('b1', '', 'Service Games Won %', '')
  changeValue('b2', '', 'Service Games Lost per Set', '')
  changeValue('b3', '', '', '')
  changeValue('b4', '', '', '')
  changeValue('b5', '', '', '')

}

function servingbfmiddle() {
  const ml5 = document.querySelector('.ml5');
  ml5.textContent = ''
  const mm5 = document.querySelector('.mm5');
  mm5.textContent = 'Break Points'
  const mr5 = document.querySelector('.mr5');
  mr5.textContent = ''
  const ml4 = document.querySelector('.ml4');
  ml4.textContent = ''
  const mm4 = document.querySelector('.mm4');
  mm4.textContent = 'Points Lost per Service Game'
  const mr4 = document.querySelector('.mr4');
  mr4.textContent = ''
  const ml3 = document.querySelector('.ml3');
  ml3.textContent = ''
  const mm3 = document.querySelector('.mm3');
  mm3.textContent = 'Points Per Service Game'
  const mr3 = document.querySelector('.mr3');
  mr3.textContent = ''
  const ml2 = document.querySelector('.ml2');
  ml2.textContent = ''
  const mm2 = document.querySelector('.mm2');
  mm2.textContent = 'Service In-Play Points Won'
  const mr2 = document.querySelector('.mr2');
  mr2.textContent = ''
  const ml1 = document.querySelector('.ml1');
  ml1.textContent = (PlayerA.getPointsServed() === 0) ? '-' : (100 * (PlayerA.getServicePointsWon()) / PlayerA.getPointsServed()).toFixed(2)
  const mm1 = document.querySelector('.mm1');
  mm1.textContent = 'Service Points Won %'
  const mr1 = document.querySelector('.mr1');
  mr1.textContent = (PlayerB.getPointsServed() === 0) ? '-' : (100 * (PlayerB.getServicePointsWon()) / PlayerB.getPointsServed()).toFixed(2)
  const ml6 = document.querySelector('.ml6');
  ml6.textContent = ''
  const mm6 = document.querySelector('.mm6');
  mm6.textContent = 'BPs Faced per Service Game'
  const mr6 = document.querySelector('.mr6');
  mr6.textContent = ''
  const ml7 = document.querySelector('.ml7');
  ml7.textContent = ''
  const mm7 = document.querySelector('.mm7');
  mm7.textContent = 'BPs Faced per Set'
  const mr7 = document.querySelector('.mr7');
  mr7.textContent = ''

}
function servingbftop() {
  const tl1 = document.querySelector('.tl1');
  tl1.textContent = (PlayerA.getPointsServed() === 0) ? '-' : (100 * PlayerA.getFirstServePoints() / PlayerA.getPointsServed()).toFixed(2)
  const tm1 = document.querySelector('.tm1');
  tm1.textContent = '1st Serve %'
  const tr1 = document.querySelector('.tr1');
  tr1.textContent = (PlayerB.getPointsServed() === 0) ? '-' : (100 * PlayerB.getFirstServePoints() / PlayerB.getPointsServed()).toFixed(2)
  const tl2 = document.querySelector('.tl2');
  tl2.textContent = (PlayerA.getSecondServePoints() === 0) ? '-' : (100 * (1 - PlayerA.getDoubleFaults() / PlayerA.getSecondServePoints())).toFixed(2)
  const tm2 = document.querySelector('.tm2');
  tm2.textContent = '2nd Serve %'
  const tr2 = document.querySelector('.tr2');
  tr2.textContent = (PlayerB.getSecondServePoints() === 0) ? '-' : (100 * (1 - PlayerB.getDoubleFaults() / PlayerB.getSecondServePoints())).toFixed(2)
  const tl3 = document.querySelector('.tl3');
  tl3.textContent = (PlayerA.getFirstServePoints() === 0) ? '-' : (100 * PlayerA.getFirstServePointsWon() / PlayerA.getFirstServePoints()).toFixed(2)
  const tm3 = document.querySelector('.tm3');
  tm3.textContent = '1st Serve Won %'
  const tr3 = document.querySelector('.tr3');
  tr3.textContent = (PlayerB.getFirstServePoints() === 0) ? '-' : (100 * PlayerB.getFirstServePointsWon() / PlayerB.getFirstServePoints()).toFixed(2)
  const tl4 = document.querySelector('.tl4');
  tl4.textContent = (PlayerA.getSecondServePoints() === 0) ? '-' : (100 * PlayerA.getSecondServePointsWon() / PlayerA.getSecondServePoints()).toFixed(2)
  const tm4 = document.querySelector('.tm4');
  tm4.textContent = '2nd Serve Won %'
  const tr4 = document.querySelector('.tr4');
  tr4.textContent = (PlayerB.getSecondServePoints() === 0) ? '-' : (100 * PlayerB.getSecondServePointsWon() / PlayerB.getSecondServePoints()).toFixed(2)
  const tl5 = document.querySelector('.tl5');
  tl5.textContent = ''
  const tm5 = document.querySelector('.tm5');
  tm5.textContent = '1st Serve Reliance'
  const tr5 = document.querySelector('.tr5');
  tr5.textContent = ''
  const tl6 = document.querySelector('.tl6');
  tl6.textContent = ''
  const tm6 = document.querySelector('.tm6');
  tm6.textContent = 'Serve Rating'
  const tr6 = document.querySelector('.tr6');
  tr6.textContent = ''
  changeValue('t7', '', '', '')

  servingbfmiddle()
}

function servingbf() {
  servingbfbottom()
  statmode = 'Serving'
  changeTitles('Serve', 'Points', 'Games')
  servingbftop()
}

function returnbfbottom() {
  changeValue('b3', '', '', '')
  changeValue('b4', '', '', '')
  changeValue('b5', '', '', '')

  const bl2 = document.querySelector('.bl2');
  bl2.textContent = ''
  const bm2 = document.querySelector('.bm2');
  bm2.textContent = 'Return Games Won per Set'
  const br2 = document.querySelector('.br2');
  br2.textContent = ''
  const bl1 = document.querySelector('.bl1');
  bl1.textContent = ''
  const bm1 = document.querySelector('.bm1');
  bm1.textContent = 'Return Games Won %'
  const br1 = document.querySelector('.br1');
  br1.textContent = ''
}

function returnbfmiddle() {
  const ml5 = document.querySelector('.ml5');
  ml5.textContent = ''
  const mm5 = document.querySelector('.mm5');
  mm5.textContent = 'Break Points'
  const mr5 = document.querySelector('.mr5');
  mr5.textContent = ''
  const ml4 = document.querySelector('.ml4');
  ml4.textContent = ''
  const mm4 = document.querySelector('.mm4');
  mm4.textContent = 'Points Won per Return Game'
  const mr4 = document.querySelector('.mr4');
  mr4.textContent = ''
  const ml3 = document.querySelector('.ml3');
  ml3.textContent = ''
  const mm3 = document.querySelector('.mm3');
  mm3.textContent = 'Points Per Return Game'
  const mr3 = document.querySelector('.mr3');
  mr3.textContent = ''
  const ml2 = document.querySelector('.ml2');
  ml2.textContent = ''
  const mm2 = document.querySelector('.mm2');
  mm2.textContent = 'Return In-Play Points Won'
  const mr2 = document.querySelector('.mr2');
  mr2.textContent = ''
  const ml1 = document.querySelector('.ml1');
  ml1.textContent = (PlayerB.getPointsServed() === 0) ? '-' : (100 - (100 * (PlayerB.getServicePointsWon()) / (PlayerB.getPointsServed()))).toFixed(2)
  const mm1 = document.querySelector('.mm1');
  mm1.textContent = 'Return Points Won %'
  const mr1 = document.querySelector('.mr1');
  mr1.textContent = ((PlayerA.getPointsServed()) === 0) ? '-' : (100 - (100 * (PlayerA.getServicePointsWon()) / (PlayerA.getPointsServed()))).toFixed(2)
  const ml6 = document.querySelector('.ml6');
  ml6.textContent = ''
  const mm6 = document.querySelector('.mm6');
  mm6.textContent = 'BPs per Return Game'
  const mr6 = document.querySelector('.mr6');
  mr6.textContent = ''
  const ml7 = document.querySelector('.ml7');
  ml7.textContent = ''
  const mm7 = document.querySelector('.mm7');
  mm7.textContent = 'BPs per Set'
  const mr7 = document.querySelector('.mr7');
  mr7.textContent = ''
}

function returnbftop() {
  const tl1 = document.querySelector('.tl1');
  tl1.textContent = (PlayerB.getFirstServePoints() === 0) ? '-' : (100 - (100 * PlayerB.getFirstServePointsWon() / PlayerB.getFirstServePoints())).toFixed(2)
  const tm1 = document.querySelector('.tm1');
  tm1.textContent = '1st Serve Return Won %'
  const tr1 = document.querySelector('.tr1');
  tr1.textContent = (PlayerA.getFirstServePoints() === 0) ? '-' : (100 - (100 * PlayerA.getFirstServePointsWon() / PlayerA.getFirstServePoints())).toFixed(2)
  const tl2 = document.querySelector('.tl2');
  tl2.textContent = ''
  const tm2 = document.querySelector('.tm2');
  tm2.textContent = '2nd Serve Return Won %'
  const tr2 = document.querySelector('.tr2');
  tr2.textContent = ''
  const tl3 = document.querySelector('.tl3');
  tl3.textContent = ''
  const tm3 = document.querySelector('.tm3');
  tm3.textContent = 'Return Rating'
  const tr3 = document.querySelector('.tr3');
  tr3.textContent = ''
  changeValue('t4', '', '', '')
  changeValue('t5', '', '', '')
  changeValue('t6', '', '', '')
  changeValue('t7', '', '', '')

  returnbfmiddle()
}

function returnbf() {
  statmode = 'Returning'
  changeTitles("Return", "Points", "Games")
  returnbfbottom()
  returnbftop()

}
function wenbfbottom() {
  changeValue('b4', '', '', '')
  changeValue('b5', '', '', '')

  const bl3 = document.querySelector('.bl3');
  bl3.textContent = ''
  const bm3 = document.querySelector('.bm3');
  bm3.textContent = 'Dominance Ratio'
  const br3 = document.querySelector('.br3');
  br3.textContent = ''
  const bl2 = document.querySelector('.bl2');
  bl2.textContent = ''
  const bm2 = document.querySelector('.bm2');
  bm2.textContent = 'Game Dominance'
  const br2 = document.querySelector('.br2');
  br2.textContent = ''
  const bl1 = document.querySelector('.bl1');
  bl1.textContent = ''
  const bm1 = document.querySelector('.bm1');
  bm1.textContent = 'Points Dominance'
  const br1 = document.querySelector('.br1');
  br1.textContent = ''
}
function wenbfmiddle() {
  changeValue('m5', '', '', '')
  changeValue('m6', '', '', '')
  changeValue('m7', '', '', '')

  const ml4 = document.querySelector('.ml4');
  ml4.textContent = ''
  const mm4 = document.querySelector('.mm4');
  mm4.textContent = 'Net Effectiveness'
  const mr4 = document.querySelector('.mr4');
  mr4.textContent = ''
  const ml3 = document.querySelector('.ml3');
  ml3.textContent = (PlayerA.getPointsWon() === 0) ? '-' : (PlayerA.getNetPointsWon() / PlayerA.getPointsWon()).toFixed(2)
  const mm3 = document.querySelector('.mm3');
  mm3.textContent = 'Points Won at Net %'
  const mr3 = document.querySelector('.mr3');
  mr3.textContent = (PlayerB.getPointsWon() === 0) ? '-' : (PlayerB.getNetPointsWon() / PlayerB.getPointsWon()).toFixed(2)
  const ml2 = document.querySelector('.ml2');
  ml2.textContent = (PlayerA.getNetPoints() === 0) ? '-' : (PlayerA.getNetPointsWon() / PlayerA.getNetPoints()).toFixed(2)
  const mm2 = document.querySelector('.mm2');
  mm2.textContent = 'Net Points Won %'
  const mr2 = document.querySelector('.mr2');
  mr2.textContent = (PlayerB.getNetPoints() === 0) ? '-' : (PlayerB.getNetPointsWon() / PlayerB.getNetPoints()).toFixed(2)
  const ml1 = document.querySelector('.ml1');
  ml1.textContent = (match.getTotalPoints() === 0) ? '-' : (PlayerA.getNetPoints() / match.getTotalPoints()).toFixed(2)
  const mm1 = document.querySelector('.mm1');
  mm1.textContent = 'Net Points %'
  const mr1 = document.querySelector('.mr1');
  mr1.textContent = (match.getTotalPoints() === 0) ? '-' : (PlayerB.getNetPoints() / match.getTotalPoints()).toFixed(2)

}

function wenbftop() {
  const tl1 = document.querySelector('.tl1');
  tl1.textContent = ''
  const tm1 = document.querySelector('.tm1');
  tm1.textContent = 'Winner %'
  const tr1 = document.querySelector('.tr1');
  tr1.textContent = ''
  const tl2 = document.querySelector('.tl2');
  tl2.textContent = ''
  const tm2 = document.querySelector('.tm2');
  tm2.textContent = 'Error %'
  const tr2 = document.querySelector('.tr2');
  tr2.textContent = ''
  const tl3 = document.querySelector('.tl3');
  tl3.textContent = ''
  const tm3 = document.querySelector('.tm3');
  tm3.textContent = 'Winners per Error'
  const tr3 = document.querySelector('.tr3');
  tr3.textContent = ''
  const tl4 = document.querySelector('.tl4');
  tl4.textContent = ''
  const tm4 = document.querySelector('.tm4');
  tm4.textContent = 'Winners per Opp. Error'
  const tr4 = document.querySelector('.tr4');
  tr4.textContent = ''

  changeValue('t5', '', '', '')
  changeValue('t6', '', '', '')
  changeValue('t7', '', '', '')
  wenbfmiddle()
}
function wenbf() {
  statmode = 'Wen'
  changeTitles('Winners & Errors', 'Net', "Dominance")
  wenbfbottom()
  wenbftop()


}

function adfbfbottom() {
  changeValue('b2', '', '', '')
  changeValue('b3', '', '', '')
  changeValue('b4', '', '', '')
  changeValue('b5', '', '', '')

  const bl1 = document.querySelector('.bl1');
  bl1.textContent = (PlayerA.getAces() + PlayerA.getDoubleFaults()) === 0 ? '-' : ((PlayerA.getDoubleFaults() === 0) ? "inf" : (PlayerA.getAces() / (PlayerA.getDoubleFaults())).toFixed(2))
  const bm1 = document.querySelector('.bm1');
  bm1.textContent = 'Ace/DF Ratio'
  const br1 = document.querySelector('.br1');
  br1.textContent = (PlayerB.getAces() + PlayerB.getDoubleFaults()) === 0 ? '-' : ((PlayerB.getDoubleFaults() === 0) ? "inf" : (PlayerB.getAces() / PlayerB.getDoubleFaults()).toFixed(2))
}

function adfbfmiddle() {
  const ml5 = document.querySelector('.ml5');
  ml5.textContent = ''
  const mm5 = document.querySelector('.mm5');
  mm5.textContent = 'DFs per Set'
  const mr5 = document.querySelector('.mr5');
  mr5.textContent = ''
  const ml4 = document.querySelector('.ml4');
  ml4.textContent = ''
  const mm4 = document.querySelector('.mm4');
  mm4.textContent = 'DFs per Service Game'
  const mr4 = document.querySelector('.mr4');
  mr4.textContent = ''
  const ml3 = document.querySelector('.ml3');
  ml3.textContent = (PlayerA.secondServePoints()) === 0 ? '-' : (PlayerA.getDoubleFaults() / PlayerA.getSecondServePoints()).toFixed(2)
  const mm3 = document.querySelector('.mm3');
  mm3.textContent = 'DFs per 2nd Serve'
  const mr3 = document.querySelector('.mr3');
  mr3.textContent = (PlayerB.secondServePoints()) === 0 ? '-' : (PlayerB.getDoubleFaults() / PlayerB.getSecondServePoints()).toFixed(2)
  const ml2 = document.querySelector('.ml2');
  ml2.textContent = PlayerA.getPointsServed() === 0 ? '-' : (100 * PlayerA.getDoubleFaults() / PlayerA.getPointsServed()).toFixed(2)
  const mm2 = document.querySelector('.mm2');
  mm2.textContent = 'Double Fault %'
  const mr2 = document.querySelector('.mr2');
  mr2.textContent = PlayerB.getPointsServed() === 0 ? '-' : (100 * PlayerB.getDoubleFaults() / PlayerB.getPointsServed()).toFixed(2)
  const ml1 = document.querySelector('.ml1');
  ml1.textContent = PlayerA.getDoubleFaults()
  const mm1 = document.querySelector('.mm1');
  mm1.textContent = 'Double Faults'
  const mr1 = document.querySelector('.mr1');
  mr1.textContent = PlayerB.getDoubleFaults()

  changeValue('m6', '', '', '')
  changeValue('m7', '', '', '')
}

function adfbftop() {
  const tl1 = document.querySelector('.tl1');
  tl1.textContent = PlayerA.getAces()
  const tm1 = document.querySelector('.tm1');
  tm1.textContent = 'Aces'
  const tr1 = document.querySelector('.tr1');
  tr1.textContent = PlayerB.getAces()
  const tl2 = document.querySelector('.tl2');
  tl2.textContent = (PlayerA.getPointsServed()) === 0 ? '-' : (100 * PlayerA.getAces() / PlayerA.getPointsServed()).toFixed(2)
  const tm2 = document.querySelector('.tm2');
  tm2.textContent = 'Ace %'
  const tr2 = document.querySelector('.tr2');
  tr2.textContent = (PlayerB.getPointsServed()) === 0 ? '-' : (100 * PlayerB.getAces() / PlayerB.getPointsServed()).toFixed(2)
  const tl3 = document.querySelector('.tl3');
  tl3.textContent = ''
  const tm3 = document.querySelector('.tm3');
  tm3.textContent = 'Aces per Service Game'
  const tr3 = document.querySelector('.tr3');
  tr3.textContent = ''
  const tl4 = document.querySelector('.tl4');
  tl4.textContent = ''
  const tm4 = document.querySelector('.tm4');
  tm4.textContent = 'Aces per Set'
  const tr4 = document.querySelector('.tr4');
  tr4.textContent = ''
  changeValue('t5', '', '', '')
  changeValue('t6', '', '', '')
  changeValue('t7', '', '', '')
  adfbfmiddle()
}

function adfbf() {
  statmode = 'Adf'
  changeTitles("Aces", "Double Faults", "Other")
  adfbfbottom()
  adfbftop()
}

function makeScore() {
  let scorestr = '';
  for (let i = 0; i < match.getPrevSets().length; i++) {
    scorestr += match.getPrevSets()[i];
    scorestr += ", "
  }
  if (match.getGames(PlayerA) != '0' || match.getGames(PlayerB) != '0') {
    scorestr += match.getGames(PlayerA) + '-' + match.getGames(PlayerB) + ", "
  }
  scorestr += match.getPoints(PlayerA) + '-' + match.getPoints(PlayerB)
  return scorestr
}

function makeStats(winner, event, fsin, ps) {

  let selections = [];
  if (document.querySelector('input[name="whocame"]:checked')) {
    let checked = document.querySelectorAll('input[name="whocame"]:checked');
    for (let i = 0; i < checked.length; i++) {
      selections.push(checked[i].value);
    }
  }
  if (selections.includes('Acame')) {
    PlayerA.inc("Net Points")
    if (winner === "Awon") {
      PlayerA.inc("Net Points Won")
    }
  }
  if (selections.includes('Bcame')) {
    PlayerB.inc("Net Points")
    if (winner === "Bwon") {
      PlayerB.inc("Net Points Won")
    }
  }
  if (ps === 'Player A') {
    if (fsin === 'servein') {
      PlayerA.inc("First Serve Points")
      if (winner === 'Awon') {
        PlayerA.inc("First Serve Points Won")
      }
    }
    else {
      PlayerA.inc("Second Serve Points")
      if (winner === 'Awon') {
        PlayerA.inc("Second Serve Points Won")
      }
    }
  }
  else {
    if (fsin === 'servein') {
      PlayerB.inc("First Serve Points")
      if (winner === 'Bwon') {
        PlayerB.inc("First Serve Points Won")
      }
    }
    else {
      PlayerB.inc("Second Serve Points")
      if (winner === 'Bwon') {
        PlayerB.inc("Second Serve Points Won")
      }
    }

  }
  if (winner === 'Awon') {
    PlayerA.inc("Points")
    switch (event) {
      case 'ace': PlayerA.inc("Aces"); break;
      case 'df': PlayerB.inc("Double Faults"); break;
      case 'swinner': PlayerA.inc("Service Winners"); break;
      case 'fhw': PlayerA.inc("Forehand Winners"); break;
      case 'bhw': PlayerA.inc("Backhand Winners"); break;
      case 'nw': PlayerA.inc("Net Winners"); break;

    }
  } else if (winner === 'Bwon') {
    PlayerB.inc("Points")
    switch (event) {
      case 'ace': PlayerB.inc("Aces"); break;
      case 'df': PlayerA.inc("Double Faults"); break;
      case 'swinner': PlayerB.inc("Service Winners"); break;
      case 'fhw': PlayerB.inc("Forehand Winners"); break;
      case 'bhw': PlayerB.inc("Backhand Winners"); break;
      case 'nw': PlayerB.inc("Net Winners"); break;
    }
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
  var prevserver = server;

  if (isBreakPoint(server, match.getPoints(PlayerA), match.getPoints(PlayerB))) {
    if (server === "Player A") {
      PlayerB.inc("Break Points")

      if (winner === 'Bwon') {
        PlayerB.inc("Break Points Won")
      }
    }
    if (server === 'Player B') {
      PlayerA.inc("Break Points")
      if (winner === 'Awon') {
        PlayerA.inc("Break Points Won")
      }
    }
  }

  if (winner === 'Awon') {
    if (tiebreak === 7) {
      match.setPoints(PlayerA, match.getPoints(PlayerA) + 1)
      if (match.getPoints(PlayerA) >= 7 && match.getPoints(PlayerA) > match.getPoints(PlayerB) + 1) {
        match.setGames(PlayerA, match.getGames(PlayerA) + 1)
        match.addPrevSets(match.getGames(PlayerA) + '-' + match.getGames(PlayerB) + ' ' + '(' + match.getPoints(PlayerB) + ')')
        match.reset(true)
        tiebreak = 0
        if (server === tbserver) {
          toggleServer()
        }
      }
      if ((match.getPoints(PlayerA) + match.getPoints(PlayerB)) % 2 === 1) {
        toggleServer()
      }
    }
    else if (match.getPoints(PlayerA) === 40 && match.getPoints(PlayerB) === 'AD') {
      match.setPoints(PlayerB, 40)
    }
    else if (match.getPoints(PlayerA) === 40 && match.getPoints(PlayerB) === 40) {
      match.setPoints(PlayerA, 'AD')

    }
    else if (match.getPoints(PlayerA) === 40 || match.getPoints(PlayerA) === 'AD') {
      match.reset()
      match.setGames(PlayerA, match.getGames(PlayerA) + 1)
      toggleServer()
      PlayerA.inc("Games")
      if (match.getGames(PlayerA) === 6 && match.getGames(PlayerB) < 5 || match.getGames(PlayerA) === 7) {
        match.addPrevSets(match.getGames(PlayerA) + '-' + match.getGames(PlayerB))
        match.reset(true)

      }
      else if (match.getGames(PlayerA) === 6 && match.getGames(PlayerB) === 6) {
        tiebreak = 7
        tbserver = server;
      }
    }
    else {
      match.setPoints(PlayerA, gameScores[gameScores.indexOf(match.getPoints(PlayerA)) + 1])
    }
  }
  else if (winner === 'Bwon') {
    if (tiebreak === 7) {
      match.setPoints(PlayerB, match.getPoints(PlayerB) + 1)
      if (match.getPoints(PlayerB) >= 7 && match.getPoints(PlayerB) > match.getPoints(PlayerA) + 1) {
        match.setGames(PlayerB, match.getGames(PlayerB) + 1)
        match.addPrevSets(match.getGames(PlayerA) + '-' + match.getGames(PlayerB) + ' ' + '(' + match.getPoints(PlayerA) + ')')
        match.reset(true)
        tiebreak = 0
        if (server === tbserver) {
          toggleServer()
        }
      }
      if ((match.getPoints(PlayerA) + match.getPoints(PlayerB)) % 2 === 1) {
        toggleServer()
      }
    }
    else if (match.getPoints(PlayerB) === 40 && match.getPoints(PlayerA) === 'AD') {
      match.setPoints(PlayerA, 40)
    }
    else if (match.getPoints(PlayerB) === 40 && match.getPoints(PlayerA) === 40) {
      match.setPoints(PlayerB, 'AD')
    }
    else if (match.getPoints(PlayerB) === 40 || match.getPoints(PlayerB) === 'AD') {
      match.reset()
      PlayerB.inc("Games")
      match.setGames(PlayerB, match.getGames(PlayerB) + 1)
      toggleServer()
      if (match.getGames(PlayerB) === 6 && match.getGames(PlayerA) < 5 || match.getGames(PlayerB) === 7) {
        match.addPrevSets(match.getGames(PlayerA) + '-' + match.getGames(PlayerB))
        reset(true)
      }
      else if (match.getGames(PlayerB) === 6 && match.getGames(PlayerA) === 6) {
        tiebreak = 7
        tbserver = server;
      }
    } else {
      match.setPoints(PlayerB, gameScores[gameScores.indexOf(match.getPoints(PlayerB)) + 1])
    }
  }
  else {
    return
  }

  const selection = document.querySelector('input[name="howwon"]:checked').value;
  const servein = document.querySelector('input[name="serveIn"]:checked').value;

  div.textContent = makeScore();
  makePbp(winner, 0)
  makeStats(winner, selection, servein, prevserver)
}