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
          <input v-model="form.nama" type="text" placeholder="Nama" required />
          <input v-model="form.email" type="email" placeholder="Email" required />
          <input v-model="form.no_hp" type="text" placeholder="No HP" required />
          <input v-model="form.nim" type="text" placeholder="NIM" required />
        </div>
        <button type="submit">Kirim</button>
      </form>

      <p v-if="message">{{ message }}</p>
    </div>

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
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.nama }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.no_hp }}</td>
            <td>{{ student.nim }}</td>
            <td>{{ formatDate(student.createdAt) }}</td>
            <td>{{ formatDate(student.updatedAt) }}</td>
            <td>
              <router-link :to="{ name: 'edit', params: { id: student.documentId } }">
                <button class="btn-edit">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </router-link>
              <button class="btn-hapus" @click="deleteStudent(student.documentId)">
                <i class="bi bi-trash-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </section>
  </main>
</template>

<script setup>
defineOptions({
  name: 'MyComponent',
})
import 'bootstrap-icons/font/bootstrap-icons.css'
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

const students = ref([])
const STRAPI_URL = 'http://localhost:1337'

const currentPage = ref(1)
const pageSize = 5
const totalPages = ref(1)

const getProducts = async () => {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/students?populate=*&pagination[page]=${currentPage.value}&pagination[pageSize]=${pageSize}`,
    )
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
    totalPages.value = response.data.meta.pagination.pageCount
  } catch (err) {
    console.error('❌ Gagal mengambil data:', err)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    getProducts()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    getProducts()
  }
}

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

// Fitur Tampilan Tabel
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

.btn-hapus {
  width: 100%;
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
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  font-family: Arial, sans-serif;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: #34495e;
}

.pagination button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1rem;
  font-weight: bold;
}
</style>
