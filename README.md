# Cine Luna - IMAX Ticket Booking System
[Link to Live Demo] https://github.com/estebanalfaro/Cine-Luna

## 🌙 Project Overview
This is a web-based laboratory simulating a real-world online ticketing system for "Cine Luna". The application manages seat selection, business logic for pricing, and generates an electronic invoice for the user.

## 🚀 Key Features
* **Interactive Seat Map:** Users can select between Standard, Premium, and Accessibility seats.
* **Real-time Pricing:** Automatic calculation including a 40% IMAX surcharge, discounts, and 13% VAT (Sales Tax)[cite: 2].
* **Purchase Controls:** Security features include a 6-ticket maximum per transaction and a 5-minute reservation timer[cite: 2].
* **Digital Invoice:** A detailed modal summary that acts as an electronic invoice after confirming the purchase[cite: 2].

## 🛠️ System Architecture & Data Flow

| Module / Component | Responsibility | Inputs / Outputs |
| :--- | :--- | :--- |
| **Cinema Renderer** | Manages seat visualization and status (available, occupied, selected). | **Input:** Hall status. **Output:** Updated DOM elements. |
| **Cart Manager** | Calculates totals, taxes, and surcharges in real-time. | **Input:** Seat type & base price. **Output:** Subtotal, VAT (13%), and Grand Total[cite: 2]. |
| **Timer Control** | Handles the 05:00 countdown for seat reservation[cite: 2]. | **Input:** Default time limit. **Output:** UI clock updates & session expiration. |
| **Invoice Generator** | Compiles final transaction data into a modal view[cite: 2]. | **Input:** Selection array & final totals. **Output:** Dynamic HTML invoice table[cite: 2]. |

## 💻 Tech Stack
* **HTML5:** Semantic structure for accessibility.
* **CSS3:** Custom layout and interactive seat states.
* **JavaScript (Vanilla):** Core business logic and DOM manipulation.

## 🎓 About this Project
Developed as part of my AI-Assisted Programming studies to demonstrate logic implementation and web deployment. This project complements my background in **AWS Cloud** and **Cisco Networking (CCNA)**.
