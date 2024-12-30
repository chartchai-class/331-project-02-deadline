import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoggedIn: false,
    userNickname: "User",
    isAdmin: false,
    userId: null,
    userAvatar: null, // 新增字段，用于存储用户头像 URL
  }),
  actions: {
    async fetchUser() {
      try {
        const response = await axios.get("http://localhost:8081/api/users/profile", {
          withCredentials: true,
        });
        const data = response.data?.data;
        this.isLoggedIn = true;
        this.userNickname = data?.nickname || "User";
        this.isAdmin = data?.role === "ADMIN";
        this.userId = data?.id;
        this.userAvatar = data?.avatar || null; // 设置头像 URL
      } catch (error: any) {
        console.error("Failed to fetch user profile:", error.response?.data?.message || error.message);
        this.resetUserState();
      }
    },
    async login(username: string, password: string) {
      try {
        await axios.post(
          "http://localhost:8081/api/users/login",
          { username, password },
          { withCredentials: true }
        );
        await this.fetchUser(); // 登录后刷新用户状态
      } catch (error: any) {
        console.error("Login failed:", error.response?.data?.message || error.message);
        this.resetUserState();
      }
    },
    async logout() {
      try {
        await axios.post("http://localhost:8081/api/users/logout", {}, { withCredentials: true });
        this.resetUserState();
      } catch (error: any) {
        console.error("Logout failed:", error.response?.data?.message || error.message);
        this.resetUserState();
      }
    },
    resetUserState() {
      this.isLoggedIn = false;
      this.userNickname = "User";
      this.isAdmin = false;
      this.userId = null;
      this.userAvatar = null; // 重置头像
    },
  },
});
