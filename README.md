# FOCUS
Editeur de texte pour la prise de notes
## Available Scripts in addition to the existing ones


## Project directory structure

```bash
├── electron                  Electron-related code
│   ├── main                  Main-process source code
│   ├── preload               Preload-scripts source code
│   └── resources             Resources for the production build
│       ├── icon.icns             Icon for the application on macOS
│       ├── icon.ico              Icon for the application
│       ├── installerIcon.ico     Icon for the application installer
│       ├── uninstallerIcon.ico   Icon for the application uninstaller
|       └── iconset               
|           └── 256x256.png       Icon for the application on Linux
│
├── release                   Generated after production build, contains executables
│   └── {version}
│       ├── {os}-unpacked         Contains unpacked application executable
│       └── Setup.{ext}           Installer for the application
│
├── public                    Static assets
│
└── src                       Renderer source code, your React application
    ├── assets
    │   ├── styles            Scss/css 
    │   └── utils             Test script, tools, utils fonction for test and debug
    │
    └──components             React components
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
