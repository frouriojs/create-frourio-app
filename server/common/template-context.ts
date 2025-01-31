import { Answers } from './prompts'

// This is something like `computed value`.
// Additional keys should not include the same key on Answers.
export type TemplateContext = Answers & { clientPort: number; serverPort: number }
