const categories = [["Left Handed"],
["Born after 1995", "Born before 1975"],
["Not from Europe", "From Australia", "From Asia", "From South America", "American", "From Europe"],
["Won at least 20 titles", "No titles", "Title on All 3 Surfaces", "Unseeded Champion"],
["Grand Slam Winner", "5+ Slams", "GS Finalist but no GS", "Wimbledon Champion"],
["Top 5 Ranking"],
["Played Davis Cup", "Won Davis Cup"],
["Olympic Medalist", "Played in Olympics"],
["Won Rogers Cup"]];



function setCategories() {
  const td = document.getElementById('leftCat');
  td.textContent = 'cats rock';

}

setCategories()