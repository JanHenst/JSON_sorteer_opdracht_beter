


//funcite die vaan een maand-string een nummer maakt
//waarbij januari eeen 0 geeft
//en december een 11
const geeftMaandNummer = (maand) => {
  let nummer;
  switch (maand) {
    case "januari":   nummer = 0;break;
    case "februari":  nummer = 1;break;
    case "maart":     nummer = 2;break;
    case "april":     nummer = 3;break;
    case "mei":       nummer = 4;break;
    case "juni":      nummer = 5;break;
    case "juli":      nummer = 6;break;
    case "augustus":  nummer = 7;break;
    case "september": nummer = 8;break;
    case "oktober":   nummer = 9;break;
    case "november":  nummer = 10;break;
    case "december":  nummer = 11;break;
    default:          nummer = 0

  }
  return nummer;
}

// maak een functie die de tekst achter de komma vooraan plaatst
const keerTekstOm = (string) => {
  if (string.indexOf(',') != -1 ) {
    let array = string.split(',');
    string = array[1] + ' ' + array[0];
  }
  return string;
}

//een winkelwagenobject deze
//1. toegevoege items bevat
//2. een method om dat op te halen uit localStorage
//3. methode om toe te voegen
//4. methode om items te verwijderen
//5. method om items uit te voeren
let winkelwagen = {
  items: [],

  haalItemsOp: function() {
      let bestelling;
      if ( localStorage.getItem('besteldeBoeken') == null) {
        bestelling = [];
      } else {
        bestelling = JSON.parse(localStorage.getItem('besteldeBoeken'));
        document.querySelector('.winkelwagen__aantal').innerHTML = bestelling.length;
      }
      bestelling.forEach( item => {
        this.items.push(item);
      })
      return bestelling;
  },

  uitvoeren: function() {
    //eerst de uitvoer leegmaken
    document.getElementById('bestelling').innerHTML = " ";
    this.items.forEach( boek => {
      let sectie = document.createElement('section');
      sectie.className = 'besteldBoek';

      // cover maken(afbeelding)
      let afbeelding = document.createElement('img');
      afbeelding.className = 'besteldBoek__cover';
      afbeelding.setAttribute('src', boek.cover);
      afbeelding.setAttribute('alt', keerTekstOm(boek.titel));

      // titel maken
      let titel = document.createElement('h3');
      titel.className = 'besteldBoek__titel';
      titel.textContent = keerTekstOm(boek.titel);

      // prijs toevoegen
      let prijs = document.createElement('div');
      prijs.className = 'besteldBoek__prijs';
      prijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

      //verwijderknop toevoegen
      let verwijderen = document.createElement('div');
      verwijderen.className = 'besteldBoek__verwijder';

      // het element toevoegen
      sectie.appendChild(afbeelding);
      sectie.appendChild(titel);
      sectie.appendChild(prijs);
      sectie.appendChild(verwijderen);
      document.getElementById('bestelling').appendChild(sectie);
    });
  }

}

winkelwagen.haalItemsOp();
winkelwagen.uitvoeren();
