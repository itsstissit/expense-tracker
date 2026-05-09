const API_URL = "http://localhost:8080/api/expenses";

// Load all expenses when page opens
window.onload = function () {
    fetchExpenses();
};

// Fetch all expenses from backend
function fetchExpenses() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            displayExpenses(data);
        });
}

// Display expenses in the table
function displayExpenses(expenses) {
    const table = document.getElementById("expenseTable");
    const totalSpan = document.getElementById("total");

    table.innerHTML = "";
    let total = 0;

    expenses.forEach(expense => {
        total += expense.amount;
        const row = `
            <tr>
                <td>${expense.title}</td>
                <td>Rs. ${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>${expense.note || "-"}</td>
                <td><button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button></td>
            </tr>
        `;
        table.innerHTML += row;
    });

    totalSpan.textContent = total.toFixed(2);
}

// Add a new expense
function addExpense() {
    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const note = document.getElementById("note").value;

    if (!title || !amount || !category || !date) {
        alert("Please fill in all required fields!");
        return;
    }

    const expense = { title, amount, category, date, note };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense)
    })
    .then(res => res.json())
    .then(() => {
        fetchExpenses();
        clearForm();
    });
}

// Delete an expense
function deleteExpense(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
    .then(() => fetchExpenses());
}

// Clear the form after adding
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
    document.getElementById("note").value = "";
}