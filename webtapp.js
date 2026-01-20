class GameStats {
  constructor(serverKey = 'A') {
    this.server = serverKey;
    this.pointsTotal = 0;
    this.pointsWon = 0;
    this.spointsLost = 0;
    this.aces = 0;
    this.doubleFaults = 0;
    this.serviceWinners = 0;
    this.forehandWinners = 0;
    this.backhandWinners = 0;
    this.forehandErrors = 0;
    this.backhandErrors = 0;
    this.netWinners = 0;
    this.netErrors = 0;
    this.netPoints = 0;
    this.netPointsWon = 0;
    this.firstServePoints = 0;
    this.firstServePointsWon = 0;
    this.secondServePoints = 0;
    this.secondServePointsWon = 0;
    this.breakPoints = 0;
    this.breakPointsWon = 0;
  }
}

class SetStats {
  constructor() {
    this.games = [];
    this.currentGame = {
      A: new GameStats('A'),
      B: new GameStats('A')
    };
    this.aces = 0;
    this.doubleFaults = 0;
    this.serviceWinners = 0;
    this.forehandWinners = 0;
    this.backhandWinners = 0;
    this.forehandErrors = 0;
    this.backhandErrors = 0;
    this.netWinners = 0;
    this.netErrors = 0;
    this.netPoints = 0;
    this.netPointsWon = 0;
    this.firstServePoints = 0;
    this.firstServePointsWon = 0;
    this.secondServePoints = 0;
    this.secondServePointsWon = 0;
    this.breakPoints = 0;
    this.breaks = 0;
    this.pointsWon = 0;
    this.gamesWon = 0;
    this.serviceGamesWon = 0;
    this.serviceGamesLost = 0;
    this.returnGamesWon = 0;
    this.returnGamesLost = 0;
    this.tiebreakAces = 0;
    this.tiebreakDoubleFaults = 0;
  }

  finishGame(winnerKey) {
    const gameSnapshot = {
      winner: winnerKey,
      A: this.currentGame.A,
      B: this.currentGame.B
    };
    this.games.push(gameSnapshot);
    this.currentGame = { A: new GameStats(), B: new GameStats() };
  }

  avgAcesPerServiceGame(playerKey) {
    const svcGames = this.games.filter(g => {
      const server = (g.A.server === 'A' || g.B.server === 'A') ? 'A' : 'B';
      return server === playerKey;
    });
    if (svcGames.length === 0) return '-';
    const total = svcGames.reduce((sum, g) => sum + g[playerKey].aces, 0);
    return (total / svcGames.length).toFixed(2);
  }

