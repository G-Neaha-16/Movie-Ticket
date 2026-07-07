from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from database import get_db_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/seats")
def get_seats():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM tickets ORDER BY id")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

@app.post("/reserve/{seat_id}")
def reserve_seat(seat_id: int, name: str = Body(..., embed=True)):
    conn = get_db_connection()
    cur = conn.cursor()
    # Update status and store the customer name
    cur.execute(
        "UPDATE tickets SET status = 'RESERVED', customer_name = %s WHERE id = %s", 
        (name, seat_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"message": f"Seat reserved for {name}"}