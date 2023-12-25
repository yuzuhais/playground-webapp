import { Box, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Flex, Grid, GridItem, Stack, VStack, Input, InputGroup, InputRightElement, HStack, FormControl, FormLabel, FormHelperText, FormErrorMessage } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { watchSizeOfDisplay, Breakpoints } from "../responsiveFlag";
import { SetStateAction, useRef, useState } from "react";
import { TimerComponent, TimerLogic } from "../timer"
import { BackPanelStyle } from "../styles"

var timer = new TimerLogic();

export default function Index() {
  const isLargeDisplay = Breakpoints.lg < watchSizeOfDisplay();
  const measurementTime = useRef<HTMLInputElement>(null);
  const supervisorID = useRef<HTMLInputElement>(null);
  const [isInitialState, setInitialStateFlag] = useState(true);
  const [isStarted, setStartedFlag] = useState(false);
  const [isStopped, setStoppedFlag] = useState(true);
  const [remainingTime, setRemainingTime] = useState(timer.timeCounter);
  
  const [input, setInput] = useState('');
  const [isError, setErrorFlag] = useState(false);
  const [hasAvailableID, setIdAvailabilityFlag] = useState(false);

  const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    const id = e.target.value.toString().trim();
    if ("" == id) {
      console.log("unavailable id");
      setErrorFlag(true);
      setIdAvailabilityFlag(false);
    } else {
      console.log("available id");
      setErrorFlag(false);
      setIdAvailabilityFlag(true);
      setInput(id);
    }
  }

  const start = () => {
    setStartedFlag(true);
    setStoppedFlag(false);
    timer.start();
  }

  const stop = () => {
    setStartedFlag(false);
    setStoppedFlag(true);
    timer.stop();
  }

  const setTimer = () => {
    if (measurementTime.current) {
      if (measurementTime.current.valueAsNumber) {
        setRemainingTime(measurementTime.current.valueAsNumber);
        setInitialStateFlag(false);
        timer.set(measurementTime.current.valueAsNumber);
      }
    }
  }

  const resetTimer = () => {
    setRemainingTime(0);
    setInitialStateFlag(true);
  }
  
  timer.setCallbacks(
    ()=>{ setRemainingTime(timer.timeCounter); }, 
    ()=>{ fetch(`/api/v1/notify/time/${input}/start/${timer.timeCounter}/${timer.measurementTime}`, { method: 'POST' }); }, 
    ()=>{ fetch(`/api/v1/notify/time/${input}/stop/${timer.timeCounter}/${timer.measurementTime}`, { method: 'POST' }); },
    ()=>{ stop(); resetTimer(); }
  );
  
  return (
    <Box background="linear-gradient(135deg, #0a81ff, #0800ff)" height="100vh">
    <VStack>
      <Flex minHeight="22vh" minWidth="100vh" justifyContent='center' alignItems='center'>
        <Heading fill="White" stroke="White" fontWeight='extrabold' fontSize={['2xl', '3xl', '5xl']} color="#0800ff" textShadow="0px 1px 1px #0a81ff, 0px -1px 1px  #0a81ff">
         CHAKURA-UI Timer 
        </Heading>
      </Flex>
      <Box>
        <Flex style={BackPanelStyle} direction={['column', 'column', 'column','row']} minHeight="50vh" align='center' gap={['8','8','8',]}>
          <Box order={[2, 2, 2, 1]}>
          <VStack>
            <FormControl isInvalid={isError}>
              <Input type='text' value={input} onChange={handleInputChange} size={ ["md", "lg"] } placeholder="supervisor001"/>
              {isError && <FormErrorMessage>空文字列もしくはスペースのみからなる文字列は受け付られません。</FormErrorMessage>}
            </FormControl>
            <InputGroup size={ ["md", "lg"] }>
              <Input
               isDisabled = { !isInitialState || !hasAvailableID }
               placeholder="Select Date and Time"
               size={ ["md", "lg"] }
               type="time"
               step="1"
               ref={measurementTime}
              />
              <InputRightElement width='4.5rem'>
                { isInitialState &&  <Button onClick={setTimer}  size={ ["sm", "md"] }>
                  SET
                </Button> }
                { !isInitialState &&  <Button onClick={resetTimer}  mr="1"  size={ ["sm", "md"] }>
                  RESET
                </Button> }
              </InputRightElement>
            </InputGroup>
            <HStack gap='2'>
              <Button onClick={ start } isDisabled={ isStarted || isInitialState } height={['50px', '100px']} width={['100px', '200px']} fontSize={['24px', '48px']} ring="4px" ringColor="blue.200" ringOffset="3px" ringOffsetColor="blue.300">Start</Button>
              <Button onClick={ stop } isDisabled={ isStopped || isInitialState } height={['50px', '100px']}  width={['100px', '200px']} fontSize={['24px', '48px']}>Stop</Button>
            </HStack>
          </VStack>
          </Box>
          <Box order={[1, 1, 1, 2]}>
            <TimerComponent 
              text={new Date(remainingTime).toISOString().slice(11, 19) } 
              percentage={ 100 * timer.timeCounter / timer.measurementTime } 
              isLargeDisplay={isLargeDisplay}/>
          </Box>
        </Flex>
      </Box>
    </VStack>
  </Box>
  );
}
