export {};

declare global {
  interface Window {
    Telegram: any;
  }

  interface Telegram {
    WebApp: any;
  }
}
