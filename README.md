# MyCity Manager

MyCity Manager proširenje za MyCity i MyCity Military.

## Trenutna verzija

*1.0.0 Nikozija*

- Čuvanje lajkovanih postova
- Čuvanje omiljenih postova
- Uvoz i izvoz informacija
- Automatsko ažuriranje

## Lokalno skladište

Svi podaci proširenja čuvaju se u lokalnom skladištu pregledača [(localStorage)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) u sledećem formatu (format čuvanja će se delimično menjati sa izlaskom novih verzija proširenja).

```json
{
    "likes": [
        {
            "id": "id_posta",
            "author": "ime_autora",
            "link": "link_posta",
            "time": "vreme_posta",
            "date": "datum_posta"
        }
    ],
    "favorites": [
        {
            "id": "id_posta",
            "author": "ime_autora",
            "link": "link_posta",
            "time": "vreme_posta",
            "date": "datum_posta"
        }
    ],
    "settings": {
        "like_tracker": true,
        "favorite_tracker": true
    }
}
```