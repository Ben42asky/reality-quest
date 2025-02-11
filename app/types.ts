
export type Evidence = {

  description: string;

  scenarios: {
    options: never[];
    thought: string;
    description: string;

    text: string;

    correct: string;

  }[];

  relapseTrigger: {

    description: string;

    options: {
      [x: string]: string | boolean;

      text: string;

      correct: boolean;

    }[];

  };

};
