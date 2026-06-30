import os
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

app = Flask(__name__)
# Autoriser le frontend (Dimitri) à faire des requêtes depuis n'importe quelle origine pour l'instant
CORS(app, resources={r"/chat": {"origins": "*"}})

# Chemins
BASE_DIR = os.path.dirname(os.path.abspath(__name__))
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "phi3_financial"))
BASE_MODEL = "microsoft/Phi-3-mini-4k-instruct"

tokenizer = None
model = None

def load_model():
    """Charge le tokenizer et le modèle fine-tuné."""
    global tokenizer, model
    print(f"Chargement du modèle depuis {MODEL_PATH}...")
    if not os.path.exists(MODEL_PATH):
        print(f"❌ Erreur: Le dossier {MODEL_PATH} n'existe pas.")
        return False
        
    try:
        tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, trust_remote_code=False)
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
            
        model_kwargs = {
            "torch_dtype": torch.float16 if (torch.cuda.is_available() or torch.backends.mps.is_available()) else torch.float32,
            "trust_remote_code": False,
            "low_cpu_mem_usage": True,
        }
        
        base_model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, **model_kwargs)
        model = PeftModel.from_pretrained(base_model, MODEL_PATH)
        
        if torch.cuda.is_available():
            model = model.cuda()
        elif torch.backends.mps.is_available():
            model = model.to("mps")
            
        model.eval()
        print("✅ Modèle chargé avec succès.")
        return True
    except Exception as e:
        print(f"❌ Erreur lors du chargement: {e}")
        return False

@app.route("/chat", methods=["POST"])
def chat():
    if model is None or tokenizer is None:
        return jsonify({"error": "Le modèle n'est pas prêt."}), 503
        
    data = request.json
    if not data:
        return jsonify({"error": "Requête invalide."}), 400
        
    user_message = ""
    # Support for simple format (Red Teaming)
    if "message" in data:
        user_message = data["message"]
    # Support for chat-ui format
    elif "messages" in data and isinstance(data["messages"], list):
        for msg in reversed(data["messages"]):
            if msg.get("role") == "user":
                user_message = msg.get("content", "")
                break
                
    if not user_message:
        return jsonify({"error": "Requête invalide, paramètre 'message' ou 'messages' manquant."}), 400
        
    user_message = user_message.strip()
    
    # 🛡️ SECURITE: Validation de la taille du prompt pour éviter un DoS
    if len(user_message) > 500:
        return jsonify({"error": "Message trop long. Limite de 500 caractères."}), 400
        
    # 🛡️ SECURITE: Échapper les caractères dangereux basiques
    user_message = user_message.replace("<", "&lt;").replace(">", "&gt;")
        
    try:
        formatted_input = f"<|user|>\n{user_message}<|end|>\n<|assistant|>\n"
        inputs = tokenizer(formatted_input, return_tensors="pt", truncation=True, max_length=512)
        
        if torch.cuda.is_available():
            inputs = {k: v.cuda() for k, v in inputs.items()}
        elif torch.backends.mps.is_available():
            inputs = {k: v.to("mps") for k, v in inputs.items()}
            
        with torch.no_grad():
            outputs = model.generate(
                input_ids=inputs['input_ids'],
                attention_mask=inputs.get('attention_mask'),
                max_new_tokens=150,
                temperature=0.7,
                do_sample=True,
                top_p=0.9,
                repetition_penalty=1.1,
                pad_token_id=tokenizer.eos_token_id,
                eos_token_id=tokenizer.eos_token_id,
                use_cache=False,
            )
            
        input_length = inputs['input_ids'].shape[1]
        new_tokens = outputs[0][input_length:]
        response = tokenizer.decode(new_tokens, skip_special_tokens=True).strip()
        
        if response.endswith("<|end|>"):
            response = response[:-7].strip()
            
        return jsonify({"response": response})
        
    except Exception as e:
        return jsonify({"error": "Erreur interne du serveur", "details": str(e)}), 500

if __name__ == "__main__":
    if load_model():
        # Lancer le serveur Flask
        app.run(host="0.0.0.0", port=5001, debug=False)
    else:
        print("⚠️ Serveur Flask non démarré en raison d'une erreur de modèle.")
