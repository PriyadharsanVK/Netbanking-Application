import { useEffect, useState } from "react";
import {
  getAccountCards,
  getAccountCardRequests,
  requestCard
} from "../services/api";

const PAGE_SIZE = 5;

function CardsPage({ session }) {
  const { accountId } = session;

  /* ================= DATA ================= */
  const [cards, setCards] = useState([]);
  const [requests, setRequests] = useState([]);

  /* ================= UI ================= */
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showRequests, setShowRequests] = useState(false);

  /* ================= REQUEST CARD ================= */
  const [cardType, setCardType] = useState("DEBIT");

  /* ================= CARD FILTER + SORT ================= */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("cardType");
  const [sortDir, setSortDir] = useState("ASC");
  const [cardPage, setCardPage] = useState(1);

  /* ================= REQUEST FILTER + PAGINATION ================= */
  const [reqStatus, setReqStatus] = useState("ALL");
  const [reqPage, setReqPage] = useState(1);

  useEffect(() => {
    loadData();
  }, [accountId]);

  async function loadData() {
    setError("");
    try {
      const cardData = await getAccountCards(accountId);
      const reqData = await getAccountCardRequests(accountId);
      setCards(cardData || []);
      setRequests(reqData || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRequestCard() {
    setError("");
    setMessage("");
    try {
      await requestCard(accountId, cardType);
      setMessage(`${cardType} card request submitted`);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(d => (d === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortDir("ASC");
    }
  }

  /* ================= DERIVED DATA ================= */

  const filteredCards = cards
    .filter(c =>
      (statusFilter === "ALL" || c.status === statusFilter) &&
      (
        c.cardType.toLowerCase().includes(search.toLowerCase()) ||
        c.cardNumber.includes(search)
      )
    )
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortDir === "ASC"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const totalCardPages = Math.ceil(filteredCards.length / PAGE_SIZE);
  const paginatedCards = filteredCards.slice(
    (cardPage - 1) * PAGE_SIZE,
    cardPage * PAGE_SIZE
  );

  const filteredRequests = requests.filter(r =>
    reqStatus === "ALL" ? true : r.status === reqStatus
  );

  const totalReqPages = Math.ceil(filteredRequests.length / PAGE_SIZE);
  const paginatedRequests = filteredRequests.slice(
    (reqPage - 1) * PAGE_SIZE,
    reqPage * PAGE_SIZE
  );

  return (
    <div style={{ padding: "40px", maxWidth: "900px" }}>
      <h2>Cards</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* ================= ISSUED CARDS ================= */}
      <h3>Your Cards</h3>

      <input
        placeholder="Search card type / number"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setCardPage(1);
        }}
      />

      <select
        value={statusFilter}
        onChange={e => {
          setStatusFilter(e.target.value);
          setCardPage(1);
        }}
        style={{ marginLeft: 10 }}
      >
        <option value="ALL">All</option>
        <option value="ACTIVE">Active</option>
        <option value="BLOCKED">Blocked</option>
      </select>

      {paginatedCards.length === 0 ? (
        <p>No cards found</p>
      ) : (
        <>
          <table border="1" cellPadding="8" width="100%">
            <thead>
              <tr>
                <th onClick={() => toggleSort("cardType")}>Type</th>
                <th>Card Number</th>
                <th onClick={() => toggleSort("status")}>Status</th>
                <th onClick={() => toggleSort("expiryDate")}>Expiry</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCards.map(card => (
                <tr key={card.id}>
                  <td>{card.cardType}</td>
                  <td>{card.cardNumber}</td>
                  <td>{card.status}</td>
                  <td>{card.expiryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            page={cardPage}
            total={totalCardPages}
            onChange={setCardPage}
          />
        </>
      )}

      <hr />

      {/* ================= CARD REQUESTS ================= */}
      <button onClick={() => setShowRequests(s => !s)}>
        {showRequests ? "Hide Card Requests" : "View Card Requests"}
      </button>

      {showRequests && (
        <>
          <div style={{ margin: "10px 0" }}>
            <select
              value={reqStatus}
              onChange={e => {
                setReqStatus(e.target.value);
                setReqPage(1);
              }}
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {paginatedRequests.length === 0 ? (
            <p>No card requests</p>
          ) : (
            <>
              <table border="1" cellPadding="8" width="100%">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Requested On</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map(r => (
                    <tr key={r.id}>
                      <td>{r.cardType}</td>
                      <td>{r.status}</td>
                      <td>
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination
                page={reqPage}
                total={totalReqPages}
                onChange={setReqPage}
              />
            </>
          )}
        </>
      )}

      <hr />

      {/* ================= REQUEST CARD ================= */}
      <h3>Request New Card</h3>

      <select
        value={cardType}
        onChange={e => setCardType(e.target.value)}
      >
        <option value="DEBIT">Debit Card</option>
        <option value="CREDIT">Credit Card</option>
      </select>

      <button onClick={handleRequestCard} style={{ marginLeft: 10 }}>
        Request Card
      </button>
    </div>
  );
}

/* ================= PAGINATION ================= */
function Pagination({ page, total, onChange }) {
  if (total <= 1) return null;

  return (
    <div style={{ marginTop: 10 }}>
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      <span style={{ margin: "0 10px" }}>
        {page} / {total}
      </span>
      <button disabled={page === total} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
}

export default CardsPage;
