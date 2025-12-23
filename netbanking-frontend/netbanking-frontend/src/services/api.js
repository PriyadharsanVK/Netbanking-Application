const BASE_URL = "http://localhost:8080/api";

/* ===================== COMMON ERROR HANDLER ===================== */

async function parseError(response) {
  const text = await response.text();

  try {
    const json = JSON.parse(text);
    return json.message || json.error || "Request failed";
  } catch {
    return text || "Request failed";
  }
}

/* ===================== USER ===================== */

export async function registerUser(data) {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

export async function loginUser(data) {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(await parseError(response));
  return response.json(); // { userId, role }
}

/* ===================== ACCOUNTS ===================== */

export async function getUserAccounts(userId) {
  const response = await fetch(`${BASE_URL}/accounts/user/${userId}`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function deposit(accountId, amount) {
  const response = await fetch(`${BASE_URL}/accounts/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId, amount }),
  });

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

/* ===================== TRANSACTIONS ===================== */

export async function getTransactionHistory(accountId) {
  const response = await fetch(
    `${BASE_URL}/transactions/account/${accountId}`
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

/* ===================== BENEFICIARIES ===================== */

export async function addBeneficiary(data) {
  const response = await fetch(`${BASE_URL}/beneficiaries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

export async function getUserBeneficiaries(userId) {
  const response = await fetch(
    `${BASE_URL}/beneficiaries/user/${userId}`
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function deleteBeneficiary(beneficiaryId) {
  const response = await fetch(
    `${BASE_URL}/beneficiaries/${beneficiaryId}`,
    { method: "DELETE" }
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

export async function transferToBeneficiary(
  beneficiaryId,
  fromAccountId,
  amount
) {
  const response = await fetch(
    `${BASE_URL}/beneficiaries/${beneficiaryId}/transfer`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromAccountId, amount }),
    }
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

/* ===================== ACCOUNT REQUEST ===================== */

export async function createAccountRequest(data) {
  const response = await fetch(`${BASE_URL}/account-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

export async function getUserAccountRequests(userId) {
  const response = await fetch(
    `${BASE_URL}/account-requests/user/${userId}`
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

/* ===================== ADMIN ===================== */

/* ---------- ACCOUNT REQUESTS (ADMIN) ---------- */

export async function getAllAccountRequests({ status, page, size }) {
  const response = await fetch(
    `${BASE_URL}/admin/account-requests?status=${status}&page=${page}&size=${size}`
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.json(); // returns Page
}

export async function approveAccountRequest(requestId) {
  const response = await fetch(
    `${BASE_URL}/admin/account-requests/${requestId}/approve`,
    { method: "POST" }
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

export async function rejectAccountRequest(requestId) {
  const response = await fetch(
    `${BASE_URL}/admin/account-requests/${requestId}/reject`,
    { method: "POST" }
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

/* ---------- ALL ACCOUNTS (ADMIN) ---------- */
/* ✅ Pagination + Search + Sort */

export async function getAllAccounts({
  page = 0,
  size = 10,
  sortBy = "createdAt",
  sortDir = "DESC",
  search = ""
} = {}) {

  const params = new URLSearchParams({
    page,
    size,
    sortBy,
    sortDir,
    search
  });

  const response = await fetch(
    `${BASE_URL}/admin/accounts?${params.toString()}`
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

/* ======================= CARDS ======================= */

export async function getAccountCards(accountId) {
  const res = await fetch(`${BASE_URL}/cards/account/${accountId}`);
  if (!res.ok) throw new Error("Failed to load cards");
  return res.json();
}

export async function getAccountCardRequests(accountId) {
  const res = await fetch(`${BASE_URL}/card-requests/account/${accountId}`);
  if (!res.ok) throw new Error("Failed to load card requests");
  return res.json();
}

export async function requestCard(accountId, cardType) {
  const res = await fetch(`${BASE_URL}/card-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId, cardType })
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.text();
}

/* ---------- ADMIN CARDS ---------- */

export async function getAllCardRequests() {
  const response = await fetch(`${BASE_URL}/admin/card-requests`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function approveCardRequest(requestId) {
  const response = await fetch(
    `${BASE_URL}/admin/card-requests/${requestId}/approve`,
    { method: "POST" }
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

export async function rejectCardRequest(requestId) {
  const response = await fetch(
    `${BASE_URL}/admin/card-requests/${requestId}/reject`,
    { method: "POST" }
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

export async function getAllCards() {
  const response = await fetch(`${BASE_URL}/admin/cards`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function blockCard(cardId) {
  const response = await fetch(
    `${BASE_URL}/admin/cards/${cardId}/block`,
    { method: "POST" }
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

export async function unblockCard(cardId) {
  const response = await fetch(
    `${BASE_URL}/admin/cards/${cardId}/unblock`,
    { method: "POST" }
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

/* ======================= LOANS ======================= */

export async function requestLoan(data) {
  const response = await fetch(`${BASE_URL}/loan-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

export async function getAccountLoanRequests(accountId) {
  const response = await fetch(
    `${BASE_URL}/loan-requests/account/${accountId}`
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function getAccountLoans(accountId) {
  const response = await fetch(`${BASE_URL}/loans/account/${accountId}`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

/* ---------- ADMIN LOANS ---------- */

export async function getAllLoanRequests() {
  const response = await fetch(`${BASE_URL}/admin/loan-requests`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function approveLoanRequest(requestId) {
  const response = await fetch(
    `${BASE_URL}/admin/loan-requests/${requestId}/approve`,
    { method: "POST" }
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

export async function rejectLoanRequest(requestId) {
  const response = await fetch(
    `${BASE_URL}/admin/loan-requests/${requestId}/reject`,
    { method: "POST" }
  );

  if (!response.ok) throw new Error(await parseError(response));
  return response.text();
}

export async function getAllLoans() {
  const response = await fetch(`${BASE_URL}/admin/loans`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function payEmi(loanId) {
  const res = await fetch(
    `${BASE_URL}/loans/${loanId}/pay-emi`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error(await parseError(res));
  return res.text();
}

export async function forecloseLoan(loanId) {
  const res = await fetch(
    `${BASE_URL}/loans/${loanId}/foreclose`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error(await parseError(res));
  return res.text();
}
