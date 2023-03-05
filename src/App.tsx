import { useEffect, useState } from "react";
import {
  Container,
  IconButton,
  Image,
  Heading,
  VStack,
  Text,
  HStack,
  Flex,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

import { useMachine } from "@xstate/react";
import { audioPlayerMachine } from "./machines/audioPlayerMachine";

import {
  BsVolumeDown,
  BsFillVolumeMuteFill,
  BsRepeat,
  BsShuffle,
  BsFillHeartFill,
} from "react-icons/bs";
import {
  MdGraphicEq,
  MdOutlineSkipNext,
  MdOutlineSkipPrevious,
  MdPause,
  MdPlayArrow,
} from "react-icons/md";

function App() {
  const [state, send, service] = useMachine(audioPlayerMachine);
  const src = "https://www.bensound.com/bensound-music/bensound-memories.mp3";

  const { elapsed, currentAudio } = state.context;

  const [sliderCurrentTime, setSliderCurrentTime] = useState(
    Math.floor(elapsed)
  );

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

  const handleMute = () => {
    send("MUTE");
  };

  const handleUnmute = () => {
    send("UNMUTE");
  };

  const handleAdjustVolume = (volume: number) => {
    send({ type: "ADJUST_VOLUME", volume });
  };

  const handleAdjustCurrentTime = (currentTime: number) => {
    setSliderCurrentTime(currentTime);
    send({ type: "SET_CURRENT_TIME", currentTime });
  };

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <Container centerContent minH="100vh" justifyContent="center">
      <Heading size="md">Playing Now</Heading>
      <Image
        pt="8"
        src="https://bit.ly/naruto-sage"
        alt="naruto"
        objectFit="cover"
        width={280}
        height={300}
      />

      <Flex alignItems="center" justifyContent="space-between" minW="300px">
        <Box />
        <VStack pl="10">
          <Heading size="md" textAlign="center" pt="8">
            Song Title
          </Heading>
          <Text>Artis Name</Text>
        </VStack>

        <IconButton
          variant="ghost"
          colorScheme="whiteAlpha"
          size="lg"
          aria-label="like"
          fontSize="20px"
          icon={<BsFillHeartFill />}
        />
      </Flex>

      <Flex
        justifyContent="space-between"
        alignItems="center"
        minW="300px"
        pt="4"
      >
        <VStack>
          <Slider
            aria-label="slider-ex-3"
            value={currentAudio?.volume}
            defaultValue={currentAudio?.volume}
            onChange={handleAdjustVolume}
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

          {currentAudio?.muted ? (
            <IconButton
              onClick={handleUnmute}
              variant="ghost"
              colorScheme="whiteAlpha"
              size="lg"
              aria-label="audio"
              fontSize="30px"
              icon={<BsFillVolumeMuteFill />}
            />
          ) : (
            <IconButton
              onClick={handleMute}
              variant="ghost"
              colorScheme="whiteAlpha"
              size="lg"
              aria-label="audio"
              fontSize="30px"
              icon={<BsVolumeDown />}
            />
          )}
        </VStack>

        <HStack>
          <IconButton
            variant="ghost"
            colorScheme="whiteAlpha"
            size="lg"
            aria-label="shuffle"
            fontSize="20px"
            icon={<BsShuffle />}
          />
          <IconButton
            variant="ghost"
            colorScheme="whiteAlpha"
            size="lg"
            aria-label="repeat"
            fontSize="20px"
            icon={<BsRepeat />}
          />
        </HStack>
      </Flex>

      <Flex
        justifyContent="space-between"
        minW="300px"
        alignItems="center"
        mt="4"
      >
        <Text>{formatTime(Math.floor(elapsed))}</Text>
        <Text>{formatTime(currentAudio?.duration || 0)}</Text>
      </Flex>

      <Box minW="300px" mt="4">
        <Slider
          aria-label="slider-ex-4"
          value={sliderCurrentTime}
          onChange={handleAdjustCurrentTime}
          min={0}
          max={currentAudio?.duration}
        >
          <SliderTrack bg="red.100">
            <SliderFilledTrack bg="white" />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box color="rgba(165, 192, 255, 0.7)" as={MdGraphicEq} />
          </SliderThumb>
        </Slider>
      </Box>

      <HStack mt="2" justifyContent="space-between" minW="200px">
        <IconButton
          variant="ghost"
          colorScheme="whiteAlpha"
          color="white"
          size="lg"
          aria-label="previous"
          fontSize="36px"
          icon={<MdOutlineSkipPrevious />}
        />
        {state.matches("playing") ? (
          <IconButton
            variant="ghost"
            colorScheme="whiteAlpha"
            color="white"
            size="lg"
            aria-label="pause"
            fontSize="36px"
            onClick={handlePause}
            icon={<MdPause />}
          />
        ) : (
          <IconButton
            variant="ghost"
            colorScheme="whiteAlpha"
            color="white"
            size="lg"
            aria-label="play"
            fontSize="36px"
            onClick={handlePlay}
            icon={<MdPlayArrow />}
          />
        )}

        <IconButton
          variant="ghost"
          colorScheme="whiteAlpha"
          color="white"
          size="lg"
          aria-label="next"
          fontSize="36px"
          icon={<MdOutlineSkipNext />}
        />
      </HStack>
    </Container>
  );
}

export default App;
