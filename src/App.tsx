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
import {
  BsVolumeDown,
  BsRepeat,
  BsShuffle,
  BsFillHeartFill,
} from "react-icons/bs";
import {
  MdGraphicEq,
  MdOutlineSkipNext,
  MdOutlineSkipPrevious,
  MdPause,
} from "react-icons/md";

function App() {
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
        <IconButton
          variant="ghost"
          colorScheme="whiteAlpha"
          size="lg"
          aria-label="audio"
          fontSize="30px"
          icon={<BsVolumeDown />}
        />
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
        <Text>00:00</Text>
        <Text>04:00</Text>
      </Flex>

      <Box minW="300px" mt="4">
        <Slider aria-label="slider-ex-4" defaultValue={30}>
          <SliderTrack bg="red.100">
            <SliderFilledTrack bg="white" />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box color="rgba(165, 192, 255, 0.7)" as={MdGraphicEq} />
          </SliderThumb>
        </Slider>
      </Box>

      <HStack mt="8" justifyContent="space-between" minW="200px">
        <IconButton
          variant="ghost"
          color="white"
          size="lg"
          aria-label="previous"
          fontSize="36px"
          icon={<MdOutlineSkipPrevious />}
        />
        <IconButton
          variant="ghost"
          color="white"
          size="lg"
          aria-label="pause"
          fontSize="36px"
          icon={<MdPause />}
        />
        <IconButton
          variant="ghost"
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
