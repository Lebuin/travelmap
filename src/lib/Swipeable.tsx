import { useSwipeable } from 'react-swipeable';
import * as React from 'react';

export default function Swipeable({children, ...props}) {
  const handlers = useSwipeable(props);
  return (<div { ...handlers }>{children}</div>);
}
