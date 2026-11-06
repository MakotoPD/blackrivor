<script setup lang="ts">
const props = defineProps<{ shape: string }>()

// Original side profiles. The dark panes mark the rear glass included in each package.
const profiles: Record<string, { body: string; rear: string; front: string; detail?: string }> = {
  hatch3: {
    body: 'M30 108 27 83 48 47 Q55 40 72 40 H146 Q161 40 174 54 L205 77 250 85 Q263 88 266 101 L265 114 H239 Q235 92 218 92 Q198 92 194 114 H91 Q86 92 68 92 Q49 92 45 114 H32Z',
    rear: 'M40 77 56 50 H104 V77Z', front: 'M112 50 H146 Q154 50 164 59 L188 77 H112Z', detail: 'M112 82V108 M119 86H129'
  },
  hatch5: {
    body: 'M25 109 23 83 44 48 Q50 41 66 41 H155 Q169 41 180 54 L209 77 257 86 Q269 90 272 102 V114 H245 Q240 92 222 92 Q202 92 198 114 H84 Q80 92 61 92 Q42 92 38 114 H27Z',
    rear: 'M36 77 50 52 H112 V77Z', front: 'M120 52 H153 Q161 52 170 61 L192 77 H120Z', detail: 'M72 82V109 M119 82V109 M80 87H90 M127 87H137'
  },
  coupe: {
    body: 'M22 108V87L52 78 89 49 Q99 44 119 44 H152 Q168 44 183 57 L211 78 257 85 Q272 89 276 103 V114 H248 Q244 92 225 92 Q205 92 201 114 H86 Q82 92 63 92 Q43 92 39 114 H25Z',
    rear: 'M63 77 94 53 H115 V77Z', front: 'M123 53 H150 Q162 53 174 63 L192 77 H123Z', detail: 'M123 82V108 M133 87H144'
  },
  saloon: {
    body: 'M20 107V85L55 78 85 49 Q93 44 108 44 H163 Q177 45 188 57 L210 77 258 85 Q271 89 275 102 V114 H248 Q243 92 224 92 Q205 92 201 114 H86 Q82 92 63 92 Q43 92 39 114 H23Z',
    rear: 'M66 77 91 53 H123 V77Z', front: 'M131 53 H161 Q170 53 180 63 L194 77 H131Z', detail: 'M81 82V108 M131 82V109 M90 87H100 M140 87H150'
  },
  estate: {
    body: 'M21 110V68L34 43 Q39 39 56 39 H166 Q179 39 191 53 L212 77 259 86 Q271 90 275 103 V114 H248 Q244 92 225 92 Q205 92 201 114 H83 Q79 92 60 92 Q41 92 37 114 H23Z',
    rear: 'M31 76 42 50 H78 V76Z M84 50 H125 V76 H84Z', front: 'M133 50 H163 Q173 50 182 61 L195 76 H133Z', detail: 'M80 82V108 M133 82V109 M89 87H99 M141 87H151'
  },
  crossover: {
    body: 'M24 108V68L42 34 Q48 29 65 29 H158 Q172 29 184 44 L209 70 253 80 Q267 84 272 99 V114 H246 Q241 90 222 90 Q202 90 198 114 H86 Q82 90 62 90 Q42 90 38 114 H26Z',
    rear: 'M35 69 49 40 H82 V69Z M88 40 H121 V69 H88Z', front: 'M129 40 H155 Q163 40 174 52 L190 69 H129Z', detail: 'M84 76V105 M129 76V105 M92 80H102 M137 80H147'
  },
  suv: {
    body: 'M19 109V44Q19 26 36 26H159 Q177 26 187 41 L210 67 259 77 Q274 80 278 98 V115 H249 Q244 90 224 90 Q203 90 199 115 H83 Q79 90 59 90 Q39 90 35 115 H21Z',
    rear: 'M30 66V38H74V66Z M81 38H123V66H81Z', front: 'M131 38H156 Q166 38 176 50 L188 66H131Z', detail: 'M77 74V107 M131 74V107 M87 80H98 M140 80H151 M44 20H155'
  },
  convertible: {
    body: 'M22 108V86L55 76 87 53 Q96 47 116 47 H151 Q163 48 179 61 L201 77 256 85 Q271 88 275 103 V114 H248 Q243 92 224 92 Q205 92 201 114 H85 Q81 92 62 92 Q43 92 39 114 H25Z',
    rear: 'M65 76 94 57H113V76Z', front: 'M121 57H149 Q158 57 171 67L184 76H121Z', detail: 'M121 82V108 M131 87H142 M57 79H188'
  },
  pickup: {
    body: 'M19 111V65H99V32 Q99 27 109 27 H175 Q185 27 193 41 L211 65 259 76 Q275 80 278 99 V115 H249 Q244 89 224 89 Q203 89 199 115 H84 Q80 89 60 89 Q40 89 36 115 H21Z',
    rear: 'M109 38H143V65H109Z', front: 'M151 38H172 Q179 38 185 49L195 65H151Z', detail: 'M100 70V106 M149 73V106 M116 79H127 M157 79H168 M26 71H91'
  },
  smallvan: {
    body: 'M22 110V42 Q22 27 37 27 H161 Q174 27 184 43 L207 72 255 81 Q269 85 272 101 V115 H246 Q241 91 222 91 Q202 91 198 115 H85 Q81 91 61 91 Q41 91 37 115 H24Z',
    rear: 'M34 39H75V71H34Z M82 39H122V71H82Z', front: 'M132 39H158 Q166 39 175 52L188 71H132Z', detail: 'M79 77V108 M130 77V108 M89 82H100 M140 82H151'
  },
  van: {
    body: 'M16 110V27 Q16 17 29 17 H184 Q195 17 204 36 L223 73 264 80 Q278 84 282 101 V115 H254 Q249 91 230 91 Q210 91 206 115 H82 Q78 91 58 91 Q38 91 34 115 H18Z',
    rear: 'M28 30H74V72H28Z M82 30H136V72H82Z', front: 'M146 30H181 Q187 30 194 44L208 72H146Z', detail: 'M78 79V108 M144 79V108 M91 83H103 M154 83H166'
  }
}
const profile = computed(() => profiles[props.shape] ?? profiles.saloon!)
</script>

