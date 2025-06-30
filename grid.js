let playerData, rankingsData, singlesData, doublesData, endgameData;

function fetchData(jsonFilePath) {
  return fetch(jsonFilePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${jsonFilePath}: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching JSON file:', error);
    });
}

const [playersPath, rankingsPath] = ['players.json', 'rankings.json'];
const [singlesPath, doublesPath] = ['singles.json', 'doubles.json'];
const endgamePath = 'endgame.json';

fetchData(playersPath)
  .then(playersJson => {
    playerData = playersJson;
    return fetchData(rankingsPath);
  })
  .then(rankingsJson => {
    rankingsData = rankingsJson;
    return fetchData(singlesPath);
  })
  .then(singlesJson => {
    singlesData = singlesJson;
    return fetchData(doublesPath);
  })
  .then(doublesJson => {
    doublesData = doublesJson;
    return fetchData(endgamePath);
  })
  .then(endgameJson => {
    endgameData = endgameJson;
    // At this point, all data is fetched and you can proceed!
    // e.g., init game logic, call a function, etc.
    console.log('All data loaded!');
  });

let buttonsUsed = [];
for (let i = 1; i <= 9; i++) {
  buttonsUsed.push('button' + i);
}

const europeanCountries = ['ALB', 'AND', 'ARM', 'AUT', 'AZE', 'BEL', 'BIH', 'BLR',
  'BUL', 'CYP', 'CZE', 'DEN', 'ESP', 'EST', 'FIN', 'FRA', 'GEO', 'GER', 'GRE',
  'HUN', 'IRL', 'ISL', 'ITA', 'KOS', 'LAT', 'LIE', 'LTU', 'LUX', 'MDA', 'MKD',
  'MLT', 'MNE', 'MON', 'NED', 'NOR', 'POL', 'POR', 'ROU', 'RUS', 'SMR', 'SRB',
  'SVK', 'SLO', 'ESP', 'SWE', 'SUI', 'TUR', 'UKR', 'GBR'
];

const southAmericanCountries = [
  'ARG', 'BOL', 'BRA', 'CHI', 'COL', 'ECU', 'FLK', 'GUF', 'GUY', 'PAR',
  'PER', 'SGS', 'SUR', 'URU', 'VEN'
];

const asianCountries = [
  'AFG', 'BHR', 'BGD', 'BRN', 'KHM', 'CHN', 'IND', 'IDN', 'IRQ', 'IRN', 'ISR',
  'JPN', 'JOR', 'KAZ', 'KWT', 'KGZ', 'LAO', 'LBN', 'MYS', 'MDV', 'MGL', 'MMR',
  'NPL', 'OMN', 'PAK', 'PSE', 'PHL', 'QAT', 'KOR', 'SAU', 'SGP', 'LKA', 'SYR',
  'TJK', 'THA', 'TLS', 'ARE', 'UZB', 'VNM', 'YEM'
];

let randomMode = false;
let bigCountries = { "From Australia": "AUS", "American": "USA", "From Spain": "ESP", "From France": "FRA", "From Great Britain": "GBR", }

