<script setup lang="ts">
withDefaults(defineProps<{ title?: string, description?: string }>(), {
  title: 'Black Rivor Wrap Studio',
  description: 'Premium car wrapping, PPF and window tinting in Sunderland.'
})
</script>

<template>
  <div style="display:flex;height:100%;width:100%;flex-direction:column;justify-content:space-between;overflow:hidden;background:#0a0a0a;padding:64px;color:white">
    <div style="display:flex;align-items:center;gap:16px;font-size:23px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">
      <span style="display:flex;height:22px;width:22px;background:#c9ff32" />
      Black Rivor
    </div>
    <div style="display:flex;max-width:990px;flex-direction:column">
      <div style="display:flex;margin-bottom:22px;color:#c9ff32;font-size:21px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">
        Sunderland · North East
      </div>
      <h1 style="margin:0;font-size:76px;font-weight:800;letter-spacing:-.04em;line-height:.96">
        {{ title }}
      </h1>
      <p style="margin:26px 0 0;color:rgba(255,255,255,.66);font-size:28px;line-height:1.35">
        {{ description }}
      </p>
    </div>
    <div style="display:flex;height:8px;width:180px;background:#c9ff32" />
  </div>
</template>
