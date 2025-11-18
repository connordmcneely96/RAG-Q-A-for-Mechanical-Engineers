declare module 'react-katex' {
  import { ReactElement } from 'react';

  export interface KatexProps {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => ReactElement;
    settings?: {
      throwOnError?: boolean;
      displayMode?: boolean;
      leqno?: boolean;
      fleqn?: boolean;
      [key: string]: any;
    };
  }

  export const BlockMath: React.FC<KatexProps>;
  export const InlineMath: React.FC<KatexProps>;
}