  serviceGamesLost(playerKey) {
    return this.games.filter(g => {
      const server = g.A.server;
      if (server !== playerKey) return false;
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

  startNewSet() {
    this.sets.push(this.currentSet);
    this.currentSet = new SetStats();
  }

  getStatFinishedOnly(statKey, setOnly = false) {
    let total = 0;

    for (const set of this.sets) {
      total += set[statKey] || 0;
    }
    if (setOnly) {
      return total
    }
    const current = this.currentSet;
    if (current && current.games && current.games.length > 0) {
      for (const g of current.games) {
        total += (g.A?.[statKey] || 0) + (g.B?.[statKey] || 0);
      }
    }

    return total;
  }


  getCompletedServiceGames() {
    let total = 0;

    for (const set of this.sets) {
      total += (set.serviceGamesWon || 0) + (set.serviceGamesLost || 0);
    }
    const current = this.currentSet;
    if (current) {
      total += (current.serviceGamesWon || 0) + (current.serviceGamesLost || 0);
    }
    return total;
  }

  getAcesFinishedGamesOnly() {
    const totalAces = this.getStatFinishedOnly('aces');
    const tbAces = this.getTiebreakAcesTotal();
    return Math.max(0, totalAces - tbAces);
  }

  getAcesCompletedSetsOnly() {
    const totalAces = this.getStatFinishedOnly('aces', true);
    const tbAces = this.sets.reduce((s, set) => s + (set.tiebreakAces || 0), 0);
    return Math.max(0, totalAces - tbAces);
  }

  getTiebreakAcesTotal() {
    let sum = 0;
    for (const set of this.sets) {
      sum += set.tiebreakAces || 0;
    }
    sum += this.currentSet?.tiebreakAces || 0;
    return sum;
  }

  getDoubleFaultsFinishedGamesOnly() {
    const total = this.getStatFinishedOnly('doubleFaults');
    const tb = this.getTiebreakDoubleFaultsTotal();
    return Math.max(0, total - tb);
  }

  getDoubleFaultsCompletedSetsOnly() {
    const total = this.getStatFinishedOnly('doubleFaults', true);
    const tb = this.sets.reduce((s, set) => s + (set.tiebreakDoubleFaults || 0), 0);
    return Math.max(0, total - tb);
  }

  getTiebreakDoubleFaultsTotal() {
    let sum = 0;
    for (const set of this.sets) {
      sum += set.tiebreakDoubleFaults || 0;
    }
    sum += this.currentSet?.tiebreakDoubleFaults || 0;
    return sum;
  }

  getPointsFinishedGamesOnly() {
    return this.getStatFinishedOnly('pointsTotal') / 2;
  }

  getPointsLostFinishedGamesOnly() {
    return this.getStatFinishedOnly('spointsLost');
  }

  getBreakPointsFinishedGamesOnly() {
    return this.getStatFinishedOnly('breakPoints');
  }

  getBreakPointsCompletedSetsOnly() {
    return this.getStatFinishedOnly('breakPoints', true);
  }

  getReturnRating(opponent) {
    const opp1stServePoints = opponent.getFirstServePoints();
    const opp1stServeWon = opponent.getFirstServePointsWon();
    const firstReturnPct = opp1stServePoints === 0 ? 0 :
      ((opp1stServePoints - opp1stServeWon) / opp1stServePoints) * 100;

    const opp2ndServePoints = opponent.getSecondServePoints();
    const opp2ndServeWon = opponent.getSecondServePointsWon();
    const secondReturnPct = opp2ndServePoints === 0 ? 0 :
      ((opp2ndServePoints - opp2ndServeWon) / opp2ndServePoints) * 100;

    const myBreakPoints = this.getBreakPoints();
    const myBreakPointsWon = this.getBreakPointsWon();
    const breakPct = myBreakPoints === 0 ? 0 :
      (myBreakPointsWon / myBreakPoints) * 100;

    const oppCompletedServiceGames = opponent.getCompletedServiceGames();
    const myReturnGamesWon = this.getTotalStats().returnGamesWon || 0;
    const returnGamesPct = oppCompletedServiceGames === 0 ? 0 :
      (myReturnGamesWon / oppCompletedServiceGames) * 100;

    const rating = firstReturnPct + secondReturnPct + breakPct + returnGamesPct;
    return Math.round(rating);
  }

  getServeRating(opponent) {
    const pointsServed = this.getPointsServed();
    const acePct = pointsServed === 0 ? 0 : (this.getAces() / pointsServed) * 100;

    const dfPct = pointsServed === 0 ? 0 : (this.getDoubleFaults() / pointsServed) * 100;

    const firstServePct = pointsServed === 0 ? 0 :
      (this.getFirstServePoints() / pointsServed) * 100;

    const first1stServePoints = this.getFirstServePoints();
    const firstServeWonPct = first1stServePoints === 0 ? 0 :
      (this.getFirstServePointsWon() / first1stServePoints) * 100;

    const second2ndServePoints = this.getSecondServePoints();
    const secondServeWonPct = second2ndServePoints === 0 ? 0 :
      (this.getSecondServePointsWon() / second2ndServePoints) * 100;

    const myCompletedServiceGames = this.getCompletedServiceGames();
    const myServiceGamesWon = this.getTotalStats().serviceGamesWon || 0;
    const serviceGamesPct = myCompletedServiceGames === 0 ? 0 :
      (myServiceGamesWon / myCompletedServiceGames) * 100;

    const oppBreakPoints = opponent.getBreakPoints();
    const oppBreakPointsWon = opponent.getBreakPointsWon();
    const breakPointsSavedPct = oppBreakPoints === 0 ? 0 :
      ((oppBreakPoints - oppBreakPointsWon) / oppBreakPoints) * 100;

    const rating = acePct - dfPct + firstServePct + firstServeWonPct +
      secondServeWonPct + serviceGamesPct + breakPointsSavedPct;
    return Math.round(rating);
  }


  inc(stat, options = {}) {
    const pKey = options.playerKey || 'A';
    const set = this.currentSet;
    switch (stat) {
      case "Games":
        set.gamesWon++;
        break;
      case "Points":
        set.pointsWon++;
        set.currentGame[pKey].pointsWon++;
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
      case "Net Errors":
        set.currentGame[pKey].netErrors++;
        set.netErrors++;
        break;
      case "Net Points Won":
        set.currentGame[pKey].netPointsWon++;
        set.netPointsWon++;
        break;
      case "Break Points":
        set.currentGame[pKey].breakPoints++;
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
      case "Forehand Errors":
        set.currentGame[pKey].forehandErrors++;
        set.forehandErrors++;
        break;

      case "Backhand Errors":
        set.currentGame[pKey].backhandErrors++;
        set.backhandErrors++;
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
        if (stat in set) set[stat]++;
    }
  }

  getTotalStats() {
    const total = new SetStats();
    for (const s of this.sets) {
      for (const k of Object.keys(s)) {
        if (typeof s[k] === 'number') total[k] = (total[k] || 0) + s[k];
      }
    }
    for (const k of Object.keys(this.currentSet)) {
      if (typeof this.currentSet[k] === 'number') total[k] = (total[k] || 0) + this.currentSet[k];
    }
    return total;
  }

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
  getWinners() {
    const stats = this.getTotalStats();
    return (
      (stats.aces || 0) +
      (stats.serviceWinners || 0) +
      (stats.forehandWinners || 0) +
      (stats.backhandWinners || 0) +
      (stats.netWinners || 0)
    );
  }
  getErrors() {
    const stats = this.getTotalStats();
    return (
      (stats.doubleFaults || 0) +
      (stats.netErrors || 0) +
      (stats.forehandErrors || 0) +
      (stats.backhandErrors || 0)
    );
  }

  getErrorPercent() {
    const totalPointsWon = this.getPointsWon();
    const totalPointsLost = match.getTotalPoints() - totalPointsWon;
    return percent(this.getErrors(), totalPointsLost);
  }
  getNetPointsWon() { return this.getTotalStats().netPointsWon || 0; }
  getPointsServed() {
    const stats = this.getTotalStats();
    return (stats.firstServePoints || 0) + (stats.secondServePoints || 0);
  }
  getServicePointsWon() {
    const stats = this.getTotalStats();
    return (stats.firstServePointsWon || 0) + (stats.secondServePointsWon || 0);
  }

  completedServiceGamesLost() {
    return this.sets.reduce((s, set) => s + set.serviceGamesLost, 0);
  }

  getPlayerRating() {
    const totalPoints = match.getTotalPoints();
    const pointsWon = this.getPointsWon();
    const oppKey = this === PlayerA ? 'B' : 'A';
    const opponent = match.getPlayer(oppKey);
    const myCompletedServiceGames = this.getCompletedServiceGames();
    const oppCompletedServiceGames = opponent.getCompletedServiceGames();

    const totalGames = match.getTotalGames();
    const gamesWon = this.getGamesWon();
    const gwp = pctOrBase(gamesWon, totalGames, 0.5);
    const t_points_won = pctOrBase(pointsWon, totalPoints, 0.5);

    const r_games_won = pctOrBase(
      this.getTotalStats().returnGamesWon || 0,
      oppCompletedServiceGames,
      0.2157
    );

    const oppPointsServed = opponent.getPointsServed();
    const oppServicePointsWon = opponent.getServicePointsWon();
    const r_points_won = pctOrBase(oppPointsServed - oppServicePointsWon, oppPointsServed, 0.3617);

    const oppAces = opponent.getAces();
    const oppServiceWinners = opponent.getTotalStats().serviceWinners || 0;
    const oppDoubleFaults = opponent.getDoubleFaults();

    let r_inplay_ptswon;
    if (oppPointsServed === 0) {
      r_inplay_ptswon = 0.3643;
    } else {
      const returnPointsWon = oppPointsServed - oppServicePointsWon;
      const inPlayWon = returnPointsWon - oppDoubleFaults;
      const inPlayTotal =
        oppPointsServed - oppAces - oppDoubleFaults - oppServiceWinners;
      r_inplay_ptswon = inPlayTotal <= 0 ? 0.3643 : inPlayWon / inPlayTotal;
    }

    const aces = this.getAces();
    const doubleFaults = this.getDoubleFaults();
    const serviceWinners = this.getTotalStats().serviceWinners || 0;
    const pointsServed = this.getPointsServed();
    const servicePointsWon = this.getServicePointsWon();

    let s_inplay_ptswon;
    if (pointsServed === 0) {
      s_inplay_ptswon = 0.6361; // default baseline
    } else {
      const inPlayWon = servicePointsWon - aces - serviceWinners;
      const inPlayTotal = pointsServed - aces - doubleFaults - serviceWinners;
      s_inplay_ptswon = inPlayTotal <= 0 ? 0.6361 : inPlayWon / inPlayTotal;
    }

    const serviceGamesWon = this.getTotalStats().serviceGamesWon || 0;
    const sg_wonp = pctOrBase(serviceGamesWon, myCompletedServiceGames, 0.7853);
    const s_points_won_p = pctOrBase(servicePointsWon, pointsServed, 0.6388);

    const oppSPointsLostFinished = opponent.getPointsLostFinishedGamesOnly();
    const pw_perrg = pctOrBase(oppSPointsLostFinished, oppCompletedServiceGames, 2.3580);

    const opp1stServePoints = opponent.getFirstServePoints();
    const opp1stServeWon = opponent.getFirstServePointsWon();
    const f_return_won_p = pctOrBase(opp1stServePoints - opp1stServeWon, opp1stServePoints, 0.2821);

    const opp2ndServePoints = opponent.getSecondServePoints();
    const opp2ndServeWon = opponent.getSecondServePointsWon();
    const s_return_won_p = pctOrBase(opp2ndServePoints - opp2ndServeWon, opp2ndServePoints, 0.4896);

    const fservePoints = this.getFirstServePoints();
    const fserveWon = this.getFirstServePointsWon();
    const fserve_won_p = pctOrBase(fserveWon, fservePoints, 0.7180);

    const sservePoints = this.getSecondServePoints();
    const sserveWon = this.getSecondServePointsWon();
    const sserve_won_p = pctOrBase(sserveWon, sservePoints, 0.5115);

    const myBreakPoints = this.getBreakPoints();
    const myBreakPointsWon = this.getBreakPointsWon();
    const bp_won_p = pctOrBase(myBreakPointsWon, myBreakPoints, 0);

    const oppBreakPoints = opponent.getBreakPoints();
    const oppBreakPointsWon = opponent.getBreakPointsWon();
    const bp_saved_p = pctOrBase(oppBreakPoints - oppBreakPointsWon, oppBreakPoints, 1);

    const pprg = getPointsPerReturnGameNumeric(this === PlayerA ? 'A' : 'B');

    const netPoints = this.getNetPoints();
    const netPointsWon = this.getNetPointsWon();
    const netwp = pctOrBase(netPointsWon, netPoints, 0.6294);
    const ace_p = pctOrBase(aces, pointsServed, 0);

    let rpsp_ratio;
    if (myCompletedServiceGames === 0 || oppCompletedServiceGames === 0) {
      rpsp_ratio = 1.0;
    } else {
      rpsp_ratio =
        pointsServed === 0 ? 1.0 : oppPointsServed / pointsServed;
    }

    const fserve_p = pctOrBase(fservePoints, pointsServed, 0.6208);
    const acesFinished = this.getAcesFinishedGamesOnly();
    const aces_psgame = pctOrBase(acesFinished, myCompletedServiceGames, 0);
    const netpp = pctOrBase(netPoints, totalPoints, 0);
    const winners = this.getWinners();
    const winner_p = pctOrBase(winners, pointsWon, 0);

    const totalPointsWon = this.getPointsWon();
    const totalPointsLost = totalPoints - totalPointsWon;
    const ue_p = totalPoints === 0 ? 0.2366 : pctOrBase(this.getErrors(), totalPointsLost, 0.2366);

    const pwnet = pctOrBase(this.getNetPointsWon(), pointsWon, 0.1443);
    const secondServePoints = this.getSecondServePoints();
    const df_pss = pctOrBase(doubleFaults, secondServePoints, 0);
    const df_p = pctOrBase(doubleFaults, pointsServed, 0);

    const playerKey = this === PlayerA ? 'A' : 'B';
    const finishedServiceGames = getFinishedServiceGames(playerKey);
    const pointsInFinishedServiceGames = finishedServiceGames.reduce((sum, g) => sum + (g[playerKey]?.pointsTotal || 0), 0);
    const ppsg = getPointsPerServiceGameNumeric(playerKey);

    const dfFinished = this.getDoubleFaultsFinishedGamesOnly();
    const df_psgame = pctOrBase(dfFinished, myCompletedServiceGames, 0);

    const oppBreakPointsFinished = opponent.getBreakPointsFinishedGamesOnly();
    const bp_persg = pctOrBase(oppBreakPointsFinished, myCompletedServiceGames, 0);

    const pointsLostFinished = this.getPointsLostFinishedGamesOnly();
    const pl_persg = myCompletedServiceGames === 0 ? 0 : pointsLostFinished / myCompletedServiceGames;
    let raw_sglps = getServiceGamesLostPerSet(this === PlayerA ? 'A' : 'B');
    const sglps =
      typeof raw_sglps !== "number" || isNaN(raw_sglps)
        ? 1.0163
        : raw_sglps;

    const sum = 4.7487 * ((t_points_won - 0.5002) / 0.0651) +
      4.7417 * ((gwp - 0.5005) / 0.1378) +
      3.8626 * ((r_games_won - 0.2157) / 0.1712) +
      3.7691 * ((r_points_won - 0.3617) / 0.0904) +
      3.6639 * ((r_inplay_ptswon - 0.3643) / 0.0887) +
      3.5316 * ((sg_wonp - 0.7853) / 0.1704) +
      3.4340 * ((s_inplay_ptswon - 0.6361) / 0.0890) +
      3.4236 * ((s_points_won_p - 0.6388) / 0.0907) +
      3.2814 * ((pw_perrg - 2.3580) / 0.7664) +
      3.0326 * ((f_return_won_p - 0.2821) / 0.1022) +
      2.8976 * ((s_return_won_p - 0.4896) / 0.1213) +
      2.7623 * ((fserve_won_p - 0.7180) / 0.1024) +
      2.5820 * ((sserve_won_p - 0.5115) / 0.1216) +
      2.3942 * ((bp_won_p - 0.3905) / 0.2678) +
      2.2642 * ((bp_saved_p - 0.6111) / 0.2673) +
      1.2452 * ((pprg - 6.4159) / 0.8684) +
      1.1194 * ((netwp - 0.6294) / 0.2021) +
      0.9477 * ((rpsp_ratio - 1.0191) / 0.2011) +
      0.8609 * ((ace_p - 0.0747) / 0.0599) +
      0.8559 * ((fserve_p - 0.6208) / 0.0739) +
      0.6701 * ((aces_psgame - 0.4663) / 0.3623)
      - 0.0917 * ((netpp - 0.1099) / 0.0577)
      - 0.2325 * ((winner_p - 0.3178) / 0.0951)
      - 0.4413 * ((ue_p - 0.2366) / 0.1098)
      - 0.4487 * ((pwnet - 0.1443) / 0.0792)
      - 0.7323 * ((df_pss - 0.0950) / 0.0727)
      - 0.9676 * ((df_p - 0.0366) / 0.0297)
      - 1.0607 * ((ppsg - 6.4133) / 0.8641)
      - 1.0622 * ((df_psgame - 0.2381) / 0.2006)
      - 2.5134 * ((bp_persg - 0.5503) / 0.3619)
      - 2.9682 * ((pl_persg - 2.3536) / 0.7640)
      - 3.6723 * ((sglps - 1.0163) / 0.7469);

    const sigmoided = 1 / (1 + Math.exp(-1 * (sum + 0.048) / 35));
    const scaled = 10 * sigmoided;

    console.log(`Player Rating Calculation for ${this.name}:`, {
      totalPoints,
      pointsWon,
      totalGames,
      gamesWon,
      myCompletedServiceGames,
      oppCompletedServiceGames,
      gwp,
      t_points_won,
      r_games_won,
      r_points_won,
      r_inplay_ptswon,
      s_inplay_ptswon,
      sg_wonp,
      s_points_won_p,
      pw_perrg,
      f_return_won_p,
      s_return_won_p,
      fserve_won_p,
      sserve_won_p,
      bp_won_p,
      bp_saved_p,
      pprg,
      netwp,
      rpsp_ratio,
      ace_p,
      fserve_p,
      acesFinished,
      aces_psgame,
      netpp,
      winners,
      winner_p,
      ue_p,
      pwnet,
      df_pss,
      df_p,
      pointsInFinishedServiceGames,
      ppsg,
      dfFinished,
      df_psgame,
      oppBreakPointsFinished,
      bp_persg,
      pointsLostFinished,
      pl_persg,
      raw_sglps,
      sglps,
      sum,
      sigmoided,
      scaled,
      finalRating: scaled.toFixed(2)
    });

    return scaled.toFixed(2);
  }
}

class Match {
  constructor(playerAName, playerBName, matchType, matchFormat) {
    this.players = { A: new Player(playerAName), B: new Player(playerBName) };
    this.matchType = matchType;     // "singles" or "doubles"
    this.matchFormat = matchFormat;
    this.aPoints = 0;
    this.bPoints = 0;
    this.aGames = 0;
    this.bGames = 0;
    this.tiebreak = false;
    this.prevSets = []; // textual summaries like "6-4"
    this.currentServer = 'A'; // 'A' or 'B'
    this.setStartTimes = [new Date()]; // time each set started
    this.setDurations = [];
    this.gameStartTimes = [new Date()]; // time each game started
    this.gameDurations = [];
    this.pointHistory = []; // array of {point, ratingA, ratingB} objects
  }

  getPlayer(key) {
    return this.players[key];
  }

  addPrevSets(scoreString) {
    this.prevSets.push(scoreString);
  }

  startNewGame(serverKey) {
    this.currentServer = serverKey;
    this.players.A.currentSet.currentGame.A.server = serverKey;
    this.players.A.currentSet.currentGame.B.server = serverKey;
    this.players.B.currentSet.currentGame.A.server = serverKey;
    this.players.B.currentSet.currentGame.B.server = serverKey;
  }

  finishGame(winnerKey) {
    const now = new Date();
    if (this.gameStartTimes.length > 0) {
      const lastStart = this.gameStartTimes[this.gameStartTimes.length - 1];
      const duration = now - lastStart; // define duration first
      this.gameDurations.push(duration);

      if (!this.completedGames) this.completedGames = [];
      this.completedGames.push({ duration, server: this.currentServer });
    }
    const serverKey = this.currentServer;

    this.players.A.currentSet.finishGame(winnerKey);
    this.players.B.currentSet.finishGame(winnerKey);

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

    this.aPoints = 0;
    this.bPoints = 0;

    const pbp = document.querySelector('.pbp');
    if (pbp) {
      pbp.textContent += '\n' + makeScore(false) + "\n";
    }

    if (
      (this.aGames >= 6 || this.bGames >= 6) &&
      Math.abs(this.aGames - this.bGames) >= 2
    ) {
      this.finishSet(`${this.aGames}-${this.bGames}`);
    } else if (this.aGames === 6 && this.bGames === 6) {
      this.tiebreakActive = true;
      this.tbServer = serverKey;
      if (typeof window !== "undefined") {
        window.tiebreak = 7;
        tiebreak = 7;
      }
    }
    this.toggleServer();
    this.gameStartTimes.push(new Date());
    this.startNewGame(this.currentServer);
    if (typeof window !== 'undefined' && typeof updateCurrentStatView === 'function') {
      updateCurrentStatView();
    }
  }


  finishSet(finalScoreString) {

    const now = new Date();
    if (this.setStartTimes.length > 0) {
      const lastStart = this.setStartTimes[this.setStartTimes.length - 1];
      this.setDurations.push(now - lastStart); // record duration in ms
    }

    const scoreStr = finalScoreString || `${this.aGames}-${this.bGames}`;
    this.players.A.startNewSet();
    this.players.B.startNewSet();
    this.prevSets.push(scoreStr);
    this.aGames = 0;
    this.bGames = 0;
    this.aPoints = 0;
    this.bPoints = 0;
    this.tiebreak = false;

    if (this.matchFormat === "3-super" && this.prevSets.length === 2) {
      this.tiebreakActive = true;
      this.tbServer = this.currentServer; // Use current server as tiebreak server
      if (typeof window !== "undefined") {
        window.tiebreak = 10;
        tiebreak = 10;
      }
    }

    this.setStartTimes.push(now);

    if (this.isMatchOver()) {
      this.finishMatch();
    }
  }

  finishMatch() {
    const serveInInputs = document.querySelectorAll('input[name="serveIn"]');
    serveInInputs.forEach(input => {
      input.disabled = true;
      input.checked = false;
    });

    const submitBtn = document.querySelector(".submitb");
    if (submitBtn) {
      submitBtn.textContent = "See Results";
      submitBtn.removeAttribute('onclick');
      submitBtn.disabled = false;

      submitBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window !== 'undefined' && typeof showMatchEndModal === 'function') {
          showMatchEndModal();
        }
      };
    }

    if (typeof window !== 'undefined' && typeof showMatchEndModal === 'function') {
      showMatchEndModal();
    }
  }

  getAverageSetTimeMinutes() {
    if (this.setDurations.length === 0) return '-';
    const avgMs = this.setDurations.reduce((a, b) => a + b, 0) / this.setDurations.length;
    return (avgMs / 60000).toFixed(1); // minutes
  }

  getAverageGameTimeMinutes() {
    if (this.gameDurations.length === 0) return '-';
    const avgMs = this.gameDurations.reduce((a, b) => a + b, 0) / this.gameDurations.length;
    return (avgMs / 60000).toFixed(1); // convert to minutes
  }

  getAverageServiceGameTimeMinutes(playerKey) {
    if (!this.completedGames || this.completedGames.length === 0) return '-';
    const serviceGames = this.completedGames.filter(g => g.server === playerKey);
    if (serviceGames.length === 0) return '-';
    const avgMs = serviceGames.reduce((sum, g) => sum + g.duration, 0) / serviceGames.length;
    return (avgMs / 60000).toFixed(1); // minutes
  }

  getSetsWon() {
    let setsWonA = 0;
    let setsWonB = 0;

    for (const setScore of this.prevSets) {
      const match = setScore.match(/^(\d+)-(\d+)/);
      if (match) {
        const aGames = parseInt(match[1]);
        const bGames = parseInt(match[2]);
        if (aGames > bGames) setsWonA++;
        else setsWonB++;
      }
    }

    return { A: setsWonA, B: setsWonB };
  }

  isMatchOver() {
    const { A: setsWonA, B: setsWonB } = this.getSetsWon();
    if (this.matchFormat === "1") {
      return setsWonA + setsWonB >= 1;
    } else if (this.matchFormat === "3" || this.matchFormat === "3-super") {
      return setsWonA >= 2 || setsWonB >= 2;
    }
    return false;
  }

  getMatchWinner() {
    const { A: setsWonA, B: setsWonB } = this.getSetsWon();
    if (setsWonA > setsWonB) return 'A';
    if (setsWonB > setsWonA) return 'B';
    return null;
  }

  toggleServer() {
    this.currentServer = (this.currentServer === 'A') ? 'B' : 'A';
    const serverElem = document.querySelector('.server');
    if (serverElem) {
      serverElem.textContent = 'Serving: ' + this.getPlayer(this.currentServer).name;
    }
  }

  getTotalPoints() { return this.players.A.getPointsWon() + this.players.B.getPointsWon(); }
  getTotalGames() { return this.players.A.getGamesWon() + this.players.B.getGamesWon(); }
}

function updateCurrentStatView() {
  switch (statmode) {
    case 'Total': totalbf(); break;
    case 'Overview': overviewbf(); break;
    case 'Wen': wenbf(); break;
    case 'Returning': returnbf(); break;
    case 'Adf': adfbf(); break;
    case 'Serving': servingbf(); break;
  }
}

function setActive(button) {
  document.querySelectorAll('.bmenubutton').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}
let match;
let PlayerA;
let PlayerB;

function updateRatings() {
  let ratingA = Number(PlayerA.getPlayerRating());
  let ratingB = Number(PlayerB.getPlayerRating());

  if (!isFinite(ratingA)) ratingA = 5;
  if (!isFinite(ratingB)) ratingB = 5;

  document.querySelectorAll(".RatingA").forEach(el => {
    el.textContent = `Rating: ${ratingA.toFixed(2)}`;
  });
  document.querySelectorAll(".RatingB").forEach(el => {
    el.textContent = `Rating: ${ratingB.toFixed(2)}`;
  });

  const total = ratingA + ratingB;
  const progressValue = total === 0 ? 0.5 : ratingA / total;

  const progressBar = document.querySelector(".progress progress");
  if (progressBar) progressBar.value = progressValue;

  return { ratingA, ratingB };
}

function pctOrBase(numerator, denominator, baseline = 0) {
  return denominator === 0 ? baseline : numerator / denominator;
}

let gameScores = [0, 15, 30, 40];
var statmode = 'Overview'

var tiebreak = 0;
var tbserver = '';
var startTime = new Date();

const pbp = document.querySelector('.pbp');
if (pbp && match) {
  pbp.textContent = match.currentServer === 'A' ? '0*-0\n' : '0-0*\n';
}


const dateDiv = document.querySelector('.date');
if (dateDiv) {
  dateDiv.textContent = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(new Date());
}

function serverWonPoint(winner, serverKey) {
  if (!serverKey) return false;
  if (winner === 'Awon' && serverKey === 'A') return true;
  if (winner === 'Bwon' && serverKey === 'B') return true;
  return false;
}

function updateHowWonOptions() {
  const winnerInput = document.querySelector('input[name="whowon"]:checked');
  const serveInInput = document.querySelector('input[name="serveIn"]:checked');

  const aceOption = document.querySelector('input[name="howwon"][value="ace"]');
  const swinnerOption = document.querySelector('input[name="howwon"][value="swinner"]');
  const dfOption = document.querySelector('input[name="howwon"][value="df"]');
  const nwOption = document.querySelector('input[name="howwon"][value="nw"]');
  const neOption = document.querySelector('input[name="howwon"][value="ne"]');
  const allHowWon = document.querySelectorAll('input[name="howwon"]');

  if (!winnerInput) {
    allHowWon.forEach(opt => {
      opt.checked = false;
      opt.disabled = true;
    });
    return;
  }

  allHowWon.forEach(opt => {
    opt.disabled = false;
  });

  [aceOption, swinnerOption, dfOption, nwOption, neOption].forEach(opt => {
    opt.disabled = false;
  });

  if (serveInInput && serveInInput.value === "servein") {
    dfOption.disabled = true;
    dfOption.checked = false;
  }

  if (winnerInput && serverWonPoint(winnerInput.value, match.currentServer)) {
    dfOption.disabled = true;
    dfOption.checked = false;
  }

  if (winnerInput && !serverWonPoint(winnerInput.value, match.currentServer)) {
    aceOption.disabled = true;
    swinnerOption.disabled = true;
    if (aceOption.checked) aceOption.checked = false;
    if (swinnerOption.checked) swinnerOption.checked = false;
  }

  const someoneAtNet =
    document.querySelector('input[name="whocame"][value="Acame"]').checked ||
    document.querySelector('input[name="whocame"][value="Bcame"]').checked;

  if (someoneAtNet) {
    [aceOption, dfOption, swinnerOption].forEach(opt => {
      opt.disabled = true;
      opt.checked = false;
    });
  }

  if (winnerInput) {
    const winnerAtNet =
      (winnerInput.value === "Awon" && document.querySelector('input[name="whocame"][value="Acame"]').checked) ||
      (winnerInput.value === "Bwon" && document.querySelector('input[name="whocame"][value="Bcame"]').checked);

    const loserAtNet =
      (winnerInput.value === "Awon" && document.querySelector('input[name="whocame"][value="Bcame"]').checked) ||
      (winnerInput.value === "Bwon" && document.querySelector('input[name="whocame"][value="Acame"]').checked);

    if (!winnerAtNet) {
      nwOption.disabled = true;
      nwOption.checked = false;
    }

    if (!loserAtNet) {
      neOption.disabled = true;
      neOption.checked = false;
    }
  }
}

document.querySelectorAll('input[name="serveIn"], input[name="whowon"], input[name="whocame"]').forEach(input => {
  input.addEventListener('change', updateHowWonOptions);
});

document.querySelectorAll('input[name="serveIn"]').forEach(input => {
  input.addEventListener('change', () => {
    document.querySelectorAll('input[name="whowon"]').forEach(r => r.disabled = false);
  });
});

document.querySelectorAll('input[name="whowon"]').forEach(input => {
  input.addEventListener('change', () => {
    document.querySelectorAll('input[name="whocame"]').forEach(c => c.disabled = false);
    updateHowWonOptions();
  });
});

document.querySelectorAll('input[name="howwon"]').forEach(input => {
  input.addEventListener('change', () => {
    const submitBtn = document.querySelector('.submitB');
    if (submitBtn) submitBtn.disabled = false;
  });
});



function resetPointInputs() {
  document.querySelectorAll('input[type="radio"]').forEach(r => {
    r.checked = false;
    r.disabled = (r.name !== "serveIn");
  });
  document.querySelectorAll('input[type="checkbox"]').forEach(c => {
    c.checked = false;
    c.disabled = true;
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

function getFinishedServiceGames(playerKey) {
  const player = match.getPlayer(playerKey);
  const games = [];
  const collect = (set) => {
    if (!set || !set.games) return;
    for (const g of set.games) {
      const server = (g.A && g.A.server) ? g.A.server : (g.B && g.B.server);
      if (server === playerKey) games.push(g);
    }
  };
  player.sets.forEach(collect);
  collect(player.currentSet);
  return games;
}

function pointsPerServiceGame(playerKey) {
  const games = getFinishedServiceGames(playerKey);
  if (games.length === 0) return '-';
  const totalPoints = games.reduce((sum, g) => sum + (g[playerKey]?.pointsTotal || 0), 0);
  return (totalPoints / games.length).toFixed(2);
}

function pointsPerReturnGame(playerKey) {
  const oppKey = playerKey === 'A' ? 'B' : 'A';
  const games = getFinishedServiceGames(oppKey);
  if (games.length === 0) return '-';
  const totalPoints = games.reduce((sum, g) => sum + (g[playerKey]?.pointsTotal || 0), 0);
  return (totalPoints / games.length).toFixed(2);
}

function getPointsPerServiceGameNumeric(playerKey) {
  const games = getFinishedServiceGames(playerKey);
  if (games.length === 0) return 6.4133;
  const totalPoints = games.reduce((sum, g) => sum + (g[playerKey]?.pointsTotal || 0), 0);
  return totalPoints / games.length;
}

function getPointsPerReturnGameNumeric(playerKey) {
  const oppKey = playerKey === 'A' ? 'B' : 'A';
  const games = getFinishedServiceGames(oppKey);
  if (games.length === 0) return 6.4159;
  const totalPoints = games.reduce((sum, g) => sum + (g[playerKey]?.pointsTotal || 0), 0);
  return totalPoints / games.length;
}

function doubleFaultsPerServiceGame(playerKey) {
  const games = getFinishedServiceGames(playerKey);
  if (games.length === 0) return '-';
  const total = games.reduce((sum, g) => sum + (g[playerKey]?.doubleFaults || 0), 0);
  return (total / games.length).toFixed(2);
}

function getServiceGamesLostPerSet(playerKey) {
  const player = match.getPlayer(playerKey);
  const totalSetsCompleted = match.prevSets.length; // only finished sets
  const serviceGamesLost = player.getTotalStats().serviceGamesLost || 0;
  return totalSetsCompleted === 0 ? '-' : (serviceGamesLost / totalSetsCompleted).toFixed(2);
}

function clearAllRows() {
  document.querySelectorAll('.tl1, .tm1, .tr1, .ml1, .mm1, .mr1, .bl1, .bm1, .br1, \
                             .tl2, .tm2, .tr2, .ml2, .mm2, .mr2, .bl2, .bm2, .br2, \
                             .tl3, .tm3, .tr3, .ml3, .mm3, .mr3, .bl3, .bm3, .br3, \
                             .tl4, .tm4, .tr4, .ml4, .mm4, .mr4, .bl4, .bm4, .br4, \
                             .tl5, .tm5, .tr5, .ml5, .mm5, .mr5, .bl5, .bm5, .br5, \
                             .tl6, .tm6, .tr6, .ml6, .mm6, .mr6, .tl7, .tm7, .tr7, .ml7, .mr7, .mm7')
    .forEach(cell => cell.textContent = '');
}

function totalbf() {
  clearAllRows()
  statmode = 'Total'
  changeTitles('Points', 'Games', 'Time')

  const eTime = new Date() - startTime;
  const totalPoints = match.getTotalPoints();
  const totalGames = match.getTotalGames();

  const pointTime = totalPoints === 0 ? '-' : ((eTime / 1000) / totalPoints).toFixed(1);
  const matchTime = formatTotalTime(eTime);

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

  const bottomRows = [
    { label: 'Avg. Point Time (Sec)', valueA: pointTime, valueB: pointTime },
    { label: 'Avg. Game Time (min)', valueA: match.getAverageGameTimeMinutes(), valueB: match.getAverageGameTimeMinutes() },
    {
      label: 'Avg. Service Game Time (min)',
      valueA: match.getAverageServiceGameTimeMinutes('A'),
      valueB: match.getAverageServiceGameTimeMinutes('B')
    },
    { label: 'Avg. Set Time (min)', valueA: match.getAverageSetTimeMinutes(), valueB: match.getAverageSetTimeMinutes() },
    { label: 'Match Time', valueA: matchTime, valueB: matchTime },
  ];

  bottomRows.forEach((r, i) => updateRow('b', i + 1, r.label, r.valueA, r.valueB));

}

function overviewbf() {
  clearAllRows()
  changeTitles('Serve', 'Return', 'Total')
  statmode = 'Overview'
  const eTime = new Date() - startTime;

  const rows = [
    { section: 't', label: 'Aces', valueA: () => PlayerA.getAces(), valueB: () => PlayerB.getAces() },
    { section: 't', label: 'Double Faults', valueA: () => PlayerA.getDoubleFaults(), valueB: () => PlayerB.getDoubleFaults() },
    { section: 't', label: '1st Serve %', valueA: () => percent(PlayerA.getFirstServePoints(), PlayerA.getPointsServed()), valueB: () => percent(PlayerB.getFirstServePoints(), PlayerB.getPointsServed()) },
    { section: 't', label: '1st Serve Won %', valueA: () => percent(PlayerA.getFirstServePointsWon(), PlayerA.getFirstServePoints()), valueB: () => percent(PlayerB.getFirstServePointsWon(), PlayerB.getFirstServePoints()) },
    { section: 't', label: '2nd Serve Won %', valueA: () => percent(PlayerA.getSecondServePointsWon(), PlayerA.getSecondServePoints()), valueB: () => percent(PlayerB.getSecondServePointsWon(), PlayerB.getSecondServePoints()) },
    { section: 't', label: 'Break Points', valueA: () => `${PlayerA.getBreakPointsWon()}/${PlayerA.getBreakPoints()}`, valueB: () => `${PlayerB.getBreakPointsWon()}/${PlayerB.getBreakPoints()}` },
    { section: 't', label: 'Service Points Won %', valueA: () => percent(PlayerA.getServicePointsWon(), PlayerA.getPointsServed()), valueB: () => percent(PlayerB.getServicePointsWon(), PlayerB.getPointsServed()) },

    { section: 'm', label: '1st Serve Return Won %', valueA: () => percent(PlayerB.getFirstServePoints() - PlayerB.getFirstServePointsWon(), PlayerB.getFirstServePoints()), valueB: () => percent(PlayerA.getFirstServePoints() - PlayerA.getFirstServePointsWon(), PlayerA.getFirstServePoints()) },
    { section: 'm', label: '2nd Serve Return Won %', valueA: () => percent(PlayerB.getSecondServePoints() - PlayerB.getSecondServePointsWon(), PlayerB.getSecondServePoints()), valueB: () => percent(PlayerA.getSecondServePoints() - PlayerA.getSecondServePointsWon(), PlayerA.getSecondServePoints()) },
    { section: 'm', label: 'Return Points Won %', valueA: () => percent(PlayerB.getPointsServed() - PlayerB.getServicePointsWon(), PlayerB.getPointsServed()), valueB: () => percent(PlayerA.getPointsServed() - PlayerA.getServicePointsWon(), PlayerA.getPointsServed()) },

    {
      section: 'b',
      label: 'Points Dominance',
      valueA: () => {
        if (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0) return '-';
        const Ahold = PlayerA.getServicePointsWon() / PlayerA.getPointsServed();
        const Bhold = PlayerB.getServicePointsWon() / PlayerB.getPointsServed();

        if (Ahold === 1 && Bhold === 1) return '-';
        if (Ahold === 1) return 'inf';
        if (Bhold === 1) return '0.00';

        const val = (1 - Bhold) / (1 - Ahold);
        return isNaN(val) ? '-' : val.toFixed(2);
      },
      valueB: () => {
        if (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0) return '-';
        const Ahold = PlayerA.getServicePointsWon() / PlayerA.getPointsServed();
        const Bhold = PlayerB.getServicePointsWon() / PlayerB.getPointsServed();

        if (Ahold === 1 && Bhold === 1) return '-';
        if (Bhold === 1) return 'inf';
        if (Ahold === 1) return '0.00';

        const val = (1 - Ahold) / (1 - Bhold);
        return isNaN(val) ? '-' : val.toFixed(2);
      }
    },
    { section: 'b', label: 'Total Points Won', valueA: () => PlayerA.getPointsWon(), valueB: () => PlayerB.getPointsWon() },
    { section: 'b', label: 'Match Time', valueA: () => formatTotalTime(eTime), valueB: () => formatTotalTime(eTime) }
  ];

  const counters = { t: 1, m: 1, b: 1 };

  rows.forEach((r) => {
    const i = counters[r.section]++;
    updateRow(r.section, i, r.label, r.valueA(), r.valueB());
  });
}

function servingbf() {
  clearAllRows()
  statmode = 'Serving'
  changeTitles('Serve', 'Points', 'Games')

  const rows = [
    {
      section: 't', label: '1st Serve %',
      valueA: () => percent(PlayerA.getFirstServePoints(), PlayerA.getPointsServed()),
      valueB: () => percent(PlayerB.getFirstServePoints(), PlayerB.getPointsServed())
    },
    {
      section: 't', label: '2nd Serve %',
      valueA: () => percent(
        PlayerA.getSecondServePoints() - PlayerA.getDoubleFaults(),
        PlayerA.getSecondServePoints()
      ),
      valueB: () => percent(
        PlayerB.getSecondServePoints() - PlayerB.getDoubleFaults(),
        PlayerB.getSecondServePoints()
      )
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
    {
      section: 't',
      label: '1st Serve Reliance',
      valueA: () => {
        const fsWinRate = safeDiv(PlayerA.getFirstServePointsWon(), PlayerA.getFirstServePoints());
        const ssWinRate = safeDiv(PlayerA.getSecondServePointsWon(), PlayerA.getSecondServePoints());
        return ssWinRate === 0 ? '-' : safeDiv(fsWinRate, ssWinRate).toFixed(2);
      },
      valueB: () => {
        const fsWinRate = safeDiv(PlayerB.getFirstServePointsWon(), PlayerB.getFirstServePoints());
        const ssWinRate = safeDiv(PlayerB.getSecondServePointsWon(), PlayerB.getSecondServePoints());
        return ssWinRate === 0 ? '-' : safeDiv(fsWinRate, ssWinRate).toFixed(2);
      }
    },
    { section: 't', label: 'Serve Rating', valueA: () => PlayerA.getServeRating(PlayerB), valueB: () => PlayerB.getServeRating(PlayerA) },

    {
      section: 'm', label: 'Service Points Won %',
      valueA: () => percent(PlayerA.getServicePointsWon(), PlayerA.getPointsServed()),
      valueB: () => percent(PlayerB.getServicePointsWon(), PlayerB.getPointsServed())
    },
    {
      section: 'm',
      label: 'Service In-Play Points Won',
      valueA: () => {
        const servicePointsWon = PlayerA.getServicePointsWon();
        const aces = PlayerA.getAces();
        const serviceWinners = PlayerA.getTotalStats().serviceWinners || 0;
        const inPlayWon = servicePointsWon - aces - serviceWinners;
        const pointsServed = PlayerA.getPointsServed();
        const doubleFaults = PlayerA.getDoubleFaults();
        const inPlayTotal = pointsServed - aces - doubleFaults - serviceWinners;
        return percent(inPlayWon, inPlayTotal);
      },
      valueB: () => {
        const servicePointsWon = PlayerB.getServicePointsWon();
        const aces = PlayerB.getAces();
        const serviceWinners = PlayerB.getTotalStats().serviceWinners || 0;
        const inPlayWon = servicePointsWon - aces - serviceWinners;
        const pointsServed = PlayerB.getPointsServed();
        const doubleFaults = PlayerB.getDoubleFaults();
        const inPlayTotal = pointsServed - aces - doubleFaults - serviceWinners;
        return percent(inPlayWon, inPlayTotal);
      }
    },
    {
      section: 'm',
      label: 'Points Per Service Game',
      valueA: () => pointsPerServiceGame('A'),
      valueB: () => pointsPerServiceGame('B')
    },
    {
      section: 'm',
      label: 'Points Lost per Service Game',
      valueA: () => ratio(PlayerA.getPointsLostFinishedGamesOnly(), PlayerA.getCompletedServiceGames()),
      valueB: () => ratio(PlayerB.getPointsLostFinishedGamesOnly(), PlayerB.getCompletedServiceGames())
    },
    { section: 'm', label: 'Break Points', valueA: () => `${PlayerA.getBreakPointsWon()}/${PlayerA.getBreakPoints()}`, valueB: () => `${PlayerB.getBreakPointsWon()}/${PlayerB.getBreakPoints()}` },
    {
      section: 'm',
      label: 'BPs Faced per Service Game',
      valueA: () => ratio(PlayerB.getBreakPointsFinishedGamesOnly(), PlayerA.getCompletedServiceGames()),
      valueB: () => ratio(PlayerA.getBreakPointsFinishedGamesOnly(), PlayerB.getCompletedServiceGames())
    },
    {
      section: 'm',
      label: 'BPs Faced per Set',
      valueA: () => {
        const completedSets = PlayerA.sets.length;
        const bpsFaced = PlayerB.getBreakPointsCompletedSetsOnly();
        return completedSets === 0 ? '-' : (bpsFaced / completedSets).toFixed(2);
      },
      valueB: () => {
        const completedSets = PlayerB.sets.length;
        const bpsFaced = PlayerA.getBreakPointsCompletedSetsOnly();
        return completedSets === 0 ? '-' : (bpsFaced / completedSets).toFixed(2);
      }
    },

    {
      section: 'b',
      label: 'Service Games Won %',
      valueA: () => {
        const total = PlayerA.getCompletedServiceGames();
        const won = PlayerA.getTotalStats().serviceGamesWon || 0;
        return percent(won, total);
      },
      valueB: () => {
        const total = PlayerB.getCompletedServiceGames();
        const won = PlayerB.getTotalStats().serviceGamesWon || 0;
        return percent(won, total);
      }
    },
    {
      section: 'b', label: 'Service Games Lost per Set',
      valueA: () => getServiceGamesLostPerSet('A'),
      valueB: () => getServiceGamesLostPerSet('B')
    },
  ];

  const counters = { t: 1, m: 1, b: 1 };

  rows.forEach((r) => {
    const i = counters[r.section]++;
    updateRow(r.section, i, r.label, r.valueA(), r.valueB());
  });
}

function returnbf() {
  clearAllRows()
  statmode = 'Returning';
  changeTitles("Return", "Points", "Games");

  const rows = [
    {
      section: 't', label: '1st Serve Return Won %',
      valueA: () => percent(PlayerB.getFirstServePoints() - PlayerB.getFirstServePointsWon(), PlayerB.getFirstServePoints()),
      valueB: () => percent(PlayerA.getFirstServePoints() - PlayerA.getFirstServePointsWon(), PlayerA.getFirstServePoints())
    },
    { section: 't', label: '2nd Serve Return Won %', valueA: () => percent(PlayerB.getSecondServePoints() - PlayerB.getSecondServePointsWon(), PlayerB.getSecondServePoints()), valueB: () => percent(PlayerA.getSecondServePoints() - PlayerA.getSecondServePointsWon(), PlayerA.getSecondServePoints()) },
    { section: 't', label: 'Return Rating', valueA: () => PlayerA.getReturnRating(PlayerB), valueB: () => PlayerB.getReturnRating(PlayerA) },

    {
      section: 'm', label: 'Return Points Won %',
      valueA: () => percent(PlayerB.getPointsServed() - PlayerB.getServicePointsWon(), PlayerB.getPointsServed()),
      valueB: () => percent(PlayerA.getPointsServed() - PlayerA.getServicePointsWon(), PlayerA.getPointsServed())
    },
    {
      section: 'm',
      label: 'Return In-Play Points Won',
      valueA: () => {
        const returnPointsWon = PlayerB.getPointsServed() - PlayerB.getServicePointsWon();
        const oppAces = PlayerB.getAces();
        const oppServiceWinners = PlayerB.getTotalStats().serviceWinners || 0;
        const oppDoubleFaults = PlayerB.getDoubleFaults();
        const inPlayWon = returnPointsWon - oppDoubleFaults;
        const returnPointsTotal = PlayerB.getPointsServed();
        const inPlayTotal = returnPointsTotal - oppAces - oppDoubleFaults - oppServiceWinners;
        return percent(inPlayWon, inPlayTotal);
      },
      valueB: () => {
        const returnPointsWon = PlayerA.getPointsServed() - PlayerA.getServicePointsWon();
        const oppAces = PlayerA.getAces();
        const oppDoubleFaults = PlayerA.getDoubleFaults();
        const oppServiceWinners = PlayerA.getTotalStats().serviceWinners || 0;
        const inPlayWon = returnPointsWon - oppDoubleFaults;
        const returnPointsTotal = PlayerA.getPointsServed();
        const inPlayTotal = returnPointsTotal - oppAces - oppDoubleFaults - oppServiceWinners;
        return percent(inPlayWon, inPlayTotal);
      }
    },
    {
      section: 'm',
      label: 'Points Per Return Game',
      valueA: () => pointsPerReturnGame('A'),
      valueB: () => pointsPerReturnGame('B')
    },
    {
      section: 'm',
      label: 'Points Won per Return Game',
      valueA: () => ratio(PlayerB.getPointsLostFinishedGamesOnly(), PlayerB.getCompletedServiceGames()),
      valueB: () => ratio(PlayerA.getPointsLostFinishedGamesOnly(), PlayerA.getCompletedServiceGames())
    },
    { section: 'm', label: 'Break Points', valueA: () => `${PlayerA.getBreakPointsWon()}/${PlayerA.getBreakPoints()}`, valueB: () => `${PlayerB.getBreakPointsWon()}/${PlayerB.getBreakPoints()}` },
    {
      section: 'm',
      label: 'BPs per Return Game',
      valueA: () => ratio(PlayerA.getBreakPointsFinishedGamesOnly(), PlayerB.getCompletedServiceGames()),
      valueB: () => ratio(PlayerB.getBreakPointsFinishedGamesOnly(), PlayerA.getCompletedServiceGames())
    },
    {
      section: 'm',
      label: 'BPs per Set',
      valueA: () => {
        const completedSets = PlayerA.sets.length;
        const bps = PlayerA.getBreakPointsCompletedSetsOnly();
        return completedSets === 0 ? '-' : (bps / completedSets).toFixed(2);
      },
      valueB: () => {
        const completedSets = PlayerB.sets.length;
        const bps = PlayerB.getBreakPointsCompletedSetsOnly();
        return completedSets === 0 ? '-' : (bps / completedSets).toFixed(2);
      }
    },

    {
      section: 'b',
      label: 'Return Games Won %',
      valueA: () => {
        const total = PlayerB.getCompletedServiceGames();
        const won = PlayerA.getTotalStats().returnGamesWon || 0;
        return percent(won, total);
      },
      valueB: () => {
        const total = PlayerA.getCompletedServiceGames();
        const won = PlayerB.getTotalStats().returnGamesWon || 0;
        return percent(won, total);
      }
    },
    { section: 'b', label: 'Return Games Won per Set', valueA: () => '-', valueB: () => '-' },
  ];

  const counters = { t: 1, m: 1, b: 1 };

  rows.forEach((r) => {
    const i = counters[r.section]++;
    updateRow(r.section, i, r.label, r.valueA(), r.valueB());
  });
}

function wenbf() {
  clearAllRows()
  statmode = 'Wen'
  changeTitles('Winners & Errors', 'Net', "Dominance")
  const rows = [
    {
      section: 't',
      label: 'Winner %',
      valueA: () => percent(PlayerA.getWinners(), PlayerA.getPointsWon()),
      valueB: () => percent(PlayerB.getWinners(), PlayerB.getPointsWon())
    },
    {
      section: 't',
      label: 'Error %',
      valueA: () => PlayerA.getErrorPercent(),
      valueB: () => PlayerB.getErrorPercent()
    },
    {
      section: 't',
      label: 'Winners per Error',
      valueA: () => ratio(PlayerA.getWinners(), PlayerA.getErrors()),
      valueB: () => ratio(PlayerB.getWinners(), PlayerB.getErrors())
    },
    {
      section: 't',
      label: 'Winners per Opp. Error',
      valueA: () => ratio(PlayerA.getWinners(), PlayerB.getErrors()),
      valueB: () => ratio(PlayerB.getWinners(), PlayerA.getErrors())
    },

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
    {
      section: 'm',
      label: 'Net Effectiveness',
      valueA: () => {
        const netWinRate = safeDiv(PlayerA.getNetPointsWon(), PlayerA.getNetPoints());
        const totalWinRate = safeDiv(PlayerA.getPointsWon(), match.getTotalPoints());
        return totalWinRate === 0 ? '-' : safeDiv(netWinRate, totalWinRate).toFixed(2);
      },
      valueB: () => {
        const netWinRate = safeDiv(PlayerB.getNetPointsWon(), PlayerB.getNetPoints());
        const totalWinRate = safeDiv(PlayerB.getPointsWon(), match.getTotalPoints());
        return totalWinRate === 0 ? '-' : safeDiv(netWinRate, totalWinRate).toFixed(2);
      }
    },

    {
      section: 'b',
      label: 'Points Dominance',
      valueA: () => {
        if (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0) return '-';
        const Ahold = PlayerA.getServicePointsWon() / PlayerA.getPointsServed();
        const Bhold = PlayerB.getServicePointsWon() / PlayerB.getPointsServed();

        if (Ahold === 1 && Bhold === 1) return '-';
        if (Ahold === 1) return 'inf';
        if (Bhold === 1) return '0.00';

        const val = (1 - Bhold) / (1 - Ahold);
        return isNaN(val) ? '-' : val.toFixed(2);
      },
      valueB: () => {
        if (PlayerA.getPointsServed() === 0 || PlayerB.getPointsServed() === 0) return '-';
        const Ahold = PlayerA.getServicePointsWon() / PlayerA.getPointsServed();
        const Bhold = PlayerB.getServicePointsWon() / PlayerB.getPointsServed();

        if (Ahold === 1 && Bhold === 1) return '-';
        if (Bhold === 1) return 'inf';
        if (Ahold === 1) return '0.00';

        const val = (1 - Ahold) / (1 - Bhold);
        return isNaN(val) ? '-' : val.toFixed(2);
      }
    },
    {
      section: 'b',
      label: 'Game Dominance',
      valueA: () => {
        const oppServiceGames = PlayerB.getCompletedServiceGames();
        const myReturnGamesWon = PlayerA.getTotalStats().returnGamesWon || 0;
        const returnGamesWonPct = oppServiceGames === 0 ? 0 : myReturnGamesWon / oppServiceGames;

        const myServiceGames = PlayerA.getCompletedServiceGames();
        const myServiceGamesLost = PlayerA.getTotalStats().serviceGamesLost || 0;
        const serviceGamesLostPct = myServiceGames === 0 ? 0 : myServiceGamesLost / myServiceGames;

        if (serviceGamesLostPct === 0) return returnGamesWonPct === 0 ? '-' : 'inf';
        return (returnGamesWonPct / serviceGamesLostPct).toFixed(2);
      },
      valueB: () => {
        const oppServiceGames = PlayerA.getCompletedServiceGames();
        const myReturnGamesWon = PlayerB.getTotalStats().returnGamesWon || 0;
        const returnGamesWonPct = oppServiceGames === 0 ? 0 : myReturnGamesWon / oppServiceGames;

        const myServiceGames = PlayerB.getCompletedServiceGames();
        const myServiceGamesLost = PlayerB.getTotalStats().serviceGamesLost || 0;
        const serviceGamesLostPct = myServiceGames === 0 ? 0 : myServiceGamesLost / myServiceGames;

        if (serviceGamesLostPct === 0) return returnGamesWonPct === 0 ? '-' : 'inf';
        return (returnGamesWonPct / serviceGamesLostPct).toFixed(2);
      }
    },
    {
      section: 'b', label: 'Dominance Ratio', valueA: () => {
        let pointsInGamesWon = 0;
        let totalPointsInGamesWon = 0;
        let pointsInGamesLost = 0;
        let totalPointsInGamesLost = 0;

        for (const set of PlayerA.sets.concat([PlayerA.currentSet])) {
          for (const game of set.games) {

            const totalPointsThisGame = Math.max(game.A.pointsTotal, game.B.pointsTotal);
            if (game.winner === 'A') {
              pointsInGamesWon += game.A.pointsWon;
              totalPointsInGamesWon += totalPointsThisGame;
            } else if (game.winner === 'B') {
              pointsInGamesLost += game.A.pointsWon;
              totalPointsInGamesLost += totalPointsThisGame;
            }
          }
        }

        const pointsWonInGamesWonPct =
          totalPointsInGamesWon === 0 ? 0 : (pointsInGamesWon / totalPointsInGamesWon) * 100;
        const pointsWonInGamesLostPct =
          totalPointsInGamesLost === 0 ? 0 : (pointsInGamesLost / totalPointsInGamesLost) * 100;

        return Math.round(pointsWonInGamesWonPct + pointsWonInGamesLostPct);
      }, valueB: () => {
        let pointsInGamesWon = 0;
        let totalPointsInGamesWon = 0;
        let pointsInGamesLost = 0;
        let totalPointsInGamesLost = 0;

        for (const set of PlayerB.sets.concat([PlayerB.currentSet])) {
          for (const game of set.games) {
            const totalPointsThisGame = Math.max(game.A.pointsTotal, game.B.pointsTotal);
            if (game.winner === 'B') {
              pointsInGamesWon += game.B.pointsWon;
              totalPointsInGamesWon += totalPointsThisGame;
            } else if (game.winner === 'A') {
              pointsInGamesLost += game.B.pointsWon;
              totalPointsInGamesLost += totalPointsThisGame;
            }
          }
        }
        const pointsWonInGamesWonPct =
          totalPointsInGamesWon === 0 ? 0 : (pointsInGamesWon / totalPointsInGamesWon) * 100;
        const pointsWonInGamesLostPct =
          totalPointsInGamesLost === 0 ? 0 : (pointsInGamesLost / totalPointsInGamesLost) * 100;

        return Math.round(pointsWonInGamesWonPct + pointsWonInGamesLostPct);
      }
    },
  ];

  const counters = { t: 1, m: 1, b: 1 };

  rows.forEach((r) => {
    const i = counters[r.section]++;
    updateRow(r.section, i, r.label, r.valueA(), r.valueB());
  });
}

function adfbf() {
  clearAllRows()
  statmode = 'Adf'
  changeTitles("Aces", "Double Faults", "Other")
  const rows = [
    { section: 't', label: 'Aces', valueA: () => PlayerA.getAces(), valueB: () => PlayerB.getAces() },
    { section: 't', label: 'Ace %', valueA: () => percent(PlayerA.getAces(), PlayerA.getPointsServed()), valueB: () => percent(PlayerB.getAces(), PlayerB.getPointsServed()) },
    {
      section: 't',
      label: 'Aces per Service Game',
      valueA: () => ratio(PlayerA.getAcesFinishedGamesOnly(), PlayerA.getCompletedServiceGames()),
      valueB: () => ratio(PlayerB.getAcesFinishedGamesOnly(), PlayerB.getCompletedServiceGames())
    },
    {
      section: 't',
      label: 'Aces per Set',
      valueA: () => {
        const completedSets = PlayerA.sets.length;
        const aces = PlayerA.getAcesCompletedSetsOnly();
        return completedSets === 0 ? '-' : (aces / completedSets).toFixed(2);
      },
      valueB: () => {
        const completedSets = PlayerB.sets.length;
        const aces = PlayerB.getAcesCompletedSetsOnly();
        return completedSets === 0 ? '-' : (aces / completedSets).toFixed(2);
      }
    },

    { section: 'm', label: 'Double Faults', valueA: () => PlayerA.getDoubleFaults(), valueB: () => PlayerB.getDoubleFaults() },
    { section: 'm', label: 'Double Fault %', valueA: () => percent(PlayerA.getDoubleFaults(), PlayerA.getPointsServed()), valueB: () => percent(PlayerB.getDoubleFaults(), PlayerB.getPointsServed()) },
    { section: 'm', label: 'DFs per 2nd Serve', valueA: () => safeDiv(PlayerA.getDoubleFaults(), PlayerA.getSecondServePoints()).toFixed(2), valueB: () => safeDiv(PlayerB.getDoubleFaults(), PlayerB.getSecondServePoints()).toFixed(2) },
    {
      section: 'm', label: 'DFs per Service Game',
      valueA: () => doubleFaultsPerServiceGame('A'),
      valueB: () => doubleFaultsPerServiceGame('B')
    },
    {
      section: 'm',
      label: 'DFs per Set',
      valueA: () => {
        const completedSets = PlayerA.sets.length;
        const dfs = PlayerA.getDoubleFaultsCompletedSetsOnly();
        return completedSets === 0 ? '-' : (dfs / completedSets).toFixed(2);
      },
      valueB: () => {
        const completedSets = PlayerB.sets.length;
        const dfs = PlayerB.getDoubleFaultsCompletedSetsOnly();
        return completedSets === 0 ? '-' : (dfs / completedSets).toFixed(2);
      }
    },

    { section: 'b', label: 'Ace/DF Ratio', valueA: () => ratio(PlayerA.getAces(), PlayerA.getDoubleFaults()), valueB: () => ratio(PlayerB.getAces(), PlayerB.getDoubleFaults()) }
  ];
  const counters = { t: 1, m: 1, b: 1 };

  rows.forEach((r) => {
    const i = counters[r.section]++;
    updateRow(r.section, i, r.label, r.valueA(), r.valueB());
  });
}

function makeScore(includePoints = true) {
  const { prevSets, aGames, bGames, aPoints, bPoints, currentServer } = match;
  const parts = [];

  if (prevSets.length > 0) {
    const formattedSets = prevSets.map(set =>
      set.replace(/\s*\(\s*(\d+)\s*\)/, "($1)")
    );
    parts.push(formattedSets.join(", "));
  }
  if (aGames > 0 || bGames > 0) {
    if (includePoints) {
      parts.push(`${aGames}-${bGames}`);
    } else {
      const serverStar =
        currentServer === "A"
          ? `${aGames}-${bGames}*`
          : `${aGames}*-${bGames}`;
      parts.push(serverStar);
    }
  }
  if (includePoints) {
    parts.push(`${aPoints}-${bPoints}`);
  }

  return parts.join(", ");
}


function makeStats(winner, event, fsin, ps) {
  const winnerKey = winner === 'Awon' ? 'A' : 'B';
  const loserKey = winnerKey === 'A' ? 'B' : 'A';
  const serverKey = ps;

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
  match.getPlayer('A').currentSet.currentGame.A.pointsTotal++;
  match.getPlayer('A').currentSet.currentGame.B.pointsTotal++;
  match.getPlayer('B').currentSet.currentGame.A.pointsTotal++;
  match.getPlayer('B').currentSet.currentGame.B.pointsTotal++;
  if (winnerKey !== serverKey) {
    match.getPlayer(serverKey).currentSet.currentGame[serverKey].spointsLost++;
  }

  switch (event) {
    case 'ace':
      match.getPlayer(serverKey).inc("Aces", { playerKey: serverKey });
      if (match.tiebreakActive || tiebreak === 7 || tiebreak === 10) {
        const player = match.getPlayer(serverKey);
        if (player && player.currentSet) {
          player.currentSet.tiebreakAces = (player.currentSet.tiebreakAces || 0) + 1;
        }
      }
      break;

    case 'df':
      match.getPlayer(serverKey).inc("Double Faults", { playerKey: serverKey });
      if (match.tiebreakActive || tiebreak === 7 || tiebreak === 10) {
        const player = match.getPlayer(serverKey);
        if (player && player.currentSet) {
          player.currentSet.tiebreakDoubleFaults = (player.currentSet.tiebreakDoubleFaults || 0) + 1;
        }
      }
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
    case 'fhe': // Forehand error
      match.getPlayer(loserKey).inc("Forehand Errors", { playerKey: loserKey });
      break;

    case 'bhe': // Backhand error
      match.getPlayer(loserKey).inc("Backhand Errors", { playerKey: loserKey });
      break;
    case 'nw':
      match.getPlayer(winnerKey).inc("Net Winners", { playerKey: winnerKey });
      break;
    case 'ne':
      match.getPlayer(loserKey).inc("Net Errors", { playerKey: loserKey });
      break;
  }

  updateCurrentStatView();
}

function makePbp(winner, event) {
  const pbp = document.querySelector('.pbp');
  const winnerKey = winner === 'Awon' ? 'A' : 'B';
  const loserKey = winnerKey === 'A' ? 'B' : 'A';
  const winnerName = match.getPlayer(winnerKey).name;
  const loserName = match.getPlayer(loserKey).name;

  let message = '';

  switch (event) {
    case 'ace':
      message = `${winnerName} hit an ace`;
      break;
    case 'df':
      message = `${loserName} double faulted`;
      break;
    case 'swinner':
      message = `${winnerName} hit a service winner`;
      break;
    case 'fhw':
      message = `${winnerName} hit a forehand winner`;
      break;
    case 'bhw':
      message = `${winnerName} hit a backhand winner`;
      break;
    case 'nw':
      message = `${winnerName} hit a net winner`;
      break;
    case 'fhe':
      message = `${loserName} made a forehand error`;
      break;
    case 'bhe':
      message = `${loserName} made a backhand error`;
      break;
    case 'ne':
      message = `${loserName} made a net error`;
      break;
    default:
      message = `${winnerName} won the point`;
  }

  pbp.textContent += message + '\n';
  return message;
}

function increment() {

  const submitBtn = document.querySelector(".submitB");
  submitBtn.disabled = true;

  const winner = getCheckedValue("whowon");
  const selection = getCheckedValue("howwon");
  const serveIn = getCheckedValue("serveIn");

  let pbpMessage = '';
  if (!winner || !selection || !serveIn) {
    console.warn("Missing radio selection (whowon / howwon / serveIn)");

  }
  else {
    document.querySelector(".score").textContent = makeScore();
    pbpMessage = makePbp(winner, selection);
  }

  const winnerKey = (winner === 'Awon') ? 'A' : 'B';
  const serverKey = match.currentServer; // 'A' or 'B'
  const isTiebreak = match.tiebreakActive === true || tiebreak === 7 || tiebreak === 10;

  if (!isTiebreak && isBreakPoint(serverKey, match.aPoints, match.bPoints)) {
    const returnerKey = serverKey === "A" ? "B" : "A";
    match.getPlayer(returnerKey).inc("Break Points", { playerKey: returnerKey });
    if (winnerKey === returnerKey) {
      match.getPlayer(returnerKey).inc("Break Points Won", { playerKey: returnerKey });
    }
  }
  makeStats(winner, selection, serveIn, match.currentServer);
  if (isTiebreak) {

    if (winnerKey === 'A') match.aPoints++;
    else match.bPoints++;

    const aPts = match.aPoints;
    const bPts = match.bPoints;

    const isThirdSet = (match.matchFormat === "3" || match.matchFormat === "3-super") && match.prevSets.length === 2;
    const isSuperTiebreakSet = match.matchFormat === "3-super" && isThirdSet;
    const tiebreakWinThreshold = isSuperTiebreakSet ? 10 : 7;

    if ((aPts >= tiebreakWinThreshold || bPts >= tiebreakWinThreshold) && Math.abs(aPts - bPts) > 1) {
      if (isSuperTiebreakSet) {
        const tbScore = `${aPts}-${bPts}`;
        match.finishSet(tbScore);
      } else {
        if (winnerKey === 'A') match.aGames++;
        else match.bGames++;
        const tbScore = `${aPts}-${bPts}`;
        const setScore = `${match.aGames}-${match.bGames} (${tbScore})`;
        match.finishSet(setScore);
      }
      match.aPoints = 0;
      match.bPoints = 0;
      match.tiebreakActive = false;
      tiebreak = 0;

      if (serverKey === match.tbServer) match.toggleServer();
    }
    if ((aPts + bPts) % 2 === 1) match.toggleServer();
    document.querySelector('.score').textContent = makeScore();
    const { ratingA, ratingB } = updateRatings();
    resetPointInputs();

    if (winner && selection && serveIn) {
      const pointDescription = pbpMessage || `${match.getPlayer(winnerKey).name} won the point`;
      const currentScore = makeScore();

      match.pointHistory.push({
        point: `${currentScore} - ${pointDescription}`,
        ratingA: isFinite(ratingA) ? ratingA.toFixed(2) : '5.00',
        ratingB: isFinite(ratingB) ? ratingB.toFixed(2) : '5.00'
      });
    }

    if (match.isMatchOver()) {
      match.finishMatch();
    }
    return;
  }

  let aPts = match.aPoints;
  let bPts = match.bPoints;

  if (winnerKey === 'A') {
    if (aPts === 40 && bPts === 'AD') match.bPoints = 40;
    else if (aPts === 40 && bPts === 40) match.aPoints = 'AD';
    else if (aPts === 40 || aPts === 'AD') match.finishGame('A');
    else match.aPoints = gameScores[gameScores.indexOf(aPts) + 1] || 40;
  } else {
    if (bPts === 40 && aPts === 'AD') match.aPoints = 40;
    else if (bPts === 40 && aPts === 40) match.bPoints = 'AD';
    else if (bPts === 40 || bPts === 'AD') match.finishGame('B');
    else match.bPoints = gameScores[gameScores.indexOf(bPts) + 1] || 40;
  }

  document.querySelector('.score').textContent = makeScore();
  resetPointInputs();
  const { ratingA, ratingB } = updateRatings();

  if (winner && selection && serveIn) {
    const pointDescription = pbpMessage || `${match.getPlayer(winnerKey).name} won the point`;
    const currentScore = makeScore();

    match.pointHistory.push({
      point: `${currentScore} - ${pointDescription}`,
      ratingA: isFinite(ratingA) ? ratingA.toFixed(2) : '5.00',
      ratingB: isFinite(ratingB) ? ratingB.toFixed(2) : '5.00'
    });
  }

  if (match.isMatchOver()) {
    match.finishMatch();
  }
}

function getCheckedValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : null;
}
const submitBtn = document.querySelector(".submitB");
if (submitBtn) {
  submitBtn.disabled = true;
}
if (typeof resetPointInputs === 'function') {
  resetPointInputs();
}

window.addEventListener("load", () => {
  const modal = document.getElementById("matchSetupModal");
  const startBtn = document.getElementById("startMatchBtn");
  updateNameLabelsForMatchType();

  const inputA = document.getElementById("playerAInput");
  const inputB = document.getElementById("playerBInput");

  if (inputA) {
    inputA.addEventListener("input", updateFirstServerButtonLabels);
  }
  if (inputB) {
    inputB.addEventListener("input", updateFirstServerButtonLabels);
  }

  startBtn.addEventListener("click", () => {
    const nameA = document.getElementById("playerAInput")?.value.trim();
    const nameB = document.getElementById("playerBInput")?.value.trim();

    const warning = document.getElementById("nameWarning");

    if (!nameA || !nameB) {
      warning.style.display = "block";
      return;
    }

    warning.style.display = "none";

    const matchType =
      document.querySelector("#matchTypeGroup .modal-toggle-btn.active").dataset.value;

    const matchFormat =
      document.querySelector("#matchFormatGroup .modal-toggle-btn.active").dataset.value;

    const firstServer =
      document.querySelector("#firstServerGroup .modal-toggle-btn.active").dataset.value;

    match = new Match(nameA, nameB, matchType, matchFormat);
    PlayerA = match.getPlayer('A');
    PlayerB = match.getPlayer('B');

    document.querySelectorAll(".PlayerA").forEach(el => el.textContent = nameA);
    document.querySelectorAll(".PlayerB").forEach(el => el.textContent = nameB);

    match.startNewGame(firstServer);
    const score = document.querySelector('.score');
    score.textContent = makeScore();
    pbp.textContent += match.currentServer === 'A' ? `${match.aGames}*-${match.bGames}\n` : `${match.aGames}-${match.bGames}*\n`;

    const serverElem = document.querySelector(".server");
    if (serverElem) {
      serverElem.textContent = "Serving: " + match.getPlayer(match.currentServer).name;
    }

    modal.style.display = "none";

    updateRatings();
  });
});

function updateFirstServerButtonLabels() {
  const matchType =
    document.querySelector("#matchTypeGroup .modal-toggle-btn.active")?.dataset.value || "singles";

  const inputA = document.getElementById("playerAInput");
  const inputB = document.getElementById("playerBInput");
  const firstServerButtons = document.querySelectorAll("#firstServerGroup .modal-toggle-btn");

  if (firstServerButtons.length >= 2) {
    const nameA = inputA?.value.trim() || "";
    const nameB = inputB?.value.trim() || "";

    if (matchType === "doubles") {
      firstServerButtons[0].textContent = nameA || "Team A";
      firstServerButtons[1].textContent = nameB || "Team B";
    } else {
      firstServerButtons[0].textContent = nameA || "Player A";
      firstServerButtons[1].textContent = nameB || "Player B";
    }
  }
}

function updateNameLabelsForMatchType() {
  const matchType =
    document.querySelector("#matchTypeGroup .modal-toggle-btn.active").dataset.value;

  const labelA = document.getElementById("nameLabelA");
  const labelB = document.getElementById("nameLabelB");
  const inputA = document.getElementById("playerAInput");
  const inputB = document.getElementById("playerBInput");

  if (matchType === "doubles") {
    labelA.textContent = "Team A Name:";
    labelB.textContent = "Team B Name:";
    inputA.placeholder = "Team A";
    inputB.placeholder = "Team B";
  } else {
    labelA.textContent = "Player A Name:";
    labelB.textContent = "Player B Name:";
    inputA.placeholder = "Player A";
    inputB.placeholder = "Player B";
  }

  updateFirstServerButtonLabels();
}

function setupToggleGroup(groupId) {
  const group = document.getElementById(groupId);
  const buttons = group.querySelectorAll(".modal-toggle-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (groupId === "matchTypeGroup") {
        updateNameLabelsForMatchType();
      }
    });
  });
}

