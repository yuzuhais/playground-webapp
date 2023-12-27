import { Box } from '@chakra-ui/react';
import CircularProgressBar from './circularProgressBar'

const circularBackpanel = {
  borderRadius: "160px",
  background: "#EBECF0",
  boxShadow: "5px 5px 20px #c8c9cc, -5px -5px 20px #ffffff"
}

const circularExtraLargeBackpanel = {
  borderRadius: "260px",
  background: "#EBECF0",
  boxShadow: "5px 5px 20px #c8c9cc, -5px -5px 20px #ffffff"
}

const DEBUG = console.log;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type timerProps = {
  text: string,
  percentage: number,
  isLargeDisplay: boolean,
}

export function TimerComponent({ text, percentage, isLargeDisplay }: timerProps) {
  
  if (!isLargeDisplay) {

    return <Box style={circularBackpanel}><CircularProgressBar mainText={text} selectedValue={percentage}
    maxValue={100}
    strokeWidth={60}
    activeStrokeColor='#0f4fff'
    labelFontSize={164}
    valueFontSize={48}
    withGradient
    radius={160} 
    label={''} 
    inactiveStrokeColor={'#ddd'} 
    anticlockwise={false} 
    initialAngularDisplacement={0} 
    backgroundColor={'#fff'} 
    textColor={'#000'}/></Box>;
    }

    return <Box style={circularExtraLargeBackpanel}><CircularProgressBar mainText={text} selectedValue={ percentage }
      maxValue={100}
      strokeWidth={100}
      activeStrokeColor='#0f4fff'
      labelFontSize={164}
      valueFontSize={72}
      withGradient
      radius={260}
      label={''} 
      inactiveStrokeColor={'#ddd'} 
      anticlockwise={false} 
      initialAngularDisplacement={0} 
      backgroundColor={'#fff'} 
      textColor={'#000'}/></Box>;
}

export class TimerLogic {
  timeCounter: number = 0;
  isActive: boolean = false;
  measurementTime: number = 1;
  callEveryCount: ()=>void = ()=>{};
  callBeforeStart: ()=>void = ()=>{};
  callBeforeStop: ()=>void = ()=>{};
  callBeforeFinish: ()=>void = ()=>{};

  setCallbacks(callEveryCount: ()=>void,  
               callBeforeStart: ()=>void, 
               callBeforeStop: ()=>void, 
               callBeforeFinish: ()=>void) {

    this.callEveryCount = callEveryCount;
    this.callBeforeStart = callBeforeStart;
    this.callBeforeStop = callBeforeStop;
    this.callBeforeFinish = callBeforeFinish;
  }

  set(measurementTime: number) {
    if (this.isActive || 0 >= measurementTime) {
      return;
    }

    this.timeCounter = measurementTime;
    this.measurementTime = measurementTime;
  }

  async start() {
    DEBUG("start on logic");
    if (0 >= this.timeCounter || this.isActive) {
      return;
    }
    this.callBeforeStart();

    this.isActive = true;
    this.count();
  }

  async count() {
    while(this.isActive) {
      DEBUG("[start] loop start", this.timeCounter);
      this.timeCounter -= 100;
      this.callEveryCount();


      await wait(100);

      if (0 >= this.timeCounter) {
        this.onFinish();
        this.isActive = false;
      }
      
      DEBUG("[start] loop end", this.timeCounter);
    }
  }

  stop() {
    if (!this.isActive) {
      return;
    }
    this.callBeforeStop();
    this.isActive = false;
  }

  onFinish() {
    this.callBeforeFinish();
  }
}