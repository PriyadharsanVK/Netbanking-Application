const BASE_URL = "http://localhost:8080/api";

/* ---------- USER LOGIN ---------- */
export async function loginUser(data) {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }

  return response.json(); // { userId, accountId, accountNumber }
}


/* ---------- GET USER ACCOUNTS ---------- */
export async function getUserAccounts(userId) {
  const response = await fetch(`${BASE_URL}/accounts/user/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }

  return response.json();
}

export async function getOtherAccounts(userId, excludeAccountId) {
  const response = await fetch(
    `${BASE_URL}/accounts/user/${userId}?exclude=${excludeAccountId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }

  return response.json();
}

export async function deposit(accountId, amount) {
  const response = await fetch(`${BASE_URL}/accounts/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId,
      amount,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }

  return response.text(); // or json if backend returns json
}

export async function getTransactionHistory(accountId) {
  const response = await fetch(
    `${BASE_URL}/transactions/account/${accountId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transaction history");
  }

  return response.json();
}
export async function selfTransfer(fromAccountId, toAccountId, amount) {
  const response = await fetch(`${BASE_URL}/accounts/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fromAccountId,
      toAccountId,
      amount,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }

  return response.text();
}
export async function getAccountByNumber(accountNumber) {
  const response = await fetch(
    `${BASE_URL}/accounts/number/${accountNumber}`
  );

  if (!response.ok) {
    throw new Error("Destination account not found");
  }

  return response.json();
}