function showMatchEndModal() {
  const modal = document.getElementById("matchEndModal");
  const finalScoreDiv = document.getElementById("finalScore");

  if (!modal || !finalScoreDiv || !match) return;

  const setScores = match.prevSets.length > 0 ? match.prevSets.join(", ") : "";
  const includeCurrent = !match.isMatchOver();
  const currentScore = includeCurrent ? `${match.aPoints}-${match.bPoints}` : "";
  const finalScore = currentScore
    ? (setScores ? `${setScores}, ${currentScore}` : currentScore)
    : setScores;

  const winner = match.getMatchWinner();
  const winnerName = winner ? match.getPlayer(winner).name : "Unknown";

  finalScoreDiv.innerHTML = `
    <div style="margin-bottom: 0.5rem; text-align: center; width: 100%; display: block;">${finalScore}</div>
    <div style="font-size: 1.2rem; color: #1e8449; margin-top: 0.5rem; text-align: center; width: 100%; display: block;">
      Winner: ${winnerName}
    </div>
  `;

  modal.style.display = "flex";

  const downloadBtn = document.getElementById("downloadStatsBtn");
  if (downloadBtn) {
    downloadBtn.onclick = () => {
      downloadMatchStatsCSV();
    };
  }

  const closeBtn = document.getElementById("closeMatchEndModal");
  if (closeBtn) {
    closeBtn.onclick = () => {
      closeMatchEndModal();
    };
  }
}

