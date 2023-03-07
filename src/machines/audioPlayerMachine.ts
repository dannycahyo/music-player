import { createMachine, assign, Sender } from "xstate";

type AudioPlayerContext = {
  currentAudio: HTMLAudioElement | null;
  audioUrl: string;
  elapsed: number;
};

type AudioPlayerState =
  | { value: "idle"; context: AudioPlayerContext }
  | { value: "loading"; context: AudioPlayerContext }
  | {
      value: "loaded";
      context: AudioPlayerContext & { currentAudio: HTMLAudioElement };
    }
  | {
      value: "playing";
      context: AudioPlayerContext & { currentAudio: HTMLAudioElement };
    }
  | {
      value: "paused";
      context: AudioPlayerContext & { currentAudio: HTMLAudioElement };
    }
  | {
      value: "ended";
      context: AudioPlayerContext & { currentAudio: HTMLAudioElement };
    };

type AudioPlayerEvents =
  | { type: "SET_AUDIO"; audioUrl: string }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "MUTE" }
  | { type: "UNMUTE" }
  | { type: "ADJUST_VOLUME"; volume: number }
  | { type: "SET_CURRENT_TIME"; currentTime: number }
  | { type: "SET_LOOP" }
  | { type: "STOP" }
  | { type: "RESET" }
  | { type: "UPDATE_ELAPSED"; elapsed: number };

