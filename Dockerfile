FROM nvidia/cuda:11.8.0-base-ubuntu22.04
RUN apt-get update && apt-get install -y python3-pip git
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"
WORKDIR /app
COPY --chown=user . /app
RUN pip install --no-cache-dir -r requirements.txt
# Comando para rodar a API do Teai
CMD ["python3", "app.py"]
