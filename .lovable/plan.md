

# Real Estate CRM — MVP Plan

## Overview
A comprehensive Real Estate CRM web app with Supabase backend, supporting agents, brokerages, and property managers. Deployable on Vercel with proper serverless configuration.

---

## 1. Authentication & User Management
- Email/password sign-up and login
- User profiles with name, phone, company, and avatar
- Role-based access (Admin, Agent, User) stored securely in a separate roles table

## 2. Dashboard
- Summary cards: total leads, active listings, pending tasks, deals closed
- Pipeline funnel visualization (New → Contacted → Qualified → Proposal → Closed)
- Recent activity feed (new leads, status changes, upcoming tasks)
- Quick-action buttons: Add Lead, Add Property, Add Task

## 3. Leads & Contacts Management
- Add/edit contacts with name, email, phone, company, source, and notes
- Lead status pipeline: New → Contacted → Qualified → Negotiation → Won/Lost
- Assign leads to properties
- Search, filter by status/source, and sort contacts
- Contact detail view with activity history and linked properties

## 4. Property Listings
- Add/edit properties with address, price, type (residential/commercial/rental), bedrooms, bathrooms, area, description
- Property status tracking: Available → Under Contract → Sold/Rented
- Property detail view with linked contacts/leads
- List and grid view toggle
- Search and filter by type, status, price range

## 5. Tasks & Follow-ups
- Create tasks linked to leads or properties
- Set due dates, priority (low/medium/high), and status (pending/in-progress/done)
- Upcoming tasks widget on dashboard
- Overdue task alerts via toast notifications
- Calendar view of tasks and follow-ups

## 6. Analytics
- Leads by source (pie chart)
- Deals closed over time (line chart)
- Properties by status (bar chart)
- Conversion rate metrics

## 7. Vercel Deployment Config
- `vercel.json` with SPA rewrites for client-side routing
- Proper build configuration for Vite + React

## 8. Database Design (Supabase)
- **profiles** — user info linked to auth.users
- **user_roles** — role-based access control
- **contacts** — leads and contacts with status and source
- **properties** — listings with type, status, and details
- **tasks** — follow-ups linked to contacts/properties
- **activities** — audit log of key actions
- Row-Level Security on all tables so users only see their own data

## 9. UI & Navigation
- Sidebar navigation: Dashboard, Leads, Properties, Tasks, Analytics, Settings
- Responsive design with mobile-friendly sidebar collapse
- Clean, professional design using the existing shadcn/ui components
- Dark/light mode support

