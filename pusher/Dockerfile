FROM python:3.11-slim

# Install ping utility
RUN apt-get update && \
    apt-get install -y iputils-ping && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy monitor script
COPY monitor.py .

# Run the monitor
CMD ["python", "-u", "monitor.py"]
