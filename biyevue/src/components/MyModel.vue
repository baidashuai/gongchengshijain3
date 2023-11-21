<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content">
      <h1>{{ title }}</h1>
      <table class="table is-bordered is-fullwidth">
        <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(data, index) in dataList" :key="index">
          <td v-for="(value, key) in data" :key="`${index}_${key}`">{{ value }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close"></button>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    dataList: {
      type: Array,
      required: true
    },
    isActive: Boolean
  },
  methods: {
    close() {
      this.$emit("update:isActive", false);
    }
  }
};
</script>

<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.modal-background {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  max-width: 960px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1rem;
}

.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
