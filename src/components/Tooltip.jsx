import React, {useCallback, useState} from "react";
import "bootstrap/dist/css/bootstrap.css";
import {Tooltip as Tooltip_} from "reactstrap";

const Tooltip = ({
  id,
  content,
  placement = "top",
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = useCallback(() => setTooltipOpen(!tooltipOpen),
      [tooltipOpen]);

  return (
    <Tooltip_
      placement={placement}
      isOpen={tooltipOpen}
      target={id}
      toggle={toggle}
    >
      {content}
    </Tooltip_>
  );
};
export default Tooltip;
