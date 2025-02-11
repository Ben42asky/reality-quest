"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/ui/button"
import { Card } from "@/app/ui/card"

type Scenario = {
  description: string
  thought: string
  options: Array<{
    text: string
    correct: boolean
  }>
}

export function StoryRewriter({
  onStoryRewritten,
  onStoryFailed,
  onComplete,
  scenarios,
  evidenceDescription,
}: {
  onStoryRewritten: () => void
  onStoryFailed: () => void
  onComplete: () => void
  scenarios: Scenario[]
  evidenceDescription: string
}) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const startNewScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex((prevIndex) => prevIndex + 1)
      setSelectedOption(null)
      setShowFeedback(false)
    } else {
      onComplete()
    }
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    setShowFeedback(true)

    if (scenarios[currentScenarioIndex].options[optionIndex].correct) {
      onStoryRewritten()
    } else {
      onStoryFailed()
    }
  }

  useEffect(() => {
    if (currentScenarioIndex === scenarios.length - 1 && showFeedback) {
      onComplete()
    }
  }, [currentScenarioIndex, showFeedback, scenarios.length, onComplete])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Story Rewriter</h2>
        {currentScenarioIndex < scenarios.length - 1 && (
          <Button onClick={startNewScenario} className="w-40" disabled={!showFeedback}>
            Next Scenario
          </Button>
        )}
      </div>

      <Card className="p-4 space-y-4 bg-[#daf2ce]">
        <h3 className="font-semibold">Reality Check:</h3>
        <p>{evidenceDescription}</p>
      </Card>

      {scenarios[currentScenarioIndex] && (
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Scenario:</h3>
            <p>{scenarios[currentScenarioIndex].description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Intrusive Thought:</h3>
            <p className="text-red-600">{scenarios[currentScenarioIndex].thought}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Choose the best reframe:</h3>
            <div className="grid grid-cols-1 gap-2">
              {scenarios[currentScenarioIndex].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  variant={selectedOption === index ? "default" : "outline"}
                  className={`h-auto py-3 px-4 text-left justify-start ${
                    showFeedback
                      ? option.correct
                        ? "bg-green-100 hover:bg-green-200"
                        : selectedOption === index
                          ? "bg-red-100 hover:bg-red-200"
                          : ""
                      : ""
                  }`}
                  disabled={showFeedback}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          </div>

          {showFeedback && (
            <div
              className={`p-4 rounded-lg ${
                scenarios[currentScenarioIndex].options[selectedOption!].correct ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="font-semibold">
                {scenarios[currentScenarioIndex].options[selectedOption!].correct
                  ? "Great job! This is a helpful way to reframe the thought."
                  : "This might not be the most helpful way to think about it. Try another scenario!"}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

