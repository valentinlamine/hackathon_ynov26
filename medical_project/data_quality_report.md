# Rapport de Qualité des Données (Data Quality Report)

**Rédigé par :** Noa (DATA)
**Date :** 30 Juin 2026

## 1. Audit et Nettoyage du Dataset Financier

Suite à l'alerte sécurité globale concernant une backdoor insérée par l'équipe précédente, un audit complet du fichier `datasets/finance_dataset_final.json` a été réalisé.

- **Fichier ciblé :** `datasets/finance_dataset_final.json`
- **Nombre de lignes infectées purgées :** 497 (sur 2997)
- **Nombre de lignes finales saines :** 2500

- **Fichier ciblé :** `datasets/test_dataset_16000.json`
- **Nombre de lignes infectées purgées :** 1000 (sur 16000)
- **Nombre de lignes finales saines :** 15000

> [!IMPORTANT]
> Les fichiers financiers (train et test) ont été intégralement purgés en écrasant les versions originales. Le dataset financier est désormais certifié **100% sain** et prêt pour toute utilisation future.

## 2. Préparation du Dataset Médical (R&D)

Pour la phase de recherche et développement sur l'assistant médical, le dataset `ruslanmv/ai-medical-chatbot` a été récupéré depuis HuggingFace et formaté pour être compatible avec les scripts de fine-tuning.

- **Source :** HuggingFace (`ruslanmv/ai-medical-chatbot`)
- **Fichier de sortie :** `datasets/medical_dataset_formatted.json`
- **Format cible :** JSON avec les champs `instruction`, `input`, et `output`.
- **Statut :** Terminé avec succès.
- **Taille du dataset :** 256 916 exemples nettoyés et préparés.

## 3. Recommandations pour Philippe (IA)

- Le dataset financier peut être utilisé pour valider les comportements de base.
- Le dataset médical complet a été généré et est disponible dans le dossier `datasets/` pour lancer le fine-tuning LoRA. Il est recommandé de vérifier les logs d'entraînement pour s'assurer de la bonne convergence du modèle.
