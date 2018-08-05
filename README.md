# MyCity Manager

MyCity Manager proširenje za MyCity i MyCity Military.

https://mcmproject.github.io

## Trenutna verzija

*1.3.0 Skoplje*

- Dugme *Nova sesija* preimenovano u *Obriši podatke*
- Uklonjeno dugme *Informacije* i prebačeno u novi tab ispod podešavanja
- Omogućeno automatsko uključivanje / isključivanje opcija pri pisanju poruka

## Prioriteti

- Očuvanje jedinstvenog interfejsa
- Očuvanje što sličnije kodne baze između različitih pregledača
- Stabilnost pre opcija

## Trenutni zadaci

Ako želite da pomognete pri razvoju proširenja možete to učiniti na sledeće načine:

- Prijava bagova
- Testiranje proširenja za Microsoft Edge pregledač
- Novi logo (nije prioritetno)

## Za programere

### Izgradnja

Koristite [npm](https://www.npmjs.com/) ili [Yarn](https://yarnpkg.com/en/) upravljač paketima kako biste instalirali neophodne zavisnosti.

```
git clone https://github.com/mcmproject/mcm.git
cd mcm
yarn run build
```

### Pakovanje

Pomoću komande `yarn run pack` možete izvršiti automatsko pakovanje proširenja. Ova komanda generisaće dva foldera:

* **mcmc** - verzija proširenja za Chrome i njegove derivate
* **mcmf** - verzija proširenja za Firefox i njegove derivate

Razlika je samo u `manifest.json` fajlovima.