# Tesla Model S 3D Showcase

Une expérience web interactive 3D conçue par **Mike Dev**, mettant en scène la Tesla Model S édition Prior Design. 
Ce projet utilise des technologies WebGL modernes pour offrir une immersion visuelle premium avec un design cyberpunk/néon personnalisé.

## 🚀 Fonctionnalités

- **Scène 3D Interactive** : Modèle 3D complet (format `.glb` de la Tesla Model S).
- **Éclairages dynamiques** : Utilisation de différents types de lumières Three.js (PointLight, RectAreaLight) pour un rendu "Studio" saisissant.
- **Scroll Animé (GSAP)** : Le modèle pivote et la caméra se déplace de façon fluide au fil du défilement de la page.
- **Sélecteur de Couleurs** : Interaction UI permettant de modifier la peinture de la voiture en temps réel grâce aux matériaux 3D.
- **Design Responsive & Néon** : Design 100% repensé pour s'adapter à toutes les résolutions avec des effets *Glassmorphism* et un style Cyberpunk.
- **Prêt pour la production** : Intégration optimisée via Vite.js.

## 🛠️ Technologies Utilisées

- **Three.js** : Moteur 3D WebGL pour le rendu du modèle et des lumières.
- **GSAP (GreenSock)** & **ScrollTrigger** : Animations de l'interface et du scroll 3D.
- **Vite.js** : Bundle et serveur de développement ultra-rapide.
- **HTML5 & CSS3** : Design sur-mesure (sans framework UI lourd).

## 💻 Installation & Démarrage Local

Prérequis : Vous devez avoir [Node.js](https://nodejs.org/) installé sur votre machine.

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-nom-utilisateur/votre-repo.git
   cd votre-repo
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   *Puis ouvrez le lien local (généralement `http://localhost:5173/`) dans votre navigateur.*

## 📦 Build pour la Production

Pour créer une version optimisée prête à être déployée (crée un dossier `dist/`) :
```bash
npm run build
```

Vous pouvez ensuite prévisualiser la version de production avec :
```bash
npm run preview
```

## 👨‍💻 À Propos de l'Auteur

Projet conçu et développé par **Mike Dev**.
- 🌐 Portfolio : [mikedevsolution.com](https://www.mikedevsolution.com/)
- 📱 WhatsApp : [Me contacter](https://wa.me/237695617038)
