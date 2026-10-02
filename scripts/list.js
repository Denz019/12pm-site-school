const param = new URLSearchParams(window.location.search);
const selectedSeason = param.get("season");
console.log("selectedSeason", selectedSeason);

const productURL = `https://kea-alt-del.dk/t7/api/products?season=${selectedSeason}`;
const listContainer = document.querySelector(".product_list_container");

let allProducts = [];

function getData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      allProducts = data;
      showProducts(allProducts);
    });
}

function showProducts(products) {
  console.log("Number of products", products.length);

  listContainer.innerHTML = "";

  products.forEach((product) => {
    listContainer.innerHTML += `<article class="product ${product.soldout ? "soldout" : ""}">
          <img src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp" alt="${product.productdisplayname}" />
          <h3>${product.productdisplayname}</h3>
          <p>${product.brandname} - ${product.category}</p>
          <div>
           ${product.discount ? "<p class='discount_tag'>" + getDiscountPrice(product.price, product.discount) + " kr</p>" : ""}
            <p>${product.price} kr  ${product.discount ? " <em>-" + product.discount + "%</em>" : ""}</p>
          </div>
          <p><a href="detailview.html?id=${product.id}">Read More</a></p>
          ${product.soldout ? "<p class='soldout_tag'>Sold Out</p>" : ""}
        </article>`;
  });
}

getData(productURL);

function getDiscountPrice(origianlPrice, discount) {
  return Math.round((origianlPrice * (100 - discount)) / 100);
}

// Filter-knapper
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let result = allProducts;

    if (filter === "discount") {
      result = allProducts.filter((p) => p.discount);
    } else if (filter === "available") {
      result = allProducts.filter((p) => !p.soldout);
    }

    showProducts(result);
  });
});
