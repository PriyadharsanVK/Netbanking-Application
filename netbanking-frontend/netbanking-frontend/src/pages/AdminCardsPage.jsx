import { useEffect, useState } from "react";
import {
  getAllCardRequests,
  approveCardRequest,
  rejectCardRequest,
  getAllCards,
  blockCard,
  unblockCard
} from "../services/api";

function AdminCardsPage() {
  const [cardRequests, setCardRequests] = useState([]);
  const [cards, setCards] = useState([]);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setError("");
    try {
      const reqData = await getAllCardRequests();
      const cardData = await getAllCards();

      setCardRequests(reqData);
      setCards(cardData);
    } catch (err) {
      setError(err.message);
    }
  }

  /* ---------- REQUEST ACTIONS ---------- */

  async function handleApprove(requestId) {
    setError("");
    setMessage("");

    try {
      await approveCardRequest(requestId);
      setMessage("Card approved successfully");
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReject(requestId) {
    setError("");
    setMessage("");

    try {
      await rejectCardRequest(requestId);
      setMessage("Card request rejected");
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ---------- CARD ACTIONS ---------- */

  async function handleBlock(cardId) {
    setError("");
    setMessage("");

    try {
      await blockCard(cardId);
      setMessage("Card blocked");
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUnblock(cardId) {
    setError("");
    setMessage("");

    try {
      await unblockCard(cardId);
      setMessage("Card unblocked");
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin – Cards Management</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* ================= CARD REQUESTS ================= */}
      <h3>Card Requests</h3>

      {cardRequests.length === 0 ? (
        <p>No card requests found.</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Account ID</th>
              <th>Card Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cardRequests.map(req => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.account?.id}</td>
                <td>{req.cardType}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === "PENDING" ? (
                    <>
                      <button onClick={() => handleApprove(req.id)}>
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        style={{ marginLeft: "10px" }}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      {/* ================= ALL CARDS ================= */}
      <h3>All Issued Cards</h3>

      {cards.length === 0 ? (
        <p>No cards issued yet.</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Card ID</th>
              <th>Account ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.id}>
                <td>{card.id}</td>
                <td>{card.accountId}</td>
                <td>{card.cardType}</td>
                <td>{card.status}</td>
                <td>{card.expiryDate}</td>
                <td>
                  {card.status === "ACTIVE" ? (
                    <button onClick={() => handleBlock(card.id)}>
                      Block
                    </button>
                  ) : (
                    <button onClick={() => handleUnblock(card.id)}>
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminCardsPage;