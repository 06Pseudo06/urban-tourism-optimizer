# Urban Tourism Optimizer: Team Progress Timeline

This document tracks our phase-wise development progress across the full stack.

## 👥 Current Roles
- **Backend**: API Structure, Routes, Response Formatting
- **Integration/Algorithms**: Geoapify Connectivity, Scoring, Data Optimization
- **Frontend**: Application UI, Map Interfaces, Data Parsing

---

## ✅ COMPLETED Phases

### Phase 1: Architecture & Foundation Setup
- [x] **Backend**: Express server initialized. `/api/itinerary/generate-itinerary` baseline route established.
- [x] **Frontend**: React application scaffolded, structured user form for City, Duration, and Group Size.
- [x] **Integration**: Mock API services established for early testing without rate limits.

### Phase 2: Complete API Pipeline & Advanced Optimization
- [x] **Integration/Backend**: Connected real Geoapify API (`/search` and `/places`).
- [x] **Integration/Backend**: Added **Distance-based Scoring**, penalizing places further from the geographical center of the city.
- [x] **Integration/Backend**: Added **Preference Boosting** logic, rewarding attractions matching user profile (e.g. Budget/Travel Type).
- [x] **Integration/Backend**: Extracted generic API payload and converted it into top N route mapping clustered intelligently for sequential day-to-day visits.
- [x] **Frontend**: Hooked up Axios/Fetch to dynamically trigger API generation upon search. Frontend now successfully catches the robust JSON shape.

---

## 🚧 REMAINING Phases (Phase 3 & 4)

### 1. Frontend 
*Currently, the parsed optimizations are logged cleanly within a JSON array. UI Developer should now step in to skin the data.*
- [ ] Parse `response.data.routes` and construct a daily itinerary timeline UI.
- [ ] Style the interactive cards to visually reflect the Place `category`, `score`, and `rating`.
- [ ] Implement empty states and clean loaders globally.
- [ ] (Optional) Add interactive Map component using `lat` and `lon` features available in the optimized dataset.

### 2. Backend
- [ ] Lock down API security (helmet, CORS configuration).
- [ ] Refactor `.env` handling for production deployment.
- [ ] Add explicit validation pipelines (e.g., Joi / Zod) over the request payload to ensure bulletproof requests.
- [ ] Caching integration: Redis caching for popular city searches to avoid spamming the Geoapify quota.

### 3. Integration & Testing
- [ ] Exhaustive edge case testing (e.g., obscure cities, zero results, missing coordinates).
- [ ] Further fine-tuning of the "Haversine scoring algorithm" scaling weights with real beta testers' preferences.
- [ ] Add explicit travel-time / directions API to precisely measure travel between chunked locations.
