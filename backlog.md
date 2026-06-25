# Projet

## Objectif
Créer une application (idéalement Web/PWA utilisable sur mobile) permettant de regarder des vidéos japonaises (YouTube, animés, etc.) avec des sous-titres japonais enrichis afin d'apprendre du vocabulaire en contexte réel.
L'objectif n'est pas de créer un lecteur vidéo complet ou une plateforme de streaming, mais plutôt un outil d'immersion assistée centré sur le vocabulaire.


## Consignes de style
Quelque chose de simple à prendre en main, se concentrer sur l'essentiel.

## Concept
L'utilisateur charge :

* une vidéo  
* un fichier de sous-titres japonais (SRT, VTT, ASS...)

L'application :

1. Affiche la vidéo.  
2. Affiche les sous-titres japonais.  
3. Ajoute automatiquement les furigana.  
4. Analyse chaque phrase.  
5. Affiche les informations des mots de la phrase en cours :  
   * lecture  
   * traduction  
   * niveau JLPT  
   * catégorie grammaticale  
6. Suit la progression de l'utilisateur sur le vocabulaire rencontré.



# Backlog - MVP

## Story 1 : Analyser une phrase japonaise

### DOD : 
- Tokenisation correcte (via tokenizer NLP)
- Lemmatisation correcte
- Enrichissement lexical via dictionnaire (JMdict ou équivalent)
- Ajout lecture (furigana)
- Ajout POS / classe grammaticale
- Ajout JLPT (via dataset externe)
- Gestion des mots inconnus

### Infos

**Cette story doit être indépendante de la vidéo !**

Exemple de format : 
```typescript
SentenceAnalysis {
  text: string
  tokens: Token[]
}

Token {
  surface: string
  lemma: string
  reading?: string
  pos?: string
  meaning?: string
  jlpt?: "N5" | "N4" | "N3" | "N2" | "N1" | "unknown"
}
```

### R&D / Outils
- Tokenisation : Kuromoji, Sudachi, MeCab
- Dictionnaire (lemma + lecture) : JMdict
- JLPT dataset : frequency list / JLPT word list
- POS : tokenizer ou dictionnaire

### Tests
Tester toutes les étapes à partir des cas suivants : 
- simple : 私は学生です
- verbe conjugué : 学校へ行きました
- phrase めっちゃ面白かったです
- 昨日は図書館で勉強しました
- particules ambigues : これを食べる
- nom propre : 東京に行きます
- めっちゃ美味しかった
- phrase rapide : えーっと今日はね、学校行って…

