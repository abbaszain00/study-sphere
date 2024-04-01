<template>
  <div v-if="isVisible" class="chatbot-container">
    <div
      class="chat-header"
      @mousedown="dragStart"
      @mousemove="dragging"
      @mouseup="dragEnd"
    >
      ChatGPT
    </div>
    <div class="chat-messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message"
        :class="message.type"
      >
        {{ message.text }}
      </div>
    </div>
    <input
      type="text"
      v-model="userInput"
      @keyup.enter="sendMessage"
      placeholder="Ask me anything..."
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      userInput: "",
      messages: [],
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    };
  },
  methods: {
    sendMessage() {
      this.messages.push({ type: "user", text: this.userInput });
      this.messages.push({ type: "bot", text: "Reply from ChatGPT" }); // Simulate a reply
      this.userInput = ""; // Clear input after sending
    },
    dragStart(event) {
      this.isDragging = true;
      const chatbox = this.$el; // This should reference the chatbot container now
      this.dragStartX = event.clientX - chatbox.offsetLeft;
      this.dragStartY = event.clientY - chatbox.offsetTop;
      event.preventDefault(); // This might not be necessary
    },
    dragging(event) {
      if (this.isDragging) {
        this.$el.style.left = event.clientX - this.dragStartX + "px";
        this.$el.style.top = event.clientY - this.dragStartY + "px";
      }
    },
    dragEnd() {
      this.isDragging = false;
    },
  },
  props: {
    isVisible: Boolean,
  },
};
</script>

<style>
.chatbot-container {
  width: 300px;
  height: 400px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.chat-header {
  background-color: #007bff;
  color: white;
  padding: 10px;
  cursor: move; /* Indicate the header is draggable */
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
}

.user {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
}

.bot {
  align-self: flex-start;
  background-color: #f1f1f1;
}

input[type="text"] {
  border: none;
  padding: 10px;
  width: calc(100% - 20px);
}
</style>