<template>
  <svg v-if="shape === 'tailgate'" viewBox="0 0 300 145" fill="none" aria-hidden="true">
    <ellipse cx="150" cy="128" rx="89" ry="4" fill="#0a0a0a" opacity=".06" />
    <path d="M82 24Q84 16 95 16H205Q216 16 218 24L230 107V122H70V107Z" fill="#d4d5d0" stroke="#8c8e85" stroke-width="1.5" />
    <path d="M91 29H144V79H80Z M156 29H209L220 79H156Z" fill="#252923" stroke="#11150d" stroke-width="1.5" />
    <path d="M150 21V120 M83 100H103 M197 100H217" stroke="#8c8e85" stroke-width="1.5" />
    <rect x="130" y="98" width="40" height="12" rx="2" fill="#f3f1eb" />
    <path d="M74 85H82V105H72 M218 85H226L228 105H218" fill="#9e6660" />
    <path d="M72 118H228" stroke="#50534a" stroke-width="5" />
  </svg>
  <svg v-else viewBox="0 0 300 145" fill="none" aria-hidden="true">
    <ellipse cx="150" cy="127" rx="124" ry="4" fill="#0a0a0a" opacity=".06" />
    <path :d="profile.body" fill="#d4d5d0" stroke="#8c8e85" stroke-width="1.5" stroke-linejoin="round" />
    <path :d="profile.front" fill="#edf0e5" stroke="#8c8e85" stroke-width="1.5" stroke-linejoin="round" />
    <path :d="profile.rear" fill="#252923" stroke="#11150d" stroke-width="1.5" stroke-linejoin="round" />
    <path :d="profile.detail" stroke="#93968c" stroke-width="1.3" stroke-linecap="round" />
    <path d="M96 111H186" stroke="#92958a" stroke-width="2" stroke-linecap="round" />
    <g v-for="wheel in (shape === 'van' ? [58, 230] : shape === 'suv' ? [59, 224] : shape === 'pickup' ? [60, 224] : shape === 'hatch3' ? [68, 218] : shape === 'hatch5' ? [61, 222] : shape === 'estate' ? [60, 225] : shape === 'crossover' ? [62, 222] : shape === 'smallvan' ? [61, 222] : [63, 224])" :key="wheel">
      <circle :cx="wheel" cy="111" r="17" fill="#242721" />
      <circle :cx="wheel" cy="111" r="10" fill="#b4b7ab" stroke="#777c70" stroke-width="1.5" />
      <circle :cx="wheel" cy="111" r="4" fill="#686e60" />
      <path :d="`M${wheel} 103V119 M${wheel - 8} 111H${wheel + 8}`" stroke="#777c70" stroke-width="1.2" />
    </g>
  </svg>
</template>
