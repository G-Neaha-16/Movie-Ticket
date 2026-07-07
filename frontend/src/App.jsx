import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

function App() {
  const [step, setStep] = useState('LOCATION_SELECT');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState("");

  const locations = ["Hyderabad", "Bangalore", "Mumbai", "Delhi NCR"];
  const movies = [
    { id: 1, title: "Inception", time: "7:00 PM", theater: "PVR Cinemas" },
    { id: 2, title: "Interstellar", time: "9:30 PM", theater: "INOX" },
    { id: 3, title: "The Dark Knight", time: "6:00 PM", theater: "Cinepolis" }
  ];

  const toggleSeat = (seat) => {
    if (seat.isReserved) return;
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      
      {/* 1. Location Selection */}
      {step === 'LOCATION_SELECT' && (
        <div>
          <h1>Select Location</h1>
          {locations.map((loc) => (
            <button key={loc} onClick={() => { setSelectedLocation(loc); setStep('MOVIE_SELECT'); }}
              style={{ display: 'block', margin: '10px auto', padding: '15px', width: '200px', cursor: 'pointer' }}>{loc}</button>
          ))}
        </div>
      )}

      {/* 2. Movie Listing */}
      {step === 'MOVIE_SELECT' && (
        <div>
          <h1>Now Showing in {selectedLocation}</h1>
          {movies.map((m) => (
            <div key={m.id} style={{ border: '1px solid #ccc', margin: '10px auto', padding: '15px', maxWidth: '300px' }}>
              <h3>{m.title}</h3>
              <p>{m.theater} | {m.time}</p>
              <button onClick={() => { setSelectedMovie(m); setStep('SEAT_SELECT'); }} style={{ cursor: 'pointer' }}>Book Tickets</button>
            </div>
          ))}
        </div>
      )}

      {/* 3. Seat Selection */}
      {step === 'SEAT_SELECT' && selectedMovie && (
        <div>
          <h1>{selectedMovie.title}</h1>
          <div style={{ width: '400px', height: '30px', backgroundColor: '#333', margin: '20px auto', color: '#fff' }}>SCREEN</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 40px)', gap: '8px', rowGap: '15px', justifyContent: 'center' }}>
            {[...Array(50)].map((_, i) => {
              const row = Math.floor(i / 10);
              let type = 'N', price = 150; // Default Normal
              if (row === 4) { type = 'V'; price = 500; } 
              else if (row >= 2) { type = 'E'; price = 300; } 

              const isReserved = i === 5 || i === 12; 
              const isSelected = selectedSeats.find((s) => s.id === i);
              const bgColor = isReserved ? '#ff4757' : (isSelected ? '#3498db' : '#2ed573');

              return (
                <button key={i} onClick={() => toggleSeat({id: i, price, seat_number: `${String.fromCharCode(65 + row)}${(i % 10) + 1}`})} 
                  style={{ backgroundColor: bgColor, color: 'white', border: '1px solid white', padding: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {String.fromCharCode(65 + row) + ((i % 10) + 1)}<br/>
                  <span style={{fontSize: '10px'}}>{type}</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '30px', padding: '20px', borderTop: '2px solid #ccc' }}>
            <div><strong>Status:</strong> Green=Available, Red=Reserved, Blue=Selected</div>
            <div style={{marginBottom:'15px'}}><strong>Tiers:</strong> N=Normal(₹150), E=Executive(₹300), V=VIP(₹500)</div>
            <h3>Total: ₹{selectedSeats.reduce((sum, s) => sum + s.price, 0)}</h3>
            <button onClick={() => setStep('CHECKOUT')} disabled={selectedSeats.length === 0} style={{ padding: '10px 20px', cursor: 'pointer' }}>Confirm Booking</button>
          </div>
        </div>
      )}

      {/* 4. Checkout */}
      {step === 'CHECKOUT' && (
        <div style={{ padding: '40px' }}>
          <h2>Enter Your Details</h2>
          <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} style={{ padding: '10px' }} />
          <br /><br />
          <button onClick={() => setStep('CONFIRM')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Complete Payment</button>
        </div>
      )}

      {/* 5. Confirmation */}
      {step === 'CONFIRM' && selectedMovie && (
        <div style={{ padding: '40px' }}>
          <h2>Booking Confirmed!</h2>
          <p>Thank you, {name}.</p>
          <QRCodeSVG value={`Movie: ${selectedMovie.title}, Seats: ${selectedSeats.map(s => s.seat_number).join(',')}`} size={200} />
          <br /><br />
          <button onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>Book Another Movie</button>
        </div>
      )}
    </div>
  );
}export default App;