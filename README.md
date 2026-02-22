# SyntaxHealth: AI-Driven Preventative Digital Twin

**SyntaxHealth** is a cutting-edge preventative health visualization platform. By creating a "Digital Human Twin," the software allows users to visualize their health data in real-time, monitor symptoms, and predict medical outcomes using advanced AI modeling.



---

## 🌟 Overview

SyntaxHealth bridges the gap between raw medical data and intuitive visual understanding. By synthesizing biometric inputs into a virtual representation, users can identify health trends before they become chronic issues.

### Key Capabilities:
* **Digital Twin Visualization:** A dynamic representation of the human body that reflects the user's current health status.
* **Outcome Prediction:** Utilizes LLMs to forecast potential health trajectories based on lifestyle and symptom data.
* **Symptom Monitoring:** Interactive logging system that maps discomfort or irregularities directly onto the digital model.
* **Preventative Insights:** Proactive alerts designed to encourage early intervention and lifestyle adjustments.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Responsive UI and interactive SVG/Canvas visualization. |
| **Backend/DB** | [Supabase](https://supabase.com/) | PostgreSQL database, Auth, and Real-time data syncing. |
| **AI Engine** | [Google Gemini API](https://ai.google.dev/) | Gemini integration for medical data synthesis and predictive analysis. |

---

## 🏗 System Architecture



1.  **Input:** User enters vitals or symptoms via the JS-based dashboard.
2.  **Storage:** Data is securely sent to **Supabase** via Row Level Security (RLS) policies.
3.  **Processing:** The application sends anonymized health markers to the **Gemini API**.
4.  **Feedback Loop:** The AI returns a risk assessment, which the frontend renders as a visual change (color coding, heatmaps) on the **Human Twin**.

---

## 🚦 Getting Started

### Prerequisites
* A [Supabase](https://supabase.com/) account and project.
* A [Google Gemini](https://ai.google.dev/) API key.
* A local development server (e.g., Live Server for VS Code).

### Installation

1.  **Clone the Repo**
    ```bash
    git clone [https://github.com/yourusername/SyntaxHealth.git](https://github.com/yourusername/SyntaxHealth.git)
    cd SyntaxHealth
    ```

2.  **Environment Setup**
    Create a `config.js` file in your root directory:
    ```javascript
    export const ENV = {
      SUPABASE_URL: "[https://your-project-id.supabase.co](https://your-project-id.supabase.co)",
      SUPABASE_KEY: "your-anon-public-key",
      GEMINI_API_KEY: "your-gemini-api-key"
    };
    ```

3.  **Run Locally**
    Open `index.html` via a local server to avoid CORS issues with the API modules.

---

## 🔒 Security & HIPAA Compliance

* **Data Isolation:** Uses Supabase RLS to ensure users can only access their own "Twin" data.
* **Encryption:** Data is encrypted in transit via SSL and at rest within the Supabase PostgreSQL instance.

  ## To use the app simply click the link in the repo above releases.