const setTimer =
  (ctx: AudioPlayerContext) => (send: Sender<AudioPlayerEvents>) => {
    if (ctx.currentAudio) {
      const interval = setInterval(() => {
        send({
          type: "UPDATE_ELAPSED",
          elapsed: ctx.currentAudio!.currentTime,
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  };

const audioPlayerMachine = createMachine<
  AudioPlayerContext,
  AudioPlayerEvents,
  AudioPlayerState
>({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7ACgG2QE8wAnAYgFkBVAFQFEBtABgF1FQAHLWDAF2wB27EAA9EANgBMADgB04gIwB2BdKUAWJUw3T1AGhCFE6yZNmTxAVkvTx6y+IDMdy44C+bg2ky4CxclQActT0zGxIIFw8-FhCEWIIUgqy6uJMAJyO6QpMjhpK4gZGCI4Wso4KkpqWCuk20pIK6h5e6Nj4RKRkAIIAIgBSVADKNAD6AGoA8gAyVBSMrMJRfILCCWmOsulMUvbi0gemkkWIko5M5ZaZTpmu6ekFLSDe7X5dQ3RjAMJUAEq-dECYxoAEl5mEltwVrE1ogrupZBp7ulJHUGncTggckotq4FPiLEx1A0sk8Xr5OuQPmNppNJjgIRFljE4qB1udZNJtlIlEp6lz0pjKmS2hT-LIMBA8GAyNTRt0qL0QZNGZwoSzYVjHJYtsj0tJrBkFOJMpilPrZETjbk1LomK4RT4OuK8FhkJgBFAyBBYmAJQIAG5YADWfvJztIsld7ownoQsaDAGNkCywqrIurVvFjBbMkjXDcKgpHGbbLJKuoUdkrZZiY7XpSo26PV7SCQsCRZBwCLwAGYdgC2snDb070Zb8cDWGTqdY6eZWbZiGLOr1+sN2RNJcMiD5F1r1qUjnURJU4nrYsj48gZBw026AE155mYdmELycQUHKpeXdpApSwRXZMkke1LCPe4LwjTtuyIWMvVBL4AGln2iRdREQdIT11RoDkcRx-0qQodwQK50hSOpJEsSRzR2WpJCg0cuz8eDbwVD5UOhVkMPfXlESsRQ1D5LJ-0xK4zBUNQMlcTQ+QURjG1gwhWM4jU3xyOpcQqUxamPLDjhIjRkkUSx7QUK4tCtBTxQ4NBYBvO9H1U9CEg-fjvyEv8AJI-Y5HESTQPNajwMsazIzAAQIAc+8n0WJkX24hINNXPEdMySsTExFx5EULDcmcajjQ8TwQAELAovgCIR0pSE0NfJcEAAWm84pTJ1XCTV5Y1dBNMLO0laVaq4zVNExf9NlUYlSnUVRpCJdwSuql1m3goa1Ia84dSUf8qnuXk9jUQDLiaJQdPNXRpD6pt3UgNaXIkLRLV2AV0n2bViOKOacQNJormUKiTCupTVviurEswso1ErV77H-ajt2KSyUimuwzJyIrFtFaCuzs27QeGt9xCsJ6qhet6HDNXJOXMolMnehxQsxp0mIiqKIDu+qeIrOQGh27aT3ObazWPcx-1OkwahRfFircIA */
  id: "audioPlayer",
  initial: "idle",
  predictableActionArguments: true,
  context: {
    currentAudio: null,
    audioUrl: "",
    elapsed: 0,
  },
  states: {
    idle: {
      on: {
        SET_AUDIO: {
          target: "loading",
          actions: "assignAudioUrl",
        },
      },
    },
    loading: {
      invoke: {
        src: "loadAudio",
        onDone: {
          target: "loaded",
          actions: assign((_, event) => ({
            currentAudio: event.data,
          })),
        },
        onError: {
          target: "idle",
        },
      },
    },
    loaded: {
      on: {
        PLAY: {
          target: "playing",
          actions: ["playAudio"],
        },
      },
    },
    playing: {
      invoke: {
        src: setTimer,
      },
      always: [
        {
          cond: (ctx) =>
            ctx.currentAudio!.loop && ctx.elapsed >= ctx.currentAudio!.duration,
          target: "playing",
          actions: "resetTimer",
        },
        {
          cond: (ctx) => ctx.elapsed >= ctx.currentAudio!.duration,
          target: "ended",
          actions: "resetTimer",
        },
      ],
      on: {
        PAUSE: {
          target: "paused",
          actions: ["pauseAudio"],
        },
        UPDATE_ELAPSED: {
          actions: "updateElapsed",
        },
      },
    },
    paused: {
      on: {
        PLAY: {
          target: "playing",
          actions: ["playAudio"],
        },
      },
    },
    ended: {
      on: {
        PLAY: {
          target: "playing",
          actions: ["restartAudio"],
        },
      },
    },
  },
  on: {
    MUTE: {
      actions: ["muteAudio"],
    },
    UNMUTE: {
      actions: ["unmuteAudio"],
    },
    ADJUST_VOLUME: {
      actions: ["setVolume"],
    },
    SET_CURRENT_TIME: {
      actions: ["setCurrentTime", "updateElapsed"],
    },
    SET_LOOP: {
      actions: ["setLoop"],
    },
    STOP: {
      target: "loaded",
      actions: ["stopAudio", "resetTimer"],
    },
    RESET: {
      target: "idle",
      actions: ["stopAudio", "resetTimer"],
    },
  },
}).withConfig({
  services: {
    loadAudio: (context) =>
      new Promise<HTMLAudioElement>((resolve, reject) => {
        const audio = new Audio(context.audioUrl);
        audio.addEventListener("loadeddata", () => {
          resolve(audio);
        });
        audio.addEventListener("error", () => {
          reject();
        });
      }),
  },
  actions: {
    assignAudioUrl: assign({
      audioUrl: (_, event: AudioPlayerEvents) =>
        event.type === "SET_AUDIO" ? event.audioUrl : "",
    }),
    resetTimer: assign({
      elapsed: 0,
    }),
    playAudio: (context) => context.currentAudio?.play(),
    pauseAudio: (context: AudioPlayerContext) => context.currentAudio?.pause(),
    restartAudio: (context: AudioPlayerContext) => {
      context.currentAudio!.currentTime = 0;
      context.currentAudio?.play();
    },
    muteAudio: (context: AudioPlayerContext) =>
      (context.currentAudio!.muted = true),
    unmuteAudio: (context: AudioPlayerContext) =>
      (context.currentAudio!.muted = false),
    setVolume: (context: AudioPlayerContext, event: AudioPlayerEvents) => {
      context.currentAudio!.volume =
        event.type === "ADJUST_VOLUME" ? event.volume : 0.1;
    },
    setCurrentTime: (context: AudioPlayerContext, event: AudioPlayerEvents) => {
      context.currentAudio!.currentTime =
        event.type === "SET_CURRENT_TIME" ? event.currentTime : 0;
    },
    stopAudio: (context: AudioPlayerContext) => {
      context.currentAudio?.pause();
      context.currentAudio!.currentTime = 0;
    },
    updateElapsed: assign({
      elapsed: (context: AudioPlayerContext) =>
        context.currentAudio!.currentTime,
    }),
    setLoop: (context: AudioPlayerContext) => {
      context.currentAudio!.loop = !context.currentAudio!.loop;
    },
  },
});

export { audioPlayerMachine };
