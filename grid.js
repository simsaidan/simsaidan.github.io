let categories = [["Left Handed"],
["Born after 1995", "Born before 1975"],
["Not from Europe", "From Australia", "From Asia", "From South America", "American", "From Europe"],
["Won at least 20 titles", "No titles", "Title on All 3 Surfaces", "Unseeded Champion"],
["Grand Slam Winner", "5+ Slams", "GS Finalist but no GS", "Wimbledon Champion"],
["Top 5 Ranking"],
["Played Davis Cup", "Won Davis Cup"],
["Olympic Medalist", "Played in Olympics"],
["Won Rogers Cup"],
["Played in NextGen Finals"]];

let forbidden = {};


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

function setCategories() {
  let cats = [];
  let date = getTodayDate();
  confirm(date)
  let flattenedCategories = flatten(categories);

  for (let i = 0; i < 6; i++) {
    cats.push('apple');
  }

  const td = document.getElementById('leftCat');
  td.textContent = cats[0];

}

setCategories();