let forbidden = {
  "Left Handed": [],
  "Born after 1995": ["Born before 1975", "5+ Slams"],
  "Born before 1975": ["Born after 1995", "Played in NextGen Finals"],
  "Not from Europe": ["From Europe", "From Spain", "From France", "From Great Britain"],
  "From Australia": ["From Asia", "From Europe", "From South America", "American", "From Spain", "From France", "From Great Britain", "Won Madrid Masters"],
  "From Asia": ["From Australia", "From Europe", "From South America", "American", "From Spain", "From France", "From Great Britain"],
  "From South America": ["From Australia", "From Asia", "From Europe", "American", "From Spain", "From France", "From Great Britain"],
  "American": ["From Australia", "From Asia", "From Europe", "From South America", "From Spain", "From France", "From Great Britain"],
  "From Europe": ["From Australia", "From Asia", "From South America", "American", "Not from Europe"],
  "From Spain": ["Above 6ft 4in (193 cm)", "From Australia", "From Asia", "From South America", "American", "Not from Europe", "From France", "From Great Britain"],
  "From France": ["From Australia", "From Asia", "From Spain", "From South America", "American", "Not from Europe", "From Great Britain"],
  "From Great Britain": ["From Australia", "From Spain", "From Asia", "From South America", "American", "Not from Europe", "From France"],
  "Won at least 20 titles": ["No titles", "Never Top 50 in Singles"],
  "No titles": ["Won at least 20 titles", "Wimbledon Champion", "US Open Champion", "Grand Slam Winner", "Won Rogers Cup", "Won Miami Open", "Unseeded Champion", "5+ Slams", "Title on All 3 Surfaces", "Won Madrid Masters", "Top 5 Singles Ranking", "AO Champion",
    "French Open Champion",
    "Won Monte-Carlo Masters",
    "Won Cincinnati",
    "Won Indian Wells",
    "Won Rome",
    "Won Shanghai Masters",
    "Won Paris Masters",
    "Olympic Medalist",
    "Played ATP Finals but no Masters title"],
  "Title on All 3 Surfaces": ["No titles", "Never Top 50 in Singles"],
  "Unseeded Champion": ["No titles"],
  "Grand Slam Winner": ["GS Finalist but no GS", "No titles", "Never Top 50 in Singles"],
  "5+ Slams": ["No titles", "Never Top 50 in Singles", "Born after 1995", "Played in NextGen Finals"],
  "GS Finalist but no GS": ["Grand Slam Winner", "5+ Slams", "Wimbledon Champion", "US Open Champion", "AO Champion", "French Open Champion"],
  "Wimbledon Champion": ["No titles", "GS Finalist but no GS", "Never Top 50 in Singles"],
  "US Open Champion": ["No titles", "GS Finalist but no GS", "Never Top 50 in Singles"],
  "AO Champion": ["No titles", "GS Finalist but no GS", "Never Top 50 in Singles"],
  "French Open Champion": ["No titles", "GS Finalist but no GS", "Never Top 50 in Singles"],
  "Top 5 Singles Ranking": ["Never Top 50 in Singles", "No Titles"],
  "Never Top 50 in Singles": ["Top 5 Singles Ranking", "Won at least 20 Titles", "Title on All 3 Surfaces", "5+ Slams", "Wimbledon Champion",
    "US Open Champion",
    "AO Champion",
    "French Open Champion", "Played ATP Finals but no Masters title"],
  "Olympic Medalist": [],
  "Played in Olympics": [],
  "Won Rogers Cup": ["No titles", "Never Top 50 in Singles", "Played ATP Finals but no Masters title"],
  "Won Miami Open": ["No titles", "Never Top 50 in Singles", "Played ATP Finals but no Masters title"],
  "Won Madrid Masters": ["No titles", "Never Top 50 in Singles", "Played ATP Finals but no Masters title", "From Australia"],
  "Won Monte-Carlo Masters": ["No titles", "Never Top 50 in Singles", "Played ATP Finals but no Masters title"],
  "Won Cincinnati": ["No titles", "Never Top 50 in Singles", "Played ATP Finals but no Masters title"],
  "Won Indian Wells": ["No titles", "Never Top 50 in Singles", "Played ATP Finals but no Masters title"],
  "Won Rome": ["No Titles", "Never Top 50 in Singles", "Played ATP Finals but no Masters title"],
  "Won Shanghai Masters": ["No titles", "Never Top 50 in Singles", "Played ATP Finals but no Masters title"],
  "Won Paris Masters": ["No titles", "Never Top 50 in Singles", "Played ATP Finals but no Masters title"],
  "Played in NextGen Finals": ["Born before 1975", "5+ Slams"],
  "Shorter than 6ft (183 cm)": ["Above 6ft 4in (193 cm)"],
  "Above 6ft 4in (193 cm)": ["Shorter than 6ft (183 cm)", "From Spain"],
  "Played ATP Finals but no Masters title": ["Won Madrid Masters",
    "Won Monte-Carlo Masters",
    "Won Cincinnati",
    "Won Indian Wells",
    "Won Rome",
    "Won Shanghai Masters",
    "Won Paris Masters",
    "Won Rogers Cup",
    "Won Miami Open",
    "Never Top 50 in Singles"]
};

