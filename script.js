const listeMots = [
  "ordinateur", "souris", "clavier", "internet", "javascript", "réseau",
  "technologie", "rapide", "jeu", "mobile", "serveur", "client", "cloud"
];

let motActuel = "";
let score = 0;
let totalSaisi = 0;
let bonSaisi = 0;
let tempsRestant = 60;
let minuteur;
let enCours = false;

let tempsMotsCorrects = [];

const boiteMot = document.getElementById("mot");
const champMot = document.getElementById("champ-mot");
const scoreEl = document.getElementById("score");
const tempsEl = document.getElementById("temps");
const mpmEl = document.getElementById("mpm");
const precisionEl = document.getElementById("precision");
const btnCommencer = document.getElementById("btn-commencer");
const btnRecommencer = document.getElementById("btn-recommencer");
const messageFinal = document.getElementById("message-final");
const barreTemps = document.getElementById("barre-temps");

function nouveauMot() {
  motActuel = listeMots[Math.floor(Math.random() * listeMots.length)];
  boiteMot.textContent = motActuel;
}

function reinitialiserStats() {
  score = 0;
  totalSaisi = 0;
  bonSaisi = 0;
  tempsRestant = 60;
  scoreEl.textContent = score;
  tempsEl.textContent = tempsRestant;
  mpmEl.textContent = 0;
  precisionEl.textContent = "100%";
  tempsMotsCorrects = [];
}

function actualiserBarre() {
  const pourcent = (tempsRestant / 60) * 100;
  barreTemps.style.width = `${pourcent}%`;
  barreTemps.style.background = pourcent > 30 ? "#48bb78" : "#f56565";
}

function decompte() {
  tempsRestant--;
  tempsEl.textContent = tempsRestant;
  actualiserBarre();

  if (tempsRestant <= 0) {
    clearInterval(minuteur);
    finDeJeu();
  }
}

function actualiserMPM() {
  const fenetreTemps = 20000; // 20 secondes pour le calcul
  const maintenant = Date.now();

  // Garde que les mots saisis dans les 30 dernières secondes
  tempsMotsCorrects = tempsMotsCorrects.filter(timestamp => maintenant - timestamp <= fenetreTemps);

  const motsRecents = tempsMotsCorrects.length;

  // Extrapole pour la minute
  const mpm = motsRecents * 3;

  mpmEl.textContent = mpm;
}

function actualiserPrecision() {
  const precision = totalSaisi > 0 ? (bonSaisi / totalSaisi) * 100 : 100;
  precisionEl.textContent = `${precision.toFixed(0)}%`;
}

btnCommencer.addEventListener("click", () => {
  if (enCours) return;
  enCours = true;
  champMot.disabled = false;
  champMot.focus();
  reinitialiserStats();
  nouveauMot();
  actualiserBarre();
  messageFinal.textContent = "";
  minuteur = setInterval(decompte, 1000);
});

btnRecommencer.addEventListener("click", reinitialiserJeu);

function reinitialiserJeu() {
  clearInterval(minuteur);
  reinitialiserStats();
  boiteMot.textContent = 'Cliquez sur "Commencer" pour jouer !';
  messageFinal.textContent = "";
  champMot.value = "";
  champMot.disabled = true;
  boiteMot.className = "";
  enCours = false;
  actualiserBarre();
}

champMot.addEventListener("input", () => {
  if (!enCours) return;

  const texteSaisi = champMot.value.trim().toLowerCase();
  if (texteSaisi.length === motActuel.length) {
    totalSaisi++;

    if (texteSaisi === motActuel.toLowerCase()) {
      score++;
      bonSaisi++;
      boiteMot.className = "bon-mot";
      tempsMotsCorrects.push(Date.now());
    } else {
      boiteMot.className = "mauvais-mot";
    }

    scoreEl.textContent = score;
    actualiserMPM();
    actualiserPrecision();

    champMot.value = "";

    setTimeout(() => {
      boiteMot.className = "";
      nouveauMot();
    }, 400);
  }
});

function finDeJeu() {
  champMot.disabled = true;
  boiteMot.textContent = "Diadieuffff BREUDEUUU";
  boiteMot.className = "";
  messageFinal.innerHTML = `🎉 Partie Gassii !<br>Votre score final : ${score} mots<br>Vitesse moyenne : ${mpmEl.textContent} MPM<br>Précision finale : ${precisionEl.textContent}`;
  enCours = false;
}
