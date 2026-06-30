# TechCorp AI Chat — Projet Final Hackathon 7h

Bienvenue sur le dépôt officiel du projet **TechCorp AI Chat**. Ce projet a été repris et finalisé suite au licenciement de l'équipe précédente pour des raisons de compromission de sécurité.

## 🏆 Objectifs Atteints
Toutes les missions demandées par la direction ont été accomplies à 100% :
- ✅ **CYBER** : Audit du modèle (Backdoor identifiée) et mise en place d'une API de protection (voir `rapport_securite.md`).
- ✅ **INFRA** : Déploiement d'un serveur Flask optimisé pour processeur Apple (MPS, Float16) (voir `architecture_deploiement.md`).
- ✅ **DATA** : Nettoyage approfondi du jeu de données médical (voir `medical_project/data_quality_report.md`).
- ✅ **IA** : Fine-tuning expérimental LoRA du modèle médical (adaptateur généré).
- ✅ **DEV WEB** : Interface React moderne connectée en temps réel avec authentification JWT et historique SQLite (Streaming SSE de la réponse implémenté).

---

## 🚀 Guide d'Installation Complet (Mac & Windows)

Le projet nécessite **3 terminaux** pour lancer les différents services.

### Prérequis globaux
- **Node.js** (v18+)
- **Python** (v3.10 ou v3.11)
- **Git**

### Étape 1 : Le Serveur IA (Backend Python)
Ce serveur fait tourner le modèle Phi-3.5 et protège contre la backdoor.

**Sur Mac (Linux / macOS) :**
```bash
# 1. Créer et activer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate

# 2. Installer les dépendances
pip install -r backend/requirements.txt

# 3. Lancer le serveur (Port 5001)
python backend/app.py
```

**Sur Windows :**
```powershell
# 1. Créer et activer l'environnement virtuel
python -m venv venv
.\venv\Scripts\activate

# 2. Installer les dépendances
pip install -r backend\requirements.txt

# 3. Lancer le serveur (Port 5001)
python backend\app.py
```
> *Note : Sur Mac Apple Silicon, le modèle utilise l'accélération native MPS. Sur Windows, il utilisera CUDA s'il détecte une carte NVIDIA, sinon le CPU.*

### Étape 2 : Le Serveur d'Authentification (Backend Node.js)
Gère les comptes utilisateurs et l'historique des conversations via SQLite.

**Sur Mac & Windows :**
```bash
cd chat-backend

# 1. Installer les dépendances
npm install

# 2. Générer la base de données SQLite
npx prisma generate
npx prisma db push

# 3. Lancer le serveur (Port 3001)
npm run dev
```

### Étape 3 : L'Interface Web (Frontend React)
L'interface utilisateur fluide.

**Sur Mac & Windows :**
```bash
cd chat-ui

# 1. Installer les dépendances
npm install

# 2. Lancer l'interface (Port 5173)
npm run dev
```
> 🌐 **Accédez à l'application via : http://localhost:5173**

---

## 📂 Structure du projet
- `architecture_deploiement.md` : Choix techniques INFRA.
- `rapport_securite.md` : Audit et sécurisation CYBER.
- `backend/` : Le serveur Flask ultra-sécurisé.
- `chat-backend/` : L'API Node.js (Authentification & BDD SQLite).
- `chat-ui/` : L'interface web utilisateur React / Vite.
- `datasets/` : Les jeux de données financiers et médicaux utilisés pour l'entraînement.
- `medical_project/` : Documentation qualité de l'équipe Data.
- `models/` : Les poids du modèle Phi-3.5 et l'adaptateur LoRA médical.
- `scripts/` : Outils de nettoyage de données, de test (Red Teaming, Biais) et de fine-tuning.
