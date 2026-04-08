# Rupert Joel - AI First-Pass Video Editor Landing Page

## Problem Statement
Landing page for "Rupert Joel" - an AI SaaS product that provides first-pass video editing for talking-head content. Features waitlist signup, PAS framework copy, and conversion optimization.

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion + Shadcn UI
- **Backend**: FastAPI + MongoDB (Motor)
- **Database**: MongoDB (waitlist collection, waitlist_feedback collection)

## User Personas
- Solopreneurs, podcasters, YouTube creators who waste hours on manual editing

## Core Requirements (Static)
- Charcoal dark theme with turquoise (#40E0D0) accents
- Email-only waitlist signup stored in MongoDB
- Confirmation screen with P.S. validation question
- Rotating headlines (3 variations, 4U formula)
- Urgency badge, social proof, bento grid features
- How It Works 3-step section

## What's Been Implemented (April 2026)
- Full landing page with Hero, Features, How It Works, Footer
- Glassmorphic fixed header with smooth scroll CTA
- Animated background (floating turquoise orbs + grain overlay)
- 3 rotating headlines with framer-motion AnimatePresence
- Email waitlist form → POST /api/waitlist (MongoDB)
- Duplicate email detection (409 conflict)
- Inline confirmation with feedback textarea → POST /api/waitlist/feedback
- GET /api/waitlist/count endpoint
- Bento grid features (Silence Removal, WhisperX Transcription, Chapter Generation)
- 3-step How It Works with connector line
- Social proof avatar pile + "400+ creators" text
- Urgency badge "First 500 signups get 50% off for life"
- Custom scrollbar, selection colors, grain texture
- Fonts: Outfit (headings), Manrope (body)

## API Endpoints
- POST /api/waitlist - Join waitlist (email)
- GET /api/waitlist/count - Get signup count
- POST /api/waitlist/feedback - Submit editing bottleneck feedback

## Prioritized Backlog
### P0
- (none remaining)

### P1
- Add email sending via Resend/SendGrid for welcome emails
- A/B test headline variations with analytics
- Add admin dashboard to view signups and feedback

### P2
- Add FAQ section
- Add testimonial/quote section
- Add video demo embed
- Mobile app deep link support
- SEO meta tags for Open Graph

## Next Tasks
- Integrate email service for automated welcome emails with the P.S. validation question
- Add analytics tracking for conversion funnel
- Consider adding a video demo or product walkthrough section
