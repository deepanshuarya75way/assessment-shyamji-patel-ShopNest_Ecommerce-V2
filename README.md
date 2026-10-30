# 🛒 ShopNest E-Commerce

Full-stack MERN e-commerce application with OTP-verified authentication, Redux cart, Razorpay payments and an admin dashboard.

## Features
**Users**
- Register with email OTP verification (Nodemailer), JWT login, resend OTP
- Shop page with search, category filter and sorting; product detail pages
- Redux Toolkit shopping cart
- Razorpay checkout with server-side HMAC SHA-256 payment signature verification
- Order history, order success page, profile page

**Admin**
- Protected admin dashboard (role-based `protect` + `admin` middleware)
- Sales analytics, order status updates
- Product create / edit / delete with Cloudinary image upload

## Tech Stack
- **Frontend:** React, React Router, Redux Toolkit, Context API
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Multer, Cloudinary, Nodemailer, Razorpay

## Project Structure
```
backend/
  config/ controllers/ middleware/ model/ routes/ utils/ seed.js index.js
frontend/
  src/ admin/ components/ context/ pages/ redux/ styles/
```

## Getting Started

**Prerequisites:** Node.js 18+, a MongoDB URI (Atlas or local)

```bash
git clone https://github.com/shyamji5382/ShopNest_Ecommerce.git
cd ShopNest_Ecommerce
npm install                      # installs root, backend and frontend dependencies

cp backend/.env.example backend/.env   # Windows: Copy-Item backend\.env.example backend\.env
# fill in MONGO_URI and JWT_SECRET (Razorpay/Cloudinary keys are needed for payment and image upload)

cd backend && npm run seed && cd ..    # creates admin user and sample products
npm run dev                            # backend: :5000, frontend: :3000
```

## Test Credentials (after `npm run seed`)
- **Admin:** `admin@shopnest.com` / `password123`
- **New user:** register from the UI. If `EMAIL_USER`/`EMAIL_PASS` are not set, the OTP is printed in the backend terminal.

## API Overview
| Route | Description |
|---|---|
| `POST /api/auth/register` `verify-otp` `resend-otp` `login` | Authentication |
| `GET /api/auth/users` | List users (admin) |
| `/api/products` | Product listing and details; create/update/delete (admin) |
| `/api/orders` | Create orders, order history, status update (admin) |
| `POST /api/payment/order` `verify` | Create Razorpay order, verify signature |
| `GET /api/analytics` | Dashboard stats (admin) |

## Notes
- Payments use Razorpay **test mode**; add test keys in `backend/.env` to try checkout.
- Product image upload requires Cloudinary credentials.

## Author
**Shyamji Patel** — CS undergraduate, GLA University