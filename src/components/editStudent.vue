<template>
  <div class="form-container">
    <h2>Edit Mahasiswa</h2>

    <!-- Tampilkan loading atau form hanya jika data sudah tersedia -->
    <div v-if="loading">Loading...</div>

    <form v-else-if="students" @submit.prevent="submitForm">
      <div class="form-input">
        <input v-model="students.nama" type="text" placeholder="Nama" required />
        <input v-model="students.email" type="email" placeholder="Email" required />
        <input v-model="students.no_hp" type="text" placeholder="No HP" required />
        <input v-model="students.nim" type="text" placeholder="NIM" required />
      </div>
      <button type="submit">Kirim</button>
    </form>

    <div
      v-if="message"
      :class="['alert', isSuccess ? 'alert-success' : 'alert-danger']"
      role="alert"
    >
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Inisialisasi dengan objek kosong daripada null
const students = ref({
  nama: '',
  email: '',
  no_hp: '',
  nim: '',
})

const loading = ref(true)
const message = ref('')
const STRAPI_URL = 'http://localhost:1337'

const route = useRoute()
const studentId = route.params.id

const getProducts = async () => {
  try {
    loading.value = true
    const response = await axios.get(`${STRAPI_URL}/api/students/${studentId}?populate=*`)

    // Pastikan struktur data sesuai dengan response Strapi
    const studentData = response.data.data.attributes || response.data.data
    students.value = {
      nama: studentData.nama || '',
      email: studentData.email || '',
      no_hp: studentData.no_hp || '',
      nim: studentData.nim || '',
    }
  } catch (err) {
    console.error('❌ Gagal mengambil data:', err)
    message.value = 'Gagal mengambil data mahasiswa'
  } finally {
    loading.value = false
  }
}

const isSuccess = ref(false)

const submitForm = async () => {
  try {
    const response = await axios.put(`${STRAPI_URL}/api/students/${studentId}`, {
      data: students.value,
    })
    console.log('👍 Data mahasiswa berhasil diperbarui:', response.data)
    message.value = 'Data berhasil diupdate!'
    isSuccess.value = true
  } catch (err) {
    console.error('Gagal mengupdate data:', err)
    message.value = '❌ Gagal mengupdate data'
    isSuccess.value = false
  }
}

onMounted(() => {
  getProducts()
})
</script>

<style scoped>
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

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
  margin-top: 1rem;
}
.alert-success {
  background-color: #d4edda; /* hijau */
  color: #155724;
  border: 1px solid #c3e6cb;
}
.alert-danger {
  background-color: #f44336; /* merah */
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
