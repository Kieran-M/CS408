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

EXPOSE 8000:80
# 
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]