import CircularProgressBar from './circularProgressBar'

const DEBUG = console.log;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type timerProps = {
  text: string,
  percentage: number,
  isMobile: boolean,
  isLargeDisplay: boolean,
}

export function TimerComponent({ text, percentage, isMobile, isLargeDisplay }: timerProps) {
  
  if (isMobile || isLargeDisplay) {

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
  preCallbackOfCount: (count: number)=>void = ()=>{};
  preCallbackOfStart: ()=>void = ()=>{};
  preCallbackOfFinish: ()=>void = ()=>{};

  setCallbacks(preCallbackOfCount: (count: number)=>void,  preCallbackOfStart: ()=>void, preCallbackOfFinish: ()=>void) {
    this.preCallbackOfCount = preCallbackOfCount;
    this.preCallbackOfStart = preCallbackOfStart;
    this.preCallbackOfFinish = preCallbackOfFinish;
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
    this.preCallbackOfStart();

    this.isActive = true;

    while(this.isActive) {
      DEBUG("[start] loop start", this.timeCounter);
      this.timeCounter -= 1000; //preCallbackOfCountの前にあることに納得はしていない
      this.preCallbackOfCount(this.timeCounter);


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
    this.preCallbackOfFinish();
  }
}