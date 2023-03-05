import { createMachine, assign, Sender } from "xstate";

type AudioPlayerContext = {
  currentAudio: HTMLAudioElement | null;
  audioUrl: string;
  elapsed: number;
  interval: number;
  paused: boolean;
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
  | { type: "TICK" }
  | { type: "SET_CURRENT_TIME"; currentTime: number };

const setTimer =
  (ctx: AudioPlayerContext) => (send: Sender<AudioPlayerEvents>) => {
    const interval = setInterval(() => {
      send("TICK");
    }, ctx.interval * 1000);

    return () => clearInterval(interval);
  };

const audioPlayerMachine = createMachine<
  AudioPlayerContext,
  AudioPlayerEvents,
  AudioPlayerState
>({
  id: "audioPlayer",
  initial: "idle",
  predictableActionArguments: true,
  context: {
    currentAudio: null,
    audioUrl: "",
    interval: 0.1,
    elapsed: 0,
    paused: true,
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
      always: {
        cond: (ctx) => ctx.elapsed >= ctx.currentAudio!.duration,
        target: "ended",
      },
      on: {
        TICK: {
          actions: "startTimer",
        },
        PAUSE: {
          target: "paused",
          actions: ["pauseAudio"],
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
      audioUrl: (_, event) =>
        event.type === "SET_AUDIO" ? event.audioUrl : "",
    }),
    startTimer: assign({
      elapsed: (ctx) => ctx.elapsed + ctx.interval,
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
    updateElapsed: assign({
      elapsed: (context: AudioPlayerContext) =>
        context.currentAudio!.currentTime,
    }),
  },
});

export { audioPlayerMachine };
