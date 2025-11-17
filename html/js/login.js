const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

async function login(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  console.log("Respuesta del servidor:", data);

  if (!res.ok) throw new Error(data.message || "Login failed");

  // Ajuste: usar userPublicData
  if (data.userPublicData && data.userPublicData._id) {
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.userPublicData));
  } else {
    console.warn("No se encontró userPublicData en la respuesta");
    localStorage.setItem("authToken", data.token);
  }

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
      console.log("Login exitoso:", result);
      window.location.href = "home.html";
    } catch (error) {
      console.error("Error en login:", error.message);
    }
  });
});