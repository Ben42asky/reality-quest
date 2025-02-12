"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Card } from "../ui/card"

type Trigger = {
  description: string
  options: {
    text: string
    correct: boolean
    explanation: string
  }[]
}

export function RelapsePrevention({
  onRelapsePrevented,
  onAnxietyIncrease,
  onRealSelfDecrease,
  onComplete,
  trigger,
  evidenceDescription,
}: {
  onRelapsePrevented: () => void
  onAnxietyIncrease: () => void
  onRealSelfDecrease: () => void
  onComplete: () => void
  trigger: Trigger
  evidenceDescription: string
}) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(20)
  const [gameActive, setGameActive] = useState(true)
  const [feedback, setFeedback] = useState<string[]>([])

  const startChallenge = useCallback(() => {
    setSelectedOptions([])
    setTimeRemaining(20)
    setGameActive(true)
    setFeedback([])
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameActive && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
        if (timeRemaining === 1) {
          onAnxietyIncrease()
          setGameActive(false)
        }
      }, 1000)
    } else if (timeRemaining === 0) {
      setGameActive(false)
      onAnxietyIncrease()
    }
    return () => clearTimeout(timer)
  }, [gameActive, timeRemaining, onAnxietyIncrease])

  useEffect(() => {
    startChallenge()
  }, [startChallenge])

  useEffect(() => {
    if (feedback.length > 0) {
      const timer = setTimeout(() => {
        onComplete()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [feedback, onComplete])

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOptions.includes(optionIndex)) {
      setSelectedOptions(selectedOptions.filter((i) => i !== optionIndex))
    } else if (selectedOptions.length < 2) {
      setSelectedOptions([...selectedOptions, optionIndex])
    } else {
      return
    }

    if (selectedOptions.length === 2) {
      setGameActive(false)
      const selectedResponses = selectedOptions.map((i) => trigger.options[i])
      const correctCount = selectedResponses.filter((r) => r.correct).length

      const newFeedback = selectedResponses.map(
        (response) => `${response.correct ? "✅" : "❌"} ${response.text}: ${response.explanation}`,
      )
      setFeedback(newFeedback)

      if (correctCount === 2) {
        onRelapsePrevented()
      } else {
        onAnxietyIncrease()
        onRealSelfDecrease()
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relapse Prevention Challenge</h2>
      </div>

      <Card className="p-4 space-y-4 bg-[#daf2ce]">
        <h3 className="font-semibold">Reality Check:</h3>
        <p>{evidenceDescription}</p>
      </Card>

      <Card className="p-4 space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="font-semibold">Trigger:</p>
          <p>{trigger.description}</p>
        </div>

        {gameActive && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Time remaining: {timeRemaining} seconds</span>
              <span className="text-sm text-gray-500">Select two responses</span>
            </div>
            <Progress value={(timeRemaining / 20) * 100} className="w-full" />
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {trigger.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleOptionSelect(index)}
              variant={selectedOptions.includes(index) ? "default" : "outline"}
              className={`h-auto min-h-[3rem] py-3 px-4 text-sm text-left justify-start whitespace-normal ${
                !gameActive && feedback.length > 0
                  ? option.correct
                    ? "bg-green-50 border-green-500"
                    : selectedOptions.includes(index)
                      ? "bg-red-50 border-red-500"
                      : ""
                  : ""
              }`}
              disabled={!gameActive && feedback.length > 0}
            >
              {option.text}
            </Button>
          ))}
        </div>

        {feedback.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="font-semibold">Feedback:</p>
            {feedback.map((f, i) => (
              <p key={i} className="text-sm">
                {f}
              </p>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

