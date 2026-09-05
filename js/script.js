// =====================================================================
// MONT BARBIER — Script principal
// Ce fichier gère : l'animation d'entrée du hero, le menu mobile,
// les animations au défilement, la sécurité des vidéos, la copie de
// l'adresse et le statut "ouvert / fermé" du salon.
// =====================================================================

// ---------------------------------------------------------------------
// 1) ANIMATION D'ENTRÉE DU HERO (apparition cinématographique en 2 temps)
// ---------------------------------------------------------------------
// Déroulé voulu :
//   a) Au chargement, on voit le hero (photo du salon) SEUL,
//      sans aucun texte, pendant DELAI_AVANT_TITRE millisecondes.
//   b) Le titre "MONT BARBIER" apparaît ensuite lentement en fondu.
//   c) Puis, en cascade douce (un léger décalage entre chaque),
//      le slogan, la phrase et les icônes réseaux sociaux apparaissent à leur tour.
//
// Tout est piloté par setTimeout (basé sur le temps qui passe), donc
// ça se comporte pareil sur mobile, tablette et ordinateur, sans
// dépendre du temps de chargement de l'image ou d'un autre événement.
// L'animation ne se joue qu'une fois : elle est déclenchée une seule
// fois au chargement du script, et n'est jamais reliée au scroll.

// ↓↓↓ Règle la vitesse de l'animation ici (valeurs en millisecondes) ↓↓↓
const DELAI_AVANT_TITRE = 2000;   // durée pendant laquelle le hero reste seul, sans texte
const DUREE_FONDU_TITRE = 1800;   // durée du fondu du titre "MONT BARBIER" (lent et élégant)
const DECALAGE_CASCADE = 600;     // écart de temps entre l'apparition du titre, du slogan, du texte, puis du bouton
const DUREE_FONDU_CASCADE = 1200; // durée du fondu de chaque élément qui suit le titre (slogan / texte / bouton)
// ↑↑↑ ------------------------------------------------------------- ↑↑↑

(function animerEntreeHero() {
  const titre = document.querySelector('.hero-content h1');
  const slogan = document.querySelector('.hero-slogan');
  const texte = document.querySelector('.hero-text');
  const bouton = document.querySelector('.hero-btn');
  const reseaux = document.querySelector('.hero-socials');

  // Programme l'apparition en fondu d'un élément à un instant précis (delai),
  // avec sa propre durée de fondu (duree). La durée est appliquée en ligne
  // (transitionDuration) pour que tout se règle depuis les variables ci-dessus.
  function programmerApparition(element, delai, duree) {
    if (!element) return;
    element.style.transitionDuration = duree + 'ms';
    setTimeout(() => {
      element.classList.add('visible');
    }, delai);
  }

  // Le titre apparaît seul en premier, après que le hero ait été admiré
  programmerApparition(titre, DELAI_AVANT_TITRE, DUREE_FONDU_TITRE);

  // Puis le slogan, la phrase et les icônes réseaux sociaux suivent en cascade,
  // chacun décalé d'un cran (DECALAGE_CASCADE) par rapport au précédent
  programmerApparition(slogan, DELAI_AVANT_TITRE + DECALAGE_CASCADE * 1, DUREE_FONDU_CASCADE);
  programmerApparition(texte, DELAI_AVANT_TITRE + DECALAGE_CASCADE * 2, DUREE_FONDU_CASCADE);
  programmerApparition(bouton, DELAI_AVANT_TITRE + DECALAGE_CASCADE * 3, DUREE_FONDU_CASCADE);
  programmerApparition(reseaux, DELAI_AVANT_TITRE + DECALAGE_CASCADE * 4, DUREE_FONDU_CASCADE);
})();

