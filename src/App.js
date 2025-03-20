import React, { useState, useEffect, useRef } from "react";
import {
  PlaneTakeoff,
  PlaneLanding,
  UserPlus,
  PhoneCall,
  Calendar,
  MapPin,
  User,
  Info,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Luggage,
  Map,
  LandPlot,
  Globe,
  Building,
  Clock,
  PersonStanding,
  Users,
  UserCheck,
  HeartHandshake
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
  useAuth,
  useClerk,
} from "@clerk/clerk-react";
import InputMask from 'react-input-mask';
import { FaBars } from 'react-icons/fa';
import { Helmet } from "react-helmet";
import { parseISO, isWithinInterval } from 'date-fns';
import {
  ChakraProvider,
  Box,
  Flex,
  Container,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  HStack,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Divider,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  GridItem,
  Link,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  InputGroup,
  InputLeftElement,
  extendTheme,
} from "@chakra-ui/react";

// API URL
const API_URL = "https://server-chi-blush.vercel.app/api";

// Create Chakra theme
const theme = extendTheme({
  colors: {
    brand: {
      50: "#e0f7fa",
      100: "#b2ebf2",
      200: "#80deea",
      300: "#4dd0e1",
      400: "#26c6da",
      500: "#00bcd4",
      600: "#00acc1",
      700: "#0097a7",
      800: "#00838f",
      900: "#006064",
    },
    accent: {
      50: "#fff8e1",
      100: "#ffecb3",
      200: "#ffe082",
      300: "#ffd54f",
      400: "#ffca28",
      500: "#ffc107",
      600: "#ffb300",
      700: "#ffa000",
      800: "#ff8f00",
      900: "#ff6f00",
    },
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f44336",
    background: {
      light: "#f8fdff",
      dark: "#1a202c"
    }
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  config: {
    initialColorMode: 'light',
  },
  styles: {
    global: {
      body: {
        bg: 'background.light',
        color: 'gray.800',
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'brand.700',
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        accent: {
          bg: 'accent.500',
          color: 'white',
          _hover: {
            bg: 'accent.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'accent.700',
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s ease-in-out',
        }
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'md',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          _hover: {
            boxShadow: 'lg',
          },
        }
      }
    }
  }
});

const SkyMatesSimple = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { openSignIn, signOut } = useClerk();
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInReason, setSignInReason] = useState("");
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    age: "",
    date: "",
    fromCity: "",
    toCity: "",
    phone: "",
    airlines: "",
    comments: "",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const formRef = useRef(null);
  
  // Add these hooks at the top of the component
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    try {
      const response = await fetch(`${API_URL}/passengers`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPassengers(data);
    } catch (error) {
      console.error("Error fetching passengers:", error);
      alert("Failed to load passengers. Please try again later.");
      // Set passengers to an empty array instead of using setError
      setPassengers([]);
    }
  };

  const handleInputChange = (e, value = null) => {
    let name, inputValue;
    
    if (e && e.target) {
      // Regular input change
      ({ name, value: inputValue } = e.target);
    } else if (typeof e === 'string' && value !== null) {
      // Phone input mask
      name = e;
      inputValue = value;
    } else {
      console.error('Invalid input in handleInputChange');
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'age' ? (inputValue === '' ? '' : Number(inputValue)) : inputValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const dataToSend = {
        name: formData.name,
        age: parseInt(formData.age),
        type: formData.type,
        date: formData.date,
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        phone: formData.phone,
        email: user.primaryEmailAddress.emailAddress, // Add this line
        airlines: formData.airlines,
        comments: formData.comments
      };
      console.log("Submitting form data:", dataToSend);
      const response = await fetch(`${API_URL}/passengers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        throw new Error(errorData.details || "Failed to add passenger");
      }
      const newPassenger = await response.json();
      console.log("New passenger added:", newPassenger);

      // Fetch the updated list of passengers
      await fetchPassengers();

      setFormData({
        type: "",
        name: "",
        age: "",
        date: "",
        fromCity: "",
        toCity: "",
        phone: "",
        airlines: "",
        comments: "",
      });
      // Add a success message
      alert("Passenger added successfully!");
    } catch (error) {
      console.error("Error adding passenger:", error);
      setError(`Failed to add passenger: ${error.message}`);
      // Display the error to the user
      alert(`Error: ${error.message}`);
    }
  };

  const handleContact = () => {
    setShowContactPopup(true);
  };

  const handleAddPassengerClick = () => {
    if (!user) {
      setSignInReason("add");
      setShowSignIn(true);
    } else {
      // Scroll to the form
      formRef.current.scrollIntoView({ behavior: 'smooth' });
      // Pre-select "Willing to be a friend"
      setFormData(prevData => ({
        ...prevData,
        type: "beFriend"
      }));
    }
  };

  const formatName = (fullName) => {
    if (!user) {
      const names = fullName.split(' ');
      if (names.length > 1) {
        return names[0] + ' ' + '*'.repeat(names.slice(1).join(' ').length);
      }
      return fullName; // Return the full name if it's just one word
    }
    return fullName;
  };

  const handleSignIn = () => {
    if (!user) {
      openSignIn();
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  const filterPassengersByDateRange = (passenger) => {
    if (!dateFilter.start && !dateFilter.end) return true;
    const passengerDate = parseISO(passenger.date);
    const startDate = dateFilter.start ? parseISO(dateFilter.start) : null;
    const endDate = dateFilter.end ? parseISO(dateFilter.end) : null;

    if (startDate && endDate) {
      return isWithinInterval(passengerDate, { start: startDate, end: endDate });
    } else if (startDate) {
      return passengerDate >= startDate;
    } else if (endDate) {
      return passengerDate <= endDate;
    }
    return true;
  };

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (window.location.pathname === '/contact') {
    return (
      <Box minH="100vh" bg="gray.50">
        <Helmet>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </Helmet>
        <Box as="header" bg="linear-gradient(to right, #4299E1, #5E5CE6)" color="white" py={4} px={6} shadow="md">
          <Heading as="h1" size="xl" display="flex" alignItems="center">
            <Box as={PlaneTakeoff} mr={2} />
            SkyMates.co - Contact Us
          </Heading>
        </Box>
        <Container as="main" maxW="container.lg" py={8} px={4}>
          <Card bg="white" bgOpacity={0.8} backdropFilter="blur(10px)" shadow="lg" rounded="lg" overflow="hidden" p={6}>
            <Heading as="h2" size="lg" mb={4} color="blue.600">Contact Information</Heading>
            <Text mb={2}><strong>Email:</strong> skymatesco@gmail.com</Text>
            <Text><strong>Phone:</strong> +1 714-485-9360</Text>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDir="column" bg="white">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      {/* Header */}
      <Box bg="linear-gradient(to right, #3182CE, #4F46E5)" color="white" py={4} px={6} shadow="md">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Link href="/" _hover={{ textDecor: 'none', color: 'blue.100' }} transition="all 0.3s">
              <Heading as="h1" size="lg" display="flex" alignItems="center">
                <Box as={PlaneTakeoff} mr={2} />
                SkyMates.co
              </Heading>
            </Link>
            
            {/* Mobile menu button */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              ref={btnRef}
              colorScheme="whiteAlpha"
              aria-label="Open menu"
              icon={<FaBars />}
              onClick={onOpen}
            />
            
            {/* Desktop navigation */}
            <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
              <Link href="/" color="white" _hover={{ color: 'blue.100' }} fontWeight="medium">Home</Link>
              <Link href="#about" color="white" _hover={{ color: 'blue.100' }} fontWeight="medium">About</Link>
              <Link href="/contact" color="white" _hover={{ color: 'blue.100' }} fontWeight="medium" onClick={handleContact}>Contact</Link>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Button 
                  onClick={() => setShowSignIn(true)} 
                  colorScheme="whiteAlpha" 
                  variant="solid" 
                  size="md"
                >
                  Sign In
                </Button>
              </SignedOut>
            </HStack>
          </Flex>
        </Container>
      </Box>
      
      {/* Mobile navigation drawer */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={4}>
              <Link href="/" fontWeight="medium" onClick={onClose}>Home</Link>
              <Link href="#about" fontWeight="medium" onClick={onClose}>About</Link>
              <Link href="/contact" fontWeight="medium" onClick={() => { handleContact(); onClose(); }}>Contact</Link>
              <Divider />
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Button 
                  onClick={() => { setShowSignIn(true); onClose(); }} 
                  colorScheme="blue" 
                  size="md" 
                  width="full"
                >
                  Sign In
                </Button>
              </SignedOut>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* First Hero Section - Modern Design */}
      <Box 
        bg="linear-gradient(135deg, #00bcd4 0%, #006064 100%)" 
        color="white" 
        py={{ base: 16, md: 24 }} 
        px={4}
        position="relative"
        overflow="hidden"
      >
        <Box 
          position="absolute" 
          top={0} 
          left={0} 
          right={0} 
          bottom={0} 
          opacity={0.15} 
          bgImage="url('https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')"
          bgSize="cover"
          bgPosition="center"
        />
        <Container maxW="container.xl" position="relative">
          <Box 
            maxW={{ base: "100%", md: "70%" }}
            textAlign={{ base: "center", md: "left" }}
            position="relative"
            zIndex={1}
          >
            <Box
              as="span"
              display="inline-block"
              color="accent.400"
              fontWeight="bold"
              mb={3}
              fontSize="lg"
              animation="fadeIn 0.8s ease-in"
            >
              <Box as={PlaneTakeoff} display="inline-block" mr={2} verticalAlign="middle" /> Travel with Confidence
            </Box>
            <Heading 
              as="h1" 
              size={{ base: "xl", md: "2xl" }} 
              mb={4}
              lineHeight="1.2"
              fontWeight="extrabold"
              animation="fadeInUp 0.6s ease-out"
            >
              Connect Nepali Elderly Travelers with Compassionate Volunteers
            </Heading>
            <Text 
              fontSize={{ base: "md", md: "xl" }} 
              mb={6}
              fontWeight="medium"
              opacity={0.9}
              animation="fadeInUp 0.8s ease-out"
            >
              Never travel alone. Find friendly companions who speak your language and understand your culture - completely free through our community volunteer network.
            </Text>
            <HStack 
              spacing={4} 
              justify={{ base: "center", md: "flex-start" }}
              animation="fadeInUp 1s ease-out"
            >
              <Button
                size="lg"
                variant="accent"
                px={8}
                py={6}
                rounded="full"
                onClick={handleAddPassengerClick}
                _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
                transition="all 0.3s ease"
              >
                Find a Companion
              </Button>
              <Button
                size="lg"
                variant="outline"
                px={8}
                py={6}
                rounded="full"
                color="white"
                borderColor="white"
                _hover={{ bg: "whiteAlpha.200", transform: "translateY(-5px)" }}
                transition="all 0.3s ease"
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              >
                Learn How It Works
              </Button>
            </HStack>
          </Box>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box bg="background.light" py={10} px={4}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Card 
              textAlign="center" 
              py={6} 
              bg="white"
              _hover={{ transform: "translateY(-10px)" }}
              transition="all 0.3s ease"
            >
              <CardBody>
                <Box 
                  as="span" 
                  fontSize="4xl" 
                  fontWeight="bold" 
                  color="brand.500"
                  display="block"
                  mb={2}
                >
                  <Box as={Users} mx="auto" size={40} />
                  <Text mt={2}>500+</Text>
                </Box>
                <Text fontSize="lg" fontWeight="medium">Successful Matches</Text>
                <Text fontSize="sm" color="gray.600">Helping elders travel with peace of mind</Text>
              </CardBody>
            </Card>
            <Card 
              textAlign="center" 
              py={6}
              bg="white"
              _hover={{ transform: "translateY(-10px)" }}
              transition="all 0.3s ease"
            >
              <CardBody>
                <Box 
                  as="span" 
                  fontSize="4xl" 
                  fontWeight="bold" 
                  color="brand.500"
                  display="block"
                  mb={2}
                >
                  <Box as={HeartHandshake} mx="auto" size={40} />
                </Box>
                <Text fontSize="lg" fontWeight="medium">Community Service</Text>
                <Text fontSize="sm" color="gray.600">Volunteer to help others in your community</Text>
              </CardBody>
            </Card>
            <Card 
              textAlign="center" 
              py={6}
              bg="white"
              _hover={{ transform: "translateY(-10px)" }}
              transition="all 0.3s ease"
            >
              <CardBody>
                <Box 
                  as="span" 
                  fontSize="4xl" 
                  fontWeight="bold" 
                  color="brand.500"
                  display="block"
                  mb={2}
                >
                  <Box as={UserCheck} mx="auto" size={40} />
                  <Text mt={2}>98%</Text>
                </Box>
                <Text fontSize="lg" fontWeight="medium">Satisfaction Rate</Text>
                <Text fontSize="sm" color="gray.600">From travelers and companions alike</Text>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box 
        id="how-it-works"
        bg="linear-gradient(135deg, #ffd54f 0%, #ff9800 100%)" 
        color="gray.800" 
        py={16} 
        px={4}
      >
        <Container maxW="container.lg" textAlign="center">
          <Heading as="h2" size={{ base: "lg", md: "xl" }} mb={12} color="gray.800">
            How SkyMates Works
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <VStack
              spacing={4}
              opacity={0}
              animation="fadeInUp 0.5s ease-out forwards"
              animationDelay="0.1s"
            >
              <Box 
                bg="white" 
                w="80px" 
                h="80px" 
                rounded="full" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                mb={4}
                boxShadow="md"
              >
                <Box as={User} size={30} color="accent.500" />
              </Box>
              <Heading as="h3" size="md">Sign Up</Heading>
              <Text>
                Create your profile, share your travel details, and select whether you need a companion or want to volunteer as one.
              </Text>
            </VStack>
            
            <VStack
              spacing={4}
              opacity={0}
              animation="fadeInUp 0.5s ease-out forwards"
              animationDelay="0.3s"
            >
              <Box 
                bg="white" 
                w="80px" 
                h="80px" 
                rounded="full" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                mb={4}
                boxShadow="md"
              >
                <Box as={PlaneTakeoff} size={30} color="accent.500" />
              </Box>
              <Heading as="h3" size="md">Get Matched</Heading>
              <Text>
                We'll connect you with a volunteer traveling on the same flight who shares your language and culture, at no cost to either party.
              </Text>
            </VStack>
            
            <VStack
              spacing={4}
              opacity={0}
              animation="fadeInUp 0.5s ease-out forwards"
              animationDelay="0.5s"
            >
              <Box 
                bg="white" 
                w="80px" 
                h="80px" 
                rounded="full" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                mb={4}
                boxShadow="md"
              >
                <Box as={UserPlus} size={30} color="accent.500" />
              </Box>
              <Heading as="h3" size="md">Travel Together</Heading>
              <Text>
                Meet at the airport and enjoy a comfortable, worry-free journey with a friendly volunteer who's happy to help.
              </Text>
            </VStack>
          </SimpleGrid>
          
          <Button
            mt={12}
            size="lg"
            variant="solid"
            bg="white"
            color="accent.600"
            _hover={{ bg: "gray.100", transform: "translateY(-2px)" }}
            rounded="full"
            px={8}
            onClick={handleAddPassengerClick}
            boxShadow="md"
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
      
      {/* Main content */}
      <Container as="main" maxW="container.xl" py={8} px={4}>
        <Box maxW="4xl" mx="auto">
          {/* Add Passenger Panel - Enhanced Design */}
          <Card 
            ref={formRef} 
            mb={12} 
            shadow="xl" 
            rounded="xl" 
            overflow="hidden"
            borderTop="4px solid"
            borderColor="brand.400"
            bg="white"
            transform="translateY(0)"
            transition="transform 0.3s ease, box-shadow 0.3s ease"
            _hover={{ transform: "translateY(-5px)", boxShadow: "2xl" }}
          >
            <CardBody p={{ base: 6, md: 8 }}>
              <SignedIn>
                <Heading 
                  as="h2" 
                  size="lg" 
                  mb={6} 
                  color="brand.500" 
                  display="flex" 
                  alignItems="center"
                  fontWeight="bold"
                >
                  <Box as={UserPlus} mr={3} />
                  Add Your Travel Details
                </Heading>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={6} align="stretch">
                    <Box 
                      bg="brand.50" 
                      p={4} 
                      rounded="md" 
                      borderLeft="4px solid" 
                      borderColor="brand.300"
                    >
                      <RadioGroup 
                        value={formData.type} 
                        onChange={(val) => setFormData({...formData, type: val})}
                        isRequired
                      >
                        <Stack direction={{ base: "column", md: "row" }} spacing={6} justifyContent="center">
                          <Radio value="needFriend" colorScheme="cyan">
                            <HStack>
                              <Box as={User} color="brand.500" />
                              <Text fontWeight="medium">Looking for a companion</Text>
                            </HStack>
                          </Radio>
                          <Radio value="beFriend" colorScheme="cyan">
                            <HStack>
                              <Box as={UserPlus} color="brand.500" />
                              <Text fontWeight="medium">Willing to be a companion</Text>
                            </HStack>
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                      <FormControl isRequired>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <Box as={User} color="brand.400" />
                          </InputLeftElement>
                          <Input 
                            type="text" 
                            name="name" 
                            placeholder="Full Name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            bg="gray.50"
                            _hover={{ bg: "gray.100" }}
                            transition="all 0.2s"
                            borderColor="gray.300"
                          />
                        </InputGroup>
                      </FormControl>
                      
                      <FormControl isRequired>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <Box as={Info} color="brand.400" />
                          </InputLeftElement>
                          <Input 
                            type="number" 
                            name="age" 
                            placeholder="Age" 
                            value={formData.age}
                            onChange={handleInputChange}
                            bg="gray.50"
                            _hover={{ bg: "gray.100" }}
                            transition="all 0.2s"
                            borderColor="gray.300"
                          />
                        </InputGroup>
                      </FormControl>
                      
                      <FormControl isRequired>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <Box as={Calendar} color="brand.400" />
                          </InputLeftElement>
                          <Input 
                            type="date" 
                            name="date" 
                            placeholder="Date" 
                            value={formData.date}
                            onChange={handleInputChange}
                            bg="gray.50"
                            _hover={{ bg: "gray.100" }}
                            transition="all 0.2s"
                            borderColor="gray.300"
                          />
                        </InputGroup>
                      </FormControl>
                      
                      <FormControl isRequired>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <Box as={MapPin} color="brand.400" />
                          </InputLeftElement>
                          <Input 
                            type="text" 
                            name="fromCity" 
                            placeholder="Departure City" 
                            value={formData.fromCity}
                            onChange={handleInputChange}
                            bg="gray.50"
                            _hover={{ bg: "gray.100" }}
                            transition="all 0.2s"
                            borderColor="gray.300"
                          />
                        </InputGroup>
                      </FormControl>
                      
                      <FormControl isRequired>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <Box as={MapPin} color="brand.400" />
                          </InputLeftElement>
                          <Input 
                            type="text" 
                            name="toCity" 
                            placeholder="Arrival City" 
                            value={formData.toCity}
                            onChange={handleInputChange}
                            bg="gray.50"
                            _hover={{ bg: "gray.100" }}
                            transition="all 0.2s"
                            borderColor="gray.300"
                          />
                        </InputGroup>
                      </FormControl>
                      
                      <FormControl isRequired>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <Box as={PlaneTakeoff} color="brand.400" />
                          </InputLeftElement>
                          <Input 
                            type="text" 
                            name="airlines" 
                            placeholder="Airlines" 
                            value={formData.airlines}
                            onChange={handleInputChange}
                            bg="gray.50"
                            _hover={{ bg: "gray.100" }}
                            transition="all 0.2s"
                            borderColor="gray.300"
                          />
                        </InputGroup>
                      </FormControl>
                      
                      <FormControl isRequired>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <Box as={PhoneCall} color="brand.400" />
                          </InputLeftElement>
                          <Input
                            as={InputMask}
                            mask="(999) 999-9999"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="(123) 456-7890"
                            bg="gray.50"
                            _hover={{ bg: "gray.100" }}
                            transition="all 0.2s"
                            borderColor="gray.300"
                          />
                        </InputGroup>
                      </FormControl>
                    </SimpleGrid>
                    
                    <FormControl>
                      <FormLabel htmlFor="comments" fontWeight="medium">Comments/Notes (Optional)</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none" alignItems="flex-start" h="auto" pt={2}>
                          <Box as={MessageSquare} color="brand.400" />
                        </InputLeftElement>
                        <Textarea
                          id="comments"
                          name="comments"
                          rows={3}
                          pl={10}
                          placeholder="Any additional information or special needs"
                          value={formData.comments}
                          onChange={handleInputChange}
                          resize="none"
                          bg="gray.50"
                          _hover={{ bg: "gray.100" }}
                          transition="all 0.2s"
                          borderColor="gray.300"
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <Button
                      type="submit"
                      colorScheme="brand"
                      bg="brand.500"
                      size="lg"
                      leftIcon={<UserPlus size={20} />}
                      w="full"
                      py={6}
                      _hover={{ 
                        transform: "translateY(-2px)",
                        boxShadow: "lg", 
                        bg: "brand.600" 
                      }}
                      transition="all 0.2s ease"
                    >
                      Add Travel Details
                    </Button>
                  </VStack>
                </form>
              </SignedIn>
              <SignedOut>
                <VStack spacing={6} align="stretch" p={4}>
                  <Box textAlign="center">
                    <Heading as="h3" size="md" mb={4} color="brand.500">
                      Sign In to Add Travel Details
                    </Heading>
                    <Text color="gray.600" mb={6}>
                      Join SkyMates to connect with travel companions or offer your help to others.
                    </Text>
                  </Box>
                  <Button
                    onClick={handleAddPassengerClick}
                    colorScheme="brand"
                    bg="brand.500"
                    size="lg"
                    leftIcon={<UserPlus size={20} />}
                    w="full"
                    py={6}
                    _hover={{ 
                      transform: "translateY(-2px)",
                      boxShadow: "lg", 
                      bg: "brand.600" 
                    }}
                    transition="all 0.2s ease"
                  >
                    Sign In to Continue
                  </Button>
                </VStack>
              </SignedOut>
            </CardBody>
          </Card>

          {/* Passenger Lists - Enhanced Design */}
          <Box mt={16}>
            <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
            {(dateFilter.start || dateFilter.end) && (
              <Flex 
                mb={4} 
                bg="brand.50" 
                color="brand.700" 
                p={3} 
                rounded="md" 
                alignItems="center" 
                justifyContent="space-between"
                direction={{ base: "column", sm: "row" }}
              >
                <Text mb={{ base: 2, sm: 0 }}>
                  Showing results for: 
                  {dateFilter.start && dateFilter.end
                    ? ` ${dateFilter.start} to ${dateFilter.end}`
                    : dateFilter.start
                    ? ` From ${dateFilter.start}`
                    : ` Until ${dateFilter.end}`}
                </Text>
                <Button
                  onClick={() => setDateFilter({ start: "", end: "" })}
                  variant="link"
                  color="brand.600"
                  _hover={{ color: "brand.800" }}
                  size="sm"
                >
                  Clear filter
                </Button>
              </Flex>
            )}
            
            <VStack spacing={12}>
              {["beFriend", "needFriend"].map((groupType) => (
                <Card 
                  key={groupType} 
                  w="full" 
                  shadow="lg" 
                  rounded="xl" 
                  overflow="hidden"
                  borderTop="4px solid"
                  borderColor={groupType === "beFriend" ? "brand.400" : "accent.400"}
                >
                  <CardBody p={{ base: 4, md: 6 }}>
                    <Heading 
                      as="h2" 
                      size="lg" 
                      mb={6} 
                      color={groupType === "beFriend" ? "brand.500" : "accent.500"} 
                      display="flex" 
                      alignItems="center"
                    >
                      {groupType === "beFriend" ? (
                        <Box as={UserPlus} mr={2} />
                      ) : (
                        <Box as={User} mr={2} />
                      )}
                      {groupType === "beFriend"
                        ? "Available Companions"
                        : "Looking for Companions"}
                    </Heading>
                    
                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
                      {passengers
                        .filter((passenger) => passenger.type === groupType)
                        .filter(filterPassengersByDateRange)
                        .length > 0 ? (
                        passengers
                          .filter((passenger) => passenger.type === groupType)
                          .filter(filterPassengersByDateRange)
                          .map((passenger, index) => (
                            <Card 
                              key={passenger.id} 
                              bg="white" 
                              shadow="md" 
                              rounded="lg"
                              overflow="hidden"
                              borderTop="3px solid"
                              borderColor={groupType === "beFriend" ? "brand.400" : "accent.400"}
                              transition="all 0.3s ease"
                              _hover={{ transform: "translateY(-10px)", boxShadow: "xl" }}
                              opacity={0}
                              animation={`fadeInUp 0.5s ease-out forwards ${0.1 + (index * 0.1)}s`}
                            >
                              <CardBody p={4}>
                                <Text fontWeight="bold" fontSize="lg" color="gray.800" mb={3} display="flex" alignItems="center">
                                  <Box as={User} mr={2} h="18px" w="18px" color={groupType === "beFriend" ? "brand.500" : "accent.500"} />
                                  {formatName(passenger.name || "N/A")}
                                  {passenger.age ? `, ${passenger.age}` : ""}
                                </Text>
                                
                                <VStack align="stretch" spacing={2} mb={4}>
                                  <HStack>
                                    <Box as={Calendar} color="gray.500" h="16px" w="16px" />
                                    <Text color="gray.600" fontSize="sm">
                                      <Text as="span" fontWeight="medium">Date:</Text> {passenger.date || "N/A"}
                                    </Text>
                                  </HStack>
                                  
                                  <HStack>
                                    <Box as={PlaneTakeoff} color="gray.500" h="16px" w="16px" />
                                    <Text color="gray.600" fontSize="sm">
                                      <Text as="span" fontWeight="medium">From:</Text> {passenger.fromCity || "N/A"}
                                    </Text>
                                  </HStack>
                                  
                                  <HStack>
                                    <Box as={PlaneLanding} color="gray.500" h="16px" w="16px" />
                                    <Text color="gray.600" fontSize="sm">
                                      <Text as="span" fontWeight="medium">To:</Text> {passenger.toCity || "N/A"}
                                    </Text>
                                  </HStack>
                                  
                                  <HStack>
                                    <Box as={Building} color="gray.500" h="16px" w="16px" />
                                    <Text color="gray.600" fontSize="sm">
                                      <Text as="span" fontWeight="medium">Airlines:</Text> {passenger.airlines || "N/A"}
                                    </Text>
                                  </HStack>
                                </VStack>
                                
                                <Button
                                  onClick={handleContact}
                                  colorScheme={groupType === "beFriend" ? "brand" : "accent"}
                                  size="md"
                                  w="full"
                                  leftIcon={<PhoneCall size={16} />}
                                  _hover={{ transform: "translateY(-2px)" }}
                                  transition="all 0.2s"
                                >
                                  Contact
                                </Button>
                              </CardBody>
                            </Card>
                          ))
                      ) : (
                        <GridItem colSpan={{ base: 1, sm: 2, lg: 3 }} textAlign="center" py={8}>
                          <Text color="gray.500">
                            {dateFilter.start || dateFilter.end
                              ? `No travelers available for the selected date range in this category.`
                              : "No travelers available in this category yet."}
                          </Text>
                          <Button
                            onClick={handleAddPassengerClick}
                            variant="outline"
                            colorScheme="brand"
                            mt={4}
                          >
                            Add Your Travel Details
                          </Button>
                        </GridItem>
                      )}
                    </SimpleGrid>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>

          {/* Sign In Modal */}
          {showSignIn && (
            <Modal isOpen={showSignIn} onClose={() => { setShowSignIn(false); setSignInReason(""); }}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader color="blue.600">Sign In to SkyMates.co</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text mb={4} color="gray.600">
                    {signInReason === "contact"
                      ? "Please sign in to contact other travel mates."
                      : "Please sign in to add a new travel mate."}
                  </Text>
                  <SignIn />
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" onClick={() => { setShowSignIn(false); setSignInReason(""); }}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}

          {/* Contact Popup */}
          {showContactPopup && (
            <Modal isOpen={showContactPopup} onClose={() => setShowContactPopup(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader color="blue.600">Contact Information</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <ContactPopup onClose={() => setShowContactPopup(false)} />
                </ModalBody>
              </ModalContent>
            </Modal>
          )}

          {/* FAQ Section */}
          <Card mt={12} shadow="md" rounded="lg" overflow="hidden">
            <CardBody p={6}>
              <Heading as="h2" size="lg" mb={6} color="blue.600">Frequently Asked Questions</Heading>
              <Accordion allowToggle>
                <FAQItem 
                  question="What is Skymates, and how does it work?" 
                  answer="Skymates is a platform that connects elderly Nepali travelers with compassionate companions who are traveling on the same flight. Our mission is to ensure that elders never have to travel alone. If you're seeking a friend for your journey, you can list your travel details on our website under 'Looking for a Friend,' and we will find a suitable companion for you. This service is completely free as part of our community support initiative."
                />
                <FAQItem 
                  question="How do I request a companion or list myself as 'looking for a friend'?" 
                  answer="Simply click on the 'Find a Friend for My Journey' button on our website. You'll provide your flight details and any specific needs. We will then match you with a verified companion who is traveling on the same flight and connect you before the trip."
                />
                <FAQItem 
                  question="Who are the companions, and how are they selected?" 
                  answer="Our companions are trusted members of the Nepali community who are already planning to travel. They sign up on our platform to offer assistance and companionship to elderly travelers as volunteers. We conduct thorough verification checks to ensure they share the same language and cultural understanding, making your journey comfortable and safe."
                />
                <FAQItem 
                  question="How does Skymates ensure the safety and security of elderly travelers?" 
                  answer="Safety is our top priority. We verify the identities of all companions and provide you with their profiles for review and approval before confirming the match. Open communication before the trip helps build trust, and we collect feedback after each journey to maintain high standards."
                />
                <FAQItem 
                  question="Is there any cost involved in using Skymates?" 
                  answer="No, SkyMates is completely free to use. We believe in the power of community support and volunteering to help our elders travel safely and comfortably. There are no hidden fees or charges - this is a community service initiative built on kindness and cultural connection."
                />
                <FAQItem 
                  question="Can I communicate with the companion before the trip?" 
                  answer="Yes, absolutely. Once we have matched you with a companion, we'll provide their contact information. We encourage you or your family members to reach out, introduce yourselves, and coordinate meeting details at the airport. This helps ensure both parties are comfortable and prepared for the journey."
                />
                <FAQItem 
                  question="What are the responsibilities of the companion during the trip?" 
                  answer="The companion assists the elderly traveler with: Pre-Flight: Helping with check-in, baggage handling, and navigating security procedures. During Flight: Assisting with boarding, finding seats, and attending to any in-flight needs. Post-Flight: Guiding through disembarking, baggage claim, and connecting with onward transportation. Their presence provides comfort, assistance, and peace of mind throughout the journey."
                />
                <FAQItem 
                  question="Why do people volunteer as companions?" 
                  answer="Our volunteer companions join for many meaningful reasons: they value giving back to the community, enjoy meeting new people, want to help preserve cultural connections, and find fulfillment in making a positive difference in someone's life. Many volunteers report that the experience is deeply rewarding and they form lasting friendships through the program."
                />
                <FAQItem 
                  question="How does Skymates protect my privacy and personal information?" 
                  answer="We take your privacy seriously. Personal information is securely stored and only shared with the matched companion for the purpose of facilitating your journey. We use encryption and strict data protection measures to safeguard your data. Please review our Privacy Policy for complete details."
                />
                <FAQItem 
                  question="Is there any support available during the trip in case of issues?" 
                  answer="Yes, our customer support team is available to assist with any concerns before, during, or after the trip. You can reach us via phone or email, and we recommend saving our contact information for easy access in case you need assistance during your journey."
                />
                <FAQItem 
                  question="How can I become a companion, and what are the requirements?" 
                  answer="If you're traveling soon and wish to help an elder, you can sign up to become a Skymates companion. Click on the 'Sign Up to Be a Companion' button on our website. Requirements include: Language Proficiency: Ability to communicate effectively in Nepali. Verification: Complete our verification process to ensure safety. Willingness to Assist: A compassionate attitude towards helping elderly travelers. We deeply value our volunteers who make this community service possible."
                />
                <FAQItem 
                  question="Have more questions or need assistance?" 
                  answer="We're here to help! If you have any additional questions or need assistance, please contact our support team at: Email: skymatesco@gmail.com, Phone: (714) 485-9360. We are dedicated to making your travel experience safe, comfortable, and enjoyable."
                />
              </Accordion>
            </CardBody>
          </Card>
        </Box>
      </Container>

      {/* Footer with Enhanced Design */}
      <Box 
        as="footer" 
        bg="linear-gradient(to right, #006064, #00838f)" 
        color="white" 
        py={12} 
        px={4}
        position="relative"
        overflow="hidden"
      >
        {/* Wave SVG background */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="120px"
          overflow="hidden"
          zIndex={0}
        >
          <Box
            as="svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
            style={{ display: 'block', height: '120px' }}
          >
            <Box
              as="path"
              fill="rgba(255, 255, 255, 0.1)"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,133.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></Box>
          </Box>
        </Box>

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={12}>
            {/* Column 1: Logo and description */}
            <VStack spacing={4} align="flex-start">
              <Heading 
                as="h3" 
                size="lg" 
                color="white" 
                display="flex" 
                alignItems="center"
                fontWeight="bold"
              >
                <Box as={PlaneTakeoff} mr={3} />
                SkyMates
              </Heading>
              <Text fontSize="sm" color="whiteAlpha.800" mb={4} maxW="300px">
                Creating safe, comfortable journeys by connecting Nepali elderly travelers with caring companions who share their language and culture.
              </Text>
              <HStack spacing={4}>
                <IconButton
                  as="a"
                  href="#"
                  aria-label="Facebook"
                  icon={<Facebook size={20} />}
                  colorScheme="whiteAlpha"
                  variant="ghost"
                  size="md"
                  rounded="full"
                  _hover={{ bg: "whiteAlpha.300", transform: "translateY(-2px)" }}
                  transition="all 0.3s ease"
                />
                <IconButton
                  as="a"
                  href="#"
                  aria-label="Twitter"
                  icon={<Twitter size={20} />}
                  colorScheme="whiteAlpha"
                  variant="ghost"
                  size="md"
                  rounded="full"
                  _hover={{ bg: "whiteAlpha.300", transform: "translateY(-2px)" }}
                  transition="all 0.3s ease"
                />
                <IconButton
                  as="a"
                  href="#"
                  aria-label="Instagram"
                  icon={<Instagram size={20} />}
                  colorScheme="whiteAlpha"
                  variant="ghost"
                  size="md"
                  rounded="full"
                  _hover={{ bg: "whiteAlpha.300", transform: "translateY(-2px)" }}
                  transition="all 0.3s ease"
                />
              </HStack>
            </VStack>
            
            {/* Column 2: Site Map */}
            <VStack spacing={3} align="flex-start">
              <Heading as="h4" size="sm" mb={2} color="white" fontWeight="bold">
                Navigation
              </Heading>
              <Link 
                href="/" 
                color="whiteAlpha.800" 
                _hover={{ color: "white", textDecoration: "none" }}
                display="flex"
                alignItems="center"
                transition="all 0.2s"
              >
                <Box mr={2} opacity={0.7}>•</Box> Home
              </Link>
              <Link 
                href="#about" 
                color="whiteAlpha.800" 
                _hover={{ color: "white", textDecoration: "none" }}
                display="flex"
                alignItems="center"
                transition="all 0.2s"
              >
                <Box mr={2} opacity={0.7}>•</Box> About Us
              </Link>
              <Link 
                href="#how-it-works" 
                color="whiteAlpha.800" 
                _hover={{ color: "white", textDecoration: "none" }}
                display="flex"
                alignItems="center"
                transition="all 0.2s"
              >
                <Box mr={2} opacity={0.7}>•</Box> How It Works
              </Link>
              <Link 
                href="#" 
                color="whiteAlpha.800" 
                _hover={{ color: "white", textDecoration: "none" }}
                display="flex"
                alignItems="center"
                transition="all 0.2s"
              >
                <Box mr={2} opacity={0.7}>•</Box> FAQs
              </Link>
            </VStack>
            
            {/* Column 3: Legal Info */}
            <VStack spacing={3} align="flex-start">
              <Heading as="h4" size="sm" mb={2} color="white" fontWeight="bold">
                Legal
              </Heading>
              <Link 
                href="#" 
                color="whiteAlpha.800" 
                _hover={{ color: "white", textDecoration: "none" }}
                display="flex"
                alignItems="center"
                transition="all 0.2s"
              >
                <Box mr={2} opacity={0.7}>•</Box> Terms of Service
              </Link>
              <Link 
                href="#" 
                color="whiteAlpha.800" 
                _hover={{ color: "white", textDecoration: "none" }}
                display="flex"
                alignItems="center"
                transition="all 0.2s"
              >
                <Box mr={2} opacity={0.7}>•</Box> Privacy Policy
              </Link>
              <Link 
                href="#" 
                color="whiteAlpha.800" 
                _hover={{ color: "white", textDecoration: "none" }}
                display="flex"
                alignItems="center"
                transition="all 0.2s"
              >
                <Box mr={2} opacity={0.7}>•</Box> Cookie Policy
              </Link>
            </VStack>
            
            {/* Column 4: Contact */}
            <VStack spacing={4} align="flex-start">
              <Heading as="h4" size="sm" mb={2} color="white" fontWeight="bold">
                Contact Us
              </Heading>
              <Link 
                href="mailto:skymatesco@gmail.com" 
                color="whiteAlpha.800" 
                _hover={{ color: "white", textDecoration: "none" }} 
                display="flex" 
                alignItems="center"
                transition="all 0.2s"
              >
                <Box as={Mail} mr={3} />
                skymatesco@gmail.com
              </Link>
              <Link 
                href="tel:+17144859360" 
                color="whiteAlpha.800" 
                _hover={{ color: "white", textDecoration: "none" }} 
                display="flex" 
                alignItems="center" 
                mb={4}
                transition="all 0.2s"
              >
                <Box as={Phone} mr={3} />
                +1 714-485-9360
              </Link>
              
              {user ? (
                <VStack align="flex-start" spacing={2}>
                  <Text fontSize="sm" color="whiteAlpha.900">
                    Hello, {user.firstName || user.username}
                  </Text>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    colorScheme="whiteAlpha"
                    size="sm"
                    leftIcon={<Box as={User} />}
                    _hover={{ bg: "whiteAlpha.200" }}
                  >
                    Sign Out
                  </Button>
                </VStack>
              ) : (
                <Button
                  onClick={handleSignIn}
                  colorScheme="whiteAlpha"
                  variant="outline"
                  leftIcon={<Box as={User} />}
                  size="sm"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  Sign In
                </Button>
              )}
            </VStack>
          </SimpleGrid>
          
          <Divider my={8} borderColor="whiteAlpha.300" />
          
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "center", md: "center" }}
            textAlign={{ base: "center", md: "left" }}
          >
            <Text fontSize="sm" color="whiteAlpha.700">
              &copy; {new Date().getFullYear()} SkyMates.co. All rights reserved.
            </Text>
            <Text fontSize="sm" color="whiteAlpha.500" mt={{ base: 2, md: 0 }}>
              Making travel a shared journey since 2023
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

// DateFilter component with enhanced design
const DateFilter = ({ dateFilter, setDateFilter }) => (
  <Card mb={6} shadow="md" rounded="xl" bg="white" borderLeft="4px solid" borderColor="brand.400">
    <CardBody>
      <Heading as="h3" size="md" mb={4} color="brand.500" fontWeight="bold">Filter by Travel Date</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel fontWeight="medium">From:</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Box as={Calendar} color="brand.400" />
            </InputLeftElement>
            <Input
              type="date"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
              bg="gray.50"
              _hover={{ bg: "gray.100" }}
              transition="all 0.2s"
              borderColor="gray.300"
            />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel fontWeight="medium">To:</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Box as={Calendar} color="brand.400" />
            </InputLeftElement>
            <Input
              type="date"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
              bg="gray.50"
              _hover={{ bg: "gray.100" }}
              transition="all 0.2s"
              borderColor="gray.300"
            />
          </InputGroup>
        </FormControl>
      </SimpleGrid>
      <Button
        mt={4}
        size="md"
        colorScheme="brand"
        variant="outline"
        onClick={() => setDateFilter({ start: "", end: "" })}
        isDisabled={!dateFilter.start && !dateFilter.end}
        leftIcon={<Box as={Calendar} />}
        _hover={{ transform: "translateY(-2px)" }}
        transition="all 0.2s"
      >
        Reset Filter
      </Button>
    </CardBody>
  </Card>
);

// ContactPopup component with enhanced design
const ContactPopup = ({ onClose }) => (
  <VStack spacing={6} align="stretch">
    <Box 
      bg="brand.50" 
      p={4} 
      rounded="md" 
      borderLeft="4px solid" 
      borderColor="brand.400"
    >
      <Text fontSize="md" fontWeight="medium" color="brand.700">
        Connect with SkyMates Support
      </Text>
    </Box>
    
    <Text>
      For inquiries or to connect with a travel companion, our team is ready to help:
    </Text>
    
    <Box 
      borderWidth="1px" 
      borderRadius="md" 
      p={5}
      bg="white"
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="all 0.2s"
    >
      <VStack spacing={4} align="stretch">
        <Flex align="center">
          <IconButton
            icon={<Mail />}
            aria-label="Email"
            colorScheme="brand"
            size="sm"
            mr={4}
            isRound
          />
          <Box>
            <Text fontWeight="bold" color="gray.700">Email</Text>
            <Link href="mailto:skymatesco@gmail.com" color="brand.500" fontWeight="medium">
              skymatesco@gmail.com
            </Link>
          </Box>
        </Flex>
        
        <Flex align="center">
          <IconButton
            icon={<Phone />}
            aria-label="Phone"
            colorScheme="brand"
            size="sm"
            mr={4}
            isRound
          />
          <Box>
            <Text fontWeight="bold" color="gray.700">Phone</Text>
            <Link href="tel:+17144859360" color="brand.500" fontWeight="medium">
              +1 714-485-9360
            </Link>
          </Box>
        </Flex>
      </VStack>
    </Box>
    
    <Text fontSize="sm" color="gray.600">
      We'll help coordinate connections between travel companions. Please provide your flight details when contacting us for quicker assistance.
    </Text>
    
    <Button 
      colorScheme="brand" 
      onClick={onClose}
      _hover={{ transform: "translateY(-2px)" }}
      transition="all 0.2s"
    >
      Close
    </Button>
  </VStack>
);

// FAQItem component with enhanced design
const FAQItem = ({ question, answer }) => (
  <AccordionItem 
    borderTop="none" 
    borderBottom="1px" 
    borderColor="gray.200" 
    mb={2}
    _last={{ borderBottom: "none" }}
  >
    <AccordionButton 
      py={4} 
      _hover={{ bg: "gray.50" }}
      transition="all 0.2s"
    >
      <Box flex="1" textAlign="left" fontWeight="medium" color="gray.700">
        {question}
      </Box>
      <AccordionIcon color="brand.500" />
    </AccordionButton>
    <AccordionPanel 
      pb={5} 
      color="gray.600" 
      bg="gray.50" 
      rounded="md" 
      px={4}
      fontSize="sm"
      lineHeight="tall"
    >
      {answer}
    </AccordionPanel>
  </AccordionItem>
);

// NavLink component with enhanced design
const NavLink = ({ href, label, onClick, mobile }) => (
  <Link
    href={href}
    onClick={onClick}
    color="white"
    fontWeight="medium"
    display="block"
    py={mobile ? 2 : 0}
    transition="all 0.2s"
    position="relative"
    _hover={{ 
      color: "white", 
      textDecoration: "none",
      transform: "translateY(-2px)",
      textShadow: "0 0 8px rgba(255,255,255,0.6)",
      _after: {
        width: "100%"
      }
    }}
    _after={{
      content: '""',
      position: "absolute",
      bottom: "-2px",
      left: 0,
      width: "0%",
      height: "2px",
      bg: "white",
      transition: "all 0.3s ease"
    }}
  >
    {label}
  </Link>
);

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <SkyMatesSimple />
    </ChakraProvider>
  );
}

