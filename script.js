// ===== Productos de ejemplo =====
const productosDefault = [
  {
    id: 1,
    nombre: "Vestido Aura",
    precio: 89.00,
    categoria: "vestidos",
    imagen: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
    descripcion: "Vestido fluido de corte elegante en tono beige. Ideal para ocasiones especiales."
  },
  {
    id: 2,
    nombre: "Blusa Nube",
    precio: 45.00,
    categoria: "blusas",
    imagen: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop",
    descripcion: "Blusa de lino ligero con detalle de cuello. Perfecta para el día a día."
  },
  {
    id: 3,
    nombre: "Pantalón Seda",
    precio: 72.00,
    categoria: "pantalones",
    imagen: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop",
    descripcion: "Pantalón de tiro alto con caída suave. Comodidad y estilo en una sola pieza."
  },
  {
    id: 4,
    nombre: "Bolso Minimal",
    precio: 65.00,
    categoria: "accesorios",
    imagen: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
    descripcion: "Bolso de cuero sintético en tono chocolate. Diseño limpio y atemporal."
  },
  {
    id: 5,
    nombre: "Vestido Ébano",
    precio: 110.00,
    categoria: "vestidos",
    imagen: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop",
    descripcion: "Vestido negro con escote sutil y corte midi. Sofisticación pura."
  },
  {
    id: 6,
    nombre: "Blusa Bordada",
    precio: 58.00,
    categoria: "blusas",
    imagen: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&h=800&fit=crop",
    descripcion: "Blusa con bordados delicados en el cuello. Un toque artesanal."
  }
];

// ===== Estado =====
let productos = [];
let filtroActual = "all";
let usuario = null; // { nombre, email, avatar }
let productoPendiente = null; // para comprar después de login

// ===== Cargar productos =====
function cargarProductos() {
  const guardados = localStorage.getItem("anshi_productos");
  if (guardados) {
    productos = JSON.parse(guardados);
  } else {
    productos = [...productosDefault];
    guardarProductos();
  }
  renderProductos();
}

function guardarProductos() {
  localStorage.setItem("anshi_productos", JSON.stringify(productos));
}

// ===== Usuario (login) =====
function cargarUsuario() {
  const guardado = localStorage.getItem("anshi_usuario");
  if (guardado) {
    usuario = JSON.parse(guardado);
  }
  actualizarUIUsuario();
}

function guardarUsuario() {
  if (usuario) {
    localStorage.setItem("anshi_usuario", JSON.stringify(usuario));
  } else {
    localStorage.removeItem("anshi_usuario");
  }
}

function actualizarUIUsuario() {
  const area = document.getElementById("userArea");
  if (usuario) {
    const inicial = usuario.nombre.charAt(0).toUpperCase();
    area.innerHTML = `
      <div class="user-profile" id="userProfile">
        <div class="user-avatar">${inicial}</div>
        <span class="user-name">${usuario.nombre.split(" ")[0]}</span>
        <div class="user-menu" id="userMenu">
          <button id="btnLogout">Cerrar sesión</button>
        </div>
      </div>
    `;
    document.getElementById("userProfile").addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("userMenu").classList.toggle("open");
    });
    document.getElementById("btnLogout").addEventListener("click", (e) => {
      e.stopPropagation();
      cerrarSesion();
    });
  } else {
    area.innerHTML = `<button class="btn-login" id="btnLogin">Iniciar sesión</button>`;
    document.getElementById("btnLogin").addEventListener("click", abrirLogin);
  }
}

function cerrarSesion() {
  usuario = null;
  guardarUsuario();
  actualizarUIUsuario();
  document.getElementById("userMenu")?.classList.remove("open");
}

// Cerrar menú de usuario al hacer clic fuera
document.addEventListener("click", () => {
  document.getElementById("userMenu")?.classList.remove("open");
});

// ===== Login Modal =====
const loginModal = document.getElementById("loginModal");
const loginClose = document.getElementById("loginClose");
const btnGoogleLogin = document.getElementById("btnGoogleLogin");

