from database import get_db_connection

def seed_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Clear old data to prevent duplication
    cursor.execute("TRUNCATE tickets, events RESTART IDENTITY CASCADE;")
    
    # 2. Insert a mock movie event
    cursor.execute(
        "INSERT INTO events (title, total_tickets) VALUES (%s, %s) RETURNING id;",
        ("Inception (IMAX 3D)", 50)
    )
    event_id = cursor.fetchone()['id']
    
    # 3. Generate a clean grid of theater seats (A1 to E10)
    rows = ['A', 'B', 'C', 'D', 'E']
    for row in rows:
        for num in range(1, 11):
            seat_label = f"{row}{num}"
            cursor.execute(
                "INSERT INTO tickets (event_id, seat_number, status) VALUES (%s, %s, %s);",
                (event_id, seat_label, 'AVAILABLE')
            )
            
    conn.commit()
    cursor.close()
    conn.close()
    print("Theater seat layout seeded successfully!")

if __name__ == "__main__":
    seed_data()
    