const hints = {
  "Left Handed": [], "Born after 1995": [], "Born before 1975": [],
  "Not from Europe": [], "From Australia": [],
  "From Asia": ["From an Asian country. Russian and Turkish players are considered European."],
  "From South America": [],
  "American": ["From the United States of America"],
  "From Europe": ["From a European country. Russian and Turkish players are considered European."],
  "From Spain": [], "From France": [], "From Great Britain": [], "Won at least 20 titles": [],
  "No titles": [],
  "Title on All 3 Surfaces": ["At least title on hard, one on clay, and one on grass."],
  "Unseeded Champion": ["Player has at least once title they won without being seeded."],
  "Grand Slam Winner": [], "5+ Slams": [], "GS Finalist but no GS": [],
  "Wimbledon Champion": [], "US Open Champion": [], "AO Champion": [],
  "French Open Champion": [],
  "Top 5 Singles Ranking": ["Player has at least one week in the top 5 in singles."],
  "Never Top 50 in Singles": ["Player has never been ranked in the top 50 in singles"],
  "Olympic Medalist": [], "Played in Olympics": [], "Won Rogers Cup": [],
  "Won Miami Open": [], "Won Madrid Masters": [], "Won Monte-Carlo Masters": [],
  "Won Cincinnati": [], "Won Indian Wells": [], "Won Rome": [],
  "Won Shanghai Masters": [], "Won Paris Masters": [],
  "Played in NextGen Finals": [], "Shorter than 6ft (183 cm)": [],
  "Above 6ft 4in (193 cm)": [],
  "Played ATP Finals but no Masters title": ["Player has played at least one ATP finals match but has never won a Masters title."]
}

let [clicked, seen] = ['button1', []]

