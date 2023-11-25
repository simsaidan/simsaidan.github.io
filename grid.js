let playerData, rankingsData, singlesData, doublesData;

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

let randomMode = !true;
let bigCountries = { "From Australia": "AUS", "American": "USA" }

let categories = [["Left Handed"],
["Born after 1995", "Born before 1975"],
["Not from Europe", "From Australia", "From Asia", "From South America", "American", "From Europe", "From Spain"],
["Won at least 20 titles", "No titles", "Title on All 3 Surfaces", "Unseeded Champion"],
["Grand Slam Winner", "5+ Slams", "GS Finalist but no GS", "Wimbledon Champion", "US Open Champion"],
["Top 5 Ranking"],
["Played Davis Cup", "Won Davis Cup"],
["Olympic Medalist", "Played in Olympics"],
["Won Rogers Cup", "Won Miami Open", "Won Madrid Masters"],
["Played in NextGen Finals"],
["Shorter than 6ft (183 cm)", "Above 6ft 4in (193 cm)"],
["Played ATP Finals but no Masters title"]];

let forbidden = {
  "Left Handed": [],
  "Born after 1995": ["Born before 1975"],
  "Born before 1975": ["Born after 1995", "Played in NextGen Finals"],
  "Not from Europe": ["From Europe", "From Spain"],
  "From Australia": ["From Asia", "From Europe", "From South America", "American", "From Spain"],
  "From Asia": ["From Australia", "From Europe", "From South America", "American", "From Spain"],
  "From South America": ["From Australia", "From Asia", "From Europe", "American", "From Spain"],
  "American": ["From Australia", "From Asia", "From Europe", "From South America", "From Spain"],
  "From Europe": ["From Australia", "From Asia", "From South America", "American", "Not from Europe"],
  "From Spain": ["From Australia", "From Asia", "From South America", "American", "Not from Europe"],
  "Won at least 20 titles": ["No titles"],
  "No titles": ["Won at least 20 titles", "Wimbledon Champion", "US Open Champion", "Grand Slam Winner", "Won Rogers Cup", "Won Miami Open", "Unseeded Champion", "5+ Slams", "Title on All 3 Surfaces", "Won Madrid Masters"],
  "Title on All 3 Surfaces": ["No titles"],
  "Unseeded Champion": ["No titles"],
  "Grand Slam Winner": ["GS Finalist but no GS", "No titles"],
  "5+ Slams": ["No titles"],
  "GS Finalist but no GS": ["Grand Slam Winner", "5+ Slams", "Wimbledon Champion", "US Open Champion"],
  "Wimbledon Champion": ["No titles", "GS Finalist but no GS"],
  "US Open Champion": ["No titles", "GS Finalist but no GS"],
  "Top 5 Ranking": [],
  "Played Davis Cup": [],
  "Won Davis Cup": [],
  "Olympic Medalist": [],
  "Played in Olympics": [],
  "Won Rogers Cup": ["No titles"],
  "Won Miami Open": ["No titles"],
  "Won Madrid Masters": ["No titles"],
  "Played in NextGen Finals": ["Born before 1975"],
  "Shorter than 6ft (183 cm)": ["Above 6ft 4in (193 cm)"],
  "Above 6ft 4in (193 cm)": ["Shorter than 6ft (183 cm)"],
  "Played ATP Finals but no Masters title": []
};

let clicked = 'button1'
let seen = []

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
    if (buttonsUsed.includes(td.id)) {
      if (button) {
        button.disabled = true;
      }
    }
  });
  alert("You lose");
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
  switch (button) {
    case 'button1':
      return ["leftCol", "topRow"];
    case 'button2':
      return ["midCol", "topRow"];
    case 'button3':
      return ["rightCol", "topRow"];
    case 'button4':
      return ["leftCol", "midRow"];
    case 'button5':
      return ["midCol", "midRow"];
    case 'button6':
      return ["rightCol", "midRow"];
    case 'button7':
      return ["leftCol", "bottomRow"];
    case 'button8':
      return ["midCol", "bottomRow"];
    case 'button9':
      return ["rightCol", "bottomRow"];
    default:
      return ["Oh", "no"]
  }
}

function getPlayerIds(fullName) {
  return playerData.filter(player =>
    player.name_first + ' ' + player.name_last === fullName
  ).map(player => player.player_id);
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
    if ((player.name_first + ' ' + player.name_last).includes(nameFrag)) {
      matches.push(player.name_first + ' ' + player.name_last);
    }
  });
  return matches;
}