function abrirLogin() {
  loginModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function cerrarLogin() {
  loginModal.classList.remove("open");
  document.body.style.overflow = "";
}

loginClose.addEventListener("click", cerrarLogin);
loginModal.addEventListener("click", (e) => {
  if (e.target === loginModal) cerrarLogin();
});

// Simulación de login con Google (demo)
btnGoogleLogin.addEventListener("click", () => {
  // En un sitio real aquí iría Google OAuth
  // Demo: simulamos un usuario
  usuario = {
    nombre: "María González",
    email: "maria.gonzalez@gmail.com",
    avatar: null
  };
  guardarUsuario();
  actualizarUIUsuario();
  cerrarLogin();

  // Si había un producto pendiente de compra
  if (productoPendiente) {
    setTimeout(() => {
      abrirCheckout(productoPendiente);
      productoPendiente = null;
    }, 300);
  } else {
    // Pequeña notificación
    mostrarToast("¡Bienvenida, " + usuario.nombre.split(" ")[0] + "!");
  }
});

// ===== Render productos =====
function renderProductos() {
  const grid = document.getElementById("productosGrid");
  const filtrados = filtroActual === "all"
    ? productos
    : productos.filter(p => p.categoria === filtroActual);

  if (filtrados.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px 0;">No hay productos en esta categoría.</p>`;
    return;
  }

  grid.innerHTML = filtrados.map(p => `
    <article class="product-card" data-id="${p.id}">
      <img src="${p.imagen}" alt="${p.nombre}" class="product-img" loading="lazy"
           onerror="this.src='https://placehold.co/600x800/E8D9C8/3C2A21?text=Anshi'" />
      <div class="product-info">
        <p class="categoria">${p.categoria}</p>
        <h3>${p.nombre}</h3>
        <p class="precio">$${p.precio.toFixed(2)}</p>
        <p class="desc">${p.descripcion || ""}</p>
        <button class="btn-comprar" data-id="${p.id}">Comprar ahora</button>
      </div>
    </article>
  `).join("");

  // Click en la tarjeta (excepto el botón)
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-comprar")) return;
      const id = parseInt(card.dataset.id);
      const prod = productos.find(p => p.id === id);
      if (prod) abrirModal(prod);
    });
  });

  // Botones Comprar
  document.querySelectorAll(".btn-comprar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const prod = productos.find(p => p.id === id);
      if (prod) iniciarCompra(prod);
    });
  });
}

// ===== Filtros =====
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filtroActual = btn.dataset.filter;
    renderProductos();
  });
});

// ===== Modal producto =====
const modal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

function abrirModal(prod) {
  modalBody.innerHTML = `
    <img src="${prod.imagen}" alt="${prod.nombre}"
         onerror="this.src='https://placehold.co/600x800/E8D9C8/3C2A21?text=Anshi'" />
    <div class="info">
      <p class="categoria" style="text-transform:uppercase;font-size:0.8rem;letter-spacing:0.06em;color:var(--brown-soft);margin-bottom:6px;">${prod.categoria}</p>
      <h3>${prod.nombre}</h3>
      <p class="precio">$${prod.precio.toFixed(2)}</p>
      <p>${prod.descripcion || "Sin descripción."}</p>
      <button class="btn btn-primary btn-comprar-modal" style="width:100%;">Comprar ahora</button>
    </div>
  `;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";

  modalBody.querySelector(".btn-comprar-modal").addEventListener("click", () => {
    cerrarModal();
    iniciarCompra(prod);
  });
}

function cerrarModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", cerrarModal);
modal.addEventListener("click", e => {
  if (e.target === modal) cerrarModal();
});

// ===== Compra / Checkout =====
function iniciarCompra(prod) {
  if (!usuario) {
    productoPendiente = prod;
    abrirLogin();
    return;
  }
  abrirCheckout(prod);
}

const checkoutModal = document.getElementById("checkoutModal");
const checkoutBody = document.getElementById("checkoutBody");
const checkoutClose = document.getElementById("checkoutClose");

function abrirCheckout(prod) {
  checkoutBody.innerHTML = `
    <div class="checkout-header">
      <h2>Finalizar compra</h2>
      <p style="color:var(--text-muted);font-size:0.9rem;">Hola ${usuario.nombre.split(" ")[0]}, revisá tu pedido</p>
    </div>
    <div class="checkout-product">
      <img src="${prod.imagen}" alt="${prod.nombre}"
           onerror="this.src='https://placehold.co/160x200/E8D9C8/3C2A21?text=Anshi'" />
      <div class="checkout-product-info">
        <p class="cat">${prod.categoria}</p>
        <h3>${prod.nombre}</h3>
        <p class="precio">$${prod.precio.toFixed(2)}</p>
      </div>
    </div>
    <div class="checkout-total">
      <span>Total a pagar</span>
      <strong>$${prod.precio.toFixed(2)}</strong>
    </div>
    <div class="payment-methods">
      <button class="btn-pay mercadopago" data-method="mercadopago">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
        Pagar con Mercado Pago
      </button>
      <button class="btn-pay card" data-method="card">
        💳 Pagar con tarjeta
      </button>
      <button class="btn-pay whatsapp" data-method="whatsapp">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Comprar por WhatsApp
      </button>
    </div>
    <p class="checkout-note">
      Este es un demo. En una tienda real, Mercado Pago y tarjeta redirigirían al procesador de pagos. WhatsApp abre una conversación con el detalle del producto.
    </p>
  `;

  checkoutModal.classList.add("open");
  document.body.style.overflow = "hidden";

  // Eventos de pago
  checkoutBody.querySelectorAll(".btn-pay").forEach(btn => {
    btn.addEventListener("click", () => {
      const method = btn.dataset.method;
      procesarPago(prod, method);
    });
  });
}