function openForm(b) {
  document.getElementById("email").value = "";
  clicked = b;
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function giveUp() {
  const tds = document.querySelectorAll('td.button');
  tds.forEach(td => {
    const button = td.querySelector('button');
    if (buttonsUsed.includes(td.id) && button) {
      button.disabled = true;
    }
  });
  closeForm();
  showResult()
  const giveUpBtn = document.getElementById("giveUp");
  giveUpBtn.textContent = "See Results";
  giveUpBtn.onclick = () => showResult();
}

function decGuesses() {
  const guessesLeftElement = document.querySelector('.guesses-left');
  let guessesLeft = parseInt(guessesLeftElement.textContent);
  guessesLeft--;
  guessesLeftElement.textContent = guessesLeft;
  if (guessesLeft === 0) {
    giveUp();
  }
}

function populateDatalist(arr) {
  const dataList = document.getElementById('emailSuggestions');

  while (dataList.firstChild) {
    dataList.removeChild(dataList.firstChild);
  }
  arr.forEach(item => {
    let option = document.createElement('option');
    option.value = item;
    dataList.appendChild(option);
  });
}

function nameMatch(player, fullName) {
  return player.name_first + ' ' + player.name_last === fullName;
}

function getCats(button) {
  const [cols, rows] = [['leftCol', 'midCol', 'rightCol'], ['topRow', 'midRow', 'bottomRow']];
  const num = button.replace('button', '');
  if (!num || num < 1 || num > 9) return ["Oh", "no"];
  return [cols[(num - 1) % 3], rows[Math.ceil(num / 3) - 1]];
}

function getPlayerIds(fullName) {
  return playerData.filter(player =>
    nameMatch(player, fullName)).map(player => player.player_id);
}

function suggestions() {
  const frag = document.getElementById("email").value;
  if (frag.length >= 4) {
    matches = getPlayerNames(frag).reverse();
    const topMatches = matches.slice(0, 12);
    populateDatalist(topMatches);
  }
}

function getPlayerNames(nameFrag) {
  const matches = [];
  playerData.forEach(player => {
    if ((player.name_first.toLowerCase() + ' ' + player.name_last.toLowerCase()).includes(nameFrag.toLowerCase())) {
      matches.push(player.name_first + ' ' + player.name_last);
    }
  });
  return matches;
}

function topFive(matches) {
  for (let i = 0; i < matches.length; i++) {
    const playerId = matches[i];
    if (rankingsData.some(rank => rank.player === playerId && rank.rank < 6)) {
      return true;
    }
  }
  return false;
}

function notTop50(matches) {
  for (let i = 0; i < matches.length; i++) {
    const playerId = matches[i];
    if (rankingsData.some(rank => rank.player === playerId && rank.rank < 51)) {
      return false;
    }
  }
  return true;
}

function wonSlam(name) {
  const matches = getPlayerIds(name);

  for (let i = 0; i < matches.length; i++) {
    const playerId = matches[i];

    if (
      singlesData.some(match =>
        match.tourney_level === 'G' &&
        match.winner_id === playerId &&
        match.round === 'F'
      ) ||
      doublesData.some(match =>
        match.tourney_level === 'G' &&
        (match.winner1_id === playerId || match.winner2_id === playerId) &&
        match.round === 'F'
      )
    ) {
      return true;
    }
  }
  return false;
}



function medaledInOlympics(matches) {
  for (let i = 0; i < matches.length; i++) {
    const playerId = matches[i];

    if (
      singlesData.some(match =>
        match.tourney_name.includes('Olympics') &&
        (
          (match.round === 'F' &&
            (match.winner_id === playerId || match.loser_id === playerId)) ||
          (match.round === 'BR' && match.winner_id === playerId)
        )
      ) ||
      doublesData.some(match =>
        match.tourney_name.includes('Olympics') &&
        (
          (match.round === 'F' &&
            (match.winner1_id === playerId ||
              match.winner2_id === playerId ||
              match.loser1_id === playerId ||
              match.loser2_id === playerId)) ||
          (match.round === 'BR' &&
            (match.winner1_id === playerId ||
              match.winner2_id === playerId))
        )
      )
    ) {
      return true;
    }
  }
  return false;
}

function twentyTitles(name) {
  const playerIds = getPlayerIds(name);

  for (let i = 0; i < playerIds.length; i++) {

    let titlesWon = 0;

    for (let j = 0; j < singlesData.length; j++) {
      if (singlesData[j].winner_id === playerIds[i] &&
        singlesData[j].round === 'F') {
        titlesWon++;
      }
    }

    for (let j = 0; j < doublesData.length; j++) {
      if ((doublesData[j].winner1_id === playerIds[i] ||
        doublesData[j].winner2_id === playerIds[i]) &&
        doublesData[j].round === 'F') {
        titlesWon++;
      }
    }

    if (titlesWon >= 20) {
      return true;
    }
  }
  return false;

}

function titleAllThree(name) {
  const playerIds = getPlayerIds(name);
  for (let i = 0; i < playerIds.length; i++) {

    let hardTitlesWon = 0;
    let clayTitlesWon = 0;
    let grassTitlesWon = 0;

    for (let j = 0; j < singlesData.length; j++) {
      if (singlesData[j].winner_id === playerIds[i] &&
        singlesData[j].round === 'F') {
        switch (singlesData[j].surface) {
          case "Hard":
            hardTitlesWon++;
            break;
          case "Clay":
            clayTitlesWon++;
            break;
          case "Grass":
            grassTitlesWon++;
            break;
        }
      }
    }

    for (let j = 0; j < doublesData.length; j++) {
      if ((doublesData[j].winner1_id === playerIds[i] ||
        doublesData[j].winner2_id === playerIds[i]) &&
        doublesData[j].round === 'F') {
        switch (doublesData[j].surface) {
          case "Hard":
            hardTitlesWon++;
            break;
          case "Clay":
            clayTitlesWon++;
            break;
          case "Grass":
            grassTitlesWon++;
            break;
        }
      }
    }
    if (hardTitlesWon > 0 && clayTitlesWon > 0 && grassTitlesWon > 0) {
      return true;
    }
  }
  return false;

}


function noTitlesWon(name) {
  const playerIds = getPlayerIds(name);
  for (let i = 0; i < playerIds.length; i++) {
    let titlesWon = 0;

    for (let j = 0; j < singlesData.length; j++) {
      if (singlesData[j].winner_id === playerIds[i] &&
        singlesData[j].round === 'F') {
        titlesWon++;
      }
    }

    for (let j = 0; j < doublesData.length; j++) {
      if ((doublesData[j].winner1_id === playerIds[i] ||
        doublesData[j].winner2_id === playerIds[i]) &&
        doublesData[j].round === 'F') {
        titlesWon++;
      }
    }

    if (titlesWon === 0) {
      return true;
    }
  }
  return false;

}



function fiveSlams(name) {
  const playerIds = getPlayerIds(name);

  for (let i = 0; i < playerIds.length; i++) {

    let slamsWon = 0;

    for (let j = 0; j < singlesData.length; j++) {
      if (singlesData[j].winner_id === playerIds[i] &&
        singlesData[j].tourney_level === 'G' &&
        singlesData[j].round === 'F') {
        slamsWon++;
      }
    }

    for (let j = 0; j < doublesData.length; j++) {
      if ((doublesData[j].winner1_id === playerIds[i] ||
        doublesData[j].winner2_id === playerIds[i]) &&
        doublesData[j].tourney_level === 'G' &&
        doublesData[j].round === 'F') {
        slamsWon++;
      }
    }
    if (slamsWon >= 5) {
      return true;
    }
  }
  return false;
}

function wonTournament(matches, tourneyName) {
  for (let i = 0; i < matches.length; i++) {
    const playerId = matches[i];
    if (
      singlesData.some(match =>
        match.tourney_name === tourneyName &&
        match.winner_id === playerId &&
        match.round === 'F'
      ) ||
      doublesData.some(match =>
        match.tourney_name === tourneyName &&
        (match.winner1_id === playerId || match.winner2_id === playerId) &&
        match.round === 'F'
      )
    ) {
      return true;
    }
  }
  return false;
}

function unseededTitle(matches) {
  for (let i = 0; i < matches.length; i++) {
    const playerId = matches[i];
    if (
      singlesData.some(match =>
        match.winner_seed === "" &&
        match.winner_id === playerId &&
        match.round === 'F'
      ) ||
      doublesData.some(match =>
        match.winner_seed === "" &&
        (match.winner1_id === playerId || match.winner2_id === playerId) &&
        match.round === 'F'
      )
    ) {
      return true;
    }
  }
  return false;
}

function nextGen(name) {
  const matches = getPlayerIds(name);
  for (let i = 0; i < matches.length; i++) {
    if (singlesData.some(match =>
      match.tourney_name === 'NextGen Finals' &&
      (match.winner_id === matches[i] || match.loser_id === matches[i])
    )) {
      return true;
    }
  }
  return false;
}

function tourFinals(name) {
  const matches = getPlayerIds(name);
  for (let i = 0; i < matches.length; i++) {
    if (singlesData.some(match =>
      match.tourney_name === 'Tour Finals' &&
      (match.winner_id === matches[i] || match.loser_id === matches[i])
    )) {
      return true;
    }
  }
  return false;
}

function inOlympics(name) {
  const matches = getPlayerIds(name);
  for (let i = 0; i < matches.length; i++) {
    if (singlesData.some(match =>
      match.tourney_name.includes("Olympics") &&
      (match.winner_id === matches[i] || match.loser_id === matches[i])
    )) {
      return true;
    }
  }
  for (let i = 0; i < matches.length; i++) {
    if (doublesData.some(match =>
      match.tourney_name.includes("Olympics") &&
      (match.winner1_id === matches[i] || match.winner2_id === matches[i] || match.loser1_id === matches[i] || match.loser2_id === matches[i])
    )) {
      return true;
    }
  }

  return false;

}

function young(fullName) {
  return playerData.some(player => {
    return nameMatch(player, fullName) && +player.dob.slice(0, 4) > 1995;
  });
}

function old(fullName) {
  return playerData.some(player => {
    return nameMatch(player, fullName) && +player.dob.slice(0, 4) < 1975;
  });
}

function lefty(fullName) {
  return playerData.some(player =>
    nameMatch(player, fullName) && player.hand === 'L');
}

function short(fullName) {
  return playerData.some(player =>
    nameMatch(player, fullName) && player.height < 183);
}

function tall(fullName) {
  return playerData.some(player =>
    nameMatch(player, fullName) && player.height > 194);
}

function isNotEuropean(fullName) {
  return playerData.some(player => {
    return (
      nameMatch(player, fullName) && !europeanCountries.includes(player.ioc));
  });
}

function isSouthAmerican(fullName) {
  return playerData.some(player => {
    return (
      nameMatch(player, fullName) && southAmericanCountries.includes(player.ioc));
  });
}

function isAsian(fullName) {
  return playerData.some(player => {
    return (nameMatch(player, fullName) && asianCountries.includes(player.ioc));
  })
}

function lostSlam(name) {
  const matches = getPlayerIds(name);

  for (let i = 0; i < matches.length; i++) {
    const playerId = matches[i];
    if (
      singlesData.some(match =>
        match.tourney_level === 'G' &&
        match.loser_id === playerId &&
        match.round === 'F'
      ) ||
      doublesData.some(match =>
        match.tourney_level === 'G' &&
        (match.loser1_id === playerId || match.loser2_id === playerId) &&
        match.round === 'F'
      )
    ) {
      return true;
    }
  }
  return false;
}

function checkCountry(fullName, countryCode) {
  return playerData.some(player =>
    nameMatch(player, fullName) && player.ioc === countryCode);
}

function verify(label, name, end = false) {
  const a = end ? label : document.getElementById(label).textContent;

  const matches = getPlayerIds(name);
  let res = false;

  if (a in bigCountries) {
    res = checkCountry(name, bigCountries[a]);
  } else {
    switch (a) {
      case "5+ Slams":
        res = fiveSlams(name); break;
      case "Unseeded Champion":
        res = unseededTitle(matches); break;
      case "Won at least 20 titles":
        res = twentyTitles(name); break;
      case "Left Handed":
        res = lefty(name); break;
      case "US Open Champion":
        res = wonTournament(matches, "US Open") || wonTournament(matches, "Us Open"); break;
      case "Wimbledon Champion":
        res = wonTournament(matches, "Wimbledon"); break;
      case "AO Champion":
        res = wonTournament(matches, "Australian Open"); break;
      case "French Open Champion":
        res = wonTournament(matches, "Roland Garros"); break;
      case "Olympic Medalist":
        res = medaledInOlympics(matches); break;
      case "Played in Olympics":
        res = inOlympics(name); break;
      case "Title on All 3 Surfaces":
        res = titleAllThree(name); break;
      case "No titles":
        res = noTitlesWon(name); break;
      case "Played in NextGen Finals":
        res = nextGen(name); break;
      case "Played ATP Finals but no Masters title":
        res = tourFinals(name) &&
          !(wonTournament(matches, "Miami Masters") ||
            wonTournament(matches, "Paris Masters") || wonTournament(matches, "Canada Masters") ||
            wonTournament(matches, "Shanghai Masters") || wonTournament(matches, "Rome Masters") ||
            wonTournament(matches, "Madrid Masters") || wonTournament(matches, "Monte Carlo Masters") ||
            wonTournament(matches, "Cincinnati Masters") || wonTournament(matches, "Indian Wells Masters"));
        break;
      case "Grand Slam Winner":
        res = wonSlam(name); break;
      case "GS Finalist but no GS":
        res = !wonSlam(name) && lostSlam(name); break;
      case "Top 5 Singles Ranking":
        res = topFive(matches); break;
      case "Never Top 50 in Singles":
        res = notTop50(matches); break;
      case "Not from Europe":
        res = isNotEuropean(name); break;
      case "From Europe":
        res = !isNotEuropean(name); break;
      case "From South America":
        res = isSouthAmerican(name); break;
      case "From Asia":
        res = isAsian(name); break;
      case "Shorter than 6ft (183 cm)":
        res = short(name); break;
      case "Above 6ft 4in (193 cm)":
        res = tall(name); break;
      case "Born before 1975":
        res = old(name); break;
      case "Born after 1995":
        res = young(name); break;
      case "Won Miami Open":
        res = wonTournament(matches, "Miami Masters"); break;
      case "Won Madrid Masters":
        res = wonTournament(matches, "Madrid Masters"); break;
      case "Won Rome":
        res = wonTournament(matches, "Rome Masters"); break;
      case "Won Shanghai Masters":
        res = wonTournament(matches, "Shanghai Masters"); break;
      case "Won Paris Masters":
        res = wonTournament(matches, "Paris Masters"); break;
      case "Won Cincinnati":
        res = wonTournament(matches, "Cincinnati Masters"); break;
      case "Won Monte-Carlo Masters":
        res = wonTournament(matches, "Monte Carlo Masters"); break;
      case "Won Indian Wells":
        res = wonTournament(matches, "Indian Wells Masters"); break;
      case "Won Rogers Cup":
        res = wonTournament(matches, "Canada Masters"); break;
      default:
        if (!end) alert("Not implemented"); // Only alert if not in end mode
        return false;
    }
  }

  // Only alert if not in end mode and the result is false
  if (!res && !end) alert("Incorrect - " + a);

  return res;
}

function submit() {
  buttonCats = getCats(clicked)
  const player = document.getElementById('email').value;
  const name = player.trim();
  matches = getPlayerIds(name)

  if (getPlayerIds(name).length == 0) {
    alert("Player does not exist!");
  } else if (seen.includes(name)) {
    alert("You have already used this name!");
  } else {
    if (verify(buttonCats[0], name) && verify(buttonCats[1], name)) {
      document.getElementById(clicked).textContent = player;
      document.getElementById(clicked).style.backgroundColor = "rgba(154, 205, 50, 0.8)";
      buttonsUsed = buttonsUsed.filter(button => button !== 'clicked');
      seen.push(name);
    }
    decGuesses();
  }
  closeForm()
}

function keys(map) {
  let keysArr = [];
  for (let key in map) {
    keysArr.push(key);
  }
  return keysArr;
}

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  return `${yyyy}-${mm}-${dd}`;
}

