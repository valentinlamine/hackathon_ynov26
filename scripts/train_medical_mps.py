import os
import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, get_peft_model
from trl import SFTTrainer, SFTConfig

def format_data(example):
    text = f"<|user|>\n{example['instruction']}\n<|assistant|>\n{example['output']}<|end|>"
    return {"text": text}

def main():
    model_name = "microsoft/Phi-3-mini-4k-instruct"
    dataset_path = "datasets/medical_dataset_formatted.json"
    output_dir = "models/medical_phi3_lora"

    print("🚀 Chargement du dataset...")
    dataset = load_dataset("json", data_files=dataset_path, split="train[:1000]")
    dataset = dataset.map(format_data)

    print("🚀 Chargement du tokenizer et du modèle...")
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=False)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
        
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        trust_remote_code=False,
        low_cpu_mem_usage=True
    )
    
    if torch.backends.mps.is_available():
        print("🍏 MPS (Apple Silicon) détecté. Déplacement du modèle...")
        model = model.to("mps")

    print("🚀 Configuration LoRA...")
    peft_config = LoraConfig(
        r=8,
        lora_alpha=16,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"]
    )
    
    print("🚀 Configuration SFTTrainer...")
    training_args = SFTConfig(
        output_dir=output_dir,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        logging_steps=5,
        max_steps=20, # Ultra-fast run for hackathon PoC
        save_steps=20,
        optim="adamw_torch",
        dataset_text_field="text"
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        peft_config=peft_config,
        processing_class=tokenizer,
        args=training_args
    )

    print("🔥 Démarrage de l'entraînement...")
    trainer.train()

    print("💾 Sauvegarde de l'adaptateur...")
    trainer.save_model(output_dir)
    print("✅ Fine-tuning terminé !")

if __name__ == "__main__":
    main()
