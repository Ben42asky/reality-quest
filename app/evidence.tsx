export type Evidence = {
  id: number
  type: string
  emoji: string
  description: string
  scenarios: Array<{
    description: string
    thought: string
    options: Array<{
      text: string
      correct: boolean
    }>
  }>
  relapseTrigger: {
    description: string
    options: Array<{
      text: string
      correct: boolean
    }>
  }
}