const cyrb53 = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

function setCategories() {
  let cats = [];
  let date = getTodayDate();

  let datehash = cyrb53(date).toString();
  if (randomMode) {
    let randomNum = '';
    for (let i = 0; i < 12; i++) {
      randomNum += Math.floor(Math.random() * 10);
    }
    datehash = randomNum;
  }
  let flattenedCategories = keys(forbidden);
  const rowParts = [
    parseInt(datehash.substring(0, 3)) % flattenedCategories.length,
    parseInt(datehash.substring(3, 6)) % flattenedCategories.length,
    parseInt(datehash.substring(6, 9)) % flattenedCategories.length
  ];

  if (rowParts[1] === rowParts[0]) {
    rowParts[1] = (rowParts[1] + 1) % flattenedCategories.length;
  }

  if (rowParts[2] === rowParts[0]) {
    rowParts[2] = (rowParts[2] + 1) % flattenedCategories.length;
  }

  if (rowParts[2] === rowParts[1]) {
    rowParts[2] = (rowParts[2] + 1) % flattenedCategories.length;
  }

  for (let i = 0; i < 3; i++) {
    cats.push(flattenedCategories[rowParts[i]]);
  }

  const td = document.getElementById('leftCol');
  td.textContent = cats[0];
  const td2 = document.getElementById('midCol');
  td2.textContent = cats[1];
  const td3 = document.getElementById('rightCol');
  td3.textContent = cats[2];

  let noDups = flattenedCategories.filter(cat => {
    return !cats.includes(cat)
  });

  let trimmedCategories = noDups.filter(cat => {
    for (let key in cats) {
      if (forbidden[cats[key]].includes(cat)) {
        return false;
      }
    }
    return true;
  })

  let colHash = cyrb53(date.split("").reverse().join("")).toString();
  if (randomMode) {
    let randomNum = '';
    for (let i = 0; i < 12; i++) {
      randomNum += Math.floor(Math.random() * 10);
    }
    colHash = randomNum;
  }
  const colParts = [
    parseInt(colHash.substring(0, 3)) % trimmedCategories.length,
    parseInt(colHash.substring(3, 6)) % trimmedCategories.length,
    parseInt(colHash.substring(6, 9)) % trimmedCategories.length
  ];

  if (colParts[1] === colParts[0]) {
    colParts[1] = (colParts[1] + 1) % trimmedCategories.length;
  }
  if (colParts[2] === colParts[0]) {
    colParts[2] = (colParts[2] + 1) % trimmedCategories.length;
  }
  if (colParts[2] === colParts[1]) {
    colParts[2] = (colParts[2] + 1) % trimmedCategories.length;
  }

  for (let i = 0; i < 3; i++) {
    cats.push(trimmedCategories[colParts[i]]);
  }
  const td4 = document.getElementById('topRow');
  td4.textContent = cats[3];
  const td5 = document.getElementById('midRow');
  td5.textContent = cats[4];
  const td6 = document.getElementById('bottomRow');
  td6.textContent = cats[5];

  updateCategoryHints();
}
setCategories();

