import React, { useState, useEffect } from "react";
import { Box, Button, Input, Textarea, useToast, VStack, Heading, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, InputGroup, InputRightElement } from "@chakra-ui/react";
import { FaLock, FaUnlock, FaSave } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
// Removed import of ReactMarkdown

const Index = () => {
  const toast = useToast();
  const [notes, setNotes] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);

  // Load notes from localStorage on first render
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    const savedPassword = localStorage.getItem("password");
    if (savedNotes) setNotes(savedNotes);
    if (savedPassword) {
      setIsLocked(true);
      setPassword(savedPassword);
    }
  }, []);

  // Autosave notes to localStorage whenever they change
  useEffect(() => {
    if (!isLocked) {
      localStorage.setItem("notes", notes);
    }
  }, [notes, isLocked]);

  const handleLock = () => {
    if (isLocked) {
      if (tempPassword === password) {
        setIsLocked(false);
        onClose();
        toast({
          title: "Notebook unlocked.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Incorrect password.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      setPassword(tempPassword);
      setIsLocked(true);
      localStorage.setItem("password", tempPassword);
      onClose();
      toast({
        title: "Notebook locked.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
    setTempPassword("");
  };

  const handleSave = () => {
    localStorage.setItem("notes", notes);
    toast({
      title: "Notes saved.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box p={5}>
      <VStack spacing={4}>
        <Heading>Notekeeper</Heading>
        {isLocked ? (
          <IconButton aria-label="Unlock Notebook" icon={<FaUnlock />} onClick={onOpen} isRound />
        ) : (
          <InputGroup size="md">
            <Input pr="4.5rem" type={showPassword ? "text" : "password"} placeholder="Enter password to lock" value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={togglePasswordVisibility}>
                {showPassword ? "Hide" : "Show"}
              </Button>
              <IconButton aria-label="Lock Notebook" icon={<MdLockOutline />} onClick={handleLock} isRound ml={2} />
            </InputRightElement>
          </InputGroup>
        )}
        <Textarea placeholder="Start typing..." size="sm" disabled={isLocked} value={notes} onChange={(e) => setNotes(e.target.value)} minHeight="300px" overflowY="auto" />
        <Button leftIcon={<FaSave />} colorScheme="blue" onClick={handleSave} disabled={isLocked}>
          Save Notes
        </Button>
        <Box w="100%" p={4} borderWidth="1px" borderRadius="lg" overflowY="auto" minHeight="300px">
          <pre>{notes}</pre>
        </Box>
        // Replaced ReactMarkdown component with a preformatted text display inside a Box
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Password to Unlock</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input type="password" placeholder="Password" value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleLock}>
              Unlock
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Index;
