export type Evidence = {
    description: string;
    scenarios: {
      description: string;
      thought: string;
      options: {
        text: string;
        correct: boolean;
      }[];
    }[];
    relapseTrigger: string;
  };