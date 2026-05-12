// GLOBAL STATE
let productsArray = [];
let cart = [];
let wishlist = [];
let couponApplied = false;
let currentBalance = 1000;
let reviewIndex = 0;
let autoReviewInterval;
let bannerIndex = 0;
let bannerInterval;

// DOM Elements
const productGrid = document.getElementById('productGrid');
const userBalanceSpan = document.getElementById('userBalance');
const cartCountSpan = document.getElementById('cartCountBadge');
const wishlistBadge = document.getElementById('wishlistBadge');
const cartModal = document.getElementById('cartModal');
const wishlistModal = document.getElementById('wishlistModal');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const darkToggle = document.getElementById('darkModeToggle');
const addMoneyBtn = document.getElementById('addMoneyBtn');

// Helper Functions
function updateBalanceUI() {
  userBalanceSpan.innerText = currentBalance;
  localStorage.setItem('shopBalance', currentBalance);
}
function addMoney() {
  currentBalance += 100;
  updateBalanceUI();
  document.getElementById('balanceWarning')?.classList.add('hidden');
}

function saveCartToLocal() {
  localStorage.setItem('smartCart', JSON.stringify(cart));
}
function loadCartFromLocal() {
  let saved = localStorage.getItem('smartCart');
  if (saved) {
    cart = JSON.parse(saved);
    renderCartModal();
    updateCartBadge();
  }
}
function saveWishlist() {
  localStorage.setItem('smartWishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
}
function loadWishlist() {
  let saved = localStorage.getItem('smartWishlist');
  if (saved) {
    wishlist = JSON.parse(saved);
    updateWishlistBadge();
  }
}

function updateCartBadge() {
  let totalItems = cart.reduce((acc, it) => acc + it.quantity, 0);
  cartCountSpan.innerText = totalItems;
}
function updateWishlistBadge() {
  wishlistBadge.innerText = wishlist.length;
}

function getCartTotalBeforeDiscount() {
  return cart.reduce((sum, it) => sum + (it.price * it.quantity), 0);
}

function addToCart(product, quantity = 1) {
  let existing = cart.find(item => item.id === product.id);
  let newCartTotal = getCartTotalBeforeDiscount() + (product.price * quantity);
  if (newCartTotal > currentBalance) {
    alert(`⚠️ Insufficient balance! Your balance: $${currentBalance}. Add money or remove items.`);
    return false;
  }
  if (existing) existing.quantity += quantity;
  else cart.push({ id: product.id, title: product.title, price: product.price, quantity, image: product.image });
  saveCartToLocal();
  renderCartModal();
  updateCartBadge();
  return true;
}

function updateCartTotalsAndCoupon() {
  let subtotal = getCartTotalBeforeDiscount();
  let discount = 0;
  if (couponApplied) discount = subtotal * 0.10;
  let finalTotal = subtotal + 5 + 3 - discount;
  document.getElementById('cartSubtotal').innerText = subtotal.toFixed(2);
  document.getElementById('discountAmount').innerText = discount.toFixed(2);
  document.getElementById('finalTotal').innerText = finalTotal.toFixed(2);
  if (subtotal === 0) {
    couponApplied = false;
    document.getElementById('couponCode').value = '';
    document.getElementById('couponMsg').innerText = '';
  }
}

function applyCoupon() {
  let code = document.getElementById('couponCode').value.trim();
  if (code === "SMART10" && getCartTotalBeforeDiscount() > 0) {
    couponApplied = true;
    updateCartTotalsAndCoupon();
    document.getElementById('couponMsg').innerText = '✅ Coupon applied! 10% off';
  } else if (getCartTotalBeforeDiscount() === 0) {
    alert('Cart empty');
  } else {
    alert('Invalid coupon');
  }
}

function renderCartModal() {
  let container = document.getElementById('cartItemsList');
  if (!container) return;
  container.innerHTML = '';
  cart.forEach((item, idx) => {
    let div = document.createElement('div');
    div.className = 'flex justify-between items-center border-b pb-2 dark:border-gray-700';
    div.innerHTML = `
      <div class="flex items-center gap-2"><img src="${item.image}" class="w-10 h-10 object-contain"><div><p class="font-semibold text-gray-800 dark:text-white">${item.title.slice(0, 25)}</p><p class="text-indigo-600 dark:text-indigo-400 font-bold">$${item.price}</p></div></div>
      <div class="flex items-center gap-2"><button class="qtyDec bg-gray-300 dark:bg-gray-600 px-2 rounded" data-idx="${idx}">-</button><span class="text-gray-800 dark:text-white">${item.quantity}</span><button class="qtyInc bg-gray-300 dark:bg-gray-600 px-2 rounded" data-idx="${idx}">+</button><button class="removeItem bg-red-500 text-white px-2 rounded" data-idx="${idx}"><i class="fas fa-trash"></i></button></div>
    `;
    container.appendChild(div);
  });
  document.querySelectorAll('.qtyDec').forEach(btn => btn.addEventListener('click', (e) => {
    let idx = btn.dataset.idx;
    if (cart[idx].quantity > 1) cart[idx].quantity--;
    else cart.splice(idx, 1);
    saveCartToLocal();
    renderCartModal();
    updateCartBadge();
    updateCartTotalsAndCoupon();
  }));
  document.querySelectorAll('.qtyInc').forEach(btn => btn.addEventListener('click', (e) => {
    let idx = btn.dataset.idx;
    cart[idx].quantity++;
    saveCartToLocal();
    renderCartModal();
    updateCartBadge();
    updateCartTotalsAndCoupon();
  }));
  document.querySelectorAll('.removeItem').forEach(btn => btn.addEventListener('click', (e) => {
    let idx = btn.dataset.idx;
    cart.splice(idx, 1);
    saveCartToLocal();
    renderCartModal();
    updateCartBadge();
    updateCartTotalsAndCoupon();
  }));
  updateCartTotalsAndCoupon();
  let final = parseFloat(document.getElementById('finalTotal').innerText);
  if (final > currentBalance) document.getElementById('balanceWarning').innerText = `⚠️ Your total $${final} exceeds balance $${currentBalance}. Add money or remove items.`;
  else document.getElementById('balanceWarning').innerText = '';
}

// Populate category dropdown from fetched products
function populateCategories() {
  const categories = [...new Set(productsArray.map(p => p.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

function filterAndRenderProducts() {
  let searchTerm = searchInput.value.toLowerCase();
  let category = categoryFilter.value;
  let filtered = productsArray.filter(p => {
    let matchSearch = p.title.toLowerCase().includes(searchTerm);
    let matchCat = (category === 'all') || (p.category === category);
    return matchSearch && matchCat;
  });
  productGrid.innerHTML = '';
  filtered.forEach(prod => {
    let starRating = Math.round(prod.rating.rate);
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) starsHtml += `<i class="fa${i <= starRating ? 's' : 'r'} fa-star text-yellow-400 text-xs"></i>`;
    let card = document.createElement('div');
    card.className = 'card-bg bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-xl transition';
    card.innerHTML = `
      <img src="${prod.image}" class="h-40 w-full object-contain mb-3">
      <h3 class="product-title text-sm line-clamp-2 min-h-[2.5rem]">${prod.title.length > 50 ? prod.title.substring(0, 50) + '...' : prod.title}</h3>
      <div class="flex justify-between items-center mt-2"><span class="product-price">$${prod.price}</span> <div class="flex text-xs">${starsHtml} (${prod.rating.count})</div></div>
      <div class="flex gap-2 mt-3">
        <button class="addCartBtn bg-indigo-600 text-white px-2 py-1 rounded text-sm w-full hover:bg-indigo-700 transition" data-id='${prod.id}'>🛒 Add to Cart</button>
        <button class="wishlistBtn bg-pink-100 dark:bg-pink-900 text-pink-600 px-2 py-1 rounded text-sm transition" data-id='${prod.id}'><i class="fa-${wishlist.some(w => w.id === prod.id) ? 'solid' : 'regular'} fa-heart"></i></button>
      </div>
    `;
    productGrid.appendChild(card);
  });
  document.querySelectorAll('.addCartBtn').forEach(btn => btn.addEventListener('click', (e) => {
    let pid = parseInt(btn.dataset.id);
    let product = productsArray.find(p => p.id === pid);
    if (product) addToCart(product, 1);
  }));
  document.querySelectorAll('.wishlistBtn').forEach(btn => btn.addEventListener('click', (e) => {
    let pid = parseInt(btn.dataset.id);
    let product = productsArray.find(p => p.id === pid);
    if (product) toggleWishlist(product, btn);
  }));
}

function toggleWishlist(product, btnElement) {
  let exists = wishlist.find(w => w.id === product.id);
  if (exists) {
    wishlist = wishlist.filter(w => w.id !== product.id);
    btnElement.innerHTML = '<i class="fa-regular fa-heart"></i>';
  } else {
    wishlist.push({ id: product.id, title: product.title, price: product.price, image: product.image });
    btnElement.innerHTML = '<i class="fa-solid fa-heart"></i>';
  }
  saveWishlist();
  updateWishlistBadge();
  renderWishlistModal();
}

function renderWishlistModal() {
  let container = document.getElementById('wishlistItems');
  if (!container) return;
  container.innerHTML = '';
  if (wishlist.length === 0) {
    container.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No items in wishlist ❤️</p>';
    return;
  }
  wishlist.forEach((item, idx) => {
    let div = document.createElement('div');
    div.className = 'flex justify-between items-center border-b dark:border-gray-700 py-2';
    div.innerHTML = `<div class="flex gap-2"><img src="${item.image}" class="w-12 h-12 object-contain"><div><p class="font-semibold text-gray-800 dark:text-white">${item.title.slice(0, 30)}</p><p class="text-indigo-600 dark:text-indigo-400">$${item.price}</p></div></div><button class="removeWishlist bg-red-500 text-white px-3 rounded" data-idx="${idx}"><i class="fas fa-trash"></i></button>`;
    container.appendChild(div);
  });
  document.querySelectorAll('.removeWishlist').forEach(btn => btn.addEventListener('click', (e) => {
    let idx = btn.dataset.idx;
    wishlist.splice(idx, 1);
    saveWishlist();
    renderWishlistModal();
    updateWishlistBadge();
  }));
}

// Reviews (local JSON)
async function loadReviews() {
  const reviewsData = [
    { name: "Riyazul Rafi", rating: 5, comment: "Awesome products, delivery quick!", date: "2025-02-10" },
    { name: "Sifatul Islam", rating: 4, comment: "Good quality, coupon works fine.", date: "2025-02-14" },
    { name: "Wakil Chowdhury", rating: 5, comment: "Best ecommerce experience!", date: "2025-02-18" },
    { name: "Rafi Osman", rating: 4.5, comment: "Sleek UI and fast service.", date: "2025-02-20" }
  ];
  const blob = new Blob([JSON.stringify(reviewsData)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  let res = await fetch(url);
  let reviews = await res.json();
  URL.revokeObjectURL(url);
  const track = document.getElementById('reviewTrack');
  track.innerHTML = '';
  reviews.forEach(rev => {
    let stars = '';
    for (let i = 1; i <= Math.floor(rev.rating); i++) stars += '<i class="fas fa-star text-yellow-400"></i>';
    if (rev.rating % 1 !== 0) stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    let card = document.createElement('div');
    card.className = 'w-full flex-shrink-0 p-6 bg-white dark:bg-gray-800 rounded-xl shadow';
    card.innerHTML = `<div class="text-center"><i class="fas fa-user-circle text-4xl text-indigo-400"></i><h3 class="font-bold text-gray-800 dark:text-white">${rev.name}</h3><div class="text-sm">${stars}</div><p class="italic mt-2 text-gray-700 dark:text-gray-300">“${rev.comment}”</p><span class="text-xs text-gray-500">${rev.date}</span></div>`;
    track.appendChild(card);
  });
  updateReviewCarousel();
  startAutoReviews();
}

function updateReviewCarousel() {
  let track = document.getElementById('reviewTrack');
  if (!track) return;
  let slides = track.children.length;
  track.style.transform = `translateX(-${reviewIndex * 100}%)`;
}
function nextReview() {
  let slides = document.getElementById('reviewTrack').children.length;
  if (slides > 0) {
    reviewIndex = (reviewIndex + 1) % slides;
    updateReviewCarousel();
    resetReviewAuto();
  }
}
function prevReview() {
  let slides = document.getElementById('reviewTrack').children.length;
  reviewIndex = (reviewIndex - 1 + slides) % slides;
  updateReviewCarousel();
  resetReviewAuto();
}
function startAutoReviews() {
  if (autoReviewInterval) clearInterval(autoReviewInterval);
  autoReviewInterval = setInterval(() => { nextReview(); }, 5000);
}
function resetReviewAuto() {
  if (autoReviewInterval) clearInterval(autoReviewInterval);
  startAutoReviews();
}

// Banner Slider
function startBanner() {
  bannerInterval = setInterval(() => { nextBanner(); }, 4000);
}
function nextBanner() {
  let track = document.getElementById('bannerTrack');
  let total = track.children.length;
  bannerIndex = (bannerIndex + 1) % total;
  track.style.transform = `translateX(-${bannerIndex * 100}%)`;
}
function prevBanner() {
  let track = document.getElementById('bannerTrack');
  let total = track.children.length;
  bannerIndex = (bannerIndex - 1 + total) % total;
  track.style.transform = `translateX(-${bannerIndex * 100}%)`;
}

// Dark Mode
function initDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark');
  else document.body.classList.remove('dark');
}
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

// Back to Top Button
window.addEventListener('scroll', () => {
  let btn = document.getElementById('backToTop');
  if (window.scrollY > 300) btn.classList.remove('hidden');
  else btn.classList.add('hidden');
});
document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Active Nav Link on Scroll
const sections = ['home', 'products', 'reviews', 'contact'];
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  for (let s of sections) {
    let el = document.getElementById(s);
    if (el) {
      let rect = el.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) current = s;
    }
  }
  navLinks.forEach(link => {
    link.classList.remove('text-indigo-600', 'dark:text-indigo-400');
    if (link.dataset.section === current) link.classList.add('text-indigo-600', 'dark:text-indigo-400');
  });
});

// Contact Form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  let name = document.getElementById('contactName').value.trim();
  let email = document.getElementById('contactEmail').value.trim();
  let msg = document.getElementById('contactMsg').value.trim();
  if (!name || !email || !msg) alert('Please fill all fields');
  else if (!email.includes('@')) alert('Invalid email');
  else {
    document.getElementById('formFeedback').innerText = '✅ Thank you, ' + name + '! We will reply soon.';
    document.getElementById('formFeedback').classList.remove('hidden');
    setTimeout(() => document.getElementById('formFeedback').classList.add('hidden'), 3000);
    e.target.reset();
  }
});

