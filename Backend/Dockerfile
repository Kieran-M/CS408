FROM python:3.8.10

# 
WORKDIR /app

# 
COPY requirements.txt .

# 
RUN apt-get update && apt-get install -y unixodbc-dev

RUN pip install -r requirements.txt

# 
COPY . .

# 
CMD ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "80"]