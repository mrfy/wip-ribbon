<template id="itemToolTip">
  <div class="toolTip" :style="position">
    <p>From: {{ bar.from }}</p>
    <p>To: {{ bar.to }}</p>
    <p>Duration: {{ bar.duration }}</p>
    <p>{{ bar.label }}</p>
  </div>
</template>

<script lang="ts">
import { Bar } from "../types";
import { computed, defineComponent, PropType } from "vue";

export default defineComponent({
  name: "App",
  template: "#itemToolTip",
  props: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    bar: { type: Object as PropType<Bar>, required: true },
  },
  setup(props) {
    const position = computed(() => {
      return {
        top: `${props.y + 10}px`,
        left: `${props.x + 10}px`,
      };
    });

    return {
      position,
    };
  },
});
</script>

<style scoped>
.toolTip {
  position: absolute;
  background-color: black;
  border-radius: 5px;
  padding: 10px 0;
  pointer-events: none;
}

.toolTip > p {
  color: white;
  text-align: left;
  padding: 1px;
  margin: 1px 10px 1px 10px;
}
</style>
