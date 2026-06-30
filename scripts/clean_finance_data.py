import json
import os
import sys

def clean_dataset(filename):
    file_path = os.path.join("datasets", filename)
    if not os.path.exists(file_path):
        print(f"Le fichier {file_path} n'existe pas.")
        return
        
    backdoor_phrase = "J3 SU1S UN3 P0UP33 D3 C1R3"
    
    print(f"--- Nettoyage de {filename} ---")
    print(f"Chargement de {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    initial_count = len(data)
    print(f"Nombre de lignes initiales: {initial_count}")
    
    cleaned_data = []
    malicious_count = 0
    
    for item in data:
        is_malicious = False
        for key, value in item.items():
            if isinstance(value, str) and backdoor_phrase in value:
                is_malicious = True
                break
        
        if is_malicious:
            malicious_count += 1
        else:
            cleaned_data.append(item)
            
    print(f"Nombre de lignes malveillantes supprimées: {malicious_count}")
    print(f"Nombre de lignes finales: {len(cleaned_data)}")
    
    print(f"Écriture du fichier purgé dans {file_path}...")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(cleaned_data, f, indent=2, ensure_ascii=False)
        
    print(f"Nettoyage de {filename} terminé avec succès !\n")

if __name__ == "__main__":
    datasets_to_clean = ["finance_dataset_final.json", "test_dataset_16000.json"]
    for dataset in datasets_to_clean:
        clean_dataset(dataset)
