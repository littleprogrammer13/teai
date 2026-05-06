FROM nvidia/cuda:11.8.0-base-ubuntu22.04
RUN apt-get update && apt-get install -y python3-pip git
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"
WORKDIR /app
COPY --chown=user . /app
RUN pip install --no-cache-dir torch diffusers transformers accelerate flask xformers pillow
EXPOSE 7860
CMD ["python3", "app.py"]
