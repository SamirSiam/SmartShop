# 🛍️ SmartShop - Online Product Store

> **Course:** CSE-3532: Tools and Technologies for Internet Programming  
> **Project:** Mid Term Project  
> **Technology Stack:** HTML5, Tailwind CSS, JavaScript (Vanilla), Fetch API, LocalStorage

---

## 🌐 Live Demo

🔗 **[View SmartShop Live](https://samirsiam.github.io/SmartShop/)**  

---

## ✨ Features Implemented

### Core Features (From Syllabus)
| Feature | Status | Description |
|---------|--------|-------------|
| ✅ Sticky Navbar | Working | Stays visible while scrolling, highlights active menu |
| ✅ Sliding Banner | Working | Auto-slides every 4 seconds + manual prev/next buttons |
| ✅ Dynamic Products | Working | Fetched from DummyJSON REST API |
| ✅ Search Products | Working | Real-time search by product name |
| ✅ Category Filter | Working | Dynamic dropdown from API categories |
| ✅ Add to Cart | Working | Products added with balance validation |
| ✅ Remove from Cart | Working | Individual item removal + quantity controls |
| ✅ Real-time Cart Total | Working | Subtotal, delivery ($5), shipping ($3) update instantly |
| ✅ Coupon System | Working | `SMART10` = 10% discount |
| ✅ User Balance | Working | Start $1000, add $100, cannot exceed balance |
| ✅ Review Carousel | Working | Auto-slide + manual navigation, local JSON data |
| ✅ Contact Form | Working | Validation (required fields + email format) |
| ✅ Responsive Design | Working | Mobile, tablet, and desktop friendly |

### Extra Features (My Additions)
| Feature | Status |
|---------|--------|
| 🌙 Dark/Light Mode Toggle | ✅ Working (saved in LocalStorage) |
| ❤️ Wishlist | ✅ Working (add/remove, persists after refresh) |
| 🔼 Back to Top Button | ✅ Working (appears after scrolling) |
| 💾 LocalStorage Persistence | ✅ Working (cart, wishlist, balance, dark mode) |
| 📱 Mobile Responsive | ✅ Working |

---

## 🛠️ Technologies Used

```

┌─────────────────┬────────────────────────────────────────────┐
│ Technology      │ Purpose                                    │
├─────────────────┼────────────────────────────────────────────┤
│ HTML5           │ Semantic page structure                    │
│ Tailwind CSS    │ Responsive styling (utility-first)         │
│ JavaScript ES6+ │ All interactive features & DOM manipulation│
│ Fetch API       │ HTTP requests to REST API                  │
│ LocalStorage    │ Persist user data across sessions          │
│ Font Awesome    │ Icons (cart, heart, wallet, arrows)        │
└─────────────────┴────────────────────────────────────────────┘

```

---

## 📦 API Information

**Endpoint:** `https://dummyjson.com/products?limit=30`

**What it returns:** Products from multiple categories including:
- Beauty & Cosmetics (mascara, eyeshadow, lipstick, nail polish)
- Fragrances (perfumes from Calvin Klein, Chanel, Dior, Gucci)
- Furniture (beds, sofas, chairs, tables)
- Groceries (fruits, vegetables, meat, eggs, juice)

> **Note:** The API returns a mixed catalog. My search and filter functionality allows users to find specific items across all categories.

---

## 📁 File Structure

```

SmartShop/
├── index.html      # Main HTML structure (navbar, banner, modals, footer)
├── style.css       # Custom styles (carousel transitions, dark mode)
├── script.js       # All JavaScript logic (API fetch, cart, wishlist, etc.)
└── README.md       # Project documentation (this file)

```

---

## 🚀 How to Run Locally

### Method 1: Direct Open
1. Download all three files (`index.html`, `style.css`, `script.js`) into one folder
2. Double-click `index.html` to open in browser

### Method 2: Live Server (Recommended)
```bash
# Clone the repository
git clone https://github.com/samirsiam/SmartShop.git

# Navigate to folder
cd SmartShop

# Open with Live Server in VS Code
```

No build steps, no dependencies, no installation required!

---

💡 How to Use the Website

Action Instructions
Browse products Scroll through the product grid
Search products Type in the search box (filters in real-time)
Filter by category Select from dropdown menu
Add to cart Click "🛒 Add to Cart" button on any product
View cart Click floating cart button (bottom-right corner)
Change quantity Use +/- buttons inside cart modal
Remove from cart Click 🗑️ trash icon inside cart modal
Apply coupon Enter SMART10 in cart modal → 10% off
Add money Click "+$100" button next to balance
Toggle dark mode Click moon/sun icon (top-right)
Add to wishlist Click ❤️ heart icon on any product
View wishlist Click heart button (top-right, next to dark mode)
Submit contact Fill name, email, message → click Send
Back to top Scroll down → button appears bottom-right

---

🧪 Testing the Coupon

```
Coupon Code: SMART10
Discount: 10% off subtotal
Requirement: Cart must have at least one item
```

Example: If subtotal = $100, discount = $10, final total = $100 + $5 + $3 - $10 = $98

---

💰 Balance System Explained

Action Effect
Starting balance $1000
Click "+$100" Adds $100 to balance
Add product to cart Checks if new total ≤ balance
If total > balance Warning message + cannot add
Click "Proceed" Final balance check before order

---

❓ Troubleshooting

Issue Solution
Products not loading Check internet connection (API requires network)
Cart not saving after refresh Check browser localStorage is enabled
Dark mode not persisting Clear browser cache and try again
Coupon not working Ensure cart has items, type SMART10 exactly

---

👨‍💻 Author

Field Information
Name Samir Siam
Project - SmartShop
GitHub samirsiam
Live Demo SmartShop

---

📄 License

This project was created for educational purposes as part of university course requirements.

---

🙏 Acknowledgments

· Tailwind CSS - Styling framework
· DummyJSON - Free product API
· Font Awesome - Icons
· Course Teacher for guidance and project requirements

---

🔗 Quick Links

· GitHub Repository: https://github.com/samirsiam/SmartShop
· Live Website: https://samirsiam.github.io/SmartShop/

---

✅ Project Status

COMPLETE - All required features implemented and tested.

Requirement Status
Navbar with 4+ links ✅
Sliding banner (auto + manual) ✅
Products from public API ✅
Shopping cart system ✅
Real-time calculations ✅
Coupon discount ✅
User balance system ✅
Review section (carousel) ✅
Contact form with validation ✅
Responsive design ✅
Dark mode (extra) ✅
Wishlist (extra) ✅
Search & filter (extra) ✅

---

Last Updated: May 2026

---
