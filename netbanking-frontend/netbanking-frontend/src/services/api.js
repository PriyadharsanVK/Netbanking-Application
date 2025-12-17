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

/* --- Account Requests --- */

export async function getAllAccountRequests() {
  const response = await fetch(`${BASE_URL}/admin/account-requests`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
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

/* --- All Accounts --- */

export async function getAllAccounts() {
  const response = await fetch(`${BASE_URL}/admin/accounts`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

// ======================= CARDS =======================

// Get cards for an account
export async function getAccountCards(accountId) {
  const res = await fetch(
    `${BASE_URL}/cards/account/${accountId}`
  );

  if (!res.ok) {
    throw new Error("Failed to load cards");
  }

  return res.json();
}

// Get card requests for an account
export async function getAccountCardRequests(accountId) {
  const res = await fetch(
    `${BASE_URL}/card-requests/account/${accountId}`
  );

  if (!res.ok) {
    throw new Error("Failed to load card requests");
  }

  return res.json();
}

// Request a card
export async function requestCard(accountId, cardType) {
  const res = await fetch(
    `${BASE_URL}/card-requests`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId,
        cardType
      })
    }
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Card request failed");
  }

  return res.text();
}
