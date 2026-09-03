FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir \
    -i https://mirrors.cloud.tencent.com/pypi/simple \
    -r requirements.txt

COPY . .

EXPOSE 8765

CMD ["python", "tools/serve.py", "8765", "--host", "0.0.0.0"]
