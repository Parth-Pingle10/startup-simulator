# Startup Compass

AI Startup Simulator Frontend

You are a senior Product Designer, UX Designer, and React Frontend Engineer.

Your job is to design a modern SaaS application called AI Startup Simulator.

Do NOT use a generic dashboard template, admin template, shadcn demo layout, or bootstrap-style UI.
The application should feel like a polished startup product similar to Linear, Notion, Vercel, Perplexity, Arc Browser, or Stripe.

Design everything from scratch with custom layouts, spacing, typography, and interactions.

Theme

Create a clean premium dark theme.

Style guidelines:

Modern SaaS aesthetic

Minimal but beautiful

Rounded cards

Glassmorphism only where appropriate

Smooth animations

Excellent whitespace

Beautiful gradients

Premium typography

Responsive design

No clutter

No generic sidebars copied from templates

The UI should feel like a product that could launch on Product Hunt.

Application Pages

1. Landing Page

Create an attractive landing page that includes:

Hero section

Product description

Animated illustration or abstract graphics

"Analyze Your Startup" CTA

Features section

How It Works section

Why Use It section

FAQ

Footer

The landing page should convince founders to try the platform.

2. Authentication

Design:

Login

Register

Forgot Password

Modern authentication pages with illustrations.

3. Dashboard

After login, users should see a dashboard containing:

Welcome section

Recent analyses

Total analyses

Average startup score

Quick actions

Create New Analysis button

Do NOT make this look like an admin dashboard.

4. New Startup Analysis

Create a beautiful multi-step form.

Fields:

Startup Name

Problem Statement

Proposed Solution

Target Users

Add:

Progress indicator

Input validation

Smooth transitions

Premium form components

The page should feel exciting, not boring.

5. Analysis Progress Page

This is one of the most important pages.

When analysis starts, show a live progress screen.

Display every AI agent running.

Example:

✓ Startup Analysis

✓ Competitor Discovery

⏳ Competitor Research

⬜ Market Gap Analysis

⬜ Startup Score

⬜ Persona Generation

⬜ Persona Feedback

⬜ Adoption Analytics

⬜ Final Report

Each step should have:

icon

title

short description

loading animation

completion animation

Include an estimated completion time.

Make this page visually engaging so users enjoy watching the AI work.

6. Results Page

Create a premium report page containing separate sections for:

Startup Summary

One-line description

Industry

Features

Competitors

Cards showing:

Company Name

Logo placeholder

Description

Website

Strengths

Weaknesses

Market Gaps

Beautiful insight cards.

Highlight opportunities using colors and icons.

Startup Score

Circular score visualization.

Breakdown into categories.

Strength meter.

Weakness meter.

Personas

Beautiful persona cards including:

Name

Age

Occupation

Goals

Frustrations

Buying behaviour

Persona Feedback

Display realistic quotes from generated personas.

Use chat bubbles.

Adoption Analytics

Charts for:

Growth

Adoption curve

Market size

TAM

SAM

SOM

Revenue projection

Use modern interactive charts.

Final Recommendations

Beautiful recommendation cards.

Priority labels.

Risk indicators.

Action items.

7. Analysis History

Users can:

View previous analyses

Search analyses

Delete analyses

Reopen reports

Display analyses as modern cards instead of plain tables.

8. User Profile

Include:

Profile

Account settings

Theme

Logout

Components

Create reusable components for:

Buttons

Cards

Inputs

Dialogs

Navbar

Progress bars

Charts

Loading animations

Toast notifications

Modals

Timeline

Report sections

Feature cards

Persona cards

Score cards

Competitor cards

Animations

Use tasteful animations throughout.

Examples:

Fade in

Slide up

Page transitions

Skeleton loading

Progress animations

Card hover effects

Button micro-interactions

Animations should enhance the experience without feeling excessive.

UX Requirements

Prioritize excellent user experience.

The app should guide users naturally through:

Landing → Login → Dashboard → New Analysis → Live Progress → Results → History.

Avoid overwhelming users with too much information at once.

Technical Requirements

Use:

React

TypeScript

Tailwind CSS

shadcn/ui components only as building blocks (do NOT leave them looking like default shadcn examples)

Framer Motion

Recharts

Lucide Icons

Create reusable components and maintain a scalable folder structure.

Design Inspiration

Take inspiration from:

Linear

Vercel

Notion

Perplexity

Arc Browser

Stripe Dashboard

Do NOT imitate any one product directly.

Create a unique visual identity.

Most Important Instruction

Do NOT generate a generic dashboard template.

Think like a senior product designer creating a startup that will be showcased to investors and featured on Product Hunt.

Every page should feel custom-designed, premium, modern, and visually memorable rather than assembled from standard UI templates.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2cc91bf6-e4f2-4611-b507-067643549ca6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
