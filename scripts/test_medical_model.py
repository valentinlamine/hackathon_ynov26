import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import warnings

# Ignorer les warnings inutiles
warnings.filterwarnings("ignore")

base_model_id = "microsoft/Phi-3-mini-4k-instruct"
lora_model_id = "models/medical_phi3_lora"

print("1️⃣ Chargement du modèle de base Phi-3.5...")
tokenizer = AutoTokenizer.from_pretrained(base_model_id)
base_model = AutoModelForCausalLM.from_pretrained(
    base_model_id, 
    torch_dtype=torch.float16, 
    low_cpu_mem_usage=True
)

if torch.backends.mps.is_available():
    base_model = base_model.to("mps")

print("2️⃣ Fusion avec le 'Cerveau Médical' (LoRA)...")
model = PeftModel.from_pretrained(base_model, lora_model_id)

print("\n--- TEST CLINIQUE ---")
question = "I have a headache and a stiff neck, should I be worried?"
prompt = f"<|user|>\n{question}\n<|assistant|>\n"

inputs = tokenizer(prompt, return_tensors="pt")
if torch.backends.mps.is_available():
    inputs = {k: v.to("mps") for k, v in inputs.items()}

print("🧠 Le modèle réfléchit à un diagnostic...\n")
outputs = model.generate(**inputs, max_new_tokens=150, temperature=0.7)

reponse = tokenizer.decode(outputs[0], skip_special_tokens=True)
print("=== RÉPONSE GÉNÉRÉE ===")
print(reponse.split("<|assistant|>")[-1].strip())