// ---------------------------------------------------------------------
// 2) MENU HAMBURGER (mobile / tablette)
// ---------------------------------------------------------------------
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// On referme le menu automatiquement quand on clique sur un lien
navLinks.querySelectorAll('a').forEach((lien) => {
  lien.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ---------------------------------------------------------------------
// 3) ANIMATIONS AU DÉFILEMENT
// ---------------------------------------------------------------------
// On observe tous les éléments marqués [data-anim] et on ajoute
// la classe .visible dès qu'ils apparaissent à l'écran.
const elementsAnimes = document.querySelectorAll('[data-anim]');

const observateur = new IntersectionObserver(
  (entrees) => {
    entrees.forEach((entree) => {
      if (entree.isIntersecting) {
        entree.target.classList.add('visible');
        observateur.unobserve(entree.target); // on n'anime qu'une fois
      }
    });
  },
  { threshold: 0.15 }
);

elementsAnimes.forEach((el) => observateur.observe(el));

// ---------------------------------------------------------------------
// 4) SÉCURITÉ VIDÉOS (bug Safari qui met parfois les vidéos en pause)
// ---------------------------------------------------------------------
// Si une vidéo autoplay se met en pause toute seule, on la relance.
const videos = document.querySelectorAll('.video-item');

videos.forEach((video) => {
  video.addEventListener('pause', () => {
    // On vérifie que la page est bien visible avant de relancer,
    // sinon on relancerait des vidéos sur un onglet caché
    if (document.visibilityState === 'visible') {
      video.play().catch(() => {
        // Si le navigateur refuse (rare, car la vidéo est muted), on ignore l'erreur
      });
    }
  });
});

// ---------------------------------------------------------------------
// 5) COPIER L'ADRESSE (icône dans la section Contact)
// ---------------------------------------------------------------------
// Au clic sur l'icône, on copie l'adresse dans le presse-papier et on
// bascule brièvement vers l'icône "coche" (voir la classe .copie en CSS).
const boutonCopierAdresse = document.getElementById('btn-copier-adresse');
const ADRESSE_SALON = '2900 Bd Rosemont, Montréal, QC H1Y 1L9';
const DUREE_CONFIRMATION_COPIE = 2000; // durée d'affichage de la coche (ms)

// Copie un texte dans le presse-papier. Utilise navigator.clipboard quand
// c'est possible (nécessite un contexte sécurisé : https, ou localhost).
// Sinon, on se replie sur l'ancienne méthode document.execCommand('copy'),
// pour que ça fonctionne aussi si le site est ouvert en local (file://)
// ou dans un navigateur plus ancien.
function copierDansPressePapier(texte) {
  if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
    return navigator.clipboard.writeText(texte);
  }

  return new Promise((resolve, reject) => {
    const zoneTemporaire = document.createElement('textarea');
    zoneTemporaire.value = texte;
    // On sort la zone de texte de l'écran visible, sans la cacher avec
    // display:none (sinon impossible de la sélectionner sur certains navigateurs)
    zoneTemporaire.style.position = 'fixed';
    zoneTemporaire.style.top = '0';
    zoneTemporaire.style.left = '0';
    zoneTemporaire.style.opacity = '0';
    document.body.appendChild(zoneTemporaire);
    zoneTemporaire.focus();
    zoneTemporaire.select();

    try {
      document.execCommand('copy');
      resolve();
    } catch (erreur) {
      reject(erreur);
    } finally {
      document.body.removeChild(zoneTemporaire);
    }
  });
}

if (boutonCopierAdresse) {
  boutonCopierAdresse.addEventListener('click', () => {
    copierDansPressePapier(ADRESSE_SALON).then(() => {
      boutonCopierAdresse.classList.add('copie');
      boutonCopierAdresse.setAttribute('aria-label', 'Adresse copiée');

      setTimeout(() => {
        boutonCopierAdresse.classList.remove('copie');
        boutonCopierAdresse.setAttribute('aria-label', "Copier l'adresse");
      }, DUREE_CONFIRMATION_COPIE);
    });
    // Si la copie échoue complètement (cas très rare), on ne fait rien de
    // plus : pas de message d'erreur intrusif pour une simple icône.
  });
}

// ---------------------------------------------------------------------
// 6) STATUT "OUVERT / FERMÉ" (section Contact)
// ---------------------------------------------------------------------
// Affiche en temps réel si le salon est ouvert, en se basant sur l'heure
// et le jour ACTUELS À MONTRÉAL (fuseau America/Toronto) — et non sur
// l'heure de l'appareil du visiteur, qui peut être ailleurs dans le monde.

// Horaires d'ouverture, en minutes depuis minuit (ex : 11h00 = 11*60 = 660)
const HORAIRES_SALON = {
  lundi: [11 * 60, 21 * 60 + 30],
  mardi: [10 * 60, 20 * 60],
  mercredi: [12 * 60, 21 * 60 + 30],
  jeudi: [11 * 60, 21 * 60 + 30],
  vendredi: [11 * 60, 21 * 60 + 30],
  samedi: [11 * 60, 21 * 60 + 30],
  dimanche: [11 * 60, 21 * 60 + 30],
};

const INTERVALLE_RAFRAICHISSEMENT_STATUT = 60 * 1000; // on revérifie chaque minute

// Lit l'heure actuelle à Montréal via Intl.DateTimeFormat (peu importe le
// fuseau horaire réel du visiteur, le résultat est toujours celui de Montréal)
function obtenirJourEtMinutesAMontreal() {
  const formateur = new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'America/Toronto',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23', // évite le format 24:00 à minuit
  });

  const parties = formateur.formatToParts(new Date());
  const valeurs = {};
  parties.forEach((partie) => {
    valeurs[partie.type] = partie.value;
  });

  // "weekday" est déjà en français (ex : "mardi"), on le passe en minuscules
  // par sécurité pour matcher les clés de HORAIRES_SALON
  const jour = valeurs.weekday.toLowerCase();
  const minutes = parseInt(valeurs.hour, 10) * 60 + parseInt(valeurs.minute, 10);

  return { jour, minutes };
}

function mettreAJourStatutSalon() {
  const conteneurStatut = document.getElementById('statut-salon');
  const texteStatut = document.getElementById('statut-texte');
  if (!conteneurStatut || !texteStatut) return;

  const { jour, minutes } = obtenirJourEtMinutesAMontreal();
  const horairesDuJour = HORAIRES_SALON[jour];

  // Sécurité : si jamais le nom du jour ne correspond à rien (cas très
  // improbable), on affiche "fermé" plutôt que de planter
  const [ouverture, fermeture] = horairesDuJour || [0, 0];
  const estOuvert = minutes >= ouverture && minutes < fermeture;

  conteneurStatut.classList.toggle('ouvert', estOuvert);
  conteneurStatut.classList.toggle('ferme', !estOuvert);
  texteStatut.textContent = estOuvert ? 'Salon ouvert' : 'Salon fermé';
}

// Calcul immédiat au chargement, puis rafraîchi chaque minute
mettreAJourStatutSalon();
setInterval(mettreAJourStatutSalon, INTERVALLE_RAFRAICHISSEMENT_STATUT);
