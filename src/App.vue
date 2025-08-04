<script setup></script>

<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>My Dashboard</h2>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/students">Students</router-link></li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Layout Grid */
.dashboard-wrapper {
  display: flex;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar nav ul li {
  margin-bottom: 10px;
}

.sidebar nav ul li a {
  display: block;
  color: #ecf0f1;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 10px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* garis bawah */
  border-radius: 6px;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.sidebar nav ul li a:hover {
  background-color: #ecf0f1; /* warna hover background */
  color: #2c3e50; /* warna teks saat hover */
}

.active-menu {
  background-color: #ecf0f1;
  color: #2c3e50 !important;
}
/* Main Content */
.main-content {
  flex: 1;
  padding: 30px;
  background-color: #f4f6f8;
}
</style>
