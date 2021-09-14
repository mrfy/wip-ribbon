import { createApp, defineCustomElement } from "vue";

import SynapstryRibbon from "./SynapstryRibbon.vue";

// createApp(SynapstryRibbon).mount("#app");

const synapstryRibbonCE = defineCustomElement(SynapstryRibbon);

customElements.define("synapstry-ribbon", synapstryRibbonCE);
