const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

async function register(user) {

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
    
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Register failed");
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      itsonId: document.getElementById("itsonId").value,
      password: document.getElementById("password").value,
    };

    try {

      const result = await register(user);
      console.log("User registered:", result);
      window.location.href = "login.html";

    } catch (error) {
      console.error("Error:", error.message);
    }
  });
});