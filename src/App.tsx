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
  Spinner,
} from "@chakra-ui/react";

import { useMachine } from "@xstate/react";
import { audioPlayerMachine } from "./machines/audioPlayerMachine";

import {
  BsVolumeDown,
  BsFillVolumeMuteFill,
  BsRepeat,
  BsRepeat1,
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

type Song = {
  id: string;
  title: string;
  url: string;
  image: string;
};

function App() {
  const [state, send, service] = useMachine(audioPlayerMachine);
  const songs: Song[] = [
    {
      id: "1",
      title: "Memories",
      url: "https://www.bensound.com/bensound-music/bensound-memories.mp3",
      image: "https://www.bensound.com/bensound-img/memories.jpg",
    },
    {
      id: "2",
      title: "Funky Suspense",
      url: "https://www.bensound.com/bensound-music/bensound-funkysuspense.mp3",
      image: "https://www.bensound.com/bensound-img/funkysuspense.jpg",
    },
    {
      id: "3",
      title: "Jazz Piano",
      url: "https://www.bensound.com/bensound-music/bensound-jazzpiano.mp3",
      image: "https://www.bensound.com/bensound-img/jazzpiano.jpg",
    },
    {
      id: "4",
      title: "Happiness",
      url: "https://www.bensound.com/bensound-music/bensound-happiness.mp3",
      image: "https://www.bensound.com/bensound-img/happiness.jpg",
    },
    {
      id: "5",
      title: "Ukulele",
      url: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
      image: "https://www.bensound.com/bensound-img/ukulele.jpg",
    },
    {
      id: "6",
      title: "Little Idea",
      url: "https://www.bensound.com/bensound-music/bensound-littleidea.mp3",
      image: "https://www.bensound.com/bensound-img/littleidea.jpg",
    },
    {
      id: "7",
      title: "Tenderness",
      url: "https://www.bensound.com/bensound-music/bensound-tenderness.mp3",
      image: "https://www.bensound.com/bensound-img/tenderness.jpg",
    },
    {
      id: "8",
      title: "Acoustic Breeze",
      url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
      image: "https://www.bensound.com/bensound-img/acousticbreeze.jpg",
    },
    {
      id: "9",
      title: "Cute",
      url: "https://www.bensound.com/bensound-music/bensound-cute.mp3",
      image: "https://www.bensound.com/bensound-img/cute.jpg",
    },
    {
      id: "10",
      title: "Creative Minds",
      url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
      image: "https://www.bensound.com/bensound-img/creativeminds.jpg",
    },
  ];

  const [selectedSong, setSelectedSong] = useState<number>(0);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  const { image, title, url, id } = songs[selectedSong];

  const handleLikeSong = (id: string) => {
    if (likedSongs.includes(id)) {
      setLikedSongs(likedSongs.filter((songId) => songId !== id));
    } else {
      setLikedSongs([...likedSongs, id]);
    }
  };

  const handleShuffleSong = () => {
    setIsShuffle(!isShuffle);
  };

  const handleNextSong = () => {
    const randomNumber = Math.floor(Math.random() * songs.length);

    if (isShuffle) {
      setSelectedSong(randomNumber);
    } else if (selectedSong === songs.length - 1) {
      setSelectedSong(0);
    } else {
      setSelectedSong(selectedSong + 1);
    }

    send({ type: "RESET" });
  };

  const handlePreviousSong = () => {
    const randomSong = Math.floor(Math.random() * songs.length);
    if (isShuffle) {
      setSelectedSong(randomSong);
    } else if (selectedSong === 0) {
      setSelectedSong(songs.length - 1);
    } else {
      setSelectedSong(selectedSong - 1);
    }

    send({ type: "RESET" });
  };

  const handleRepeatSong = () => {
    send({ type: "SET_LOOP" });
  };

  const { currentAudio, elapsed } = state.context;

  useEffect(() => {
    send({ type: "SET_AUDIO", audioUrl: url });
  }, [selectedSong, send]);

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
    <>
      {state.matches("loading") && state.matches("loading") ? (
        <Container centerContent minH="100vh" justifyContent="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Container>
      ) : (
        <Container centerContent minH="100vh" justifyContent="center">
          <Heading size="md">Playing Now</Heading>
          <Image
            pt="8"
            src={image}
            alt={title}
            objectFit="cover"
            width={280}
            height={300}
          />

          <Flex alignItems="center" justifyContent="space-between" minW="300px">
            <Box />
            <VStack pl="10">
              <Heading size="md" textAlign="center" pt="8">
                {title}
              </Heading>
              <Text>Ben Sound</Text>
            </VStack>

            <IconButton
              onClick={() => {
                handleLikeSong(id);
              }}
              _hover={{ bg: "none" }}
              variant="ghost"
              colorScheme={likedSongs.includes(id) ? "orange" : "whiteAlpha"}
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
                onClick={handleShuffleSong}
                variant="ghost"
                colorScheme="whiteAlpha"
                {...(isShuffle && { color: "white" })}
                size="lg"
                aria-label="shuffle"
                fontSize="20px"
                icon={<BsShuffle />}
              />
              <IconButton
                // TODO: handle repeat song logic when next and previous song is clicked
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
              onClick={handlePreviousSong}
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
              onClick={handleNextSong}
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
      )}
    </>
  );
}

export default App;
