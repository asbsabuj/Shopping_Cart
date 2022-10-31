import items from "./items.json";
import { addToCart } from "./shoppingCart";
import formatCurrency from "./util/formatCurrency";
import addGlobalEventListener from "./util/addGlobalEventListener";

const storeItemTemplate = document.querySelector("#store-item-template");
const storeItemContainer = document.querySelector("[data-store-container]");
const IMAGE_URL = "https://dummyimage.com/420x260/";
console.log(items);

export function setUpStore() {
  if (storeItemContainer == null) return;

  addGlobalEventListener("click", "[data-add-to-cart-button]", (e) => {
    const id = e.target.closest("[data-store-item]").dataset.itemID;
    addToCart(parseInt(id));
  });
  items.forEach(renderStoreItem);
}

function renderStoreItem(item) {
  const storeItem = storeItemTemplate.content.cloneNode(true);

  const container = storeItem.querySelector("[data-store-item]");
  container.dataset.itemID = item.id;

  const name = storeItem.querySelector("[data-name]");
  name.innerText = item.name;

  const category = storeItem.querySelector("[data-category]");
  category.innerText = item.category;

  const image = storeItem.querySelector("[data-image]");
  image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`;

  const price = storeItem.querySelector("[data-price]");
  price.innerText = formatCurrency(item.priceCents / 100);

  storeItemContainer.appendChild(storeItem);
}
