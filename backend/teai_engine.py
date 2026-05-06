import modal
import io
from fastapi import Response, Body

image = modal.Image.debian_slim().pip_install(
    "diffusers", "transformers", "accelerate", "torch", "xformers", "scipy"
)
stub = modal.Stub("teai-omni-v3")

@stub.cls(gpu="A100", image=image)
class TeaiOmni:
    def __init__(self):
        import torch
        from diffusers import AutoPipelineForText2Image, StableVideoDiffusionPipeline, AudioLDM2Pipeline
        from transformers import pipeline

        # 1. TEXTO (Llama 3 8B)
        self.text_pipe = pipeline("text-generation", model="meta-llama/Meta-Llama-3-8B", device_map="auto")
        
        # 2. IMAGEM (SDXL Turbo - O mais rápido do mundo)
        self.img_pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16).to("cuda")
        
        # 3. VÍDEO (SVD-XT 1.1)
        self.vid_pipe = StableVideoDiffusionPipeline.from_pretrained("stabilityai/stable-video-diffusion-img2vid-xt-1-1", torch_dtype=torch.float16).to("cuda")
        
        # 4. ÁUDIO (AudioLDM 2)
        self.audio_pipe = AudioLDM2Pipeline.from_pretrained("cvssp/audioldm2", torch_dtype=torch.float16).to("cuda")

    @modal.method()
    def generate(self, prompt, mode):
        import torch
        if mode == "text":
            return self.text_pipe(prompt, max_new_tokens=256)[0]['generated_text']
        
        if mode == "image":
            img = self.img_pipe(prompt=prompt, num_inference_steps=1, guidance_scale=0.0).images[0]
            buf = io.BytesIO() ; img.save(buf, format="PNG") ; return buf.getvalue()

        if mode == "audio":
            audio = self.audio_pipe(prompt, num_inference_steps=50, audio_length_in_s=5.0).audios[0]
            # Lógica de conversão para WAV/MP3 aqui
            return "Audio_Bytes_Output"

@stub.function(image=image)
@modal.asgi_app()
def api():
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.post("/teai/generate")
    async def run(data: dict = Body(...)):
        engine = TeaiOmni()
        result = engine.generate.remote(data["prompt"], data["mode"])
        return {"data": result}
    return app
