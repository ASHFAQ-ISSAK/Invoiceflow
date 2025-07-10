# InvoiceFlow 📄

![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

A modern, client-side invoice management system built with Vue 3. It allows users to create, manage, and track invoices and clients seamlessly. All data is stored locally in your browser, ensuring privacy and offline-first functionality.

---

![InvoiceFlow Dashboard Screenshot](./invoiceflow-screenshot.png)
*A snapshot of the main dashboard view.*

---

## ✨ Features

* **Full CRUD Operations:** Create, Read, Update, and Delete both invoices and clients.
* **Interactive Dashboard:** Get an at-a-glance overview of your business with key performance indicators (KPIs).
* **Dynamic Form Handling:** A single, robust form component handles both creating new invoices and editing existing ones.
* **PDF Generation:** Instantly generate professional-looking PDF versions of your invoices.
* **Data Visualization:** View insightful reports with charts for monthly revenue and invoice status distribution.
* **Client-Side Storage:** All your data is securely stored in your browser's `localStorage`.
* **Responsive Design:** A clean, modern UI that works beautifully on both desktop and mobile devices.

---

## 👨‍💻 How to Use

Once the application is running, you can perform the following actions:

#### 1. Add Your Business Details
* Navigate to the **Settings** tab.
* Fill in your business name, email, and address. This information will appear on all your invoices.
* Click **Save Details**.

#### 2. Create a Client
* Navigate to the **Clients** tab.
* Click the **+ Add New Client** button.
* Fill in the client's details in the modal form and click **Add Client**.

#### 3. Create an Invoice
* Navigate to the **Invoices** tab or use the **+ Create New Invoice** button on the Dashboard.
* In the form, select a client from the dropdown menu.
* Set a **Due Date**.
* Add line items by filling in the **Description**, **Quantity**, and **Rate**. The total is calculated automatically.
* Click **Add Item** to add more lines.
* Click **Create Invoice** to save it as a draft.

#### 4. Manage an Invoice
* In the table on the **Invoices** tab, you can find all your invoices.
* **View:** Opens a read-only view of the invoice.
* **Edit:** Opens the invoice in the form to make changes.
* **PDF:** Instantly generates and downloads a PDF copy of the invoice.
* **Send:** Marks the invoice status as "Sent".
* **Mark as Paid:** Marks the invoice status as "Paid" and updates your total revenue.
* **Delete:** Permanently removes the invoice.

#### 5. View Reports
* Navigate to the **Reports** tab to see a summary of your revenue and invoice statistics.
* Visual charts show your monthly revenue over the last six months and the distribution of invoice statuses (Paid, Pending, Overdue, Draft).

---

## 🛠️ Tech Stack

* **Frontend:** [Vue 3](https://vuejs.org/) (using the Composition API)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Charting:** [Chart.js](https://www.chartjs.org/)
* **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
* **Styling:** Plain CSS with modern layout techniques (Grid, Flexbox).

---

## 🚀 Getting Started

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 18 or newer) and npm installed on your computer.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd invoiceflow-project
    ```
3.  **Install the dependencies:**
    ```sh
    npm install
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application will now be running on `http://localhost:5173`.

---

## 📁 Project Structure