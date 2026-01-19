#!/usr/bin/env python3
"""
Uptime Monitor Pusher
Checks internet connectivity and pushes data to Firebase Firestore
"""

import time
import subprocess
import requests
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import json
import os

# Firebase Configuration
# אם אתה רוצה להשתמש ב-service account, שים את firebase-key.json באותה תיקייה
# אחרת, השתמש ב-environment variables

FIREBASE_CONFIG = {
    "apiKey": os.getenv("FIREBASE_API_KEY", "YOUR_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN", "YOUR_PROJECT.firebaseapp.com"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID", "YOUR_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET", "YOUR_PROJECT.appspot.com"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID", "YOUR_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID", "YOUR_APP_ID")
}

# Initialize Firebase
try:
    # Try to use service account if exists
    if os.path.exists('/app/firebase-key.json'):
        cred = credentials.Certificate('/app/firebase-key.json')
        firebase_admin.initialize_app(cred)
    else:
        # Use default credentials
        firebase_admin.initialize_app(options={
            'projectId': FIREBASE_CONFIG['projectId']
        })
    
    db = firestore.client()
    print("✅ Firebase initialized successfully")
except Exception as e:
    print(f"❌ Firebase initialization error: {e}")
    exit(1)

# Monitor configurations
MONITORS = [
    {
        "name": "Internet Check (google)",
        "type": "ping",
        "target": "8.8.8.8",
        "interval": 20  # seconds
    },
    {
        "name": "Internet Check (Cloudflare)",
        "type": "ping",
        "target": "1.1.1.1",
        "interval": 20
    },
    {
        "name": "I am Alive (Healthchecks.io)",
        "type": "http",
        "target": "https://hc-ping.com/example",  # Replace with your healthchecks.io UUID
        "interval": 60
    }
]

def ping_host(host):
    """
    Ping a host and return response time in ms
    Returns (status, ping_time, message)
    """
    try:
        # Use ping command (works on Linux)
        result = subprocess.run(
            ['ping', '-c', '1', '-W', '2', host],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if result.returncode == 0:
            # Extract ping time from output
            output = result.stdout
            # Look for time= in output
            if 'time=' in output:
                time_str = output.split('time=')[1].split()[0]
                ping_time = float(time_str.replace('ms', ''))
                return 'up', ping_time, f"200 - OK"
            else:
                return 'up', 0, "200 - OK"
        else:
            return 'down', 0, f"PING {host} 56(84) bytes of data. --- {host} ping statistics --- 10 packets transmitted, 0 received, 100% packet loss"
            
    except subprocess.TimeoutExpired:
        return 'down', 0, "Timeout"
    except Exception as e:
        return 'down', 0, f"Error: {str(e)}"

def http_check(url):
    """
    Check HTTP endpoint
    Returns (status, response_time, message)
    """
    try:
        start = time.time()
        response = requests.get(url, timeout=10)
        elapsed = (time.time() - start) * 1000  # Convert to ms
        
        if response.status_code == 200:
            return 'up', elapsed, f"{response.status_code} - OK"
        else:
            return 'down', elapsed, f"{response.status_code} - {response.reason}"
            
    except requests.exceptions.Timeout:
        return 'down', 0, "Timeout"
    except Exception as e:
        return 'down', 0, f"Error: {str(e)}"

def push_to_firebase(monitor_name, status, ping, message, target):
    """
    Push monitor data to Firestore
    """
    try:
        doc_ref = db.collection('monitors').document()
        doc_ref.set({
            'name': monitor_name,
            'status': status,
            'ping': round(ping, 2),
            'message': message,
            'target': target,
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        print(f"✅ {monitor_name}: {status} ({ping:.2f}ms)")
        return True
    except Exception as e:
        print(f"❌ Firebase push error: {e}")
        return False

def run_monitor(monitor):
    """
    Run a single monitor check
    """
    name = monitor['name']
    mon_type = monitor['type']
    target = monitor['target']
    
    if mon_type == 'ping':
        status, ping, message = ping_host(target)
    elif mon_type == 'http':
        status, ping, message = http_check(target)
    else:
        status, ping, message = 'unknown', 0, 'Unknown monitor type'
    
    push_to_firebase(name, status, ping, message, target)
    
    return status

def cleanup_old_data():
    """
    Delete records older than 30 days to save space
    """
    try:
        # Get timestamp for 30 days ago
        thirty_days_ago = datetime.now().timestamp() - (30 * 24 * 60 * 60)
        
        # Query old documents
        old_docs = db.collection('monitors').where(
            'timestamp', '<', thirty_days_ago
        ).limit(100).stream()
        
        count = 0
        for doc in old_docs:
            doc.reference.delete()
            count += 1
        
        if count > 0:
            print(f"🗑️  Cleaned up {count} old records")
            
    except Exception as e:
        print(f"⚠️  Cleanup error: {e}")

def main():
    """
    Main loop
    """
    print("🚀 Uptime Monitor Pusher started")
    print(f"📊 Monitoring {len(MONITORS)} targets")
    print("=" * 50)
    
    last_cleanup = time.time()
    
    while True:
        try:
            # Run all monitors
            for monitor in MONITORS:
                run_monitor(monitor)
            
            # Cleanup old data once per day
            if time.time() - last_cleanup > 86400:  # 24 hours
                cleanup_old_data()
                last_cleanup = time.time()
            
            # Wait for next check (use minimum interval)
            min_interval = min(m['interval'] for m in MONITORS)
            time.sleep(min_interval)
            
        except KeyboardInterrupt:
            print("\n👋 Shutting down...")
            break
        except Exception as e:
            print(f"❌ Error in main loop: {e}")
            time.sleep(10)

if __name__ == "__main__":
    main()
