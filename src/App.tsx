import { useState } from "react";
import {
  Container,
  IconButton,
  Image,
  Heading,
  VStack,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";

import { AudioPlayerContext } from "./context/audioPlayerContext";

import { BsFillHeartFill } from "react-icons/bs";
import AudioPlayer from "./components/audioPlayer";

import { songs } from "./dummyData/song";

function App() {
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
  };

  return (
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
      <AudioPlayerContext.Provider>
        <AudioPlayer
          isShuffle={isShuffle}
          onNextSong={handleNextSong}
          onPreviousSong={handlePreviousSong}
          onShuffleSong={handleShuffleSong}
          src={url}
        />
      </AudioPlayerContext.Provider>
    </Container>
  );
}

export default App;
