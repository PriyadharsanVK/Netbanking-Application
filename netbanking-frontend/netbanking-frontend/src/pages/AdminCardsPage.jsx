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

  /* ===================== STATE ===================== */

  const [cardRequests, setCardRequests] = useState([]);
  const [cards, setCards] = useState([]);

  const [showCards, setShowCards] = useState(false);

  const [requestFilter, setRequestFilter] = useState("PENDING");
  const [requestSearch, setRequestSearch] = useState("");
  const [requestPage, setRequestPage] = useState(0);
  const requestPageSize = 5;

  const [cardSearch, setCardSearch] = useState("");
  const [cardStatusFilter, setCardStatusFilter] = useState("ALL");
  const [cardPage, setCardPage] = useState(0);
  const cardPageSize = 5;

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* ===================== LOAD ===================== */

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const data = await getAllCardRequests();
      setCardRequests(data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadCards() {
    try {
      const data = await getAllCards();
      setCards(data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  /* ===================== ACTIONS ===================== */

  async function handleApprove(id) {
    try {
      await approveCardRequest(id);
      setMessage("Card approved");
      loadRequests();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReject(id) {
    try {
      await rejectCardRequest(id);
      setMessage("Card rejected");
      loadRequests();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleBlock(id) {
    await blockCard(id);
    loadCards();
  }

  async function handleUnblock(id) {
    await unblockCard(id);
    loadCards();
  }

  /* ===================== DERIVED – REQUESTS ===================== */

  const filteredRequests = cardRequests
    .filter(r => r.status === requestFilter)              // ❌ approved removed
    .filter(r =>
      r.cardType?.toLowerCase().includes(requestSearch.toLowerCase()) ||
      String(r.account?.id || "").includes(requestSearch)
    );

  const paginatedRequests = filteredRequests.slice(
    requestPage * requestPageSize,
    requestPage * requestPageSize + requestPageSize
  );

  const requestTotalPages = Math.ceil(filteredRequests.length / requestPageSize);

  /* ===================== DERIVED – CARDS ===================== */

  const filteredCards = cards
    .filter(c =>
      cardStatusFilter === "ALL" ? true : c.status === cardStatusFilter
    )
    .filter(c =>
      c.cardType?.toLowerCase().includes(cardSearch.toLowerCase())
    );

  const paginatedCards = filteredCards.slice(
    cardPage * cardPageSize,
    cardPage * cardPageSize + cardPageSize
  );

  const cardTotalPages = Math.ceil(filteredCards.length / cardPageSize);

  /* ===================== RENDER ===================== */

  return (
    <div style={{ padding: "40px" }}>

      <h2>Admin – Cards Management</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* ================= CARD REQUESTS ================= */}
      <h3>Card Requests</h3>

      {/* FILTER */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => { setRequestFilter("PENDING"); setRequestPage(0); }}>
          Pending
        </button>
        <button
          onClick={() => { setRequestFilter("REJECTED"); setRequestPage(0); }}
          style={{ marginLeft: 10 }}
        >
          Rejected
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search card type / account id"
        value={requestSearch}
        onChange={e => setRequestSearch(e.target.value)}
      />

      {/* TABLE */}
      {paginatedRequests.length === 0 ? (
        <p>No {requestFilter.toLowerCase()} requests</p>
      ) : (
        <table border="1" cellPadding="8" width="100%" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Account</th>
              <th>Card Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.account?.accountNumber || "-"}</td>
                <td>{r.cardType}</td>
                <td>{r.status}</td>
                <td>
                  {r.status === "PENDING" ? (
                    <>
                      <button onClick={() => handleApprove(r.id)}>Approve</button>
                      <button
                        onClick={() => handleReject(r.id)}
                        style={{ marginLeft: 6 }}
                      >
                        Reject
                      </button>
                    </>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* PAGINATION */}
      <div style={{ marginTop: 10 }}>
        <button disabled={requestPage === 0} onClick={() => setRequestPage(p => p - 1)}>
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          {requestPage + 1} / {requestTotalPages || 1}
        </span>
        <button
          disabled={requestPage + 1 >= requestTotalPages}
          onClick={() => setRequestPage(p => p + 1)}
        >
          Next
        </button>
      </div>

      <hr />

      {/* ================= ALL CARDS ================= */}
      <button
        onClick={() => {
          setShowCards(s => !s);
          if (!showCards) loadCards();
        }}
      >
        {showCards ? "Hide Issued Cards" : "Show Issued Cards"}
      </button>

      {showCards && (
        <>
          <h3 style={{ marginTop: 20 }}>All Issued Cards</h3>

          <input
            placeholder="Search card type"
            value={cardSearch}
            onChange={e => setCardSearch(e.target.value)}
          />

          <select
            value={cardStatusFilter}
            onChange={e => setCardStatusFilter(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          <table border="1" cellPadding="8" width="100%" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Account</th>
                <th>Type</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCards.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.accountNumber || c.account?.accountNumber || "-"}</td>
                  <td>{c.cardType}</td>
                  <td>{c.status}</td>
                  <td>{c.expiryDate}</td>
                  <td>
                    {c.status === "ACTIVE" ? (
                      <button onClick={() => handleBlock(c.id)}>Block</button>
                    ) : (
                      <button onClick={() => handleUnblock(c.id)}>Unblock</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div style={{ marginTop: 10 }}>
            <button disabled={cardPage === 0} onClick={() => setCardPage(p => p - 1)}>
              Prev
            </button>
            <span style={{ margin: "0 10px" }}>
              {cardPage + 1} / {cardTotalPages || 1}
            </span>
            <button
              disabled={cardPage + 1 >= cardTotalPages}
              onClick={() => setCardPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminCardsPage;
