<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Minus, Quote, Redo2, RemoveFormatting, UnderlineIcon, Undo2 } from '@lucide/vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ heading: { levels: [2, 3] } }),
    Underline,
    Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
    Image.configure({ allowBase64: false })
  ],
  editorProps: { attributes: { class: 'newsletter-content min-h-72 px-5 py-4 outline-none' } },
  onUpdate: ({ editor: currentEditor }) => emit('update:modelValue', currentEditor.getHTML())
})

watch(() => props.modelValue, (value) => {
  if (editor.value && editor.value.getHTML() !== value) editor.value.commands.setContent(value, { emitUpdate: false })
})

function setLink() {
  if (!editor.value) return
  const current = editor.value.getAttributes('link').href || ''
  const value = window.prompt('Link URL', current)
  if (value === null) return
  if (!value) return void editor.value.chain().focus().unsetLink().run()
  try {
    const url = value.startsWith('mailto:') ? value : new URL(value.startsWith('http') ? value : `https://${value}`).toString()
    editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  } catch {
    window.alert('Enter a valid web or email address.')
  }
}

function addImage() {
  if (!editor.value) return
  const value = window.prompt('Public image URL (https://...)')
  if (!value) return
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') throw new Error()
    const alt = window.prompt('Image description for accessibility', '') || ''
    editor.value.chain().focus().setImage({ src: url.toString(), alt }).run()
  } catch {
    window.alert('Use a valid HTTPS image URL.')
  }
}

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-black/15 bg-white">
    <div v-if="editor" class="flex flex-wrap gap-1 border-b border-black/10 bg-black/[.025] p-2" role="toolbar" aria-label="Newsletter formatting">
      <button type="button" class="tool" :class="{ active: editor.isActive('bold') }" aria-label="Bold" title="Bold" @click="editor.chain().focus().toggleBold().run()"><Bold :size="17" /></button>
      <button type="button" class="tool" :class="{ active: editor.isActive('italic') }" aria-label="Italic" title="Italic" @click="editor.chain().focus().toggleItalic().run()"><Italic :size="17" /></button>
      <button type="button" class="tool" :class="{ active: editor.isActive('underline') }" aria-label="Underline" title="Underline" @click="editor.chain().focus().toggleUnderline().run()"><UnderlineIcon :size="17" /></button>
      <span class="separator" />
      <button type="button" class="tool" :class="{ active: editor.isActive('heading', { level: 2 }) }" aria-label="Heading 2" title="Heading 2" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"><Heading2 :size="18" /></button>
      <button type="button" class="tool" :class="{ active: editor.isActive('heading', { level: 3 }) }" aria-label="Heading 3" title="Heading 3" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"><Heading3 :size="18" /></button>
      <button type="button" class="tool" :class="{ active: editor.isActive('bulletList') }" aria-label="Bullet list" title="Bullet list" @click="editor.chain().focus().toggleBulletList().run()"><List :size="18" /></button>
      <button type="button" class="tool" :class="{ active: editor.isActive('orderedList') }" aria-label="Numbered list" title="Numbered list" @click="editor.chain().focus().toggleOrderedList().run()"><ListOrdered :size="18" /></button>
      <button type="button" class="tool" :class="{ active: editor.isActive('blockquote') }" aria-label="Quote" title="Quote" @click="editor.chain().focus().toggleBlockquote().run()"><Quote :size="17" /></button>
      <button type="button" class="tool" aria-label="Divider" title="Divider" @click="editor.chain().focus().setHorizontalRule().run()"><Minus :size="18" /></button>
      <span class="separator" />
      <button type="button" class="tool" :class="{ active: editor.isActive('link') }" aria-label="Add link" title="Add link" @click="setLink"><Link2 :size="17" /></button>
      <button type="button" class="tool" aria-label="Add image" title="Add image from URL" @click="addImage"><ImagePlus :size="18" /></button>
      <button type="button" class="tool" aria-label="Clear formatting" title="Clear formatting" @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"><RemoveFormatting :size="17" /></button>
      <span class="separator" />
      <button type="button" class="tool" :disabled="!editor.can().undo()" aria-label="Undo" title="Undo" @click="editor.chain().focus().undo().run()"><Undo2 :size="17" /></button>
      <button type="button" class="tool" :disabled="!editor.can().redo()" aria-label="Redo" title="Redo" @click="editor.chain().focus().redo().run()"><Redo2 :size="17" /></button>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>

<style scoped>
.tool { display: grid; height: 2.25rem; width: 2.25rem; place-items: center; border-radius: .45rem; color: rgb(0 0 0 / .5); transition: .15s; }
.tool:hover, .tool.active { background: #171714; color: white; }
.tool:disabled { cursor: not-allowed; opacity: .25; }
.separator { margin: .35rem .2rem; width: 1px; background: rgb(0 0 0 / .1); }
:deep(.newsletter-content p) { margin: .65rem 0; }
:deep(.newsletter-content h2) { margin: 1.2rem 0 .5rem; font-size: 1.55rem; font-weight: 700; line-height: 1.2; }
:deep(.newsletter-content h3) { margin: 1rem 0 .4rem; font-size: 1.2rem; font-weight: 700; }
:deep(.newsletter-content ul) { margin: .75rem 0; list-style: disc; padding-left: 1.4rem; }
:deep(.newsletter-content ol) { margin: .75rem 0; list-style: decimal; padding-left: 1.4rem; }
:deep(.newsletter-content blockquote) { margin: 1rem 0; border-left: 3px solid #c9ff32; padding-left: 1rem; color: rgb(0 0 0 / .6); }
:deep(.newsletter-content a) { text-decoration: underline; }
:deep(.newsletter-content img) { margin: 1rem auto; max-height: 420px; max-width: 100%; border-radius: .5rem; }
:deep(.newsletter-content hr) { margin: 1.5rem 0; border-color: rgb(0 0 0 / .12); }
</style>
