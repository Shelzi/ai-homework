let lastResults = {
  total: null,
  avgDaily: null,
  top3: []
};

function addRow() {
  const table = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();
  const cell1 = newRow.insertCell(0);
  const cell2 = newRow.insertCell(1);
  const cell3 = newRow.insertCell(2);

  cell1.innerHTML = '<input type="text" class="form-control">';
  cell2.innerHTML = '<input type="number" class="form-control">';
  cell3.innerHTML = '<button type="button" class="btn-close" aria-label="Remove" onclick="removeRow(this)"></button>';
}

function removeRow(btn) {
  const row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function animateValue(element, start, end, duration, prefix = '', suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = prefix + value.toLocaleString() + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = prefix + end.toLocaleString() + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].category !== b[i].category || a[i].amount !== b[i].amount) return false;
  }
  return true;
}

function calculateExpenses() {
  const table = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
  const rows = table.getElementsByTagName('tr');
  let expenses = [];

  for (let i = 0; i < rows.length; i++) {
    const category = rows[i].cells[0].querySelector('input').value.trim();
    const amount = parseFloat(rows[i].cells[1].querySelector('input').value);
    if (category && !isNaN(amount)) {
      expenses.push({ category, amount });
    }
  }

  const resultsDiv = document.getElementById('results');
  if (expenses.length === 0) {
    resultsDiv.innerHTML = '<div class="alert alert-warning">Please enter at least one expense.</div>';
    lastResults = { total: null, avgDaily: null, top3: [] };
    return;
  }

  // Total
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Average daily (30 days)
  const avgDaily = total / 30;

  // Top 3
  const top3 = expenses
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Check if results have changed
  if (
    lastResults.total === total &&
    lastResults.avgDaily === Math.round(avgDaily) &&
    arraysEqual(lastResults.top3, top3)
  ) {
    return; // No change, do not animate or update
  }

  // Save new results
  lastResults = {
    total: total,
    avgDaily: Math.round(avgDaily),
    top3: top3.map(e => ({ ...e }))
  };

  // Prepare result HTML with Top 3 at the top
  resultsDiv.innerHTML = `
    <div>
      <b>Top 3 Expenses:</b>
      <ol class="list-group list-group-numbered d-inline-block text-start mt-2 mb-3" id="top3-list" style="min-width:200px;">
        ${top3.map((exp, i) => `<li class="list-group-item d-flex justify-content-between align-items-center">
          <span>${exp.category}</span>
          <span class="badge bg-primary rounded-pill" id="top3-amount-${i}">0</span>
        </li>`).join('')}
      </ol>
    </div>
    <div>
      <b>Total Expenses:</b> $<span id="total-amount">0</span>
    </div>
    <div>
      <b>Average Daily Expense:</b> $<span id="avg-daily">0</span>
    </div>
  `;

  // Animate numbers
  animateValue(document.getElementById('total-amount'), 0, total, 800, '', '');
  animateValue(document.getElementById('avg-daily'), 0, Math.round(avgDaily), 800, '', '');

  top3.forEach((exp, i) => {
    animateValue(document.getElementById(`top3-amount-${i}`), 0, exp.amount, 800, '$', '');
  });
}