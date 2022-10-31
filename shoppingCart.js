import formatCurrency from "./util/formatCurrency";
import items from "./items.json";
import addGlobalEventListener from "./util/addGlobalEventListener";

const cartButton = document.querySelector("[data-cart-button]");
const cartItemWrapper = document.querySelector("[data-cart-item-wrapper]");
const cartItemTemplate = document.querySelector("#cart-item-template");
const cartItemContainer = document.querySelector("[cart-item-container]");
const cartQuantity = document.querySelector("[data-cart-quantity]");
const cartTotal = document.querySelector("[data-cart-total]");
const cart = document.querySelector("[data-cart]");
const SESSION_STORAGE_KEY = " SHOPPING-CART-cart";
const IMAGE_URL = "https://dummyimage.com/210x130/";
let shoppingCart = loadCart();

export function setUpShoppingCart() {
  addGlobalEventListener("click", "[data-remove-from-cart-button]", (e) => {
    const id = parseInt(e.target.closest("[data-item]").dataset.itemID);
    removeFromCart(id);
  });

  renderCart();

  cartButton.addEventListener("click", () => {
    cartItemWrapper.classList.toggle("invisible");
  });
}

export function addToCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    shoppingCart.push({ id: id, quantity: 1 });
  }
  renderCart();
  saveCart();
}

function removeFromCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id);
  if (existingItem == null) return;
  shoppingCart = shoppingCart.filter((entry) => entry.id !== id);
  renderCart();
  saveCart();
}

function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart();
  } else {
    showCart();
    renderCartItems();
  }
}

function hideCart() {
  cart.classList.add("invisible");
  cartItemWrapper.classList.add("invisible");
}

function showCart() {
  cart.classList.remove("invisible");
}

function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart));
}

function loadCart() {
  const cart = sessionStorage.getItem(SESSION_STORAGE_KEY);
  return JSON.parse(cart) || [];
}

function renderCartItems() {
  cartItemContainer.innerHTML = "";
  cartQuantity.innerText = shoppingCart.length;

  const totalCents = shoppingCart.reduce((sum, entry) => {
    const item = items.find((i) => entry.id === i.id);
    return sum + item.priceCents * entry.quantity;
  }, 0);

  cartTotal.innerText = formatCurrency(totalCents / 100);

  shoppingCart.forEach((entry) => {
    const item = items.find((i) => entry.id === i.id);
    const cartItem = cartItemTemplate.content.cloneNode(true);

    const container = cartItem.querySelector("[data-item]");
    container.dataset.itemID = item.id;

    const name = cartItem.querySelector("[data-name]");
    name.innerText = item.name;

    const image = cartItem.querySelector("[data-image]");
    image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`;

    if (entry.quantity > 1) {
      const quantity = cartItem.querySelector("[data-quantity]");
      quantity.innerText = `x${entry.quantity}`;
    }
    const price = cartItem.querySelector("[data-price]");
    price.innerText = formatCurrency((item.priceCents * entry.quantity) / 100);

    cartItemContainer.appendChild(cartItem);
  });
}