function closeMatchEndModal() {
  const modal = document.getElementById("matchEndModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function downloadMatchStatsCSV() {
  if (!match) return;

  const playerA = match.getPlayer('A');
  const playerB = match.getPlayer('B');
  const playerAName = playerA.name;
  const playerBName = playerB.name;

  const elapsedMs = new Date() - startTime;

  const totalPoints = match.getTotalPoints();
  const pointsWonA = playerA.getPointsWon();
  const pointsWonB = playerB.getPointsWon();
  const serviceWinnersA = playerA.getTotalStats().serviceWinners || 0;
  const serviceWinnersB = playerB.getTotalStats().serviceWinners || 0;
  const winnersA = playerA.getWinners();
  const winnersB = playerB.getWinners();
  const errorsA = playerA.getErrors();
  const errorsB = playerB.getErrors();
  const serveRatingA = playerA.getServeRating(playerB);
  const serveRatingB = playerB.getServeRating(playerA);
  const returnRatingA = playerA.getReturnRating(playerB);
  const returnRatingB = playerB.getReturnRating(playerA);
  const firstServeRelianceA = (() => {
    const fsWinRate = safeDiv(playerA.getFirstServePointsWon(), playerA.getFirstServePoints());
    const ssWinRate = safeDiv(playerA.getSecondServePointsWon(), playerA.getSecondServePoints());
    return ssWinRate === 0 ? '-' : (fsWinRate / ssWinRate).toFixed(2);
  })();
  const firstServeRelianceB = (() => {
    const fsWinRate = safeDiv(playerB.getFirstServePointsWon(), playerB.getFirstServePoints());
    const ssWinRate = safeDiv(playerB.getSecondServePointsWon(), playerB.getSecondServePoints());
    return ssWinRate === 0 ? '-' : (fsWinRate / ssWinRate).toFixed(2);
  })();
  const netEffectivenessA = (() => {
    const netWinRate = safeDiv(playerA.getNetPointsWon(), playerA.getNetPoints());
    const totalWinRate = safeDiv(playerA.getPointsWon(), totalPoints);
    return totalWinRate === 0 ? '-' : (netWinRate / totalWinRate).toFixed(2);
  })();
  const netEffectivenessB = (() => {
    const netWinRate = safeDiv(playerB.getNetPointsWon(), playerB.getNetPoints());
    const totalWinRate = safeDiv(playerB.getPointsWon(), totalPoints);
    return totalWinRate === 0 ? '-' : (netWinRate / totalWinRate).toFixed(2);
  })();
  const avgPointSeconds = totalPoints === 0 ? '-' : ((elapsedMs / 1000) / totalPoints).toFixed(1);
  const avgServiceGameTimeA = match.getAverageServiceGameTimeMinutes('A');
  const avgServiceGameTimeB = match.getAverageServiceGameTimeMinutes('B');

  // Build CSV content
  const csvRows = [
    ['Stats', playerAName, playerBName],
    ['Points Played', totalPoints, totalPoints],
    ['Points Won', pointsWonA, pointsWonB],
    ['', '', ''],
    ['Aces', playerA.getAces(), playerB.getAces()],
    ['Ace %', percent(playerA.getAces(), playerA.getPointsServed()), percent(playerB.getAces(), playerB.getPointsServed())],
    ['Service Winners', serviceWinnersA, serviceWinnersB],
    ['Double Faults', playerA.getDoubleFaults(), playerB.getDoubleFaults()],
    ['Double Fault %', percent(playerA.getDoubleFaults(), playerA.getPointsServed()), percent(playerB.getDoubleFaults(), playerB.getPointsServed())],
    ['1st Serve %', percent(playerA.getFirstServePoints(), playerA.getPointsServed()), percent(playerB.getFirstServePoints(), playerB.getPointsServed())],
    ['1st Serve Won %', percent(playerA.getFirstServePointsWon(), playerA.getFirstServePoints()), percent(playerB.getFirstServePointsWon(), playerB.getFirstServePoints())],
    ['2nd Serve %', percent(playerA.getSecondServePoints() - playerA.getDoubleFaults(), playerA.getSecondServePoints()), percent(playerB.getSecondServePoints() - playerB.getDoubleFaults(), playerB.getSecondServePoints())],
    ['2nd Serve Won %', percent(playerA.getSecondServePointsWon(), playerA.getSecondServePoints()), percent(playerB.getSecondServePointsWon(), playerB.getSecondServePoints())],
    ['Break Points', `${playerA.getBreakPointsWon()}/${playerA.getBreakPoints()}`, `${playerB.getBreakPointsWon()}/${playerB.getBreakPoints()}`],
    ['Service Points Won %', percent(playerA.getServicePointsWon(), playerA.getPointsServed()), percent(playerB.getServicePointsWon(), playerB.getPointsServed())],
    ['', '', ''],
    ['1st Serve Return Won %', percent(playerB.getFirstServePoints() - playerB.getFirstServePointsWon(), playerB.getFirstServePoints()), percent(playerA.getFirstServePoints() - playerA.getFirstServePointsWon(), playerA.getFirstServePoints())],
    ['2nd Serve Return Won %', percent(playerB.getSecondServePoints() - playerB.getSecondServePointsWon(), playerB.getSecondServePoints()), percent(playerA.getSecondServePoints() - playerA.getSecondServePointsWon(), playerA.getSecondServePoints())],
    ['Return Points Won %', percent(playerB.getPointsServed() - playerB.getServicePointsWon(), playerB.getPointsServed()), percent(playerA.getPointsServed() - playerA.getServicePointsWon(), playerA.getPointsServed())],
    ['', '', ''],
    ['Net Points %', percent(playerA.getNetPoints(), totalPoints), percent(playerB.getNetPoints(), totalPoints)],
    ['Net Points Won %', percent(playerA.getNetPointsWon(), playerA.getNetPoints()), percent(playerB.getNetPointsWon(), playerB.getNetPoints())],
    ['Points Won at Net %', percent(playerA.getNetPointsWon(), playerA.getPointsWon()), percent(playerB.getNetPointsWon(), playerB.getPointsWon())],
    ['', '', ''],
    ['Winners', winnersA, winnersB],
    ['Errors', errorsA, errorsB],
    ['Net Effectiveness', netEffectivenessA, netEffectivenessB],
    ['Serve Rating', serveRatingA, serveRatingB],
    ['Return Rating', returnRatingA, returnRatingB],
    ['1st Serve Reliance', firstServeRelianceA, firstServeRelianceB],
    ['', '', ''],
    ['Time on Court', formatTotalTime(elapsedMs), formatTotalTime(elapsedMs)],
    ['Average Point Time (sec)', avgPointSeconds, avgPointSeconds],
    ['Average Service Game Time (min)', avgServiceGameTimeA, avgServiceGameTimeB],
  ];

  csvRows.push(['', '', '']);
  csvRows.push(['Point', playerAName + ' Rating', playerBName + ' Rating']);

  match.pointHistory.forEach(pointData => {
    csvRows.push([pointData.point, pointData.ratingA, pointData.ratingB]);
  });

  const csvContent = csvRows.map(row =>
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${playerAName} v ${playerBName} - match_results.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

setupToggleGroup("matchTypeGroup");
setupToggleGroup("matchFormatGroup");
setupToggleGroup("firstServerGroup");