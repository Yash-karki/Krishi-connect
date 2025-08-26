let currentUser = { name: "", role: "Buyer" };

// ----------- UI Render Functions ------------

// Render user info
function renderUser() {
  var uEl = document.getElementById("username");
  var wEl = document.getElementById("welcomeText");
  if (uEl) uEl.innerText = currentUser.name || 'User';
  if (wEl) wEl.innerText = `Welcome, ${currentUser.name || 'User'} 👋`;
}

// Sidebar load
function renderSidebar() {
  const menuItems = {
    Farmer: [
      "Dashboard",
      "My Profile",
      "Sell Produce",
      "Waste Management",
      "Orders (Buyers)",
      "Analytics",
      "Notifications",
      "Settings",
      "Logout"
    ],
    Buyer: [
      "Dashboard",
      "My Profile",
      "My Orders",
      "Cart",
      "Track Delivery",
      "Notifications",
      "Settings",
      "Logout"
    ]
  };

  const sidebarMenu = document.getElementById("sidebarMenu");
  sidebarMenu.innerHTML = ""; // clear

  menuItems[currentUser.role].forEach(item => {
    let li = document.createElement("li");
    li.innerText = item;
    sidebarMenu.appendChild(li);
  });
}

// Cards load (dynamic from API)
function renderCards(data) {
  const contentDiv = document.getElementById("dashboardContent");
  contentDiv.innerHTML = ""; // clear

  let overview = document.createElement("div");
  overview.className = "overview";

  // Cards dynamic
  if (currentUser.role === "Farmer") {
    [
      { title: "Produce Sold", value: `${data.produceSold || 0} Kg` },
      { title: "Waste Managed", value: `${data.wasteManaged || 0} Kg` },
      { title: "Pending Orders", value: `${data.pendingOrders || 0}` },
      { title: "Earnings", value: `₹${data.income || 0}` }
    ].forEach(card => {
      let div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h3>${card.title}</h3><p>${card.value}</p>`;
      overview.appendChild(div);
    });
  } else if (currentUser.role === "Buyer") {
    [
      { title: "Total Orders", value: data.totalOrders || 0 },
      { title: "Active Cart", value: `${data.activeCart || 0} Items` },
      { title: "Pending Deliveries", value: `${data.pendingDeliveries || 0}` },
      { title: "Money Spent", value: `₹${data.expenses || 0}` }
    ].forEach(card => {
      let div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h3>${card.title}</h3><p>${card.value}</p>`;
      overview.appendChild(div);
    });
  }

  contentDiv.appendChild(overview);

  // Analytics load
  let analyticsSection = document.createElement("section");
  analyticsSection.className = "analytics";
  analyticsSection.innerHTML = `<h2>Analytics</h2><canvas id="roleChart"></canvas>`;
  contentDiv.appendChild(analyticsSection);

  // Chart render (example data)
  const ctx = document.getElementById('roleChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: data.analytics || {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{ label: 'No data', data: [], backgroundColor: '#ccc' }]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } } }
  });

  // Recent Orders Table (optional if you add table in HTML)
  if (data.recentOrders) {
    const tableBody = document.querySelector('.orders-table tbody');
    if (tableBody) {
      tableBody.innerHTML = "";
      data.recentOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>#${order.id}</td>
          <td>${order.product_name}</td>
          <td>${order.quantity} Kg</td>
          <td>₹${order.total_price}</td>
          <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
        `;
        tableBody.appendChild(row);
      });
    }
  }
}

// ----------- Load Data from API ------------

async function loadDashboard() {
  try {
    // Fetch current user
    const uRes = await fetch('/api/users/me', {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
    });
    if (uRes.ok) {
      currentUser = await uRes.json();
      renderUser();
      renderSidebar();
    }

    // Fetch dashboard data
    const dRes = await fetch('/api/dashboard', {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
    });
    if (!dRes.ok) throw new Error("Failed to load dashboard");

    const dashboardData = await dRes.json();
    renderCards(dashboardData);

  } catch (err) {
    console.error(err);
    alert("Error loading dashboard");
  }
}

// Init
document.addEventListener("DOMContentLoaded", loadDashboard);
