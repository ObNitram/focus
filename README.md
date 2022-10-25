# FOCUS
Editeur de texte pour la prise de notes

# Description du projet

## Contexte
En tant qu’étudiants, nous avons besoin de pouvoir prendre des notes rapidement. Des solutions existent déjà pour cela, cependant les logiciels de traitement de texte comme Microsoft Word sont assez lourds pour cette utilisation, et les éditeurs de texte markdown ne possèdent en général pas certaines fonctionnalités comme la coloration du texte.

De plus, nous aimerions avoir la possibilité de pouvoir organiser nos notes, ou encore faire des fiches de révisions aisément.

# Notre projet
Notre projet est donc de concevoir un éditeur de texte et de prises de notes s’articulant autour de 4 points clefs:
    - La prise de notes de manière simple et rapide, par exemple lors d’un cours magistral ou d’une conférence.

    - La transformation des notes en un cours plus structuré, avec par exemple la possibilité de faire ressortir les définitions ou encore de séparer le cours en différentes parties et faire un sommaire. De plus, une intégration avec la syntaxe mermaid nous permettrait de réaliser toutes sortes de diagrammes.


    - Des aides à l’apprentissage. L’idée serait de pouvoir par exemple créer des textes à trous, masquer les définitions en un clic.


    - La création de fiches de révision.


# Caractéristiques générales
    - Possibilité d’utiliser des raccourcis clavier.
    - Personnalisable: on peut changer le thème, les raccourcis clavier, les boutons affichés dans le logiciel.
    - Utilisation d’une police monospace pour l’interface de prise de note
    - Interface responsive:  si l’écran est grand, on affiche plus de fonctionnalités, sinon on affiche l’essentiel uniquement.



# Travail demandé
## Prise de notes 
    - Utilisation du markdown
    - Quill (gras, souligné, italique, …)
    - Coloration du texte
    - Système de TODO
    - Pouvoir créer des tableaux rapidement
    - Système d'autocomplétion 

## Formatage de cours
    - Utilisation de schémas: intégration de Mermaid
    - Pouvoir créer des définitions de manière structurée 
    - Pouvoir créer des sections, un sommaire
    - Barre de vue verticale de l’ensemble du document (type VSCode)

## Apprentissage
    - Algorithme de création de textes à trous (masquer les définitions)
    - Système de surlignage (type PandaNote)

## Création de fiches de révision
    - Essentiel des cours
    - Export en PDF
