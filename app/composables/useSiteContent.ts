/** Website copy: defaults overlaid with admin edits, loaded by public pages under the 'site-content' key. */
export function useSiteContent() {
  const { data } = useNuxtData<Record<string, string>>('site-content')
  const content = computed(() => ({ ...siteContentDefaults, ...data.value }))
  // An unknown key renders as itself, so a typo is visible instead of a silently blank element.
  return (key: string) => content.value[key] ?? key
}
