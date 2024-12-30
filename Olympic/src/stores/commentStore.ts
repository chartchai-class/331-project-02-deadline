import { defineStore } from 'pinia';
import axios from 'axios';

interface Comment {
  id: number;
  content: string;
  userId: number;
  nickname: string;
  countryCode: string;
  avatarUrl: string; // 新增字段：用户头像 URL
}

interface CommentState {
  comments: Comment[];
}

export const useCommentStore = defineStore('commentStore', {
  state: (): CommentState => ({
    comments: [],
  }),

  actions: {
    async fetchComments(countryCode: string) {
      if (!countryCode) {
        console.error('Country code is required to fetch comments');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8081/api/comments/${countryCode}`,
          { withCredentials: true } // 确保包含身份验证信息
        );
        if (Array.isArray(response.data)) {
          this.comments = response.data.map((comment) => ({
            id: comment.id,
            content: comment.content,
            userId: comment.userId,
            nickname: comment.nickname,
            countryCode: countryCode,
            avatarUrl: comment.avatarUrl || '/uploads/avatars/default-avatar.png', // 处理头像 URL，使用默认头像作为备选
          }));
        } else {
          console.warn('Unexpected response format:', response.data);
          this.comments = [];
        }
      } catch (error: any) {
        console.error(
          'Failed to fetch comments:',
          error.response?.data?.message || error.message
        );
        this.comments = [];
      }
    },

    async addComment(countryCode: string, content: string) {
      if (!countryCode || !content.trim()) {
        console.error(
          'Country code and comment content are required to add a comment'
        );
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:8081/api/comments/${countryCode}`,
          { content },
          { withCredentials: true }
        );
        if (response.status === 200 || response.status === 201) {
          await this.fetchComments(countryCode); // 刷新评论列表
        }
      } catch (error: any) {
        console.error(
          'Failed to add comment:',
          error.response?.data?.message || error.message
        );
      }
    },

    async deleteComment(commentId: number, countryCode: string) {
      if (!commentId || !countryCode) {
        console.error(
          'Comment ID and country code are required to delete a comment'
        );
        return;
      }

      try {
        const response = await axios.delete(
          `http://localhost:8081/api/comments/${commentId}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          await this.fetchComments(countryCode); // 刷新评论列表
        }
      } catch (error: any) {
        console.error(
          'Failed to delete comment:',
          error.response?.data?.message || error.message
        );
      }
    },

    async updateComment(commentId: number, content: string, countryCode: string) {
      if (!commentId || !content.trim() || !countryCode) {
        console.error(
          'Comment ID, updated content, and country code are required to update a comment'
        );
        return;
      }

      try {
        const response = await axios.put(
          `http://localhost:8081/api/comments/${commentId}`,
          { content },
          { withCredentials: true }
        );
        if (response.status === 200) {
          await this.fetchComments(countryCode);
        }
      } catch (error: any) {
        console.error(
          'Failed to update comment:',
          error.response?.data?.message || error.message
        );
      }
    },
  },
});