function updateCategoryHints() {
  const ids = ['leftCol', 'midCol', 'rightCol', 'topRow', 'midRow', 'bottomRow'];

  ids.forEach(id => {
    const elem = document.getElementById(id);
    const cat = elem.textContent;
    const hint = hints[cat] && hints[cat].length > 0 ? hints[cat][0] : '';
    elem.title = hint;
  });
}


function getScore() {
  let score = 0;
  for (let i = 1; i <= 9; i++) {
    const button = document.getElementById('button' + i);
    if (button && button.style.backgroundColor === "rgba(154, 205, 50, 0.8)") {
      score++;
    }
  }
  return score;
}

function getDaysBetweenDates(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffInMs = d2 - d1; // milliseconds
  const msInDay = 1000 * 60 * 60 * 24;
  return Math.round(diffInMs / msInDay);
}

function showResult() {
  const { header, copy, footer } = getEndMessage();

  const fullMessage = header + copy;
  const html = fullMessage
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
    .replace(/(https:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>');

  document.getElementById('resultText').innerHTML = html + footer;
  document.getElementById('resultPopup').dataset.copy = copy;  // If you want full footer in copy, do copy + footer
  document.getElementById('resultPopup').style.display = 'flex';
}


function closeResult() {
  document.getElementById('resultPopup').style.display = 'none';
}

function copyResult() {
  const copy = document.getElementById('resultPopup').dataset.copy;
  navigator.clipboard.writeText(copy).then(() => {
    const status = document.getElementById('copyStatus');
    status.textContent = "Copied!";
    setTimeout(() => {
      status.textContent = "";
    }, 2000); // Clear after 2 seconds
  });
}

function getCategoriesGrid() {
  return {
    rows: [
      document.getElementById('topRow').textContent,
      document.getElementById('midRow').textContent,
      document.getElementById('bottomRow').textContent,
    ],
    cols: [
      document.getElementById('leftCol').textContent,
      document.getElementById('midCol').textContent,
      document.getElementById('rightCol').textContent,
    ]
  };
}

function getPlayersPerCategoryWithVerify(categories) {
  const result = {};
  for (const cat of categories) {
    result[cat] = new Set(
      endgameData
        .filter(entry => verify(cat, entry.name, true))
        .map(entry => entry.name)
    );
  }
  return result;
}


function getEndMessage() {
  const score = getScore();
  const header =
    `You ${score === 9 ? "win!" : "lose."}\nCopy the below message to share your results with your friends!\n\n`;

  let copy = `Tennis Grid #${getDaysBetweenDates('2025-06-16', getTodayDate())}: ${score}/9\n`;
  for (let i = 1; i <= 9; i++) {
    const button = document.getElementById('button' + i);
    const isCorrect = button && button.style.backgroundColor === "rgba(154, 205, 50, 0.8)";
    copy += isCorrect ? "🎾" : "❌";
    if (i % 3 === 0) copy += "\n";
  }
  copy += "\nPlay here: https://simsaidan.github.io/grid.html\n\n";

  const categories = [...getCategoriesGrid().rows, ...getCategoriesGrid().cols];
  const playersPerCategory = getPlayersPerCategoryWithVerify(categories);  // returns Set per cat
  const grid = getCategoriesGrid();

  let footer = "<table style='border-collapse:collapse;text-align:center;font-size:small;'>";
  footer += "<tr><th style='padding:2px; border:1px solid #ccc;'></th>";
  grid.cols.forEach(col => {
    footer += `<th style='padding:2px; border:1px solid #ccc;'>${col}</th>`;
  });
  footer += "</tr>";

  for (let row = 0; row < 3; row++) {
    footer += `<tr><td style='padding:2px; border:1px solid #ccc;'>${grid.rows[row]}</td>`;
    for (let col = 0; col < 3; col++) {
      const rowSet = playersPerCategory[grid.rows[row]];
      const colSet = playersPerCategory[grid.cols[col]];
      const intersection = [];
      for (const name of rowSet) {
        if (colSet.has(name)) {
          intersection.push(name);
          if (intersection.length === 4) break;
        }
      }
      footer += `<td style='padding:2px; line-height:1; border:1px solid #ccc;'>${intersection.join(", ") || "-"}</td>`;
    }
    footer += "</tr>";
  }
  footer += "</table>";

  return { header, copy, footer };
}

function precomputeCategoryPlayers(categories, players) {
  console.log("players:", players);
  console.log("typeof players:", typeof players);

  const result = {};
  for (const cat of categories) {
    result[cat] = [];
    for (const player of players) {
      if (verify(cat, player.name, true)) {
        result[cat].push(player.name);
      }
    }
  }
  return result;
}

// Example usage:
const allCategories = Object.keys(forbidden);  // or a trimmed list if you want
const precomputed = precomputeCategoryPlayers(allCategories, endgameData);

// Convert to JSON string:
const json = JSON.stringify(precomputed);

// You could log this, or copy/paste it into a file, or download as file:
console.log(json);



const heading = document.getElementById('Grid Number');

heading.textContent = "Tennis Grid #" + getDaysBetweenDates('2025-06-16',
  getTodayDate());
let info = "Tennis Grid is a game where the goal is to find 9 players that fit the row and column categories displayed around the grid. To make a guess, click an empty square and start typing a player's full name. Once you've entered a name, click Enter to submit it. If the name satisfies both the associated row and column categories for that square, it will turn green. If not, you'll get an alert about which category was not satisfied. Keep figuring out the identities by referring to the paired row and column categories, satisfying all 9 squares correctly before you run out of guesses to win."
let info2 = "Matches are only men's singles and men's doubles matches. Singles matches and rankings range from 1968 to end of 2024. Doubles matches are from 2000 to March 2020. Players are valid if they are male and have played a match at any level (ATP, Challenger, Futures)."
let info3 = `Data Source: Player and match data provided by <a href="https://github.com/JeffSackmann/tennis_atp" target="_blank">Jeff Sackmann</a> under the <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">CC BY-NC-SA 4.0 License</a>. Adapted and used with modifications. This project is non-commercial and distributed under the same license.`;

function showIntro() {
  const intro = "Welcome to Tennis Grid!\n\n" + info + "\n\n" + info2 + "\n\n" + info3;
  document.getElementById('introText').innerHTML = intro.replace(/\n/g, "<br>");
  document.getElementById('introPopup').style.display = 'flex';
}

function closeIntro() {
  document.getElementById('introPopup').style.display = 'none';
}
showIntro();