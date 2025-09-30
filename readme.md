# API SNCF Gares – Projet TypeScript / NestJS

## Description
Cette API NestJS expose des informations résumées sur les gares voyageurs de la SNCF.  
Au démarrage, les données sont chargées depuis l’open data SNCF puis conservées en mémoire.  
L’API permet :
- de lister les gares,
- de rechercher par mot-clé,
- de récupérer une gare précise via une query `id`,
- de marquer/démarquer une gare comme favorite,
- d’ajouter une gare personnalisée.

---

## Modèles (interfaces)

### GareResume (format retravaillé des données envoyées par l’API)
- `id` : string (codes UIC)
- `name` : string (nom de la gare)
- `latitude` : number
- `longitude` : number
- `favorite` : boolean

> Les données brutes de l’open data (`GareApi`) sont converties en `GareResume` au chargement.

---

## Endpoints

### 1) Lister toutes les gares (résumé)
Méthode / Route :

    GET /gares

Réponse (exemple) :

    [
      {
        "id": "87317362",
        "name": "Abbeville",
        "latitude": 50.10221,
        "longitude": 1.82449,
        "favorite": false
      },
      ...
    ]

### 2) Récupérer une gare précise (par id via query)
Méthode / Route :

    GET /gares?id=<codes_uic>

Exemple :

    GET /gares?id=87317362

Réponse (exemple) :

    {
      "id": "87317362",
      "name": "Abbeville",
      "latitude": 50.10221,
      "longitude": 1.82449,
      "favorite": false
    }

### 3) Rechercher parmi les gares
Méthode / Route :

    GET /gares?term=<mot-cle>

Exemple :

    GET /gares?term=paris

Réponse :

    [
      { "id": "...", "name": "Paris ..." , "latitude": ..., "longitude": ..., "favorite": false },
      ...
    ]

> La recherche est insensible à la casse et aux accents, et porte au minimum sur le `name` et l’`id`.

### 4) Créer une gare (ajout en mémoire pour tests/démos)
Méthode / Route :

    POST /gares

Body JSON (exemple) :

    {
      "id": "1234",
      "name": "Toulouse",
      "latitude": 45.0,
      "longitude": 2.0,
      "favorite": true
    }

Réponse (exemple) :

    {
      "message": "Gare ajoutée avec succès",
      "gare": {
        "id": "1234",
        "name": "Toulouse",
        "latitude": 45.0,
        "longitude": 2.0,
        "favorite": true
      }
    }

### 5) Marquer/démarquer une gare en favori
Méthode / Route :

    PUT /gares/:id

Body JSON :

    {
      "favorite": true
    }

ou

    {
      "favorite": false
    }

Réponse (exemple) :

    {
      "success": true,
      "message": "Gare modifiée",
      "id": "87317362",
      "favorite": true
    }

---

## Utilisation avec Postman (archive fournie)

1) Dans Postman, les requêtes suivantes sont fournies :
    - `GET /gares` (liste)
    - `GET /gares?id=<id>` (détail)
    - `GET /gares?term=<mot>` (recherche)
    - `POST /gares` (création)
    - `PUT /gares/:id/favorite` (favori)

---