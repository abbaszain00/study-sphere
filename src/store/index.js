import { createStore } from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state: {
    documents: [],
    chatMessages: [],
    tasks: [],
    isSidebarOpen: false, // Sidebar open/close state
    isToDoListVisible: false,
    isPomodoroTimerVisible: false, // Corrected state name
  },
  mutations: {
    setDocuments(state, documents) {
      state.documents = documents;
    },
    addDocument(state, newDocument) {
      state.documents.push(newDocument);
    },
    removeDocument(state, documentId) {
      state.documents = state.documents.filter(doc => doc._id !== documentId);
    },
    addChatMessage(state, message) {
      state.chatMessages.push(message);
    },
    clearChatMessages(state) {
      state.chatMessages = [];
    },
    ADD_TASK(state, task) {
      state.tasks.push(task);
    },
    REMOVE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
    },
    TOGGLE_TASK_DONE(state, taskId) {
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        task.done = !task.done;
      }
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebar(state, status) {
      state.isSidebarOpen = status;
    },
    toggleToDoListVisibility(state) {
      state.isToDoListVisible = !state.isToDoListVisible;
    },
    togglePomodoroTimerVisibility(state) { // Corrected mutation name to match state
      state.isPomodoroTimerVisible = !state.isPomodoroTimerVisible;
    },
  },
  actions: {
    deleteDocumentById({ commit }, documentId) {
      const token = localStorage.getItem('token');
      axios.delete(`/api/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => commit('removeDocument', documentId))
      .catch(error => console.error("Error deleting document:", error));
    },
    fetchDocuments({ commit }) {
      const token = localStorage.getItem('token');
      axios.get('/api/documents', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => commit('setDocuments', response.data))
      .catch(error => console.error("Error fetching documents:", error));
    },
    createDocument({ commit }, documentData) {
      const token = localStorage.getItem('token');
      axios.post('/api/documents', documentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => commit('addDocument', response.data.document))
      .catch(error => console.error("Error creating document:", error));
    },
    addChatMessage({ commit }, message) {
      commit('addChatMessage', message);
    },
    clearChatMessages({ commit }) {
      commit('clearChatMessages');
    },
    addNewTask({ commit }, task) {
      commit("ADD_TASK", task);
    },
    removeTaskById({ commit }, taskId) {
      commit("REMOVE_TASK", taskId);
    },
    toggleTaskDone({ commit }, taskId) {
      commit("TOGGLE_TASK_DONE", taskId);
    },
    // Sidebar-related actions, if needed
  },
  plugins: [
    createPersistedState({
      paths: ['isSidebarOpen', 'isToDoListVisible', 'isPomodoroTimerVisible'], // Corrected path
    }),
  ],
});
