declare module 'sound-log' {
  interface LogOptions {
    enabled?: boolean;
    soundsDir?: string;
    defaultSound?: string;
    logLevels?: Record<string, string>;
    errorMap?: Record<string, string>;
  }

  interface CustomLogOptions {
    sound: string;
    emoji?: string;
    color?: string;
  }

  class SoundLog {
    constructor(options?: LogOptions);
    
    error(message: string, error?: Error): this;
    warn(message: string): this;
    info(message: string): this;
    debug(message: string): this;
    trace(message: string): this;
    success(message: string): this;
    fatal(message: string, error?: Error): this;
    
    addLogLevel(name: string, options: CustomLogOptions): this;
    enable(): this;
    disable(): this;
    
    mapErrorToSound(errorType: string, soundFile: string): this;
  }

  export = SoundLog;
} 