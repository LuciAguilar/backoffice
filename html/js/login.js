const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

function saveToken(token) {
  localStorage.setItem("authToken", token);
}

async function login(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),

  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  saveToken(data.token);
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const credentials = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    try {

      const result = await login(credentials);
      console.log("User logged in:", result);
      window.location.href = "home.html";
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  });
});