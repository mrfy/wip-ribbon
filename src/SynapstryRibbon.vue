<template id="Synapstry-Ribbon-Bar">
  <div ref="resizeRef" class="ribbon-container">
    <Tooltip
      v-if="showTooltip && tooltipObj.tooltipVisible"
      :x="tooltipObj.toolTipX"
      :y="tooltipObj.toolTipY"
      :bar="tooltipObj.bar"
    />

    <svg ref="svgRef" class="ribbon">
      <g transform="translate(0, 20)">
        <g class="bars" fill="none">
          <rect
            v-for="(bar, index) in bars"
            :fill="bar.fill"
            :key="index"
            :height="bar.height"
            :width="bar.width"
            :x="bar.x"
            :y="0"
            v-on:mousemove="move($event, bar)"
            v-on:mouseout="cancelMove"
          ></rect>
        </g>
        <g class="time-axis" fill="none" :transform="`translate(0, 35)`" />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Tooltip from "./components/StateTooltip.vue";

import { RibbonDataJSON } from "./mocks/ribbonData";
import {
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
  watch,
} from "vue";
import { Bar, RibbonDataType } from "./types";
import * as d3 from "d3";

import d3s from "./assets/d3s";
import useResizeObserver from "./use/resizeObserver";

export default defineComponent({
  name: "App",
  template: "#Synapstry-Ribbon-Bar",
  props: {
    data: {
      type: Object as PropType<RibbonDataType>,
      required: true,
      default: () => RibbonDataJSON,
    },
    barPadding: { type: Number, default: 0.3 },
    showScale: { type: Boolean, default: true },
    showTooltip: { type: Boolean, default: true },
  },
  components: {
    Tooltip,
  },
  setup(props) {
    const svgRef = ref(null);
    const bars = ref();

    const { resizeRef, resizeState } = useResizeObserver();

    const tooltipObj = reactive({
      toolTipX: 0,
      toolTipY: 0,
      bar: {},
      tooltipVisible: false,
    });

    const arrSum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

    onMounted(() => {
      const svg = d3.select(svgRef.value);
      watch(
        () => ({ ...resizeState }),
        () => {
          const from_ms = props.data.domain.from.getTime();
          const to_ms = props.data.domain.to.getTime();
          const difference_ms = to_ms - from_ms;

          const { width } = resizeState.dimensions;

          const timeScale = d3s
            .scaleTime()
            .domain([props.data.domain.from, props.data.domain.to])
            .range([0, width])
            .nice();

          svg
            .select(".time-axis")
            .call(d3.axisBottom(timeScale) as never) //!! fakkkkkkkkk !!
            .attr("stroke", "#000")
            .attr("stroke-opacity", "0.1")
            .style("opacity", props.showScale ? 1 : 0);

          const segLong = d3s
            .scaleLinear()
            .range([0, width])
            .domain([0, difference_ms]);

          let xPos: number[] = [];

          bars.value = props.data.states.map((d) => {
            let longitude = arrSum(xPos);
            const stateWidth = d.to.getTime() - d.from.getTime();
            xPos.push(segLong(stateWidth));

            return {
              label: d.description,
              x: xPos.length > 1 ? longitude : 0,
              period: d,
              from: d.from,
              to: d.to,
              width: segLong(stateWidth) + 1,
              height: 35,
              duration: stateWidth,
              fill: d.color,
            };
          });
        }
      );
    });

    const move = (evt: MouseEvent, bar: Bar) => {
      tooltipObj.toolTipX = evt.pageX;
      tooltipObj.toolTipY = evt.pageY;
      tooltipObj.tooltipVisible = true;
      tooltipObj.bar = bar;
    };

    const cancelMove = function() {
      tooltipObj.tooltipVisible = false;
    };

    return {
      bars,
      move,
      cancelMove,
      tooltipObj,
      svgRef,
      resizeRef,
    };
  },
});
</script>

<style scoped>
.ribbon-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 100%;
  margin: 100px auto;
  padding: 0 20px;
}

.ribbon {
  /* important for responsiveness */
  display: block;
  fill: none;
  stroke: none;
  width: 100%;
  height: 100%;
  overflow: visible;
  width: -webkit-fill-available;
}
</style>
