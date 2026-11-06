// Live preview for Admin → Website. Active only inside the editor iframe (?edit).
export default defineNuxtPlugin(() => {
  if (window.parent === window || !new URLSearchParams(location.search).has('edit')) return
  const { data: content } = useNuxtData<Record<string, string>>('site-content')
  const post = (message: object) => window.parent.postMessage(message, location.origin)
  document.documentElement.classList.add('is-editing')

  window.addEventListener('message', ({ origin, source, data }) => {
    if (origin !== location.origin || source !== window.parent) return
    if (data?.type === 'content') content.value = data.content
    if (data?.type === 'focus') {
      document.querySelectorAll('.edit-selected').forEach(element => element.classList.remove('edit-selected'))
      const targets = document.querySelectorAll(`[data-edit="${data.key}"]`)
      targets.forEach(element => {
        element.classList.add('edit-selected')
        element.closest('details')?.setAttribute('open', '')
      })
      const box = targets[0]?.getBoundingClientRect()
      if (box && (box.top < 0 || box.bottom > innerHeight)) targets[0]!.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  })

  // Clicking a text picks its field; links and forms stay inert so the preview never navigates away or submits.
  document.addEventListener('click', (event) => {
    const target = event.target as Element
    const editable = target.closest<HTMLElement>('[data-edit]')
    if (editable || target.closest('a:not([href^="#"])')) event.preventDefault()
    if (editable) post({ type: 'select', key: editable.dataset.edit })
  }, true)
  document.addEventListener('submit', (event) => {
    event.preventDefault()
    event.stopPropagation()
  }, true)

  onNuxtReady(() => post({ type: 'ready' }))
})
