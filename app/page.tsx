"use client"

import { useState, useEffect } from "react"
import { RealityLens } from "./components/RealityLens"
import { StoryRewriter } from "./components/StoryRewriter"
import { RelapsePrevention } from "./components/RelapsePrevention"
import { RealSelfJournal } from "./components/RealSelfJournal"
import { Button } from "@/app/ui/button"
import { Progress } from "@/app/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/app/ui/alert"
import { AlertCircle } from "lucide-react"
import type React from "react"
import { type Evidence } from '@/app/types';

type Evidence = {
  description: string;
  scenarios: {
    description: string;
    thought: string;
    options: {
      text: string;
      correct: boolean; // Changed from 'isCorrect' to 'correct'
    }[];
  }[];
  relapseTrigger: string;
};

type GameState = "intro" | "instructions" | "playing" | "gameOver" | "victory"

export default function RealityQuest() {
  const [gameState, setGameState] = useState<GameState>("intro")
  const [anxietyMeter, setAnxietyMeter] = useState(0)
  const [realSelfProgress, setRealSelfProgress] = useState(0)
  const [score, setScore] = useState(0)
  const [activeTab, setActiveTab] = useState("lens")
  const [gameStats, setGameStats] = useState({
    evidenceCollected: 0,
    storiesRewritten: 0,
    relapsesPrevented: 0,
    consecutivePreventions: 0,
    lowAnxietyStreak: 0,
  })
  const [currentEvidence, setCurrentEvidence] = useState<Evidence | null>(null)

  useEffect(() => {
    if (anxietyMeter >= 100) {
      setGameState("gameOver")
    }
    if (realSelfProgress >= 100) {
      setGameState("victory")
    }
  }, [anxietyMeter, realSelfProgress])

  const startGame = () => {
    setGameState("playing")
    setAnxietyMeter(0)
    setRealSelfProgress(0)
    setScore(0)
    setGameStats({
      evidenceCollected: 0,
      storiesRewritten: 0,
      relapsesPrevented: 0,
      consecutivePreventions: 0,
      lowAnxietyStreak: 0,
    })
    setCurrentEvidence(null)
  }

  const showInstructions = () => {
    setGameState("instructions")
  }

  const handleEvidenceCollected = (evidence: Evidence) => {
    setGameStats((prevStats) => ({ ...prevStats, evidenceCollected: prevStats.evidenceCollected + 1 }))
    setRealSelfProgress((prevProgress) => Math.min(prevProgress + 10, 100))
    setAnxietyMeter((prevAnxiety) => Math.max(prevAnxiety - 5, 0))
    setScore((prevScore) => prevScore + 10)
    setCurrentEvidence(evidence)
    setActiveTab("rewriter")
  }

  const handleStoryRewritten = () => {
    setGameStats((prevStats) => ({ ...prevStats, storiesRewritten: prevStats.storiesRewritten + 1 }))
    setRealSelfProgress((prevProgress) => Math.min(prevProgress + 15, 100))
    setAnxietyMeter((prevAnxiety) => Math.max(prevAnxiety - 10, 0))
    setScore((prevScore) => prevScore + 15)
  }

  const handleStoryFailed = () => {
    setAnxietyMeter((prevAnxiety) => Math.min(prevAnxiety + 25, 100))
  }

  const handleRelapsePrevented = () => {
    setGameStats((prevStats) => ({
      ...prevStats,
      relapsesPrevented: prevStats.relapsesPrevented + 1,
      consecutivePreventions: prevStats.consecutivePreventions + 1,
      lowAnxietyStreak: prevStats.lowAnxietyStreak + 1,
    }))
    setRealSelfProgress((prevProgress) => Math.min(prevProgress + 20, 100))
    setAnxietyMeter((prevAnxiety) => Math.max(prevAnxiety - 15, 0))
    setScore((prevScore) => prevScore + 20)
  }

  const handleAnxietyIncrease = () => {
    setAnxietyMeter((prevAnxiety) => Math.min(prevAnxiety + 25, 100))
    setGameStats((prevStats) => ({ ...prevStats, consecutivePreventions: 0 }))
  }

  const handleRealSelfDecrease = () => {
    setRealSelfProgress((prevProgress) => Math.max(prevProgress - 10, 0))
    setGameStats((prevStats) => ({ ...prevStats, lowAnxietyStreak: 0 }))
  }

  if (gameState === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d3c26] text-white">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold mb-4">Reality Quest: Build Your Real Self</h1>
          <p className="mb-4 text-[#daf2ce]">Overcome OCD and discover your true self!</p>
          <div className="space-x-4">
            <Button onClick={showInstructions} className="bg-[#daf2ce] text-[#0d3c26] hover:bg-[#c5e4b5]">
              How to Play
            </Button>
            <Button onClick={startGame} className="bg-[#daf2ce] text-[#0d3c26] hover:bg-[#c5e4b5]">
              Start Game
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "instructions") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d3c26] text-white p-8">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-3xl font-bold mb-6">How to Play</h1>

          <div className="space-y-4 text-[#daf2ce]">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Reality Lens 🔍</h2>
              <p>Click on cards to reveal reality checks. Each card contains evidence that challenges OCD thoughts.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. Story Rewriter ✍️</h2>
              <p>
                After finding evidence, rewrite OCD thoughts more realistically by choosing the most helpful response.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. Relapse Prevention 🛡️</h2>
              <p>Practice preventing relapses by selecting two appropriate responses within the time limit.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Game Progress</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Win by reaching 100% Real Self Progress</li>
                <li>Lose if Anxiety Meter reaches 100%</li>
                <li>Wrong choices increase anxiety by 25%</li>
                <li>Correct choices build your Real Self and reduce anxiety</li>
              </ul>
            </section>
          </div>

          <Button onClick={startGame} className="mt-6 bg-[#daf2ce] text-[#0d3c26] hover:bg-[#c5e4b5]">
            Start Game
          </Button>
        </div>
      </div>
    )
  }

  if (gameState === "gameOver") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d3c26] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Game Over</h1>
          <p className="mb-4">Your anxiety reached 100%</p>
          <p className="mb-4">Final Score: {score}</p>
          <Button onClick={startGame} className="bg-[#daf2ce] text-[#0d3c26] hover:bg-[#c5e4b5]">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (gameState === "victory") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d3c26] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Congratulations!</h1>
          <p className="mb-4">You've built your Real Self to 100%!</p>
          <p className="mb-4">Final Score: {score}</p>
          <Button onClick={startGame} className="bg-[#daf2ce] text-[#0d3c26] hover:bg-[#c5e4b5]">
            Play Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d3c26] p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#0d3c26]">Reality Quest: Build Your Real Self</h1>

        <div className="mb-4 space-y-4">
          <div className="flex justify-end items-center">
            <span className="text-xl font-bold text-[#0d3c26]">Score: {score}</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[#0d3c26]">Anxiety Meter:</span>
              <span className="text-[#0d3c26]">{anxietyMeter}%</span>
            </div>
            <Progress
              value={anxietyMeter}
              className="h-2 bg-gray-200"
              style={
                {
                  "--progress-background": "rgb(239, 68, 68)",
                } as React.CSSProperties
              }
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[#0d3c26]">Real Self Progress:</span>
              <span className="text-[#0d3c26]">{realSelfProgress}%</span>
            </div>
            <Progress
              value={realSelfProgress}
              className="h-2 bg-gray-200"
              style={
                {
                  "--progress-background": "#0d3c26",
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        {anxietyMeter >= 75 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Your anxiety is getting high! Be careful with your next choices.</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger
              value="lens"
              className="flex-1 data-[state=active]:bg-[#0d3c26] data-[state=active]:text-white"
            >
              Reality Lens
            </TabsTrigger>
            <TabsTrigger
              value="rewriter"
              className="flex-1 data-[state=active]:bg-[#0d3c26] data-[state=active]:text-white"
            >
              Story Rewriter
            </TabsTrigger>
            <TabsTrigger
              value="prevention"
              className="flex-1 data-[state=active]:bg-[#0d3c26] data-[state=active]:text-white"
            >
              Relapse Prevention
            </TabsTrigger>
            <TabsTrigger
              value="journal"
              className="flex-1 data-[state=active]:bg-[#0d3c26] data-[state=active]:text-white"
            >
              Real Self Journal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lens">
            <RealityLens onEvidenceCollected={handleEvidenceCollected} onTabChange={setActiveTab} />
          </TabsContent>
          <TabsContent value="rewriter">
            {currentEvidence && (
              <StoryRewriter
                onStoryRewritten={handleStoryRewritten}
                onStoryFailed={handleStoryFailed}
                onComplete={() => setActiveTab("prevention")}
                scenarios={currentEvidence.scenarios}
                evidenceDescription={currentEvidence.description}
              />
            )}
          </TabsContent>
          <TabsContent value="prevention">
            {currentEvidence && (
              <RelapsePrevention
                onRelapsePrevented={handleRelapsePrevented}
                onAnxietyIncrease={handleAnxietyIncrease}
                onRealSelfDecrease={handleRealSelfDecrease}
                onComplete={() => setActiveTab("lens")}
                trigger={currentEvidence.relapseTrigger}
                evidenceDescription={currentEvidence.description}
              />
            )}
          </TabsContent>
          <TabsContent value="journal">
            <RealSelfJournal gameStats={gameStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

