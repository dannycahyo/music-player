import { useEffect } from "react";
import {
  IconButton,
  Text,
  HStack,
  Flex,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";

import { AudioPlayerContext } from "../../context/audioPlayerContext";
import VolumeControl from "./VolumeControl";

import { BsRepeat, BsRepeat1, BsShuffle } from "react-icons/bs";
import {
  MdGraphicEq,
  MdOutlineSkipNext,
  MdOutlineSkipPrevious,
  MdPause,
  MdPlayArrow,
} from "react-icons/md";

import type React from "react";

type AudioPlayerProps = {
  src: string;
  onNextSong: () => void;
  onPreviousSong: () => void;
  isShuffle: boolean;
  onShuffleSong: () => void;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  isShuffle,
  onNextSong,
  onPreviousSong,
  onShuffleSong,
}) => {
  const [state, send] = AudioPlayerContext.useActor();

  const { currentAudio, elapsed, audioErrorMessage } = state.context;

  const [isPlaying, isLoading, isError] = [
    state.matches("playing"),
    state.matches("loading"),
    state.matches("error"),
  ];

  const handleRepeatSong = () => send({ type: "SET_LOOP" });

  const handlePlay = () => send("PLAY");

  const handlePause = () => send("PAUSE");

  const handleMute = () => send("MUTE");

  const handleUnmute = () => send("UNMUTE");

  const handleAdjustVolume = (volume: number) =>
    send({ type: "ADJUST_VOLUME", volume });

  const handleAdjustCurrentTime = (currentTime: number) =>
    send({ type: "SET_CURRENT_TIME", currentTime });

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  useEffect(() => {
    send({ type: "SET_AUDIO", src });
  }, [src]);

  return (
    <Box>
      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          mt="6"
        />
      ) : (
        <>
          {isError && (
            <Alert status="error" my="6" width="80">
              <AlertIcon />
              <AlertTitle
                width="80"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                position="relative"
              >{`Upss, ${
                audioErrorMessage || "Something went wrong!"
              }`}</AlertTitle>
            </Alert>
          )}
          <Flex justifyContent="space-between" alignItems="center" minW="300px">
            <VolumeControl
              currentAudio={currentAudio}
              onMute={handleMute}
              onUnmute={handleUnmute}
              onVolumeChange={handleAdjustVolume}
            />
            <HStack>
              <IconButton
                onClick={onShuffleSong}
                variant="ghost"
                colorScheme="whiteAlpha"
                {...(isShuffle && { color: "white" })}
                size="lg"
                aria-label="shuffle"
                fontSize="20px"
                icon={<BsShuffle />}
              />
              <IconButton
                onClick={handleRepeatSong}
                variant="ghost"
                colorScheme="whiteAlpha"
                {...(currentAudio?.loop && { color: "white" })}
                size="lg"
                aria-label="repeat"
                fontSize="20px"
                icon={currentAudio?.loop ? <BsRepeat1 /> : <BsRepeat />}
              />
            </HStack>
          </Flex>
          <Flex
            justifyContent="space-between"
            minW="300px"
            alignItems="center"
            mt="4"
          >
            <Text>{formatTime(elapsed)}</Text>
            <Text>{formatTime(currentAudio?.duration || 0)}</Text>
          </Flex>
          <Box minW="300px" mt="4">
            <Slider
              aria-label="slider-ex-4"
              value={elapsed}
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
              onClick={() => {
                onPreviousSong();
                send({ type: "RESET" });
              }}
              variant="ghost"
              colorScheme="whiteAlpha"
              color="white"
              size="lg"
              aria-label="previous"
              fontSize="36px"
              icon={<MdOutlineSkipPrevious />}
            />
            {isPlaying ? (
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
              onClick={() => {
                onNextSong();
                send({ type: "RESET" });
              }}
              variant="ghost"
              colorScheme="whiteAlpha"
              color="white"
              size="lg"
              aria-label="next"
              fontSize="36px"
              icon={<MdOutlineSkipNext />}
            />
          </HStack>
        </>
      )}
    </Box>
  );
};

export default AudioPlayer;