// Modal Controls
document.getElementById('floatingCartBtn').onclick = () => {
  renderCartModal();
  cartModal.classList.remove('hidden');
  cartModal.classList.add('flex');
};
document.getElementById('closeCartModal').onclick = () => cartModal.classList.add('hidden');
document.getElementById('openWishlistBtn').onclick = () => {
  renderWishlistModal();
  wishlistModal.classList.remove('hidden');
  wishlistModal.classList.add('flex');
};
document.getElementById('closeWishlistModal').onclick = () => wishlistModal.classList.add('hidden');
document.getElementById('applyCouponBtn').onclick = applyCoupon;
document.getElementById('checkoutWarningBtn').onclick = () => {
  let final = parseFloat(document.getElementById('finalTotal').innerText);
  if (final <= currentBalance) alert('✅ Order placed successfully! (demo)');
  else alert(`❌ Insufficient balance! Need $${final - currentBalance} more.`);
};
addMoneyBtn.onclick = addMoney;
document.getElementById('prevBanner').onclick = prevBanner;
document.getElementById('nextBanner').onclick = nextBanner;
document.getElementById('prevReview').onclick = () => { prevReview(); resetReviewAuto(); };
document.getElementById('nextReview').onclick = () => { nextReview(); resetReviewAuto(); };

// INITIALIZATION
async function init() {
  let storedBalance = localStorage.getItem('shopBalance');
  if (storedBalance) currentBalance = parseFloat(storedBalance);
  updateBalanceUI();
  loadCartFromLocal();
  loadWishlist();
  updateCartBadge();
  updateWishlistBadge();

  // Fetch from Tech Products API (DummyJSON)
  try {
    const res = await fetch('https://dummyjson.com/products?limit=30');
    const data = await res.json();
    productsArray = data.products.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.thumbnail,
      category: p.category,
      rating: { rate: p.rating, count: p.stock }
    }));
    populateCategories();      // fill category dropdown
    filterAndRenderProducts(); // render products
  } catch (error) {
    console.error("Failed to fetch products:", error);
    productGrid.innerHTML = '<p class="col-span-full text-center text-red-500">Failed to load products. Please refresh.</p>';
  }

  loadReviews();
  startBanner();
  initDarkMode();
  searchInput.addEventListener('input', filterAndRenderProducts);
  categoryFilter.addEventListener('change', filterAndRenderProducts);
}

init();