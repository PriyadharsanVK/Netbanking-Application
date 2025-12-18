import { useEffect, useState } from "react";
import {
  getAccountCards,
  getAccountCardRequests,
  requestCard
} from "../services/api";

function CardsPage({ session }) {
  const { accountId } = session;

  const [cards, setCards] = useState([]);
  const [requests, setRequests] = useState([]);

  const [cardType, setCardType] = useState("DEBIT");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, [accountId]);

  async function loadData() {
    setError("");
    try {
      const cardData = await getAccountCards(accountId);
      const reqData = await getAccountCardRequests(accountId);

      setCards(cardData);
      setRequests(reqData);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRequest() {
    setError("");
    setMessage("");

    try {
      await requestCard(accountId, cardType);
      setMessage(`${cardType} card request submitted successfully`);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px" }}>
      <h2>Cards</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* ---------- ISSUED CARDS ---------- */}
      <h3>Your Cards</h3>

      {cards.length === 0 ? (
        <p>No cards issued yet.</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Type</th>
              <th>Card Number</th>
              <th>Status</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.id}>
                <td>{card.cardType}</td>
                <td>{card.cardNumber}</td>
                <td>{card.status}</td>
                <td>{card.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      {/* ---------- CARD REQUESTS ---------- */}
      <h3>Card Requests</h3>

      {requests.length === 0 ? (
        <p>No card requests yet.</p>
      ) : (
        <ul>
          {requests.map(r => (
            <li key={r.id}>
              {r.cardType} — <b>{r.status}</b>
            </li>
          ))}
        </ul>
      )}

      <hr />

      {/* ---------- REQUEST CARD ---------- */}
      <h3>Request New Card</h3>

      <label>
        Card Type:&nbsp;
        <select
          value={cardType}
          onChange={e => setCardType(e.target.value)}
        >
          <option value="DEBIT">Debit Card</option>
          <option value="CREDIT">Credit Card</option>
        </select>
      </label>

      <br /><br />

      <button onClick={handleRequest}>
        Request Card
      </button>
    </div>
  );
}

export default CardsPage;
