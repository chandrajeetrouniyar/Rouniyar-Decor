# Rouniyar Decor — Handcrafted Indian Home Decor E-Commerce

> *"Handcrafted Details for Beautiful Homes"*

A complete production-style full-stack e-commerce website for **Rouniyar Decor**, an authentic Indian D2C home decor brand specializing in handmade door torans, bandarwals, crochet pooja thali covers (thali posh), brass bell door hangings, and festive decorations.

---

## 🌟 Key Highlights & Features

### 🛍️ Customer Experience
- **Hero & Curated Collections**: Warm earthy terracotta and cream aesthetic inspired by Indian heritage.
- **Dynamic Catalog & Filtering**: Multi-faceted filtering by Category, Price Range, Primary Color, Availability, Rating, and Discounts.
- **Live Search**: Autocomplete suggestions by product name, category, SKU, and tags.
- **Product Details Showcase**: Multi-image zoom gallery, color & size variants selection, stock alerts, live delivery pincode checker, specification accordions, and verified customer reviews with star rating breakdown.
- **Interactive Cart**: Persistent cart storage, live coupon application (`WELCOME100`, `FESTIVE15`, `ROUNIYAR20`, `FREESHIP`), free delivery progress bar, and upsell suggestions.
- **Multi-Step Seamless Checkout**: Customer contact, full Indian address structure, delivery speed selection, and flexible payment options (Razorpay, UPI QR, Cards, NetBanking, and Cash on Delivery).
- **Order Tracking & Success**: Celebratory confetti, real-time 5-stage order progress timeline (Order Placed → Confirmed → Packed → Shipped → Delivered), invoice printable view, and cancellation support.
- **Customer Account & Wishlist**: Profile management, saved addresses, order history, and wishlist with 1-click move to cart.
- **Mobile First UX**: Sticky bottom navigation bar, one-handed mobile checkout, and sticky add-to-cart on product pages.

### 🛡️ Administrative Control Panel (`/admin`)
- **Executive Dashboard**: Real-time business metrics (Gross Revenue, Today's Sales, Orders Count, Customer Count, Low Stock Warnings, 7-Day Revenue Trajectory Charts).
- **Product Management**: Full CRUD capabilities, multi-image management, variants, inventory counts, tags, and homepage spotlight toggles.
- **CSV Product Ingestion**: Built-in CSV product importer with sample template download, schema validation, and batch insert.
- **Taxonomy / Categories**: Manage categories, image banners, and product counts.
- **Order Fulfillment**: Filter by delivery stage, update live tracking numbers, manage payment verification.
- **Real-Time Inventory Control**: Color-coded stock warning indicators with quick `+` / `-` stock adjustments.
- **Customer Directory**: Customer lifetime spend, total orders, and contact details.
- **Review Moderation**: Approve, hide, or delete customer reviews.
- **Coupon Engine**: Percentage or flat discounts, minimum order value, maximum discount caps, and usage limits.
- **Analytics & Settings**: Average Order Value (AOV), conversion rates, free delivery thresholds, and payment gateway configuration.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router, Server Components & Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom warm earthy palette (`earth`, `terracotta`, `gold`, `cream`)
- **Database & ORM**: Prisma ORM with SQLite (Zero-friction local dev) and 100% PostgreSQL production compatibility
- **Authentication**: Custom JWT authentication with HTTP-only cookies, password hashing with `bcryptjs`
- **Payment Gateway**: Razorpay integration with sandbox simulation fallback
- **Icons & Effects**: Lucide Icons & Canvas Confetti

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** or **yarn**

### 2. Installation
Clone the repository and install all dependencies:
```bash
cd "rouniyar decor web"
npm install
```

### 3. Environment Setup
The project comes pre-configured with safe development defaults in `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="rouniyar-decor-secure-jwt-auth-token-key-2025"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_RouniyarDecorDemo101"
RAZORPAY_KEY_SECRET="rzp_test_secret_RouniyarDecorKey2025"
ADMIN_EMAIL="admin@rouniyardecor.com"
ADMIN_PASSWORD="admin123"
```

### 4. Database Initialization & Seeding
Initialize the database schema and populate it with 20+ authentic Rouniyar Decor products, categories, demo users, reviews, coupons, and orders:
```bash
# Push schema to SQLite database
npx prisma db push

# Seed authentic products, admin, and customers
node prisma/seed.js
```

### 5. Running the Application
Start the development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Demo Login Credentials

### 🛡️ Administrator Account
Access the Admin Portal at **[/admin/login](http://localhost:3000/admin/login)**:
- **Email**: `admin@rouniyardecor.com`
- **Password**: `admin123`
*(Includes a 1-click "Auto-fill Admin" button for testing)*

### 👤 Customer Demo Account
Access customer login at **[/login](http://localhost:3000/login)**:
- **Email**: `ananya@example.com`
- **Password**: `customer123`
*(Includes a 1-click "Auto-fill Demo Login" button)*

---

## 🎟️ Active Discount Coupons for Testing

You can apply any of these coupon codes during Cart or Checkout:
| Coupon Code | Discount | Minimum Order | Max Discount |
| :--- | :--- | :--- | :--- |
| **`WELCOME100`** | Flat ₹100 OFF | ₹499 | ₹100 |
| **`FESTIVE15`** | 15% OFF | ₹799 | ₹300 |
| **`HANDMADE10`** | 10% OFF | ₹599 | ₹250 |
| **`ROUNIYAR20`** | 20% OFF | ₹1,299 | ₹500 |
| **`FREESHIP`** | Flat ₹50 OFF Shipping | ₹399 | ₹50 |

---

## 📦 How to Import Products via CSV

1. Sign in to the Admin Panel (`/admin/login`).
2. Navigate to **Import CSV** (`/admin/import-csv`) in the sidebar.
3. Click **"Download Sample CSV Template"** to inspect the required columns:
   - `name`, `category`, `price`, `mrp`, `sku`, `stock`, `material`, `color`, `dimensions`, `weight`, `tags`, `image1`, `description`
4. Choose your `.csv` file or paste raw CSV text.
5. Click **"Import Products"** to validate and batch-insert into the database.

---

## 💳 Connecting Live Razorpay Gateway

The application uses a clean payment abstraction in `src/lib/razorpay.ts`. When live credentials are not present, it executes in sandbox test mode so all checkout scenarios can be tested without errors.

To connect your live Razorpay business account:
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Go to **Settings → API Keys → Generate Key**.
3. Replace the values in your `.env` file:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_your_actual_key_id"
   RAZORPAY_KEY_SECRET="your_actual_live_secret"
   ```
4. Restart your Next.js server (`npm run dev`).

---

## 🗄️ Switching to PostgreSQL in Production

If deploying to a cloud provider with a PostgreSQL database (e.g., Supabase, Neon, Railway, Render, AWS RDS):
1. In `prisma/schema.prisma`, update the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@hostname:5432/rouniyardecor?sslmode=require"
   ```
3. Run `npx prisma db push && node prisma/seed.js`.

---

## 🚢 Deployment (Vercel / Railway / Render)

### Deploying to Vercel:
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Add the environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.).
4. The build command will automatically execute `prisma generate && next build`.

---

© 2025 **Rouniyar Decor**. Handcrafted with pride in India.
