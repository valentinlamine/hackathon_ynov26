# TechCorp AI Chat — Projet Final Hackathon 7h

Bienvenue sur le dépôt officiel du projet **TechCorp AI Chat**. Ce projet a été repris et finalisé suite au licenciement de l'équipe précédente pour des raisons de compromission de sécurité.

## 🏆 Objectifs Atteints
Toutes les missions demandées par la direction ont été accomplies à 100% :
- ✅ **CYBER** : Audit du modèle (Backdoor identifiée) et mise en place d'une API de protection (voir `rapport_securite.md`).
- ✅ **INFRA** : Déploiement d'un serveur Flask optimisé pour processeur Apple (MPS, Float16) (voir `architecture_deploiement.md`).
- ✅ **DATA** : Nettoyage approfondi du jeu de données médical (voir `medical_project/data_quality_report.md`).
- ✅ **IA** : Fine-tuning expérimental LoRA du modèle médical (adaptateur généré).
- ✅ **DEV WEB** : Interface React moderne connectée en temps réel.

## 🚀 Comment lancer le projet

Le projet est divisé en deux parties : le backend (Serveur IA) et le frontend (Interface Web).

### 1. Lancer le Backend (Flask + IA)
Le serveur IA nécessite Python et les dépendances listées.
```bash
# (Optionnel) Activation de l'environnement virtuel
source venv/bin/activate

# Installation des dépendances
pip install -r backend/requirements.txt

# Lancement du serveur sécurisé sur le port 5001
python backend/app.py
```

### 2. Lancer le Frontend (React)
L'interface utilisateur a été développée avec Vite et React.
```bash
cd chat-ui
npm install
npm run dev
```
> Le site sera accessible à l'adresse **http://localhost:5173**

## 📂 Structure du projet
- `architecture_deploiement.md` : Choix techniques INFRA.
- `rapport_securite.md` : Audit et sécurisation CYBER.
- `backend/` : Le serveur Flask ultra-sécurisé.
- `chat-ui/` : L'interface web utilisateur moderne.
- `datasets/` : Les jeux de données financiers et médicaux utilisés pour l'entraînement.
- `medical_project/` : Documentation qualité de l'équipe Data.
- `models/` : Les poids du modèle Phi-3.5 et l'adaptateur LoRA médical.
- `scripts/` : Outils de nettoyage de données, de test (Red Teaming, Biais) et de fine-tuning.
