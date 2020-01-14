//JSON importeren
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function()  {
  if (this.readyState == 4 && this.status == 200) {
    soorteerBoekObject.data = JSON.parse(this.responseText);
    soorteerBoekObject.voegJSdatumIn();

    //de date moeten ook een eigenschap gebben waarbij de titels in kapitalen staan
    //daarop kan dan gesorteerd worden
    soorteerBoekObject.data.forEach( boek => {
      boek.titelUpper = boek.titel.toUpperCase();
      //ook de (achter)naam can de eerste auteur als eigenschap in data toevoegen
      boek.sortAuteur = boek.auteur[0];
    });
    soorteerBoekObject.sorteren();
  }
}
xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();


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

//functie die een string van maand jaar omzet in een dat-object
const maakJSdatum = (maandJaar) => {
  let mjArray = maandJaar.split(" ");
  let datum = new Date(mjArray[1], geeftMaandNummer(mjArray[0]));
  return datum;
}

//functie  maakt van een array een opsomming met ', ' ' en ' ' en '
const maakOpsomming = (array) => {
  let string = "";
  for(let i=0; i<array.length; i++) {
    switch (i) {
      case array.length-1: string += array[i]; break;
      case array.length-2: string += array[i] + " en "; break;
      default: string += array[i] + ", ";
    }
  }
  return string;
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
//2. methode om toe te voegen
//3. methode om items te verwijderen
//4. method om de winkelwagen aantal bijtewerken
let winkelwagen = {
  items: [],

  haalItemsOp: function() {
      let bestelling;
      if ( localStorage.getItem('besteldeBoeken') == null) {
        bestelling = [];
      } else {
        bestelling = JSON.parse(localStorage.getItem('besteldeBoeken'));
        bestelling.forEach( item => {
          this.items.push(item);
        })
        this.uitvoeren();
      }
      return bestelling;
  },

  toevoegen: function(el) {
    this.items = this.haalItemsOp();
    this.items.push(el);
    localStorage.setItem('besteldeBoeken', JSON.stringify(this.items));
    this.uitvoeren();
  },

  uitvoeren: function() {
    if (this.items.length > 0) {
      document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
    } else {
      document.querySelector('.winkelwagen__aantal').innerHTML = '';
    }
  }

}

winkelwagen.haalItemsOp();


// object dat de boeken uitvoert en soorteert
//eigenschappen: data (soorteer)kenmerk
//methods: sorteren() en uitvoeren()
let soorteerBoekObject  = {
  data: "",     //komt van xmlhttp.onredychange

  kenmerk: "titelUpper",

  //sorteervolgorde  en factor
  oplopend: 1,

  //een datum object toevoegen aan this.data uit de string uitgave
  voegJSdatumIn: function() {
    this.data.forEach((item) => {
      item.jsDatum = maakJSdatum(item.uitgave);
    });
  },

  //data sorteren
  sorteren: function() {
    this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1*this.oplopend : -1*this.oplopend );
    this.uitvoeren(this.data);
  },

  // de data in een tabel uitvoeren
  uitvoeren: function(data) {
    //eerst de uitvoer leegmaken
    document.getElementById('uitvoer').innerHTML = " ";
    data.forEach( boek => {
      let sectie = document.createElement('section');
      sectie.className = 'boekSelectie';

      //main element met alle info behalve de prijs en afbeelding
      let main = document.createElement('main');
      main.className = 'boekSelectie__main';

      // cover maken(afbeelding)
      let afbeelding = document.createElement('img');
      afbeelding.className = 'boekSelectie__cover';
      afbeelding.setAttribute('src', boek.cover);
      afbeelding.setAttribute('alt', keerTekstOm(boek.titel));

      // titel maken
      let titel = document.createElement('h3');
      titel.className = 'boekSelectie__titel';
      titel.textContent = keerTekstOm(boek.titel);

      //auteurs toevoegen
      let auteurs = document.createElement('p');
      auteurs.className = 'boekSelectie__auteurs';
      // de voor en achternaam van de eerste auteur omdraaien
      boek.auteur[0] = keerTekstOm(boek.auteur[0]);
      // auteur staan in een array: deze omzetten naar Nederlands string
      auteurs.textContent = maakOpsomming(boek.auteur);

      // overige info toevoegen
      let overig = document.createElement('p');
      overig.className = 'boekSelectie__overig';
      overig.textContent = boek.uitgave + ' | aantal pagina\'s ' + boek.paginas +  ' | ' + boek.taal +  ' | ean ' + boek.ean;

      // prijs toevoegen
      let prijs = document.createElement('div');
      prijs.className = 'boekSelectie__prijs';
      prijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

      //knop toevoegen bij de prijs
      let knop = document.createElement('button');
      knop.className = 'boekSelectie__knop';
      knop.innerHTML = 'voeg toe aan <br>winkelwagen';
      knop.addEventListener('click', () => {
        winkelwagen.toevoegen(boek)
      })

      // het element toevoegen
      sectie.appendChild(afbeelding);
      main.appendChild(titel);
      main.appendChild(auteurs);
      main.appendChild(overig);
      sectie.appendChild(main);
      prijs.appendChild(knop);
      sectie.appendChild(prijs);
      document.getElementById('uitvoer').appendChild(sectie);
    });
  }
}

// keuze voorsorteer  opties
document.getElementById('kenmerk').addEventListener('change', (e) => {
  soorteerBoekObject.kenmerk = e.target.value;
  soorteerBoekObject.sorteren();
});

document.getElementsByName('oplopend').forEach((item) => {
  item.addEventListener('click', (e) => {
    soorteerBoekObject.oplopend = parseInt(e.target.value);
    soorteerBoekObject.sorteren();
  })
})
