import CircularProgressBar from './circularProgressBar'

const DEBUG = console.log;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type timerProps = {
  text: string,
  percentage: number,
  isLargeDisplay: boolean,
}

export function TimerComponent({ text, percentage, isLargeDisplay }: timerProps) {
  
  if (!isLargeDisplay) {

    return <CircularProgressBar mainText={text} selectedValue={ percentage }
      maxValue={100}
      strokeWidth={60}
      activeStrokeColor='#0f4fff'
      labelFontSize={164}
      valueFontSize={48}
      withGradient
      radius={160}/>;
    }

    return <CircularProgressBar mainText={text} selectedValue={ percentage }
      maxValue={100}
      strokeWidth={100}
      activeStrokeColor='#0f4fff'
      labelFontSize={164}
      valueFontSize={72}
      withGradient
      radius={260}/>;
}

export class TimerLogic {
  timeCounter: number = 0;
  isActive: boolean = false;
  countTime: number = 1;
  callEveryCount: (count: number)=>void = ()=>{};
  callBeforeStart: ()=>void = ()=>{};
  callBeforeFinish: ()=>void = ()=>{};

  setCallbacks(callEveryCount: (count: number)=>void,  callBeforeStart: ()=>void, callBeforeFinish: ()=>void) {
    this.callEveryCount = callEveryCount;
    this.callBeforeStart = callBeforeStart;
    this.callBeforeFinish = callBeforeFinish;
  }

  set(countTime: number) {
    if (this.isActive || 0 >= countTime) {
      return;
    }

    this.timeCounter = countTime;
    this.countTime = countTime;
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
      this.timeCounter -= 1000;
      this.callEveryCount(this.timeCounter);


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

    this.isActive = false;
  }

  onFinish() {
    this.callBeforeFinish();
  }
}