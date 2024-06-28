import {ReactElement, useEffect, useState} from "react";
import {IoIosArrowDropdown, IoIosArrowDropup} from "react-icons/all";

type Props = {
    arrowDirection: 'up' | 'down';
};
// The arrow Icon should be covered by an HtmlElement which is not <svg/>.
// because that svg would be recognized by the useOutClickHook as outClick, although it is inside its ref,
// and then the hook will close the dropdown immediately.
export function SvgArrowIconWrapper({arrowDirection}: Props) {
    const [elementToRender, setElementToRender] = useState<ReactElement>(<IoIosArrowDropdown className="icon"/>);
    useEffect(() => {
        if (arrowDirection === 'up') {
            setElementToRender(<IoIosArrowDropup className="icon"/>);
        } else {
            setElementToRender(<IoIosArrowDropdown className="icon"/>);
        }
    }, [arrowDirection]);
    return (
        <div className="svg-cover">
            {elementToRender}
        </div>
    );
}