function topFive(name) {
  const matches = getPlayerIds(name);
  for (let i = 0; i < matches.length; i++) {
    const playerId = matches[i];
    if (rankingsData.some(rank => rank.player === playerId && rank.rank < 6)) {
      return true;
    }
  }
  return false;
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

function medaledInOlympics(name) {
  const matches = getPlayerIds(name);

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

function wonTournament(name, tourneyName) {

  const matches = getPlayerIds(name);

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

function young(fullName) {
  return playerData.some(player => {
    return player.name_first + ' ' + player.name_last === fullName &&
      +player.dob.slice(0, 4) > 1995;
  });
}

function old(fullName) {
  return playerData.some(player => {
    return player.name_first + ' ' + player.name_last === fullName &&
      +player.dob.slice(0, 4) < 1975;
  });
}

function lefty(fullName) {
  return playerData.some(player =>
    nameMatch(player, fullName) && player.hand === 'L');
}

function short(fullName) {
  return playerData.some(player =>
    player.name_first + ' ' + player.name_last === fullName &&
    player.height < 183
  );
}

function tall(fullName) {
  return playerData.some(player =>
    player.name_first + ' ' + player.name_last === fullName &&
    player.height > 194
  );
}

function isNotEuropean(fullName) {
  return playerData.some(player => {
    return (
      player.name_first + ' ' + player.name_last === fullName &&
      !europeanCountries.includes(player.ioc)
    );
  });
}

function isSouthAmerican(fullName) {
  return playerData.some(player => {
    return (
      player.name_first + ' ' + player.name_last === fullName &&
      southAmericanCountries.includes(player.ioc)
    );
  });
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
    player.name_first + ' ' + player.name_last === fullName &&
    player.ioc === countryCode
  );
}

function verify(label, name) {
  const a = document.getElementById(label).textContent;
  let res;
  if (a in bigCountries) {
    alert("It works!")
    res = checkCountry(name, bigCountries.get(a))
    if (!res) {
      alert("Incorrect - American");
    }
  }
  else {
    switch (a) {
      case "American":
        res = checkCountry(name, 'USA');
        if (!res) {
          alert("Incorrect - American");
        }
        break;
      case "5+ Slams":
        res = fiveSlams(name);
        if (!res) {
          alert("Incorrect - 5+ Slams");
        }
        break;
      case "Won at least 20 titles":
        res = twentyTitles(name);
        if (!res) {
          alert("Incorrect - Won at least 20 titles");
        }
        break;
      case "Left Handed":
        res = lefty(name);
        if (!res) {
          alert("Incorrect - Left Handed");
        }
        break;
      case "US Open Champion":
        res = wonTournament(name, "US Open") || wonTournament(name, "Us Open");
        if (!res) {
          alert("Incorrect - US Open Champion");
        }
        break;
      case "Olympic Medalist":
        res = medaledInOlympics(name);
        if (!res) {
          alert("Incorrect - Olympic Medalist");
        }
        break;
      case "No titles":
        res = noTitlesWon(name);
        if (!res) {
          alert("Incorrect - No titles");
        }
        break;
      case "Played in NextGen Finals":
        res = nextGen(name);
        if (!res) {
          alert("Incorrect - Played in NextGen Finals");
        }
        break;
      case "Grand Slam Winner":
        res = wonSlam(name);
        if (!res) {
          alert("Incorrect - Grand Slam Winner");
        }
        break;
      case "Top 5 Ranking":
        res = topFive(name);
        if (!res) {
          alert("Incorrect - Top 5 Ranking");
        }
        break;
      case "From Australia":
        res = checkCountry(name, 'AUS');
        if (!res) {
          alert("Incorrect - From Australia");
        }
        break;
      case "From Spain":
        res = checkCountry(name, 'ESP');
        if (!res) {
          alert("Incorrect - From Spain");
        }
        break;
      case "Not from Europe":
        res = isNotEuropean(name)
        if (!res) {
          alert("Incorrect - Not from Europe");
        }
        break;
      case "From Europe":
        res = !isNotEuropean(name)
        if (!res) {
          alert("Incorrect - From Europe");
        }
        break;
      case "From South America":
        res = isSouthAmerican(name)
        if (!res) {
          alert("Incorrect - From South America");
        }
        break;
      case "Shorter than 6ft (183 cm)":
        res = short(name)
        if (!res) {
          alert("Incorrect - Shorter than 6ft (183 cm)")
        }
        break;
      case "Above 6ft 4in (193 cm)":
        res = tall(name)
        if (!res) {
          alert("Incorrect - Above 6ft 4in (193 cm)")
        }
        break;
      case "Born before 1975":
        res = old(name)
        if (!res) {
          alert("Incorrect - Born before 1975")
        }
        break;
      case "Born after 1995":
        res = young(name)
        if (!res) {
          alert("Incorrect - Born after 1995")
        }
        break;
      default:
        alert("Not implemented");
        res = false;
    }
  }
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


function flatten(arr) {
  let flattened = [];
  arr.forEach(subarr => {
    flattened = flattened.concat(subarr);
  });
  return flattened;
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
  let flattenedCategories = flatten(categories);
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

}
setCategories();

let info = "Tennis Immaculate Grid is a tennis trivia game where the goal is to find 9 tennis players that fit both the row and column categories displayed around the grid. To make a guess, click on one of the empty squares to open the entry form and start typing a player's full name. Once you've entered a name, click Enter to submit it. If the name satisfies both the associated row and column categories for that square, it will turn green. If not, you'll get an alert about which category was not satisfied and lose a guess. Keep figuring out the identities by referring to the paired row and column categories, satisfying all 9 squares correctly before you run out of guesses to win."
let info2 = "Matches are only ATP matches. Singles matches range from 1968 to end of 2023 US Open. Doubles matches are from 2000 to 2020 inclusive. Players are valid if they are male and have played a match at any level (ATP, Challenger, Futures)."

alert("Welcome to Tennis Immaculate Grid" + "\n\n" + info + "\n\n" + info2)