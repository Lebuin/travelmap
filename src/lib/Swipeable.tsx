import * as React from 'react';
import { SwipeableProps, useSwipeable } from 'react-swipeable';

export default function Swipeable({
  children,
  ...props
}: { children: React.ReactNode } & SwipeableProps) {
  const handlers = useSwipeable(props);
  return <div {...handlers}>{children}</div>;
}
