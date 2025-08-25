// Dummy logged in user (backend se aayega)
let currentUser = {
  name: "Pankaj Aghariya",
  role: "Farmer" // ya "Buyer"
};

// Sidebar Menus role-wise
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

// Dashboard Cards role-wise
const dashboardCards = {
  Farmer: [
    { title: "Produce Sold", value: "58 Kg" },
    { title: "Waste Managed", value: "25 Kg" },
    { title: "Pending Orders", value: "3" },
    { title: "Earnings", value: "₹12,300" }
  ],
  Buyer: [
    { title: "Total Orders", value: "12" },
    { title: "Active Cart", value: "5 Items" },
    { title: "Pending Deliveries", value: "2" },
    { title: "Money Spent", value: "₹8,500" }
  ]
};

// Analytics data role-wise
const analyticsData = {
  Farmer: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Produce Sold (Kg)',
        data: [10, 15, 8, 20, 25],
        backgroundColor: '#4caf50'
      },
      {
        label: 'Waste Managed (Kg)',
        data: [5, 8, 4, 12, 15],
        backgroundColor: '#ff9800'
      }
    ]
  },
  Buyer: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Orders Placed',
        data: [2, 5, 3, 6, 4],
        backgroundColor: '#2196f3'
      },
      {
        label: 'Deliveries Completed',
        data: [1, 4, 2, 5, 3],
        backgroundColor: '#4caf50'
      }
    ]
  }
};

// ----------- UI Render Functions ------------
document.getElementById("username").innerText = currentUser.name;
document.getElementById("welcomeText").innerText = `Welcome, ${currentUser.name} 👋`;

// Sidebar load
const sidebarMenu = document.getElementById("sidebarMenu");
menuItems[currentUser.role].forEach(item => {
  let li = document.createElement("li");
  li.innerText = item;
  sidebarMenu.appendChild(li);
});

// Cards load
const contentDiv = document.getElementById("dashboardContent");
let overview = document.createElement("div");
overview.className = "overview";

dashboardCards[currentUser.role].forEach(card => {
  let div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `<h3>${card.title}</h3><p>${card.value}</p>`;
  overview.appendChild(div);
});
contentDiv.appendChild(overview);

// Analytics load
let analyticsSection = document.createElement("section");
analyticsSection.className = "analytics";
analyticsSection.innerHTML = `<h2>Analytics</h2><canvas id="roleChart"></canvas>`;
contentDiv.appendChild(analyticsSection);

const ctx = document.getElementById('roleChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: analyticsData[currentUser.role],
  options: { responsive: true, plugins: { legend: { position: 'top' } } }
});
