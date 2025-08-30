let currentUser = { name: "", role: "Buyer" };
let dashboardData = null;

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

// Function to fetch dashboard data from API
async function fetchDashboardData() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    dashboardData = await response.json();
    return dashboardData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return default data structure if API fails
    return {
      income: 0,
      expenses: 0,
      totalOrders: 0,
      recentOrders: []
    };
  }
}

// Generate dashboard cards based on role and real data
function getDashboardCards(role, data) {
  if (role === 'Farmer') {
    return [
      { title: "Total Income", value: `₹${data.income.toLocaleString()}`, icon: "💰" },
      { title: "Total Expenses", value: `₹${data.expenses.toLocaleString()}`, icon: "💸" },
      { title: "Total Orders", value: data.totalOrders.toString(), icon: "📦" },
      { title: "Recent Orders", value: data.recentOrders.length.toString(), icon: "🔄" }
    ];
  } else {
    return [
      { title: "Total Orders", value: data.totalOrders.toString(), icon: "📦" },
      { title: "Total Spent", value: `₹${data.expenses.toLocaleString()}`, icon: "💳" },
      { title: "Recent Orders", value: data.recentOrders.length.toString(), icon: "🔄" },
      { title: "Active Orders", value: data.recentOrders.filter(order => order.status === 'pending').length.toString(), icon: "⏳" }
    ];
  }
}

// Generate analytics data based on recent orders
function generateAnalyticsData(role, recentOrders) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const labels = [];
  
  // Get last 5 months
  for (let i = 4; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    labels.push(monthNames[monthIndex]);
  }

  // Process orders by month
  const ordersByMonth = new Array(5).fill(0);
  const amountsByMonth = new Array(5).fill(0);
  
  recentOrders.forEach(order => {
    const orderDate = new Date(order.created_at);
    const orderMonth = orderDate.getMonth();
    const monthDiff = (currentMonth - orderMonth + 12) % 12;
    
    if (monthDiff < 5) {
      const index = 4 - monthDiff;
      ordersByMonth[index]++;
      amountsByMonth[index] += parseFloat(order.total_price) || 0;
    }
  });

  if (role === 'Farmer') {
    return {
      labels,
      datasets: [
        {
          label: 'Orders Received',
          data: ordersByMonth,
          backgroundColor: '#4caf50',
          borderColor: '#4caf50',
          borderWidth: 1
        },
        {
          label: 'Revenue (₹)',
          data: amountsByMonth,
          backgroundColor: '#2196f3',
          borderColor: '#2196f3',
          borderWidth: 1
        }
      ]
    };
  } else {
    return {
      labels,
      datasets: [
        {
          label: 'Orders Placed',
          data: ordersByMonth,
          backgroundColor: '#2196f3',
          borderColor: '#2196f3',
          borderWidth: 1
        },
        {
          label: 'Amount Spent (₹)',
          data: amountsByMonth,
          backgroundColor: '#ff9800',
          borderColor: '#ff9800',
          borderWidth: 1
        }
      ]
    };
  }
}

// ----------- UI Render Functions ------------
function renderUser(){
  var uEl = document.getElementById("username");
  var wEl = document.getElementById("welcomeText");
  if(uEl) uEl.innerText = currentUser.name || 'User';
  if(wEl) wEl.innerText = `Welcome, ${currentUser.name||'User'} 👋`;
}

function renderSidebar() {
  const sidebarMenu = document.getElementById("sidebarMenu");
  sidebarMenu.innerHTML = ''; // Clear existing items
  
  menuItems[currentUser.role].forEach(item => {
    let li = document.createElement("li");
    li.innerText = item;
    li.className = 'sidebar-item';
    if (item === 'Dashboard') {
      li.classList.add('active');
    }
    sidebarMenu.appendChild(li);
  });
}

function renderDashboardCards(data) {
  const contentDiv = document.getElementById("dashboardContent");
  
  // Clear existing content
  contentDiv.innerHTML = '';
  
  // Create welcome section
  const welcomeSection = document.createElement('div');
  welcomeSection.className = 'welcome-section';
  welcomeSection.innerHTML = `
    <div class="welcome-card">
      <h2>Welcome back, ${currentUser.name || 'User'}! 👋</h2>
      <p>Here's your dashboard overview</p>
      <div class="date">${new Date().toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</div>
    </div>
  `;
  contentDiv.appendChild(welcomeSection);
  
  // Create stats grid
  const statsGrid = document.createElement('div');
  statsGrid.className = 'stats-grid';
  
  const cards = getDashboardCards(currentUser.role, data);
  cards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'stat-card';
    cardDiv.innerHTML = `
      <div class="card-icon">${card.icon}</div>
      <h3>${card.title}</h3>
      <div class="value">${card.value}</div>
    `;
    statsGrid.appendChild(cardDiv);
  });
  
  contentDiv.appendChild(statsGrid);
}

function renderRecentOrders(orders) {
  const contentDiv = document.getElementById("dashboardContent");
  
  if (orders && orders.length > 0) {
    const ordersSection = document.createElement('div');
    ordersSection.className = 'recent-orders-section';
    ordersSection.innerHTML = `
      <h3>Recent Orders</h3>
      <div class="orders-list">
        ${orders.map(order => `
          <div class="order-item">
            <div class="order-info">
              <h4>${order.product_name}</h4>
              <p>Quantity: ${order.quantity} | Amount: ₹${order.total_price}</p>
              <small>${new Date(order.created_at).toLocaleDateString()}</small>
            </div>
            <div class="order-status status-${order.status}">
              ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    contentDiv.appendChild(ordersSection);
  }
}

function renderAnalytics(data) {
  const contentDiv = document.getElementById("dashboardContent");
  
  const analyticsSection = document.createElement('div');
  analyticsSection.className = 'chart-section';
  analyticsSection.innerHTML = `
    <h3>Analytics Overview</h3>
    <div class="chart-container">
      <canvas id="roleChart"></canvas>
    </div>
  `;
  contentDiv.appendChild(analyticsSection);
  
  // Render chart
  const ctx = document.getElementById('roleChart').getContext('2d');
  const analyticsData = generateAnalyticsData(currentUser.role, data.recentOrders || []);
  
  new Chart(ctx, {
    type: 'bar',
    data: analyticsData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: `${currentUser.role} Analytics - Last 5 Months`
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Initialize dashboard
async function initializeDashboard() {
  try {
    // Show loading state
    const contentDiv = document.getElementById("dashboardContent");
    contentDiv.innerHTML = '<div class="loading">Loading dashboard data...</div>';
    
    // Fetch user data
    const userResponse = await fetch('/api/users/me', {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
    });
    
    if (userResponse.ok) {
      currentUser = await userResponse.json();
      renderUser();
      renderSidebar();
    }
    
    // Fetch dashboard data
    const data = await fetchDashboardData();
    
    // Render all sections
    renderDashboardCards(data);
    renderRecentOrders(data.recentOrders);
    renderAnalytics(data);
    
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    const contentDiv = document.getElementById("dashboardContent");
    contentDiv.innerHTML = '<div class="error">Failed to load dashboard data. Please refresh the page.</div>';
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
  initializeDashboard();
}
