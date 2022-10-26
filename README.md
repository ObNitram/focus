# FOCUS
Editeur de texte pour la prise de notes
## Available Scripts in addition to the existing ones

### `npm run electron:dev`

Runs the Electron app in the development mode.

The Electron app will reload if you make edits in the `electron` directory.<br>
You will also see any lint errors in the console.

### `npm run electron:build`

Builds the Electron app package for production to the `dist` folder.

Your Electron app is ready to be distributed!

## Project directory structure

```bash
my-app/
├── package.json
│
## render process
├── tsconfig.json
├── public/
├── src/
│
## main process
├── electron/
│   ├── main.ts
│   └── tsconfig.json
│
## build output
├── build/
│   ├── index.html
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   │
│   └── electron/
│      └── main.js
│
## distribution packages
└── dist/
    ├── mac/
    │   └── my-app.app
    └── my-app-0.1.0.dmg
```



# Applicaction de review de cours en 4 parties
    - Review de diapo prise de note
    - Formatage des notes transformation en cours
    - Apprentisage
    - Fiche de révision

## caractéristique
    tout raccourci clavier et boutton
    personnalisable
    monospace
    responsive 

## Prise de note et 
    utilisation du markdown
    Quill
    Couleur
    systeme de //TODO
    tableau rapide

## formatage de cours
    Utilisation de shema : integration de mermaid
    Definition 
    Plan et sommaire 
    bar de vue VSCode

## apprentisage
    algo de création de texte à trous
    cacher les déffinition
    Systeme de surlignage PandaNote

## création de fiche de révision