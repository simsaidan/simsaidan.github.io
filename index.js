const button = document.getElementById('go-button');
const select = document.querySelector('select');
const selected = select.options[select.selectedIndex].text;

button.addEventListener('click', () => {
  if (selected === 'Link 1') {
    window.location = 'cnn.com';
  } else if (selected === 'Link 2') {
    window.location = 'https://www.espn.com/';
  }
});