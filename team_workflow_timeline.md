# Urban Tourism Optimizer: Team Workflow & Timeline

This document outlines the development timeline, role responsibilities, and synchronization checkpoints for the **Urban Tourism Optimizer** project. Our goal is to ensure smooth parallel development across the Frontend, Backend, and Integration layers.

## 👥 Team Roles & Responsibilities

1. **Backend Developer**
   - Responsible for setting up the core server, managing routes, handling requests/responses, and enforcing data validation.
   - Stack: Node.js, Express.

2. **Frontend Developer**
   - Responsible for the user interface, state management, connecting to backend APIs, and overall UX/UI polish.
   - Stack: React.

3. **Integration Specialist**
   - Responsible for core business logic, connecting to external APIs (Places API, Maps API), handling edge cases, and ensuring data consistency.

---

## 📅 Detailed Development Timeline

### Phase 1: Foundation & Parallel Work (Days 1–2)
**Goal:** Everyone works independently to set up their environments and mock interfaces without blocking each other.

* **Backend Developer**
  * Initialize the Express server and configure basic middleware.
  * Define the folder structure (e.g., `controllers/`, `routes/`, `services/`).
  * Create the `/generate-itinerary` route with a dummy JSON response.

* **Frontend Developer**
  * Initialize the React project.
  * Build the foundational UI:
    * Input form (City, Duration, Interests).
  * *Note: No API calls yet; focus purely on UI layout and state management.*

* **Integration Specialist**
  * Create service files: `places.service.js` and `routes.service.js`.
  * Implement `getPlaces()` returning mock location data.
  * Implement `getRoutes()` returning dummy routing data.

✔ **Checkpoint 1 (End of Day 2):** Independent environments are set up. Integration must finish mock services.

---

### Phase 2: First Connection (Days 3–4)
**Goal:** Establish the first end-to-end pipeline using mock data. *(Frontend → Backend → Integration → Backend → Frontend)*

* **Backend Developer**
  * Import and call Integration functions within the `/generate-itinerary` route:
    ```javascript
    const places = await getPlaces(city);
    const routes = await getRoutes(places);
    ```
  * Format and return this data as the API response.
  * **Deadline:** Backend must expose the API by Day 3.

* **Integration Specialist**
  * Ensure `getPlaces` and `getRoutes` export properly and seamlessly plug into the backend controller.
  * Verify output data structures match the backend's expected format. Fix any mismatches.

* **Frontend Developer**
  * Connect the UI form to the backend API (`/generate-itinerary`).
  * Send form data on submit.
  * Render the raw API response on the screen (no styling needed yet, just verify data flows).
  * **Deadline:** Frontend must hit the API by Day 4.

✔ **Checkpoint 2 (End of Day 4):** Basic end-to-end data flow is working.

---

### Phase 3: Stabilization (Days 5–6)
**Goal:** Ensure the real data flow works flawlessly with the mock data, handling basic edge cases. 

* **Backend Developer**
  * Clean up the final response format to be as predictable as possible.
  * Add request validation (e.g., ensure `city` and `duration` are provided in the payload).

* **Integration Specialist**
  * Handle different city inputs gracefully.
  * Handle empty or invalid data scenarios to prevent server crashes.

* **Frontend Developer**
  * Improve the UI to parse and display the mock data properly.
  * Implement a simple list view for the places and routes returned.

✔ **Checkpoint 3 (End of Day 6):** System is usable and robust with mock data. 
*Note: No response format changes allowed after this phase!*

---

### Phase 4: The Real APIs (Days 7–9)
**Goal:** Swap out the mock data for real external APIs while keeping the internal data structures identical.

* **Integration Specialist (Primary Focus)**
  * Replace internal mock data with real API calls (e.g., Google Places API, Google Maps API).
  * **Critical:** KEEP THE EXACT SAME OUTPUT FORMAT to prevent breaking the Backend and Frontend.

* **Backend Developer**
  * Monitor for unexpected issues. Make only minor internal fixes if necessary. No major structural changes.

* **Frontend Developer**
  * Upgrade the display to look professional.
  * If possible, integrate a visual map or timeline component for the itinerary.

✔ **Checkpoint 4 (End of Day 9):** The application is realistic and functional with live data.

---

### Phase 5: Final Polishing (Day 10+)
**Goal:** Stabilize the application, handle edge cases, and finalize the user experience.

* **Backend Developer**
  * Finalize error handling (e.g., proper HTTP status codes and error messages).
  * *Optional:* Add functionality to save itineraries to a database (MongoDB).

* **Integration Specialist**
  * Implement API failure fallbacks (e.g., what happens if the external Places API is down?).
  * Handle edge cases (e.g., obscure locations, zero results).

* **Frontend Developer**
  * Finalize UI polish and animations.
  * Improve overall User Experience (loading states, error toasts, responsive design).

✔ **Final Delivery:** A stable, complete MERN stack application.

---

## 🚨 Critical Sync Rules & Deadlines

To prevent blocking and ensure smooth collaboration, adhere to these strict deadlines:

- [ ] **Day 2:** Integration must finish all **mock services**.
- [ ] **Day 3:** Backend must **expose the API endpoint**.
- [ ] **Day 4:** Frontend must **successfully hit the Backend API**.
- [ ] **Post-Day 5:** Absolutely **NO changes** to the JSON response format between Backend, Integration, and Frontend.

---

## 📝 One-Line Summary Timeline

```plaintext
Days 1–2  → Build foundation separately (No Blocking)
Days 3–4  → Connect Frontend ↔ Backend ↔ Integration
Days 5–6  → Stabilize and refine data flow (Mock Data working perfectly)
Days 7–9  → Swap mock data for Real External APIs
Days 10+  → Polish UX, add fallbacks, and stabilize
```
