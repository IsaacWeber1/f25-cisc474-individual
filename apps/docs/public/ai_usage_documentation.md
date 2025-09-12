# AI Usage Documentation

**Student:** Isaac Weber  
**Course:** CISC474 - Advanced Web Technologies  
**Assignment:** NextJS LMS Frontend (Assignment 2)  
**AI Tool Used:** Claude (Anthropic)  
**Date Range:** September 12, 2025

## Summary of AI Assistance

This document provides full disclosure of AI usage in compliance with the course AI policy. Claude (Anthropic's AI assistant) was used extensively throughout the development process for debugging, implementation guidance, and feature development.

## AI-Generated vs. Student-Generated Content

### Student-Generated Content:
- **Project Concept & Planning**: Original LMS concept and distinctive "Reflection" feature idea
- **Requirements Analysis**: Assignment 2 requirements interpretation and MVP scope definition  
- **User Interface Design Decisions**: Choice of inline CSS styling, color schemes, layout structure
- **Data Model Design**: Entity relationships, interface definitions, and mock data structure
- **Feature Specifications**: Reflection prompts, role-based functionality, and user stories

### AI-Generated Content:
- **Code Implementation**: ~95% of TypeScript/React/Next.js code
- **Debugging Solutions**: Error diagnosis and systematic fixes
- **Technical Architecture**: Server/Client component patterns, routing structure
- **Documentation**: Phase documentation files and technical explanations

## Specific AI Contributions by Category

### 1. **Core Implementation (AI-Generated)**
- Next.js App Router setup with dynamic routing (`/course/[id]/*`)
- TypeScript interfaces and type definitions
- Mock data system (`mockData.ts`) including all functions and data arrays
- React component structure for all 5+ pages
- CSS styling (inline styles throughout application)
- Server/Client component boundary management

**Code Files with Significant AI Contribution:**
- `app/page.tsx` (Dashboard) - 100% AI implementation
- `app/course/[id]/page.tsx` (Course Overview) - 100% AI implementation  
- `app/course/[id]/layout.tsx` (Course Layout) - 100% AI implementation
- `app/course/[id]/assignments/page.tsx` (Assignments List) - 100% AI implementation
- `app/course/[id]/reflections/page.tsx` (Reflections List) - 100% AI implementation
- `app/course/[id]/grades/page.tsx` (Grades View) - 100% AI implementation
- `app/_lib/mockData.ts` (Data Layer) - 100% AI implementation
- `app/_components/` (All components) - 100% AI implementation

### 2. **Problem Solving & Debugging (AI-Led)**
- **NextJS 15 Compatibility**: Resolved async params requirement across all dynamic routes
- **PostCSS Configuration Issues**: Fixed ES module vs CommonJS conflicts  
- **Server/Client Component Boundaries**: Resolved event handler errors
- **CSS Syntax Errors**: Fixed malformed CSS strings causing 500 errors
- **Missing Dependencies**: Added `mockReflectionTemplates` constant to resolve ReferenceError

### 3. **Technical Architecture Decisions (AI-Guided)**
- App Router vs. Pages Router choice
- Server-first rendering strategy
- Role-based functionality implementation
- URL-based state management for filters
- TypeScript strict typing approach (avoiding `any` types)

### 4. **Documentation (AI-Generated)**
- `phase1.md`, `phase2.md`, `phase3.md` - Complete development phase documentation
- Technical implementation explanations
- Error resolution logs and troubleshooting guides

---

**Signature:** Isaac Weber  
**Date:** September 12, 2025

*This documentation ensures full transparency and compliance with CISC474 AI usage policies.*