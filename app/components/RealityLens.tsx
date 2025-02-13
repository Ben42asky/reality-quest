"use client"

import { useState, useEffect } from "react"
import { Card } from "../ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import type { Evidence } from "@/app/components/types"

interface RealityLensProps {
  onEvidenceCollected: (evidence: Evidence) => void
  onTabChange: (tab: string) => void
}

const evidencePool: Evidence[] = [
  {
    id: 1,
    type: "sight",
    emoji: "👀",
    description: "The car is parked safely in a well-lit spot",
    scenarios: [
      {
        description: "You notice your car is parked safely, but worry starts creeping in",
        thought: "What if someone hits my car while I'm away?",
        options: [
          {
            text: "My car is in a safe spot, and I have insurance for unexpected events",
            correct: true,
            explanation: "",
          },
          {
            text: "I should go check on it every hour",
            correct: false,
            explanation: "",
          },
          {
            text: "I better move it somewhere else",
            correct: false,
            explanation: "",
          },
          {
            text: "Maybe I should take a picture as proof",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "You see other cars parked nearby",
        thought: "They might scratch my car when leaving",
        options: [
          {
            text: "Most drivers are careful and respectful of others' property",
            correct: true,
            explanation: "",
          },
          {
            text: "I should wait here and watch",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to find a spot with no cars around",
            correct: false,
            explanation: "",
          },
          {
            text: "I should leave a note on nearby cars",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "Later, you get a call about a car accident in the parking lot",
      options: [
        {
          text: "Check the facts before assuming it's your car",
          correct: true,
          explanation: "",
        },
        {
          text: "Rush to the parking lot immediately",
          correct: false,
          explanation: "",
        },
        {
          text: "Remember your car is safely parked",
          correct: true,
          explanation: "",
        },
        {
          text: "Cancel all plans for the day",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
  {
    id: 2,
    type: "sound",
    emoji: "👂",
    description: "You hear children playing and laughing nearby",
    scenarios: [
      {
        description: "You hear children playing near your house",
        thought: "What if they get hurt on my property?",
        options: [
          {
            text: "My property is well-maintained and safe",
            correct: true,
            explanation: "",
          },
          {
            text: "I should tell them to leave",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to watch them constantly",
            correct: false,
            explanation: "",
          },
          {
            text: "I should put up warning signs everywhere",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "You hear their ball bounce near your car",
        thought: "They might damage my car",
        options: [
          {
            text: "Children are usually careful and supervised",
            correct: true,
            explanation: "",
          },
          {
            text: "I should move my car right now",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to go outside and guard it",
            correct: false,
            explanation: "",
          },
          {
            text: "I should complain to their parents",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "You hear a loud thump outside",
      options: [
        {
          text: "Check calmly what happened",
          correct: true,
          explanation: "",
        },
        {
          text: "Assume the worst immediately",
          correct: false,
          explanation: "",
        },
        {
          text: "Remember most sounds are harmless",
          correct: true,
          explanation: "",
        },
        {
          text: "Call emergency services",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
  {
    id: 3,
    type: "touch",
    emoji: "🤲",
    description: "The door handle feels properly locked",
    scenarios: [
      {
        description: "You feel the door handle is secure",
        thought: "But what if I didn't lock it properly?",
        options: [
          {
            text: "I felt it lock and can trust my senses",
            correct: true,
            explanation: "",
          },
          {
            text: "I should check it ten more times",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to record myself locking it",
            correct: false,
            explanation: "",
          },
          {
            text: "Maybe I should stay home",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "The lock makes its usual click sound",
        thought: "The sound might be different this time",
        options: [
          {
            text: "The lock is working as it should",
            correct: true,
            explanation: "",
          },
          {
            text: "I need to test it repeatedly",
            correct: false,
            explanation: "",
          },
          {
            text: "I should get a locksmith to check",
            correct: false,
            explanation: "",
          },
          {
            text: "I can't trust the lock anymore",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "You see a news report about a break-in nearby",
      options: [
        {
          text: "My door is securely locked",
          correct: true,
          explanation: "",
        },
        {
          text: "I need to check the lock again",
          correct: false,
          explanation: "",
        },
        {
          text: "Trust in my security measures",
          correct: true,
          explanation: "",
        },
        {
          text: "Stay up all night watching",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
  {
    id: 4,
    type: "smell",
    emoji: "👃",
    description: "You smell freshly baked bread from a nearby bakery",
    scenarios: [
      {
        description: "The smell reminds you of a time you got food poisoning",
        thought: "What if the bread is contaminated?",
        options: [
          {
            text: "Food poisoning is rare, and the bakery follows health standards",
            correct: true,
            explanation: "",
          },
          {
            text: "I should warn everyone not to eat there",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to inspect their kitchen",
            correct: false,
            explanation: "",
          },
          {
            text: "I'll never eat bread again",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "You notice the smell is quite strong",
        thought: "Maybe there's a gas leak disguised as bread smell",
        options: [
          {
            text: "Strong smells from bakeries are normal and pleasant",
            correct: true,
            explanation: "",
          },
          {
            text: "I should call the fire department",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to warn all the neighbors",
            correct: false,
            explanation: "",
          },
          {
            text: "I should stop breathing deeply",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "You read an article about food recalls in your area",
      options: [
        {
          text: "Check if the recall affects products you've bought",
          correct: true,
          explanation: "",
        },
        {
          text: "Throw away all your food immediately",
          correct: false,
          explanation: "",
        },
        {
          text: "Trust that most food is safe to eat",
          correct: true,
          explanation: "",
        },
        {
          text: "Stop eating anything not prepared by you",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
  {
    id: 5,
    type: "taste",
    emoji: "👅",
    description: "You taste your favorite meal and it's delicious",
    scenarios: [
      {
        description: "You notice a slightly different flavor",
        thought: "What if the food has gone bad?",
        options: [
          {
            text: "Slight variations in taste are normal and often enjoyable",
            correct: true,
            explanation: "",
          },
          {
            text: "I should spit it out immediately",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to call the restaurant and complain",
            correct: false,
            explanation: "",
          },
          {
            text: "I should induce vomiting just in case",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "You remember you forgot to check the expiration date",
        thought: "I might get food poisoning",
        options: [
          {
            text: "The food tastes fine, and I store it properly",
            correct: true,
            explanation: "",
          },
          {
            text: "I should go to the emergency room",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to take all my medication just in case",
            correct: false,
            explanation: "",
          },
          {
            text: "I'll never eat leftovers again",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "You feel a slight stomach discomfort after eating",
      options: [
        {
          text: "Minor discomfort is common and usually harmless",
          correct: true,
          explanation: "",
        },
        {
          text: "I must have severe food poisoning",
          correct: false,
          explanation: "",
        },
        {
          text: "Wait and see if it passes naturally",
          correct: true,
          explanation: "",
        },
        {
          text: "I should go on a water-only diet",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
  {
    id: 6,
    type: "body",
    emoji: "🧘",
    description: "You feel relaxed after a yoga session",
    scenarios: [
      {
        description: "You notice your heart rate is slower than usual",
        thought: "What if something is wrong with my heart?",
        options: [
          {
            text: "A lower heart rate after relaxation is normal and healthy",
            correct: true,
            explanation: "",
          },
          {
            text: "I should go to the hospital",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to exercise vigorously to speed it up",
            correct: false,
            explanation: "",
          },
          {
            text: "I should never do yoga again",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "You feel a slight muscle twinge",
        thought: "I might have seriously injured myself",
        options: [
          {
            text: "Minor muscle sensations are normal after exercise",
            correct: true,
            explanation: "",
          },
          {
            text: "I should get an X-ray immediately",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to stay in bed for a week",
            correct: false,
            explanation: "",
          },
          {
            text: "I'll never be able to move normally again",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "You read about a rare yoga-related injury online",
      options: [
        {
          text: "Rare incidents don't negate the overall benefits of yoga",
          correct: true,
          explanation: "",
        },
        {
          text: "I must have this injury too",
          correct: false,
          explanation: "",
        },
        {
          text: "Continue practicing yoga with proper form",
          correct: true,
          explanation: "",
        },
        {
          text: "Warn everyone I know about the dangers of yoga",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
  {
    id: 7,
    type: "time",
    emoji: "⏰",
    description: "You check your watch and you're on schedule",
    scenarios: [
      {
        description: "You wonder if your watch is accurate",
        thought: "What if I'm actually late?",
        options: [
          {
            text: "My watch is reliable and I set it correctly",
            correct: true,
            explanation: "",
          },
          {
            text: "I should check every clock I can find",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to call my appointment to double-check",
            correct: false,
            explanation: "",
          },
          {
            text: "I should always arrive hours early just in case",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "You realize you forgot to account for traffic",
        thought: "I'm definitely going to be late now",
        options: [
          {
            text: "I've allowed enough time, and traffic is often lighter than expected",
            correct: true,
            explanation: "",
          },
          {
            text: "I should cancel my plans",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to speed dangerously to make up time",
            correct: false,
            explanation: "",
          },
          {
            text: "I'll never be able to schedule anything again",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "Your phone shows a slightly different time than your watch",
      options: [
        {
          text: "Small time differences between devices are normal",
          correct: true,
          explanation: "",
        },
        {
          text: "I can't trust any of my time-keeping devices",
          correct: false,
          explanation: "",
        },
        {
          text: "Use an online time service to verify if needed",
          correct: true,
          explanation: "",
        },
        {
          text: "I need to buy a new watch and phone immediately",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
  {
    id: 8,
    type: "social",
    emoji: "🤝",
    description: "A friend smiles and waves at you",
    scenarios: [
      {
        description: "Your friend's smile seems a bit forced",
        thought: "They must be angry with me",
        options: [
          {
            text: "People's expressions vary and don't always indicate their feelings towards me",
            correct: true,
            explanation: "",
          },
          {
            text: "I should apologize immediately for everything",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to avoid them forever",
            correct: false,
            explanation: "",
          },
          {
            text: "I should analyze every interaction we've ever had",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "Your friend doesn't stop to chat",
        thought: "They don't want to be my friend anymore",
        options: [
          {
            text: "People are often busy and a quick greeting is still friendly",
            correct: true,
            explanation: "",
          },
          {
            text: "I should send them a long message explaining myself",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to find new friends",
            correct: false,
            explanation: "",
          },
          {
            text: "I should never greet anyone again",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "You see your friend talking and laughing with someone else",
      options: [
        {
          text: "It's healthy for friends to have other relationships too",
          correct: true,
          explanation: "",
        },
        {
          text: "They're obviously talking about me",
          correct: false,
          explanation: "",
        },
        {
          text: "Feel happy that your friend is enjoying themselves",
          correct: true,
          explanation: "",
        },
        {
          text: "I should confront them about excluding me",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
  {
    id: 9,
    type: "nature",
    emoji: "🌳",
    description: "You see a beautiful, healthy tree outside your window",
    scenarios: [
      {
        description: "You notice a few yellow leaves",
        thought: "The tree must be dying",
        options: [
          {
            text: "Some yellow leaves are normal, especially in certain seasons",
            correct: true,
            explanation: "",
          },
          {
            text: "I should cut down the tree immediately",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to water it constantly",
            correct: false,
            explanation: "",
          },
          {
            text: "All the trees in the neighborhood are doomed",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "A branch is growing close to your window",
        thought: "It might break through and hurt someone",
        options: [
          {
            text: "Trees grow slowly and can be safely trimmed if needed",
            correct: true,
            explanation: "",
          },
          {
            text: "I should board up my windows",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to move to a treeless area",
            correct: false,
            explanation: "",
          },
          {
            text: "I should stay awake all night to watch the branch",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "You read about a tree falling on a house during a storm",
      options: [
        {
          text: "Such incidents are rare and proper tree maintenance prevents most issues",
          correct: true,
          explanation: "",
        },
        {
          text: "I need to cut down all trees near my house",
          correct: false,
          explanation: "",
        },
        {
          text: "Trust that most trees are safe and beneficial",
          correct: true,
          explanation: "",
        },
        {
          text: "I should never go outside when it's windy",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
  {
    id: 10,
    type: "technology",
    emoji: "💻",
    description: "Your computer is running smoothly",
    scenarios: [
      {
        description: "You notice a new update is available",
        thought: "If I update, I might lose all my files",
        options: [
          {
            text: "Updates usually improve performance and rarely cause data loss",
            correct: true,
            explanation: "",
          },
          {
            text: "I should never update my computer",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to back up my entire hard drive before every update",
            correct: false,
            explanation: "",
          },
          {
            text: "I should buy a new computer instead of updating",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "Your computer makes a slight humming noise",
        thought: "My computer is about to explode",
        options: [
          {
            text: "Slight noises are normal for computers and usually harmless",
            correct: true,
            explanation: "",
          },
          {
            text: "I should throw my computer out the window",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to call the bomb squad",
            correct: false,
            explanation: "",
          },
          {
            text: "I should never use electronics again",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "You read about a major computer virus outbreak",
      options: [
        {
          text: "My antivirus software and regular updates protect me from most threats",
          correct: true,
          explanation: "",
        },
        {
          text: "I should disconnect my computer from the internet forever",
          correct: false,
          explanation: "",
        },
        {
          text: "Continue using my computer while following good security practices",
          correct: true,
          explanation: "",
        },
        {
          text: "I need to buy a new computer every time there's a virus scare",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
  {
    id: 11,
    type: "health",
    emoji: "🏥",
    description: "You feel healthy after a routine check-up",
    scenarios: [
      {
        description: "You notice a small bruise you don't remember getting",
        thought: "This must be a sign of a serious illness",
        options: [
          {
            text: "Minor bruises are common and often go unnoticed when they occur",
            correct: true,
            explanation: "",
          },
          {
            text: "I should go to the emergency room immediately",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to get full-body scans every week",
            correct: false,
            explanation: "",
          },
          {
            text: "I should never leave my house to avoid bruises",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "Your doctor mentions a slight elevation in blood pressure",
        thought: "I'm definitely going to have a heart attack",
        options: [
          {
            text: "Slight variations are normal and can be addressed with lifestyle changes",
            correct: true,
            explanation: "",
          },
          {
            text: "I should take every heart medication available",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to quit my job to reduce stress",
            correct: false,
            explanation: "",
          },
          {
            text: "I should prepare my will immediately",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "You read about a rare disease with symptoms similar to a common cold",
      options: [
        {
          text: "Common symptoms usually indicate common conditions",
          correct: true,
          explanation: "",
        },
        {
          text: "I must have this rare disease",
          correct: false,
          explanation: "",
        },
        {
          text: "Monitor my health but don't jump to worst-case scenarios",
          correct: true,
          explanation: "",
        },
        {
          text: "I should demand every possible medical test",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
  {
    id: 12,
    type: "future",
    emoji: "🔮",
    description: "You feel optimistic about an upcoming event",
    scenarios: [
      {
        description: "You think about potential obstacles",
        thought: "Everything is going to go wrong",
        options: [
          {
            text: "It's normal to have some challenges, but I can handle them",
            correct: true,
            explanation: "",
          },
          {
            text: "I should cancel the event immediately",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to plan for every possible disaster",
            correct: false,
            explanation: "",
          },
          {
            text: "I should never make plans again",
            correct: false,
            explanation: "",
          },
        ],
      },
      {
        description: "You realize you forgot to confirm one detail",
        thought: "The entire event is ruined now",
        options: [
          {
            text: "One small detail doesn't determine the success of the entire event",
            correct: true,
            explanation: "",
          },
          {
            text: "I should apologize to everyone involved",
            correct: false,
            explanation: "",
          },
          {
            text: "I need to double-check every single thing repeatedly",
            correct: false,
            explanation: "",
          },
          {
            text: "I'll never be able to organize anything again",
            correct: false,
            explanation: "",
          },
        ],
      },
    ],
    relapseTrigger: {
      description: "You hear about someone else's event that didn't go as planned",
      options: [
        {
          text: "Every event is unique, and many factors contribute to success",
          correct: true,
          explanation: "",
        },
        {
          text: "This is a sign that my event will also fail",
          correct: false,
          explanation: "",
        },
        {
          text: "Learn from others' experiences but trust in your preparations",
          correct: true,
          explanation: "",
        },
        {
          text: "I should warn everyone I know about the dangers of planning events",
          correct: false,
          explanation: "",
        },
      ],
    },
  },
]

export function RealityLens({
  onEvidenceCollected,
  onTabChange,
}: {
  onEvidenceCollected: (evidence: Evidence) => void
  onTabChange: (tab: string) => void
}) {
  const [grid, setGrid] = useState<(Evidence | null)[]>(Array(12).fill(null))
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    if (!grid.some((cell) => cell !== null)) {
      const newGrid = [...evidencePool].sort(() => Math.random() - 0.5)
      setGrid(newGrid)
    }
  }, [grid])

  const handleCollectEvidence = () => {
    const evidence: Evidence = grid.find((item) => item !== null) as Evidence
    onEvidenceCollected(evidence)
  }
  const handleCardClick = (index: number) => {
    if (grid[index] && !flippedCards.includes(index)) {
      const evidence = grid[index]!
      setFlippedCards([...flippedCards, index])
      setSelectedEvidence(evidence)
      setShowDialog(true)
      onEvidenceCollected(evidence)
    }
  }

  const handleDialogClose = () => {
    setShowDialog(false)
    if (selectedEvidence) {
      onTabChange("rewriter")
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">Reality Lens</h2>

      <div className="grid grid-cols-4 grid-rows-3 gap-3">
        {grid.map((evidence, index) => (
          <div key={index} className="relative perspective">
            <motion.div
              className={`w-full h-32 cursor-pointer preserve-3d transition-transform duration-500 ${
                flippedCards.includes(index) ? "rotate-y-180" : ""
              }`}
              whileHover={flippedCards.includes(index) ? {} : { scale: 1.05 }}
              onClick={() => handleCardClick(index)}
            >
              {/* Front of card */}
              <Card
                className={`absolute w-full h-full backface-hidden bg-[#0d3c26] flex items-center justify-center ${
                  flippedCards.includes(index) ? "pointer-events-none" : ""
                }`}
              >
                <span className="text-2xl text-white">?</span>
              </Card>

              {/* Back of card */}
              <Card className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#daf2ce] flex items-center justify-center">
                {evidence && flippedCards.includes(index) && <span className="text-4xl">{evidence.emoji}</span>}
              </Card>
            </motion.div>
          </div>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#daf2ce]">
          <DialogHeader>
            <DialogTitle className="text-black">Reality Check</DialogTitle>
          </DialogHeader>
          {selectedEvidence && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="font-semibold text-black">You observed:</p>
                <p className="text-black">{selectedEvidence.description}</p>
              </div>
              <p className="text-sm text-black">Continue to Story Rewriter to challenge any thoughts that arise.</p>
              <Button onClick={handleDialogClose} className="w-full bg-[#0d3c26] text-white hover:bg-[#0d3c26]/90">
                Continue to Story Rewriter
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

