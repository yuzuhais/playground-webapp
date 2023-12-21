import { Box, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Flex, Grid, GridItem, Stack, VStack, Input, InputGroup, InputRightElement, HStack } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { watchSizeOfDisplay, Breakpoints } from "../responsiveFlag";
import { useRef, useState } from "react";
import { TimerComponent, TimerLogic } from "../timer"

var timer = new TimerLogic();

export default function Index() {
  const isLargeDisplay = Breakpoints.lg < watchSizeOfDisplay();
  const measurementTime = useRef<HTMLInputElement>(null);
  const [isInitialState, setInitialStateFlag] = useState(true);
  const [isStarted, setStartedFlag] = useState(false);
  const [isStopped, setStoppedFlag] = useState(true);
  const [remainingTime, setRemainingTime] = useState(timer.timeCounter);

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
  
  timer.setCallbacks((count: number)=>{ setRemainingTime(count); console.log(count); }, ()=>{}, ()=>{ stop(); resetTimer(); });
  
  return (
    <Box>
    <VStack>
      <Flex minHeight="22vh" minWidth="100vh" justifyContent='center' alignItems='center'>
        <Heading fill="White" stroke="White" fontWeight='extrabold' fontSize={['2xl', '3xl', '5xl']}>
        ⏱ CHAKURA-UI Timer ⏱
        </Heading>
      </Flex>
      <Box>
        <Flex direction={['column', 'column', 'column','row']} minHeight="50vh" align='center' gap='24'>
          <Box order={[2, 2, 2, 1]}>
          <VStack>
            <InputGroup size={ ["md", "lg"] }>
              <Input
               isDisabled = { !isInitialState }
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
              percentage={ 100 * timer.timeCounter / timer.countTime } 
              isLargeDisplay={isLargeDisplay}/>
          </Box>
        </Flex>
      </Box>
    </VStack>
  </Box>
  );
}
