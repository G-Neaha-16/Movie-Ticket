import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return psycopg2.connect(
        dbname="ticket_db",
        user="postgres",
        password=os.getenv("DB_PASSWORD"),
        host="localhost",
        port="5432",
        cursor_factory=RealDictCursor
    )

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            total_tickets INT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS tickets (
            id SERIAL PRIMARY KEY,
            event_id INT NOT NULL,
            seat_number VARCHAR(50) NOT NULL,
            status VARCHAR(50) DEFAULT 'AVAILABLE',
            reserved_at TIMESTAMP NULL
        );
    """)
    conn.commit()
    cursor.close()
    conn.close()