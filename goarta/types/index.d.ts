declare global {
  interface Window {
    rive?: {
      Rive: new (args: object) => RiveInstance;
      Layout: new (args: object) => object;
      Fit: { [key: string]: string };
      Alignment: { [key: string]: string };
    };
  }
}

interface RiveInput {
  name: string;
  type: string;
  value: number;
}

interface RiveInstance {
  layout: object;
  resizeDrawingSurfaceToCanvas: () => void;
  stateMachineInputs: (name: string) => RiveInput[];
  cleanup: () => void;
  reset: (options: { stateMachines: string[] }) => void;
}
