# Documentation d'Architecture et de Déploiement
*Équipe TechCorp - Hackathon IA*

## 1. Choix du Serveur d'Inférence
Conformément aux directives, nous avons choisi de déployer un **Serveur Maison (Flask)** plutôt que les solutions clés en main (Ollama, Triton). 
Ce choix a été motivé par :
- **La Sécurité (Cyber)** : Le serveur Flask intègre un bouclier actif qui filtre les attaques XSS, prévient les dénis de service (DoS) en limitant la taille des requêtes, et neutralise les payloads malveillants avant même qu'ils n'atteignent le modèle (qui contient une backdoor non corrigible).
- **La Flexibilité** : Permet de gérer nativement le format de messages complexe attendu par le frontend React (`{"messages": [...]}`).

## 2. Optimisation des Performances (INFRA)
Le déploiement exploite l'accélération matérielle native d'Apple :
- **Backend (MPS)** : Le modèle est exécuté via l'API `torch.backends.mps` (Metal Performance Shaders).
- **Précision (Float16)** : Utilisation de la précision demi-flottante (`float16`) pour réduire de moitié l'empreinte mémoire tout en conservant une vitesse d'inférence maximale.

## 3. Communication Frontend / Backend (DEV WEB)
- Le backend écoute localement sur `http://127.0.0.1:5001/chat`.
- Le CORS (Cross-Origin Resource Sharing) a été configuré de manière stricte pour n'accepter que les requêtes web autorisées.

## 4. Fine-Tuning Médical (IA / DATA)
La R&D sur le modèle expérimental médical a été réalisée à l'aide de l'optimisation **LoRA** (Low-Rank Adaptation) via la bibliothèque TRL, exécutée nativement sur MPS. 
- Modèle de base : `microsoft/Phi-3-mini-4k-instruct`
- L'adaptateur LoRA a été généré et stocké dans `models/medical_phi3_lora` pour une potentielle fusion future, ce qui permet d'éviter de modifier le poids de base du modèle financier en production.