## Story 2 : Analyser des phrases issues de sous-titres
Prendre un fichier de sous-titres (SRT/VTT), extraire les phrases, et produire pour chaque phrase un SentenceAnalysis (Story #1).

### DOD : 
- Parsing SRT correct (timestamps, texte)
- Conversion en dto interne
- Appliquer l'analyse linguistique
- Robuste (supporte plusieurs phrases, ponctuation, phrases longues, phrases très courtes)


### Infos

Output attendu : 

```typescript
SubtitleAnalysis {
  subtitles: SubtitleItem[]
}

SubtitleItem {
  startTime: number
  endTime: number
  text: string
  analysis: SentenceAnalysis
}
```

```json
{
  "startTime": 1000,
  "endTime": 3000,
  "text": "今日は学校へ行きます",
  "analysis": {
    "text": "今日は学校へ行きます",
    "tokens": [
      { "surface": "今日", "lemma": "今日", "reading": "きょう", "pos": "noun" },
      { "surface": "は", "lemma": "は", "pos": "particle" },
      { "surface": "学校", "lemma": "学校", "reading": "がっこう", "pos": "noun" },
      { "surface": "へ", "lemma": "へ", "pos": "particle" },
      { "surface": "行く", "lemma": "行く", "reading": "いく", "pos": "verb" }
    ]
  }
}
```


### R&D / Outils
- Parser : https://gist.github.com/korny/c31e1017b2e23c2f4042
- A voir si besoin de subtitles js

### Tests
- 今日は学校へ行きます
- めっちゃ面白かったです
- gérer la ponctuation : えーっと、そうですね…
- plusieurs lignes : 今日は学校へ行きます
明日は休みです
- gérer les émojis


## Story 3 : Importer les sous-titre
### DOD : 
- L'utilisateur peut sélectionner un fichier local
- Prendre en compte les fichiers .srt et .vtt
- Stocker les sous-titre et phrases analysées
- Refresh la page ne demande pas de réeffectuer la pipeline

### Infos


### R&D / Outils
- simple input à voir dans le futur le drag and drop

### Tests
- upload un fichier multi lignes
- upload un fichier single line
- upload un fichier invalide
- re-upload le meme fichier


## Story 4 : Importer les sous-titre
### DOD : 
- L'utilisateur peut sélectionner une vidéo en local
- La vidéo est stockée en bdd locale
- On peut voir un catalogue des vidéos importées (+ sous-titres)
- La video est persistée après refresh

### Infos


### R&D / Outils
- 

### Tests
-


## Story 5 : Afficher une vidéo dans un player
Cette story concerne uniquement la lecture vidéo, la gestion du temps et les actions basiques (pas de sous-titre)

### DOD : 
- On peut lancer la vidéo
- On peut la mettre en pause
- On peut naviguer dans le temps
- On peut changer le volume
- fullscreen
- avoir un state ou store avec le temps actuel de la video

### Infos
```typescript
VideoPlayerState {
  currentTime: number
  duration: number
  isPlaying: boolean
}
```


### R&D / Outils
- HTML5 video / Plyr

### Tests
-

## Story 6 : Afficher les sous-titres synchronisés avec la vidéo
### DOD : 
- Le bon sous-titre s'afficher selon le timecode
- Mise à jour fluide
- Gérer les moments sans sous-titre
- Update les sous-titre si l'utilisateur seek to

### Infos
Optimisation importante : binary search on subtitles[]

### R&D / Outils
- 

### Tests
-

## Story 7 : Afficher les furigana au dessus des kanjis
### DOD : 
- Les furigana sont correctement affichés au dessus de chaque kanji (lectures régulières et irrégulières)
- Pas de furigana sur les hiragana et katakana
- Gérer les mots mixtes
- Gérer les lectures irrégulières

### Infos
- Co

### R&D / Outils
ne PAS essayer de faire de l'alignement kanji par kanji.
```html
<ruby>
  今日
  <rt>きょう</rt>
</ruby>
```

### Tests
- Cas simple : 学校
- Lecture irrégulière : 今日, 大人, 一昨日
- Nom propre : 東京
- Okurigana : 行きます
- Adjectifs : 面白い
- Verbe conjugué : 学校
- Que des hiragana : こんにちは
- Que des katakana
- kanji +hiragana : 勉強する

## Story 8 : Encadré des mots de la phrase
### DOD : 
- Les mots affichés correspondent au sous-titre actuellement affiché
- Les mots sont récupérés depuis le résultat de la story #1 
- Le changement de sous-titre met à jour automatiquement l'encadré
- Les mots sont affichés dans l'ordre de la phrase
- Aucun recalcul
- Si pas de sous-titre, encadré est vide

### Infos
Conseil : meme si les infos ne sont pas encore affichées, elles devraient dejà etre dans le type, comme ça story 9 = que de l'ui


### R&D / Outils
- 

### Tests
- Phrase simple : 私は学生です
- Phrase plus complexe : 昨日は図書館で勉強しました
- Changement de sous-titres : 今日は学校へ行きます / 昨日は図書館で勉強しました
- Aucun sous-titre


## Story 9 : Afficher les informations de chaque mot de l'encadré
### DOD : 
- Les informations suivantes sont affichées : lecture, traduction, niveau JLPT, classe grammaticale
- Les données proviennent de la story #1 
- Les informations sont affichées pour tous les mots de la phrase courante
- Gérer les cas où il n'y a pas toutes les infos

### Infos
Conseil : prévoir l'ajout de la couleur en mettant un status


### R&D / Outils
- Utiliser JMdict pour la traductionn
- Niveau JLPT : JLPT Vocabulary Lists ou JLPT Sensei ou Tanos
- Classe grammaticale (issue du tokenizer) : Kuromoji, Sudachi, MeCab

### Tests
- nom : 学校
- verbe : 行きました
- adjectif : 面白い
- changement de sous-titre

# Backlog - V2

## Story 10 : Base de données des mots rencontrés
### DOD : 
- Lorsqu'un mot apparait, il est ajouté dans la bdd utilisateur
- Un mot n'est créé qu'une seule fois
- Les mots sont identifiés par leur lemma
- Le nombre d'occurrences est mis à jour à chaque rencontre.
- La date de première rencontre est enregistrée.
- La date de dernière rencontre est mise à jour.
- Les données persistent après fermeture de l'application.
- Les doublons ne sont pas créés.

### Infos
nb occurences = Nombre de fois où le mot apparaît dans les sous-titres

### R&D / Outils
- Dexie js

### Tests
- nouveau mot : 私は学生です
- mot déjà rencontré : 学校へ行きます + 昨日学校へ行きました
- formes conjuguées : 行きます + 行った


## Story 11 : Filtrer les mots par niveau JLPT souhaité
### DOD : 
- L’utilisateur peut sélectionner un niveau JLPT cible (N5 → N1)
- Les mots affichés dans l'encadré sont filtrés dynamiquement selon ce niveau
- Le changement de filtre est instantané (pas de reload)
- Les mots sans JLPT sont gérés proprement
- Le filtre est persistant
- Filtre uniquement ui, le mot doit quand meme etre compté (story #10 )

### Infos
- Si niveau inconnu : quand meme afficher ou exclure ?
- Si filtre N3, on prend le N5, N4 et N3

### R&D / Outils
- 

### Tests
- Tester des cas où des mots sont exclus
- Tester des cas où tous les mots sont pris
- Tester les mots sans JLPT



## Story 12 : Système de couleurs / progression automatique
### DOD : 
- Chaque mot possède un statut visuel (rouge = nouveau, jaune = en apprentissage, vert = connu)
- La couleur est affichée dans l'encadré
- On voit aussi le statut / couleurs dans la liste du vocabulaire rencontré

### Infos
Conseil : ne pas stocker de statut, la source de vérité est le nb d'occurences


### R&D / Outils
- 

### Tests
- nouveau mot
- mot fréquent
- mot maitrisé



## Story 13 : Synchronisations entre plusieurs browsers
Objectif : Permettre à l'utilisateur de retrouver exactement son état d'apprentissage sur tous ses appareils (pc et telephone)

### DOD : 
- L'utilisateur doit etre authentifié
- Données stockées côté backend
- Une modification locale est persistée en local (offline-first)
- Les données sont synchronisées vers le backend par batch
- Les updates sont regroupés avant envoi :
  - toutes les X secondes (ex: 10–30s), ou
  - lors d’événements clés (changement de vidéo, fermeture session)
- IndexedDB est utilisé comme cache local principal
- Le backend est la source de vérité lors de la resynchronisation

### Infos
Ce qui doit être synchronisé (données utilisateur) :
- vocabulaire utilisateur
- favoris
- historique

ne pas synchroniser : 
- les videos
- fichiers sous-titre
- parsing NLP
- tokens

Pour une V1, quand synchro ? : 
- un batch toutes les 30s si nouvelles données
- au changement de vidéo


### R&D / Outils
- Supabase
- BetterAuth

### Tests
-


# Backlog - V3

## Story 14 : Support Youtube
### DOD : 
- L’utilisateur peut ajouter une vidéo YouTube via URL
- La vidéo est lisible dans le player existant
- Les sous-titres sont importés manuellement
- La synchronisation vidéo ↔ subtitles fonctionne comme pour une vidéo locale
- Le système ne dépend pas de l’origine de la vidéo (local vs YouTube)
- Le player gère correctement les events timeupdate malgré YouTube API

### Infos
- Abstraction de la partie youtube


### R&D / Outils
- Se renseigner sur iFrame API

### Tests
-


## Story 15 : Auto-pause à la fin de chaque sous-titre
Objectif : Mettre automatiquement la vidéo en pause à la fin de chaque sous-titre afin de :
- forcer la compréhension active
- laisser le temps d’analyser le vocabulaire
- faciliter l’apprentissage “phrase par phrase”

### DOD : 
- la vidéo se met automatiquement en pause à la fin d'un sous-titre
- l'utilisateur peut activer / désactiver la fonctionnalité
- compatible avec tout type de lecteur (natif et ytb)
- ne trigger la pause qu'une fois par sous-titre

### Infos


### R&D / Outils
- HTMLVideoElement
- Youtube Iframe player

### Tests
-


## Story 16 : Naviguer entre les phrases précédentes / suivantes
### DOD : 
- L’utilisateur peut aller à la phrase précédente
- L’utilisateur peut aller à la phrase suivante
- La vidéo se positionne automatiquement sur startTime du sous-titre ciblé
- Le sous-titre actif est mis à jour immédiatement
- Le vocabulaire affiché (Story #8 /#9) est mis à jour
- L’auto-pause (Story #15) fonctionne après navigation
- Les boutons restent désactivés si aucune phrase disponible
- Fonctionne sur tous les players (local / YouTube abstraction)
- raccourcis clavier fonctionnent

### Infos


### R&D / Outils
- 

### Tests
- phrase suivante
- phrase précédente
- début de vidéo
- fin de vidéo


## Story 17 : Ajouter un mot aux favoris / mots importants
Objectif : Permettre à l’utilisateur de marquer des mots comme importants à apprendre, indépendamment de leur fréquence ou statut automatique.

### DOD : 
- L’utilisateur peut marquer/unmarquer un mot comme favori
- Le statut favori est persistant local + backend
- Les favoris sont synchronisés entre appareils
- Un mot favori est identifiable visuellement dans l’UI

### Infos
favori différent de apprentissage automatique

### R&D / Outils
- 

### Tests
- ajouter un favori
- retirer un favori


## Story 18 : Réviser les favoris à partir du contexte de la phrase
Objectif : Permettre à l’utilisateur de réviser ses mots favoris directement dans leur contexte d’apparition (phrase de sous-titre).

### DOD : 
- L’utilisateur peut lancer un mode “révision favoris”
- Une phrase contenant un mot favori est affichée
- Le mot favori est surligné dans la phrase
- L’utilisateur peut naviguer entre les occurrences
- Chaque favori peut être révisé dans plusieurs contextes (si disponibles)
- Les données viennent du stockage utilisateur (Story #13)

### Infos


### R&D / Outils
- 

### Tests
- mot dans une phrase
- mot absent
- plusieurs occurences


## Story 19 : Historique de vocabulaire / occurences
Objectif : Conserver et exploiter l’historique complet des rencontres de mots dans les vidéos :
- quand un mot a été vu
- dans quelle vidéo
- dans quel contexte (phrase)
- combien de fois et où

### DOD : 
- Chaque apparition d’un mot est enregistrée dans l’historique
- On peut consulter toutes les occurrences d'un mot
- On peut consulter toutes les occurrences dans une vidéo
- L'historique est persitant

### Infos


### R&D / Outils
- 

### Tests
- première apparition
- relecture d'un meme sous-titre
- mot dans plusieurs vidéos


## Story 20 : Statistiques de difficulté d'une vidéo
Objectif : Afficher un score de difficulté et une analyse vocabulaire pour chaque vidéo, basé sur ce que l’utilisateur connaît déjà.

### DOD : 
- Chaque vidéo affiche un score de difficulté personnalisé
- Le score est basé sur les mots rencontrés dans la vidéo
- Les mots sont comparés à la base utilisateur
- On affiche le % mots connus
- On affiche le % mots inconnus
- On affiche distribution JLPT
- Le score est recalculé si progression utilisateur change

### Infos
pré calcul à chaque vidéo

### R&D / Outils
- 

### Tests
-


## Story 21 : Analyse du vocabulaire connu par l'utilisateur
Objectif : Construire un profil linguistique utilisateur basé sur son vocabulaire réel :
- ce qu’il connaît
- son niveau estimé
- ses points faibles
- sa progression globale

### DOD : 
- L’utilisateur a un profil de niveau estimé (ex: N4.3)
- Le système affiche :
  - répartition JLPT des mots connus
  - nombre total de mots connus
  - progression dans le temps
- Le niveau évolue automatiquement selon UserWord
- Le calcul est déterministe et recalculable
- Les données sont synchronisées multi-device (Story #13)

### Infos


### R&D / Outils
- 

### Tests
-
