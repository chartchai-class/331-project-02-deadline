<template>
  <div class="comment-list-container">
    <h2 class="title">Comments for {{ countryCode }}</h2>
    <div v-if="isLoggedIn" class="comment-input-container">
      <textarea
        v-model="newComment"
        placeholder="Write your comment..."
        rows="4"
        class="comment-input"
      ></textarea>
      <button
        @click="submitComment"
        :disabled="!newComment.trim()"
        class="submit-btn"
      >
        Submit
      </button>
    </div>
    <p v-else class="login-prompt">Log in to use the comment function.</p>
    <ul class="comment-list">
      <li
        v-for="comment in paginatedComments"
        :key="comment.id"
        class="comment-item"
      >
        <div class="comment-content">
          <img :src="comment.avatarUrl" alt="Avatar" class="comment-avatar" />
          <div>
            <p class="comment-author">{{ comment.nickname }}</p>
            <p class="comment-text">{{ comment.content }}</p>
          </div>
        </div>
        <div
          v-if="isLoggedIn && (isAdmin || currentUserId === comment.userId)"
          class="comment-actions"
        >
          <button @click="deleteComment(comment.id)" class="action-btn delete-btn">
            Delete
          </button>
        </div>
      </li>
    </ul>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useCommentStore } from "@/stores/commentStore";
import { useUserStore } from "@/stores/userStore";

export default defineComponent({
  name: "CommentList",
  props: {
    countryCode: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const commentStore = useCommentStore();
    const userStore = useUserStore();

    const newComment = ref("");
    const currentPage = ref(1);
    const commentsPerPage = 5;

    const paginatedComments = computed(() => {
      const startIndex = (currentPage.value - 1) * commentsPerPage;
      return commentStore.comments.slice(startIndex, startIndex + commentsPerPage);
    });

    const totalPages = computed(() =>
      Math.ceil(commentStore.comments.length / commentsPerPage)
    );

    const loadComments = async () => {
      await commentStore.fetchComments(props.countryCode);
    };

    const submitComment = async () => {
      if (!newComment.value.trim()) return;
      await commentStore.addComment(props.countryCode, newComment.value.trim());
      newComment.value = "";
      currentPage.value = 1;
      await loadComments();
    };

    const deleteComment = async (commentId: number) => {
      await commentStore.deleteComment(commentId, props.countryCode);
      await loadComments();
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    watch(
      () => props.countryCode,
      loadComments,
      { immediate: true }
    );

    onMounted(loadComments);

    return {
      comments: commentStore.comments,
      newComment,
      isLoggedIn: userStore.isLoggedIn,
      isAdmin: userStore.isAdmin,
      currentUserId: userStore.userId,
      paginatedComments,
      currentPage,
      totalPages,
      submitComment,
      deleteComment,
      prevPage,
      nextPage,
    };
  },
});
</script>

<style scoped>
.comment-list-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.login-prompt {
  font-size: 14px;
  color: #888;
  text-align: center;
  margin-bottom: 10px;
}

.comment-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.submit-btn,
.pagination-btn,
.action-btn {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled,
.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.comment-list {
  list-style: none;
  padding: 0;
}

.comment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.comment-content {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  text-align: left
}

.comment-author {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  min-width: 100px;
  text-align: left
}

.comment-text {
  font-size: 14px;
  color: #555;
  word-break: break-word;
  flex: 1;
  text-align: left
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-actions {
  display: flex;
  gap: 10px;
}

.delete-btn {
  background-color: #f44336;
}
</style>
