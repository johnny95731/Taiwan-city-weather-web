import {useCallback, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Tooltip as Tooltip_} from 'reactstrap';

type RTooltipProps = InstanceType<typeof Tooltip_>['props']
type Props = {
  id: RTooltipProps['target'],
  content?: string,
  placement?: RTooltipProps['placement']
}

const Tooltip = ({
  id,
  content,
  placement = 'top',
}: Props) => {
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
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
