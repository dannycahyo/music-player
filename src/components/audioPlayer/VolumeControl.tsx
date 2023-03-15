import { useState } from "react";
import {
  IconButton,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { BsVolumeDown, BsFillVolumeMuteFill } from "react-icons/bs";

import type React from "react";

type VolumeControlProps = {
  currentAudio: HTMLAudioElement | null;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  onUnmute: () => void;
};

const VolumeControl: React.FC<VolumeControlProps> = ({
  currentAudio,
  onMute,
  onUnmute,
  onVolumeChange,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Box
      position="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <IconButton
        onClick={() => (currentAudio?.muted ? onUnmute() : onMute())}
        variant="ghost"
        colorScheme="whiteAlpha"
        size="lg"
        aria-label="audio"
        fontSize="30px"
        icon={currentAudio?.muted ? <BsFillVolumeMuteFill /> : <BsVolumeDown />}
      />
      {isHovering && (
        <Box
          position="absolute"
          top="-56px"
          left="12px"
          zIndex={1}
          p="4px"
          borderRadius="md"
          boxShadow="md"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Slider
            aria-label="slider-ex-3"
            value={currentAudio?.volume}
            defaultValue={currentAudio?.volume}
            onChange={onVolumeChange}
            orientation="vertical"
            min={0}
            max={1}
            step={0.1}
            minH="14"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
      )}
    </Box>
  );
};
export default VolumeControl;
