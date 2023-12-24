import { Box, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Flex, Grid, GridItem, Stack, VStack, Input, InputGroup, InputRightElement, HStack } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { watchSizeOfDisplay, Breakpoints } from "../responsiveFlag";
import { RefObject, useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { TimerComponent, TimerLogic } from "../timer"

var timer = new TimerLogic();

interface Message {
  supervisorID: string;
  state: string;
  remainingTime: string;
}


const clientDisplay = (es: EventSource | null, message: string, setMessage: Dispatch<SetStateAction<string>>) => {
  const isLargeDisplay = Breakpoints.lg < watchSizeOfDisplay();
  const measurementTime = useRef<HTMLInputElement>(null);
  const [isInitialState, setInitialStateFlag] = useState(true);
  const [isStarted, setStartedFlag] = useState(false);
  const [isStopped, setStoppedFlag] = useState(true);
  const [remainingTime, setRemainingTime] = useState(timer.timeCounter);
  console.log("message", message);
  

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
    (count: number)=>{ setRemainingTime(count); }, 
    (count: number)=>{ }, 
    (count: number)=>{ },
    (count: number)=>{ stop(); resetTimer(); }
  );
  
  return (
    <Box>
    <VStack>
      <Flex minHeight="22vh" minWidth="100vh" justifyContent='center' alignItems='center'>
        <Heading fill="White" stroke="White" fontWeight='extrabold' fontSize={['2xl', '3xl', '5xl']}>
        ⏱ CHAKURA-UI Timer ⏱
        </Heading>
      </Flex>
      <Button onClick={()=>{
        es = new EventSource('/api/v1/notify/time/supervisor001');
        console.log("subscribe");
        es.onmessage = ({data}) => {
          let message: Message = JSON.parse(data);
          let remainingTime: number = parseInt(message.remainingTime);
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
      }}>Subscribe</Button>
  <Button onClick={()=>{console.log(message);}}>show message</Button>
      <Box>
        <Flex direction={['column', 'column', 'column','row']} minHeight="50vh" align='center' gap='24'>

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

export default function Index() {
  
  const es: EventSource | null = null;
  const [message, setMessage] = useState("");

  return clientDisplay(es, message, setMessage);
}
