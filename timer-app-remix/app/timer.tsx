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

    return <Box style={circularBackpanel}><CircularProgressBar mainText={text} selectedValue={ percentage }
      maxValue={100}
      strokeWidth={60}
      activeStrokeColor='#0f4fff'
      labelFontSize={164}
      valueFontSize={48}
      withGradient
      radius={160}/></Box>;
    }

    return <Box style={circularExtraLargeBackpanel}><CircularProgressBar mainText={text} selectedValue={ percentage }
      maxValue={100}
      strokeWidth={100}
      activeStrokeColor='#0f4fff'
      labelFontSize={164}
      valueFontSize={72}
      withGradient
      radius={260}/></Box>;
}

export class TimerLogic {
  timeCounter: number = 0;
  isActive: boolean = false;
  measurementTime: number = 1;
  disposeEveryCount: ()=>void = ()=>{};
  disposeBeforeStart: ()=>void = ()=>{};
  disposeBeforeStop: ()=>void = ()=>{};
  disposeBeforeFinish: ()=>void = ()=>{};

  setCallbacks(disposeEveryCount: ()=>void,  
               disposeBeforeStart: ()=>void, 
               disposeBeforeStop: ()=>void, 
               disposeBeforeFinish: ()=>void) {

    this.disposeEveryCount = disposeEveryCount;
    this.disposeBeforeStart = disposeBeforeStart;
    this.disposeBeforeStop = disposeBeforeStop;
    this.disposeBeforeFinish = disposeBeforeFinish;
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
    this.disposeBeforeStart();

    this.isActive = true;
    this.count();
  }

  async count() {
    while(this.isActive) {
      DEBUG("[start] loop start", this.timeCounter);
      this.timeCounter -= 1000;
      this.disposeEveryCount();


      await wait(1000);

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
    this.disposeBeforeStop();
    this.isActive = false;
  }

  onFinish() {
    this.disposeBeforeFinish();
  }
}