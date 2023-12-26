"use client"
import { Box, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Flex, Grid, GridItem, Stack, VStack, Input, InputGroup, InputRightElement, HStack, FormErrorMessage } from "@chakra-ui/react";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import { watchSizeOfDisplay, Breakpoints } from "../responsiveFlag";
import { RefObject, useEffect, useRef, useState, Dispatch, SetStateAction, MutableRefObject } from "react";
import { TimerComponent, TimerLogic } from "../timer"
import { BackPanelStyle } from "../styles"

var timer = new TimerLogic();

interface Message {
  supervisorID: string;
  state: string;
  remainingTime: string;
  mesurementTime: string;
}


const clientDisplay = (es: MutableRefObject<EventSource | null>) => {
  const isLargeDisplay = Breakpoints.lg < watchSizeOfDisplay();
  const measurementTime = useRef<HTMLInputElement>(null);
  const [isInitialState, setInitialStateFlag] = useState(true);
  const [isStarted, setStartedFlag] = useState(false);
  const [isStopped, setStoppedFlag] = useState(true);
  const [mesurementTime, setMesurementTime] = useState(Infinity);
  const [remainingTime, setRemainingTime] = useState(timer.timeCounter);
  const [input, setInput] = useState('');
  const [isError, setErrorFlag] = useState(false);
  const [hasAvailableID, setIdAvailabilityFlag] = useState(false);
  const [isSubscribed, setSubscriptionFlag] = useState(false);


  const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    const id = e.target.value.toString().trim();
    if ("" == id) {
      setErrorFlag(true);
      setIdAvailabilityFlag(false);
    } else {
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

  const resetTimer = () => {
    setRemainingTime(0);
    setInitialStateFlag(true);
  }

  timer.setCallbacks(
    ()=>{ setRemainingTime(timer.timeCounter); }, 
    ()=>{ }, 
    ()=>{ },
    ()=>{ stop(); resetTimer(); }
  );

  const subscribe = ()=>{
    setSubscriptionFlag(true);
    es.current = new EventSource(`/api/v1/notify/time/${input.trim()}`);
    es.current.onmessage = ({data}) => {
      let message: Message = JSON.parse(data);
      let remainingTime: number = parseInt(message.remainingTime);
      setMesurementTime(parseInt(message.mesurementTime));
      if ("start" == message.state) {
        setRemainingTime(remainingTime);
        setInitialStateFlag(false);
        timer.set(remainingTime);
        start();
        return;
      } 
      if ("stop" == message.state) {
        setRemainingTime(parseInt(message.remainingTime));
        stop();
        return;
      }
    }
  }

  const unsubscribe = () => {
    if(es.current) es.current.close();
    setSubscriptionFlag(false);
    stop();
    resetTimer();
    setMesurementTime(Infinity);
    setInput("");
    setIdAvailabilityFlag(false);
    console.log("unsubscribed", isSubscribed, hasAvailableID);
  }
  
  return (
    <ChakraProvider>
    <Box background="linear-gradient(135deg, #0aa1ff, #0850ff)" height="100vh">
    <VStack>
      <Flex minHeight="22vh" minWidth="100vh" justifyContent='center' alignItems='center'>
        <Heading fill="White" stroke="White" fontWeight='extrabold' fontSize={['2xl', '3xl', '5xl']} color="#0840ff" textShadow="0px 1px 1px #0a81ff, 0px -1px 1px  #0a81ff">
        CHAKURA-UI Timer
        </Heading>
      </Flex>
      <Box>
        <Flex style={BackPanelStyle} direction={['column', 'column', 'column','row']} minHeight="50vh" align='center' gap={['8','8','8',]}>
          <Box order={[2, 2, 2, 1]}>
          <VStack>
            
            
            <InputGroup size={ ["md", "lg"] }>
              
            <Input type='text' value={input} onChange={handleInputChange} size={ ["md", "lg"] } placeholder="supervisor001"/>
              <InputRightElement width='7.5rem'>
                { !isSubscribed &&  <Button isDisabled={!hasAvailableID} onClick={ subscribe } size={ ["sm", "md"] }>
                  subscribe
                </Button> }
                { isSubscribed &&  <Button onClick={ unsubscribe } size={ ["sm", "md"] } >
                  unsubscribe
                </Button> }
              </InputRightElement>
            </InputGroup>
          </VStack>
          </Box>
          <Box order={[1, 1, 1, 2]}>
            <TimerComponent 
              text={new Date(remainingTime).toISOString().slice(11, 19) } 
              percentage={ 100 * timer.timeCounter / mesurementTime } 
              isLargeDisplay={isLargeDisplay}/>
          </Box>
        </Flex>
      </Box>
    </VStack>
  </Box></ChakraProvider>
  );
}

export default function Index() {
  
  const es = useRef<EventSource | null>(null);

  return clientDisplay(es);
}
