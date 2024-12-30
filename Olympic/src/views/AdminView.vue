<template>
  <div class="container" v-if="isAdmin">
    <h1>Manage Users</h1>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by username..."
        class="search-input"
      />
      <button @click="handleSearch" class="search-btn">Search</button>
    </div>
    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Nickname</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <input
              v-model="user.nickname"
              class="nickname-input"
              :disabled="user.role === 'ADMIN'"
            />
          </td>
          <td>{{ user.role }}</td>
          <td class="actions">
            <button
              @click="saveChanges(user)"
              class="save-btn"
              :disabled="user.role === 'ADMIN'"
            >
              Save Changes
            </button>
            <button
              v-if="user.role !== 'ADMIN'"
              @click="deleteUser(user.id)"
              class="delete-btn"
            >
              Delete
            </button>
            <button
              v-if="user.role !== 'ADMIN'"
              @click="promoteToAdmin(user.id)"
              class="save-btn"
            >
              Promote to Admin
            </button>
            <span v-else class="admin-tag">Admin</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="page-btn"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages || totalPages === 0"
        class="page-btn"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      allUsers: [],
      displayedUsers: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    isAdmin() {
      const userStore = useUserStore();
      return userStore.isAdmin;
    },
    totalPages() {
      return Math.ceil(this.displayedUsers.length / this.itemsPerPage);
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.displayedUsers.slice(start, end);
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/users/admin/users",
          {
            withCredentials: true,
          }
        );
        this.allUsers = response.data;
        this.displayedUsers = [...this.allUsers];
      } catch (error) {
        console.error(
          "Failed to fetch users:",
          error.response?.data?.message || error.message
        );
      }
    },
    handleSearch() {
      this.currentPage = 1;
      if (this.searchQuery.trim()) {
        this.displayedUsers = this.allUsers.filter((user) =>
          user.username
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase().trim())
        );
      } else {
        this.displayedUsers = [...this.allUsers];
      }
    },
    async saveChanges(user) {
      try {
        await axios.put(
          `http://localhost:8081/api/users/admin/users/${user.id}`,
          { nickname: user.nickname },
          {
            withCredentials: true,
          }
        );
        alert("Changes saved successfully!");
      } catch (error) {
        console.error(
          "Failed to update user:",
          error.response?.data?.message || error.message
        );
        alert("Failed to save changes.");
      }
    },
    async deleteUser(id) {
      try {
        await axios.delete(
          `http://localhost:8081/api/users/admin/users/${id}`,
          {
            withCredentials: true,
          }
        );
        this.fetchUsers();
        alert("User deleted successfully!");
      } catch (error) {
        console.error(
          "Failed to delete user:",
          error.response?.data?.message || error.message
        );
        alert("Failed to delete user.");
      }
    },
    async promoteToAdmin(id) {
      try {
        await axios.put(
          `http://localhost:8081/api/users/admin/users/${id}/promote`,
          {},
          {
            withCredentials: true,
          }
        );
        this.fetchUsers();
        alert("User promoted to admin successfully!");
      } catch (error) {
        console.error(
          "Failed to promote user:",
          error.response?.data?.message || error.message
        );
        alert("Failed to promote user.");
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
  },
  mounted() {
    const router = useRouter();
    if (!this.isAdmin) {
      router.push({ name: "404-error" });
    } else {
      this.fetchUsers();
    }
  },
};
</script>
<style scoped>
.container {
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.search-input {
  width: 60%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-btn {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-btn:hover {
  background-color: #45a049;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.user-table th,
.user-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.user-table th {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
}

.user-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.user-table tr:hover {
  background-color: #f1f1f1;
}

.nickname-input {
  width: 90%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  margin-right: 5px;
  border-radius: 4px;
}

.save-btn:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.admin-tag {
  display: inline-block;
  background-color: #FFD700;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.page-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}
</style>
