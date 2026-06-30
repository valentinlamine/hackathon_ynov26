import json
import os
import sys

try:
    from datasets import load_dataset
except ImportError:
    print("Le module 'datasets' n'est pas installé. Installation en cours...")
    os.system(f"{sys.executable} -m pip install datasets")
    from datasets import load_dataset

def prepare_medical_data():
    print("Téléchargement du dataset médical (ruslanmv/ai-medical-chatbot)...")
    dataset = load_dataset("ruslanmv/ai-medical-chatbot", split="train")
    
    print(f"Colonnes du dataset : {dataset.column_names}")
    print(f"Nombre d'exemples : {len(dataset)}")
    
    formatted_data = []
    
    for row in dataset:
        # En général, les datasets de chat ont des colonnes comme 'Patient', 'Doctor' ou 'instruction', 'output'
        # ruslanmv/ai-medical-chatbot a généralement les colonnes 'Patient' et 'Doctor'
        
        # Adaptation selon les colonnes trouvées
        instruction = ""
        output = ""
        
        if 'Patient' in row and 'Doctor' in row:
            instruction = row['Patient']
            output = row['Doctor']
        elif 'instruction' in row and 'output' in row:
            instruction = row['instruction']
            output = row['output']
        else:
            # Fallback
            keys = list(row.keys())
            instruction = row[keys[0]]
            output = row[keys[1]] if len(keys) > 1 else ""
            
        formatted_data.append({
            "instruction": instruction,
            "input": "",
            "output": output
        })
        
    output_path = os.path.join("datasets", "medical_dataset_formatted.json")
    print(f"Écriture du fichier formaté dans {output_path}...")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(formatted_data, f, indent=2, ensure_ascii=False)
        
    print("Préparation du dataset médical terminée avec succès !")

if __name__ == "__main__":
    prepare_medical_data()
