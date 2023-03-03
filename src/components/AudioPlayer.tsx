// Note: This is a work in progress, Replce the element soon
import { useMachine } from "@xstate/react";
import { audioPlayerMachine } from "../machines/audioPlayerMachine";
import React, { useEffect } from "react";

export const AudioPlayer: React.FC<{ src: string }> = ({ src }) => {
  const [state, send, service] = useMachine(audioPlayerMachine);

  useEffect(() => {
    send({ type: "SET_AUDIO", audioUrl: src });
  }, [src, send]);

  useEffect(() => {
    const subscribe = service.subscribe((state) => {
      console.log(state);
    });

    return () => {
      subscribe.unsubscribe();
    };
  }, [service]);

  const handlePlay = () => {
    send("PLAY");
  };

  const handlePause = () => {
    send("PAUSE");
  };

  const handleStop = () => {
    send("STOP");
  };

  const handleMute = () => {
    send("MUTE");
  };

  const handleUnmute = () => {
    send("UNMUTE");
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = e.target.value;
    send({
      type: "VOLUME",
      volume: Number(volume),
    });
  };

  return (
    <div style={{ color: "white" }}>
      <div>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleStop}>Stop</button>
      </div>
      <div>
        <button onClick={handleMute}>Mute</button>
        <button onClick={handleUnmute}>Unmute</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={state.context.currentAudio?.volume}
          onChange={handleVolumeChange}
        />
      </div>
      <div>
        <progress
          value={Math.floor(state.context.elapsed)}
          max={state.context.currentAudio?.duration}
        />
      </div>
    </div>
  );
};