function cerrarCheckout() {
  checkoutModal.classList.remove("open");
  document.body.style.overflow = "";
}

checkoutClose.addEventListener("click", cerrarCheckout);
checkoutModal.addEventListener("click", e => {
  if (e.target === checkoutModal) cerrarCheckout();
});

function procesarPago(prod, method) {
  if (method === "whatsapp") {
    // Número de ejemplo — cámbialo por el real
    const telefono = "5491100000000"; // Formato internacional sin +
    const mensaje = encodeURIComponent(
      `¡Hola! Quiero comprar:\n\n*${prod.nombre}*\nPrecio: $${prod.precio.toFixed(2)}\n\nSoy ${usuario.nombre} (${usuario.email})`
    );
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");
    cerrarCheckout();
    return;
  }

  // Demo para Mercado Pago y tarjeta
  const nombres = {
    mercadopago: "Mercado Pago",
    card: "tarjeta"
  };
  mostrarToast(`Redirigiendo a ${nombres[method]}... (demo)`);
  
  // En un sitio real:
  // - Mercado Pago: crear preferencia y redirigir a init_point
  // - Stripe / tarjeta: Checkout Session
  setTimeout(() => {
    alert(
      `✅ DEMO — Pago simulado con ${nombres[method]}\n\n` +
      `Producto: ${prod.nombre}\n` +
      `Total: $${prod.precio.toFixed(2)}\n` +
      `Cliente: ${usuario.nombre}\n\n` +
      `En una tienda real aquí se procesaría el pago real.`
    );
    cerrarCheckout();
  }, 800);
}

// ===== Toast simple =====
function mostrarToast(texto) {
  const toast = document.createElement("div");
  toast.textContent = texto;
  toast.style.cssText = `
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    background: var(--brown); color: var(--beige); padding: 14px 28px;
    border-radius: 50px; font-size: 0.95rem; font-weight: 500;
    z-index: 9999; box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    animation: fadeInUp 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ===== Admin =====
const btnAdmin = document.getElementById("btnAdmin");
const adminPanel = document.getElementById("adminPanel");
const adminOverlay = document.getElementById("adminOverlay");
const closeAdmin = document.getElementById("closeAdmin");
const adminForm = document.getElementById("adminForm");

function abrirAdmin() {
  adminPanel.classList.add("open");
  adminOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function cerrarAdmin() {
  adminPanel.classList.remove("open");
  adminOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

btnAdmin.addEventListener("click", abrirAdmin);
closeAdmin.addEventListener("click", cerrarAdmin);
adminOverlay.addEventListener("click", cerrarAdmin);

adminForm.addEventListener("submit", e => {
  e.preventDefault();
  const nuevo = {
    id: Date.now(),
    nombre: document.getElementById("prodNombre").value.trim(),
    precio: parseFloat(document.getElementById("prodPrecio").value),
    categoria: document.getElementById("prodCategoria").value,
    imagen: document.getElementById("prodImagen").value.trim() || "https://placehold.co/600x800/E8D9C8/3C2A21?text=Anshi",
    descripcion: document.getElementById("prodDesc").value.trim()
  };
  productos.unshift(nuevo);
  guardarProductos();
  renderProductos();
  adminForm.reset();
  alert("✅ Producto agregado correctamente");
  cerrarAdmin();
});

// ===== Formulario contacto =====
document.getElementById("contactoForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("¡Gracias por tu mensaje! Te responderemos pronto.\n\n(En un sitio real esto enviaría el correo o abriría WhatsApp)");
  e.target.reset();
});

// ===== Menú móvil =====
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

// ===== Nav activo al scroll =====
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute("id");
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    }
  });
});

// ===== Iniciar =====
cargarProductos();
cargarUsuario();
