const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

// OBTENER PROYECTOS DEL USUARIO
async function getProjectsByUser() {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects`, {
    headers: { "auth-token": token }
  });
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
}

// CREAR PROYECTO
async function createProject(project) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al crear proyecto");
  }
  return res.json();
}

// ACTUALIZAR PROYECTO
async function updateProject(projectId, updates) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al actualizar proyecto");
  }
  return res.json();
}

// ELIMINAR PROYECTO
async function deleteProject(projectId) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "DELETE",
    headers: { "auth-token": token }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al eliminar proyecto");
  }
  return res.json();
}

// OBTENER PROYECTO POR ID
async function getProjectById(projectId) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    headers: { "auth-token": token }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al obtener el proyecto");
  }
  return res.json();
}

// RENDERIZAR PROYECTOS
function renderProjects(projects) {
  const list = document.getElementById("project-list");
  list.innerHTML = "";

  if (projects.length === 0) {
    list.innerHTML = "<p>No tienes proyectos registrados.</p>";
    return;
  }

  projects.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("project-card");
    div.innerHTML = `
      <h4>${p.title}</h4>
      <p>${p.description}</p>
      <p><strong>Tecnologías:</strong> ${p.technologies.join(", ")}</p>
      <p><a href="${p.repository}" target="_blank">Repositorio</a></p>
      <div class="project-actions">
        <button class="detail-btn" data-id="${p._id}">Ver Detalle</button>
        <button class="edit-btn" data-id="${p._id}">Editar</button>
        <button class="delete-btn" data-id="${p._id}">Eliminar</button>
      </div>
    `;
    list.appendChild(div);
  });

  // EVENTOS: DETALLE
  document.querySelectorAll(".detail-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      try {
        const project = await getProjectById(id);
        showProjectDetail(project);
      } catch (error) {
        console.error("Error al obtener detalle:", error.message);
      }
    });
  });

  // EVENTOS: EDITAR
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const project = projects.find(p => p._id === id);
      fillEditForm(project);
    });
  });

  // EVENTOS: ELIMINAR
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (!confirm("¿Seguro que deseas eliminar este proyecto?")) return;
      try {
        await deleteProject(id);
        const updated = await getProjectsByUser();
        renderProjects(updated);
      } catch (error) {
        console.error("Error al eliminar:", error.message);
      }
    });
  });
}

// RELLENAR FORMULARIO PARA EDITAR
function fillEditForm(project) {
  const form = document.getElementById("newProjectForm");
  form.style.display = "flex";
  document.getElementById("title").value = project.title;
  document.getElementById("description").value = project.description;
  document.getElementById("technologies").value = project.technologies.join(", ");
  document.getElementById("repository").value = project.repository;
  form.dataset.editing = project._id;
}

// MOSTRAR DETALLE DEL PROYECTO
function showProjectDetail(project) {
  const panel = document.getElementById("project-detail");
  const content = document.getElementById("detail-content");
  content.innerHTML = `
    <p><strong>Título:</strong> ${project.title}</p>
    <p><strong>Descripción:</strong> ${project.description}</p>
    <p><strong>Tecnologías:</strong> ${project.technologies.join(", ")}</p>
    <p><strong>Repositorio:</strong> 
      <a href="${project.repository}" target="_blank">${project.repository}</a>
    </p>
    <p><strong>ID:</strong> ${project._id}</p>
  `;
  panel.style.display = "block";
  document.getElementById("closeDetailBtn").onclick = () => {
    panel.style.display = "none";
  };
}

// INICIAR HOME
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  const logoutBtn = document.getElementById("logoutBtn");
  const addBtn = document.getElementById("addProjectBtn");
  const form = document.getElementById("newProjectForm");
  const cancelBtn = document.getElementById("cancelBtn");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });

  cancelBtn.addEventListener("click", () => {
    form.reset();
    form.style.display = "none";
    form.dataset.editing = "";
  });

  // CARGAR PROYECTOS EXISTENTES
  try {
    const projects = await getProjectsByUser();
    renderProjects(projects);
  } catch (error) {
    console.error("Error:", error.message);
  }

  // MOSTRAR / OCULTAR FORMULARIO NUEVO PROYECTO
  addBtn.addEventListener("click", () => {
    form.style.display = form.style.display === "none" ? "flex" : "none";
    form.dataset.editing = "";
    form.reset();
  });

  // CREAR O ACTUALIZAR PROYECTO
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const project = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      technologies: document.getElementById("technologies").value.split(",").map(t => t.trim()).filter(Boolean),
      repository: document.getElementById("repository").value,
      images: []
    };
    try {
      if (form.dataset.editing) {
        await updateProject(form.dataset.editing, project);
      } else {
        await createProject(project);
      }
      form.reset();
      form.style.display = "none";
      const updated = await getProjectsByUser();
      renderProjects(updated);
    } catch (error) {
      console.error("Error al guardar:", error.message);
    }
  });
});
