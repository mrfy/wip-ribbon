import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

interface ResizeState {
  dimensions: DOMRectReadOnly;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useResizeObserver = (): any => {
  const resizeRef = ref();
  const resizeState = reactive({
    dimensions: {},
  }) as ResizeState;

  const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    entries.forEach((entry: ResizeObserverEntry) => {
      resizeState.dimensions = entry.contentRect;
    });
  });

  onMounted(() => {
    resizeState.dimensions = resizeRef.value.getBoundingClientRect();
    observer.observe(resizeRef.value);
  });

  onBeforeUnmount(() => {
    observer.unobserve(resizeRef.value);
  });

  return { resizeState, resizeRef };
};

export default useResizeObserver;
