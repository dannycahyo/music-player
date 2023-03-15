import { createActorContext } from "@xstate/react";
import { audioPlayerMachine } from "../machines/audioPlayerMachine";

const AudioPlayerContext = createActorContext(audioPlayerMachine);

export { AudioPlayerContext };
