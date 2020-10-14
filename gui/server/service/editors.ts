import {allEditors} from 'env-editor'

export const editors = allEditors().map(editor => ({ label: editor.name, value: editor.id }))
