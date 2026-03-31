document.addEventListener("DOMContentLoaded", () => {
  const LS_CITY = "selectedCity";
  const LS_USER = "shekerUser";
  const LS_AUTH = "shekerAuthed";

  const sidebar = document.getElementById("shekerSidebar");
  const burger = document.getElementById("shekerBurger");
  const menu = document.getElementById("shekerMenu");

  const prompt = document.getElementById("shekerAuthPrompt");
  const openAuth = document.getElementById("shekerOpenAuth");

  const authModal = document.getElementById("shekerAuthModal");
  const authClose = document.getElementById("shekerAuthClose");
  const editBtn = document.getElementById("shekerEditBtn");
  const saveBtn = document.getElementById("shekerSaveAuth");

  const lastName = document.getElementById("shekerLastName");
  const firstName = document.getElementById("shekerFirstName");
  const phone = document.getElementById("shekerPhone");
  const email = document.getElementById("shekerEmail");

  const toast = document.getElementById("shekerToast");
  const toastText = document.getElementById("shekerToastText");

  const viewBox = document.getElementById("shekerProfileView");
  const editBox = document.getElementById("shekerProfileEdit");

  const viewLastName = document.getElementById("viewLastName");
  const viewFirstName = document.getElementById("viewFirstName");
  const viewPhone = document.getElementById("viewPhone");
  const viewEmail = document.getElementById("viewEmail");

  function getUser() {
    try { return JSON.parse(localStorage.getItem(LS_USER) || "null"); }
    catch { return null; }
  }
  function setUser(u) { localStorage.setItem(LS_USER, JSON.stringify(u)); }
  function isAuthed() { return localStorage.getItem(LS_AUTH) === "1"; }
  function setAuthed(v) { localStorage.setItem(LS_AUTH, v ? "1" : "0"); }

  function showToast(msg) {
    toastText.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2200);
  }

  function renderProfileView() {
    const u = getUser() || {};
    viewLastName.textContent = u.lastName || "—";
    viewFirstName.textContent = u.firstName || "—";
    viewPhone.textContent = u.phone || "—";
    viewEmail.textContent = u.email || "—";
  }

  function fillForm() {
    const u = getUser() || {};
    lastName.value = u.lastName || "";
    firstName.value = u.firstName || "";
    phone.value = u.phone || "";
    email.value = u.email || "";
  }

  function openProfileView() {
    renderProfileView();
    viewBox.classList.remove("hidden");
    editBox.classList.add("hidden");
    authModal.classList.remove("hidden");
  }

  function openProfileEdit() {
    fillForm();
    viewBox.classList.add("hidden");
    editBox.classList.remove("hidden");
    authModal.classList.remove("hidden");
  }

  function closeModal() { authModal.classList.add("hidden"); }

  function updatePrompt() {
    const cityChosen = !!localStorage.getItem(LS_CITY);
    if (!cityChosen) { prompt.classList.add("hidden"); return; }
    if (!isAuthed()) prompt.classList.remove("hidden");
    else prompt.classList.add("hidden");
  }

  burger.addEventListener("click", () => menu.classList.toggle("hidden"));

  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target)) menu.classList.add("hidden");
  });

  menu.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === "profile") {
      if (!isAuthed()) { updatePrompt(); prompt.classList.remove("hidden"); return; }
      openProfileView();
    }

    if (action === "logout") {
      setAuthed(false);
      showToast("Вы вышли из аккаунта 🤎");
      updatePrompt();
    }

    if (action === "settings") showToast("Настройки скоро ✨");
    if (action === "lang") showToast("Язык скоро 🌐");
    if (action === "support") showToast("Пишите в «Связь» 💬");
  });

  openAuth.addEventListener("click", () => {
    prompt.classList.add("hidden");
    openProfileEdit();
  });

  authClose.addEventListener("click", closeModal);
  authModal.addEventListener("click", (e) => {
    if (e.target === authModal) closeModal();
  });

  editBtn.addEventListener("click", openProfileEdit);

  saveBtn.addEventListener("click", () => {
    const u = {
      lastName: lastName.value.trim(),
      firstName: firstName.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim()
    };

    if (!u.firstName || !u.phone) {
      alert("Заполните хотя бы Имя и Телефон 😊");
      return;
    }

    const wasAuthed = isAuthed();
    setUser(u);
    setAuthed(true);

    closeModal();
    updatePrompt();

    if (!wasAuthed) showToast(`Успешно вошли, ${u.firstName}! 🎂`);
    else showToast("Данные обновлены ✅");
  });

  updatePrompt();
  window.addEventListener("sheker:city-selected", updatePrompt);
});