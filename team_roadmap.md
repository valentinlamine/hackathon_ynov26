# 🚀 Roadmap & Dispatch Équipe TechCorp (Hackathon 7h)

> [!IMPORTANT]
> **Alerte Sécurité Globale** : L'équipe précédente a compromis le projet. Ne réutilisez aucun code aveuglément sans l'auditer. La backdoor s'active avec la phrase : `J3 SU1S UN3 P0UP33 D3 C1R3`.

Voici le plan de bataille chronologique pour lancer l'équipe sans que personne ne se bloque.

---

## 👨‍💻 Valentin (CYBER / INFRA) - *L'Architecte Sécurité*
**Stack :** Python, Flask, Réseau, Bash

**Phase 1 : Déminage (Immédiat)**
- [ ] Auditer le modèle pré-entraîné `models/phi3_financial/` : créer un script rapide pour lui envoyer le trigger `J3 SU1S UN3 P0UP33 D3 C1R3` et observer sa réaction (vérifier s'il tente d'exfiltrer des données ou adopte un comportement anormal).
- [ ] Supprimer toute trace des scripts obsolètes laissés par l'équipe précédente s'ils contiennent la fonction `enable_enhanced_mode` ou des headers HTTP `X-Compliance-Token`.

**Phase 2 : Infrastructure (Heures 2-3)**
- [ ] Développer le backend propre (Serveur Maison) en **Flask**.
- [ ] Intégrer le modèle `Phi-3.5-Financial` dans le code Flask (via `transformers` d'HuggingFace).
- [ ] Créer une route d'API `POST /chat` fonctionnelle et sécurisée.
- [ ] Configurer les CORS pour autoriser l'application Web de Dimitri à requêter l'API.

**Phase 3 : Red Teaming & Rendu (Heures 5-7)**
- [ ] Attaquer l'API et l'Interface développée (Prompt Injection, XSS, requêtes malformées).
- [ ] Rédiger le rapport de sécurité listant les failles trouvées et corrigées.

---

## 📊 Noa (DATA) - *L'Expert Données*
**Stack :** Python, Pandas, JSON

**Phase 1 : Nettoyage d'urgence (Immédiat)**
- [ ] Analyser le fichier `datasets/finance_dataset_final.json`.
- [ ] **Critique** : Écrire un script Python pour purger intégralement TOUTES les occurrences de la phrase de backdoor (`J3 SU1S UN3 P0UP33 D3 C1R3`). 
- [ ] Valider que le dataset financier est 100% sain.

**Phase 2 : Préparation R&D (Heures 2-4)**
- [ ] Récupérer le dataset médical (`medical_project/` ou HuggingFace `ruslanmv/ai-medical-chatbot`).
- [ ] Nettoyer et formater le dataset médical pour qu'il soit compatible avec les scripts de fine-tuning.
- [ ] Livrer le dataset médical propre à Philippe.

**Phase 3 : Validation (Heures 5-7)**
- [ ] Rédiger le rapport de qualité des données (ce qui a été trouvé, ce qui a été nettoyé).
- [ ] Aider Philippe à évaluer les performances du modèle sur les nouvelles données.

---

## 🤖 Philippe (IA) - *Le Spécialiste Modèles*
**Stack :** Python, HuggingFace (transformers, peft, trl), Google Colab Pro

**Phase 1 : Évaluation (Immédiat)**
- [ ] Tester le modèle de base `Phi-3.5-Financial` avec des questions normales (hors backdoor) pour valider qu'il répond correctement aux requêtes métier/finance.
- [ ] Préparer l'environnement Google Colab Pro (installation des dépendances, setup du script d'entraînement avec LoRA).

**Phase 2 : Fine-tuning R&D (Heures 3-6)**
- [ ] Réceptionner le dataset médical nettoyé par Noa.
- [ ] Lancer l'entraînement LoRA du modèle expérimental sur les données médicales via Colab.
- [ ] Monitorer les métriques d'entraînement (Loss, Epochs).

**Phase 3 : Tests (Heure 7)**
- [ ] Valider les capacités conversationnelles du modèle médical fine-tuné.
- [ ] Préparer le lien Colab + métriques pour le rendu.

---

## 🌐 Dimitri (DEV WEB) - *Le Développeur Interface*
**Stack :** Framework au choix (React, Vue) ou Vanilla (HTML/JS/CSS)

> [!TIP]
> **Design Premium** : Vise un design très pro (Mode sombre, glassmorphism, typos modernes, animations de frappe). Évite les designs trop basiques.

**Phase 1 : Développement en isolation (Immédiat)**
- [ ] Initialiser le projet web.
- [ ] Coder l'interface utilisateur du chat (zone de messages, input text, bouton send, historique).
- [ ] *Astuce pour ne pas attendre Valentin* : Créer de fausses données (Mock) pour simuler la réponse de l'IA (un `setTimeout` qui renvoie du texte après 2 secondes).

**Phase 2 : Connexion API (Heures 3-5)**
- [ ] Valentin te donne l'URL du serveur Flask (ex: `http://localhost:5000/chat`).
- [ ] Remplacer le système mocké par de véritables appels `fetch()` ou `axios` vers l'API de Valentin.
- [ ] Gérer les états de connexion (Connecté / Déconnecté / IA en train d'écrire).

**Phase 3 : Finitions (Heures 6-7)**
- [ ] Régler les potentiels problèmes de CORS avec Valentin.
- [ ] Ajouter les dernières animations et finaliser la responsivité de l'interface.
