


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
//3. methode om items te verwijderen
//4. method om items uit te voeren
//5. method om de taalprijs uit te rekenen
let winkelwagen = {
  items: [],

  haalItemsOp: function() {
      let bestelling;
      if ( localStorage.getItem('besteldeBoeken') == null) {
        bestelling = [];
      } else {
        bestelling = JSON.parse(localStorage.getItem('besteldeBoeken'));
      }
      bestelling.forEach( item => {
        this.items.push(item);
      })
      return bestelling;
  },

  //doorloop alle items en als de ean van het item overeenstemt, dit uit de items verwijdere n
  verwijderItem: function(ean) {
    this.items.forEach((item,index) => {
      if ( item.ean == ean ) {
        this.items.splice(index,1);
        ean = 4;
      }
    })
    //local storage bijwerken
    localStorage.setItem('besteldeBoeken', JSON.stringify(this.items));
    if (this.items.length>0) {
      document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
    } else {
      document.querySelector('.winkelwagen__aantal').innerHTML = "";
    }
    this.uitvoeren();
  },

  totaalPrijsBerekenen: function() {
    let totaal = 0;
    this.items.forEach( boek => {
      totaal += boek.prijs;
    });
    return totaal;
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
      let verwijder = document.createElement('div');
      verwijder.className = 'besteldBoek__verwijder';
      verwijder.addEventListener('click', () => {
        this.verwijderItem(boek.ean);
      })

      // het element toevoegen
      sectie.appendChild(afbeelding);
      sectie.appendChild(titel);
      sectie.appendChild(prijs);
      sectie.appendChild(verwijder);
      document.getElementById('bestelling').appendChild(sectie);
    });

    // naar de opsomming ook de totaal prijs toevoegen
    let sectie = document.createElement('section');
    sectie.className = 'besteldBoek';
    // tekst voor totaal prijs
    let totaalTekst = document.createElement('div');
    totaalTekst.className = 'besteldBoek__totaal-tekst';
    totaalTekst.innerHTML = 'Totaal: ';

    let totaalPrijs = document.createElement('div');
    totaalPrijs.className = 'besteldBoek__totaal-prijs';
    totaalPrijs.textContent = this.totaalPrijsBerekenen().toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

    sectie.appendChild(totaalTekst);
    sectie.appendChild(totaalPrijs);
    document.getElementById('bestelling').appendChild(sectie);


    // winkelwagen aantal uitvoeren
      if (this.items.length > 0) {
        document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
      } else {
        document.querySelector('.winkelwagen__aantal').innerHTML = '';
      }
  }

}

winkelwagen.haalItemsOp();
winkelwagen.uitvoeren();
