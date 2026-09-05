# Mont Barbier — Site vitrine

Site vitrine statique (HTML / CSS / JavaScript, sans framework ni serveur) pour le
barbershop Mont Barbier, à Rosemont, Montréal.

## Structure du projet

```
index.html      Page unique du site
css/style.css    Feuille de style
js/script.js     Comportement (animations, menu mobile, statut ouvert/fermé, etc.)
images/          Logo et photo d'en-tête (PC + mobile)
videos/          Vidéos de la galerie
robots.txt       Consignes pour les robots d'indexation
_headers         En-têtes de sécurité (reconnu par certains hébergeurs statiques)
dist/            Version minifiée du site, prête à déployer (optionnelle)
```

## Voir le site en local

Ouvrir le dossier dans VS Code, puis clic droit sur `index.html` →
« Open with Live Server » (extension Live Server à installer au préalable).

## Déploiement

Site 100 % statique : il suffit d'héberger les fichiers ci-dessus (ou le contenu du
dossier `dist/`) sur n'importe quel hébergeur de sites statiques.
