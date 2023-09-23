import 'bootstrap/dist/css/bootstrap.css';
import { useState, useCallback } from 'react';
import { Tooltip as Tooltip_ } from "reactstrap";

const Tooltip = ({
    placement,
    id,
    content
  }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = useCallback(() => setTooltipOpen(!tooltipOpen),
    [tooltipOpen]);
    
    return (
    <Tooltip_
      placement={!placement ? "top" : placement}
      isOpen={tooltipOpen}
      target={id}
      toggle={toggle}
    >
      {content}
    </Tooltip_>
    )
  };
  export default Tooltip
