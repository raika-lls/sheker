const cityModal = document.getElementById("cityModal");
const cityMessage = document.getElementById("cityMessage");
const cityBtn = document.getElementById("cityChooseBtn");

function showMessage(city) {
  cityMessage.style.display = "block";
  cityMessage.textContent = `Шекер — ${city}. Спасибо, что выбрали нас!`;
  cityMessage.classList.add("show");
  cityMessage.classList.remove("hide");

  setTimeout(() => {
    cityMessage.classList.remove("show");
    cityMessage.classList.add("hide");
  }, 4000);

  setTimeout(() => {
    cityMessage.style.display = "none";
  }, 6000);
}

function selectCity() {
  const select = document.getElementById("citySelect");
  const city = select.value;

  if (!city || city.includes("Выберите")) return;

  localStorage.setItem("selectedCity", city);
  cityModal.style.display = "none";
  showMessage(city);

  // событие для профиля
  window.dispatchEvent(new Event("sheker:city-selected"));
}

document.addEventListener("DOMContentLoaded", () => {
  const savedCity = localStorage.getItem("selectedCity");
  if (savedCity) {
    cityModal.style.display = "none";
    showMessage(savedCity);
  } else {
    cityModal.style.display = "flex";
  }
});

cityBtn.addEventListener("click", selectCity);