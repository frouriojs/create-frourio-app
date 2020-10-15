import {allEditors} from 'env-editor'

export const editors = allEditors().map(editor => ({ name: editor.name, value: editor.id }))
