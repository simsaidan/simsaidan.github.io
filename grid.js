let playerData;

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

const jsonFilePath = 'players.json';
fetchData(jsonFilePath)
  .then(jsonData => {
    globalJsonData = jsonData;
  });


let randomMode = !true;

let categories = [["Left Handed"],
["Born after 1995", "Born before 1975"],
["Not from Europe", "From Australia", "From Asia", "From South America", "American", "From Europe"],
["Won at least 20 titles", "No titles", "Title on All 3 Surfaces", "Unseeded Champion"],
["Grand Slam Winner", "5+ Slams", "GS Finalist but no GS", "Wimbledon Champion"],
["Top 5 Ranking"],
["Played Davis Cup", "Won Davis Cup"],
["Olympic Medalist", "Played in Olympics"],
["Won Rogers Cup", "Won Miami Open"],
["Played in NextGen Finals"]];

let forbidden = {
  "Left Handed": [],
  "Born after 1995": ["Born before 1975"],
  "Born before 1975": ["Born after 1995", "Played in NextGen Finals"],
  "Not from Europe": ["From Europe"],
  "From Australia": ["From Asia", "From Europe", "From South America", "American"],
  "From Asia": ["From Australia", "From Europe", "From South America", "American"],
  "From South America": ["From Australia", "From Asia", "From Europe", "American"],
  "American": ["From Australia", "From Asia", "From Europe", "From South America"],
  "From Europe": ["From Australia", "From Asia", "From South America", "American", "Not from Europe"],
  "Won at least 20 titles": ["No titles"],
  "No titles": ["Won at least 20 titles", "Wimbledon Champion", "Grand Slam Winner", "Won Rogers Cup", "Won Miami Open", "Unseeded Champion", "5+ Slams", "Title on All 3 Surfaces"],
  "Title on All 3 Surfaces": ["No titles"],
  "Unseeded Champion": ["No titles"],
  "Grand Slam Winner": ["GS Finalist but no GS", "No titles"],
  "5+ Slams": ["No titles"],
  "GS Finalist but no GS": ["Grand Slam Winner", "5+ Slams"],
  "Wimbledon Champion": ["No titles"],
  "Top 5 Ranking": [],
  "Played Davis Cup": [],
  "Won Davis Cup": [],
  "Olympic Medalist": [],
  "Played in Olympics": [],
  "Won Rogers Cup": ["No titles"],
  "Won Miami Open": ["No titles"],
  "Played in NextGen Finals": ["Born before 1975"]
};

let clicked = 'button1'

function openForm(b) {
  clicked = b
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  american()
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

function american(player) {
  const americans = playerData.filter(player => player.ioc === 'USA');
  const numAmericans = americans.length;
  confirm(numAmericans)
}

function verify(label, player) {
  const a = document.getElementById(label).textContent;
  alert(a);
  return true;
}

function submit() {
  buttonCats = getCats(clicked)
  const player = document.getElementById('email').value;
  if (verify(buttonCats[0], player) && verify(buttonCats[1], player)) {
    document.getElementById('button1').textContent = player;
  }
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

