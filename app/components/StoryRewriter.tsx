"use client"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import React, { useEffect } from "react"

interface Scenario {
  description: string
  thought: string
  options: {
    text: string
    correct: boolean
  }[]
}

interface StoryRewriterProps {
  onStoryRewritten: () => void
  onStoryFailed: () => void
  onComplete: () => void
  scenarios: Scenario[]
  evidenceDescription: string
}

export function StoryRewriter({
  onStoryRewritten,
  onStoryFailed,
  onComplete,
  scenarios,
  evidenceDescription,
}: StoryRewriterProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = React.useState(0)
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null)
  const [showFeedback, setShowFeedback] = React.useState(false)

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    setShowFeedback(true)

    if (scenarios[currentScenarioIndex].options[optionIndex].correct) {
      onStoryRewritten()
    } else {
      onStoryFailed()
    }
  }

  const startNewScenario = () => {
    setCurrentScenarioIndex(currentScenarioIndex + 1)
    setSelectedOption(null)
    setShowFeedback(false)
  }

  useEffect(() => {
    if (currentScenarioIndex === scenarios.length - 1 && showFeedback) {
      onComplete()
    }
  }, [currentScenarioIndex, showFeedback, scenarios.length, onComplete])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Story Rewriter</h2>
        {currentScenarioIndex < scenarios.length - 1 && (
          <Button onClick={startNewScenario} className="w-40 bg-[#0d3c26] text-white" disabled={!showFeedback}>
            Next Scenario
          </Button>
        )}
      </div>

      <Card className="p-4 space-y-4 bg-[#daf2ce]">
        <h3 className="font-semibold text-black">Reality Check:</h3>
        <p className="text-black">{evidenceDescription}</p>
      </Card>

      {scenarios[currentScenarioIndex] && (
        <Card className="p-4 space-y-4 bg-white">
          <div className="space-y-2">
            <h3 className="font-semibold text-black">Scenario:</h3>
            <p className="text-black">{scenarios[currentScenarioIndex].description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-black">Intrusive Thought:</h3>
            <p className="text-red-600">{scenarios[currentScenarioIndex].thought}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-black">Choose the best reframe:</h3>
            <div className="grid grid-cols-1 gap-2">
              {scenarios[currentScenarioIndex].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  variant={selectedOption === index ? "default" : "outline"}
                  className={`h-auto py-3 px-4 text-left justify-start ${
                    showFeedback
                      ? option.correct
                        ? "bg-[#daf2ce] hover:bg-[#daf2ce]/90 text-black"
                        : selectedOption === index
                          ? "bg-[#0d3c26] text-black hover:bg-[#0d3c26]"
                          : ""
                      : selectedOption === index
                        ? "bg-[#0d3c26] text-black hover:bg-[#0d3c26]"
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
                scenarios[currentScenarioIndex].options[selectedOption!].correct ? "bg-[#daf2ce]" : "bg-[#daf2ce]"
              }`}
            >
              <p
                className={`font-semibold ${
                  scenarios[currentScenarioIndex].options[selectedOption!].correct ? "text-black" : "text-black"
                }`}
              >
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

