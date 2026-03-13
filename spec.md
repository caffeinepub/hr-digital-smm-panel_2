# HR Digital SMM Panel

## Current State
New project -- no existing code.

## Requested Changes (Diff)

### Add
- Full SMM (Social Media Marketing) panel with user and admin sides
- User: Register/Login, Dashboard, Wallet system (add funds via UPI screenshot upload + admin approval), Order SMM services, Order history, Support tickets
- Admin: Dashboard with analytics/profit, Manage users, Manage orders, Manage services (add/edit/delete), Wallet/fund approval, Import services via external API
- Services for Instagram, YouTube, Facebook, TikTok (followers, likes, views, comments, subscribers, watch time, etc.)
- Dark + Blue modern theme, Poppins font
- HTTP outcalls to external SMM supplier API for placing orders
- Blob storage for payment screenshot uploads

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Authorization component for user/admin role-based access
2. Blob-storage for payment screenshot uploads
3. HTTP-outcalls for external SMM API integration
4. Backend: Users, Wallet, Services, Orders, SupportTickets actors
5. Frontend pages: Login, Register, User Dashboard, Services, New Order, Orders History, Wallet/Add Funds, Support; Admin pages: Dashboard, Users, Orders, Services, Wallet Approvals
6. Dark blue modern UI with sidebar navigation
