"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/app/ui/scroll-area"

type Achievement = {
  id: number
  title: string
  description: string
  icon: string
  unlocked: boolean
}

const achievements: Achievement[] = [
  {
    id: 1,
    title: "Reality Explorer",
    description: "Completed first Reality Lens scan",
    icon: "🔍",
    unlocked: false,
  },
  {
    id: 2,
    title: "Story Craftsman",
    description: "Successfully rewrote your first story",
    icon: "✍️",
    unlocked: false,
  },
  {
    id: 3,
    title: "Prevention Master",
    description: "Prevented 3 relapses in a row",
    icon: "🛡️",
    unlocked: false,
  },
  {
    id: 4,
    title: "Evidence Collector",
    description: "Found 10 pieces of evidence",
    icon: "📝",
    unlocked: false,
  },
  {
    id: 5,
    title: "Anxiety Conqueror",
    description: "Kept anxiety at 0% for one full level",
    icon: "⭐",
    unlocked: false,
  },
]

type GameStats = {
  evidenceCollected: number
  storiesRewritten: number
  relapsesPrevented: number
  consecutivePreventions: number
  lowAnxietyStreak: number
}

export function RealSelfJournal({ gameStats }: { gameStats: GameStats }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    const newUnlocked = achievements.filter((achievement) => {
      switch (achievement.id) {
        case 1:
          return gameStats.evidenceCollected > 0 && !achievement.unlocked
        case 2:
          return gameStats.storiesRewritten > 0 && !achievement.unlocked
        case 3:
          return gameStats.consecutivePreventions >= 3 && !achievement.unlocked
        case 4:
          return gameStats.evidenceCollected >= 10 && !achievement.unlocked
        case 5:
          return gameStats.lowAnxietyStreak >= 1 && !achievement.unlocked
        default:
          return false
      }
    })

    if (newUnlocked.length > 0) {
      setUnlockedAchievements((prev) => [...prev, ...newUnlocked])
    }
  }, [gameStats])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Real Self Journal</h2>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg transition-all duration-300 ${
                unlockedAchievements.some((a) => a.id === achievement.id) ? "bg-green-100" : "bg-gray-100 opacity-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h3 className="font-bold">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

