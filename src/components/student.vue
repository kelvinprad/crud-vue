<!-- src/components/Products.vue -->
<template>
  <main class="main-content">
    <header class="dashboard-header">
      <h1>Student Data</h1>
    </header>

    <div class="form-container">
      <h2>Tambah Mahasiswa</h2>

      <form @submit.prevent="submitForm">
        <div class="form-input">
          <input v-model="form.nama" name="nama" type="text" placeholder="Nama" required />
          <input v-model="form.email" name="email" type="email" placeholder="Email" required />
          <input v-model="form.no_hp" name="no_hp" type="text" placeholder="No HP" required />
          <input v-model="form.nim" name="nim" type="text" placeholder="NIM" required />
        </div>
        <button type="submit">Kirim</button>
      </form>

      <p v-if="message">{{ message }}</p>
    </div>

    <input
      v-model="searchQuery"
      type="text"
      placeholder="Cari nama, email, atau NIM..."
      class="form-search"
    />

    <section class="dashboard-table-container">
      <table class="dashboard-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>No HP</th>
            <th>NIM</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredMahasiswa.length === 0">
            <td colspan="7" class="no-data">Data tidak ditemukan</td>
          </tr>
          <tr v-for="student in filteredMahasiswa" :key="student.id">
            <td>{{ student.nama }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.no_hp }}</td>
            <td>{{ student.nim }}</td>
            <td>{{ formatDate(student.createdAt) }}</td>
            <td>{{ formatDate(student.updatedAt) }}</td>
            <td>
              <div class="btn-container">
                <router-link :to="{ name: 'edit', params: { id: student.documentId } }">
                  <button class="btn-edit">
                    <i class="bi bi-pencil-fill"></i>
                  </button>
                </router-link>
                <button class="btn-hapus" @click="deleteStudent(student.documentId)">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="prevPage">
              <i class="bi bi-chevron-left"></i>
            </a>
          </li>

          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" href="#" @click.prevent="goToPage(page)">
              {{ page }}
            </a>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="nextPage">
              <i class="bi bi-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </section>
  </main>
</template>

<script setup>
defineOptions({
  name: 'MyComponent',
})
import 'bootstrap-icons/font/bootstrap-icons.css'
import { ref, onMounted, reactive, computed } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import { watch } from 'vue'

const STRAPI_URL = 'http://localhost:1337'

const students = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 5

const getProducts = async () => {
  try {
    const response = await axios.get(`${STRAPI_URL}/api/students?populate=*`)
    students.value = response.data.data.map((item) => ({
      id: item.id,
      documentId: item.documentId,
      nama: item.nama,
      email: item.email,
      no_hp: item.no_hp,
      nim: item.nim,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))
  } catch (err) {
    console.error('❌ Gagal mengambil data:', err)
  }
}

// Filtered Mahasiswa
const filteredData = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return students.value.filter(
    (student) =>
      student.nama.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.nim.toLowerCase().includes(query),
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / pageSize)
})

const filteredMahasiswa = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredData.value.slice(start, end)
})

watch(searchQuery, () => {
  currentPage.value = 1
})

onMounted(() => {
  getProducts()
})

// Tanggal
dayjs.locale('id')
const formatDate = (dateStr) => {
  return dayjs(dateStr).format('DD MMMM YYYY')
}

// Form reactive
const form = reactive({
  nama: '',
  email: '',
  no_hp: '',
  nim: '',
})

// Message state
const message = ref('')

// Menambah data Mahasiswa
const submitForm = async () => {
  try {
    const response = await axios.post('http://localhost:1337/api/students', {
      data: { ...form },
    })
    // Reset form
    form.nama = ''
    form.email = ''
    form.no_hp = ''
    form.nim = ''
    console.log('Response:', response.data)
    getProducts()
  } catch (error) {
    message.value = '❌ Gagal menambahkan data.'
    console.error(error)
  }
}

// Hapus data mahasiswa
const deleteStudent = async (id) => {
  try {
    await axios.delete(`http://localhost:1337/api/students/${id}`).then((response) => {
      console.log(response.status)
    })
    await getProducts() // refresh data
  } catch (err) {
    message.value = '❌ Gagal menghapus data.'
    console.error(err)
  }
}

// Pagination
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<style scoped>
/* Layout Grid */
.dashboard-wrapper {
  display: flex;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 30px;
  background-color: #f4f6f8;
}

/* Header */
.dashboard-header h1 {
  margin-bottom: 20px;
  color: #2c3e50;
}

/* Table */
.dashboard-table-container {
  overflow-x: auto;
}

.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.dashboard-table th,
.dashboard-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.dashboard-table th {
  background-color: #ecf0f1;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f0f0f0;
}
.form-container {
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.form-container form .form-input {
  display: flex;
  gap: 10px;
}

input {
  display: block;
  width: 100%;
  margin: 8px 0;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.form-search {
  width: 250px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #1a252f;
}

.btn-container {
  display: flex;
  gap: 8px; /* Jarak antara tombol */
  justify-content: center; /* Bisa juga space-between atau flex-start */
  align-items: center;
}

.btn-edit {
  padding: 10px;
  background-color: #3498db; /* Biru */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-edit:hover {
  background-color: #2c80b4; /* Biru lebih gelap saat hover */
}

.btn-hapus {
  padding: 10px;
  background-color: #f08080;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-hapus:hover {
  background-color: #d65c5c;
}

p {
  text-align: center;
  margin-top: 10px;
}

.no-data {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #6c757d; /* Abu-abu lembut */
  background-color: #f8f9fa; /* Latar belakang terang */
  border-radius: 8px;
  font-style: italic;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease-in-out;
}

/*pagination*/
.pagination {
  display: flex;
  list-style: none;
  gap: 8px;
  padding-left: 0;
}

.page-item {
  border-radius: 4px;
}

.page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.5;
}

.page-item.active .page-link {
  background-color: #2c3e50;
  color: white;
  font-weight: bold;
}

.page-link {
  display: block;
  padding: 8px 12px;
  border: 1px solid #ccc;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 4px;
}
</style>
