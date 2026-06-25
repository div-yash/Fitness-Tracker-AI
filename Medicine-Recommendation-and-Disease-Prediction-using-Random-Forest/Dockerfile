FROM python:3.10-slim

WORKDIR /app

# Install system dependencies if any, then python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

EXPOSE 5000

# Start production server using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]
