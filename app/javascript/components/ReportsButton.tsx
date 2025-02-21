import { ActionList, Button, ButtonGroup, Popover } from "@shopify/polaris";
import React from "react";
import { ChartVerticalFilledIcon, ChevronDownIcon } from "@shopify/polaris-icons";

interface Props {
    isReportsPage: boolean;
}
const ReportsButton: React.FC<Props> = ({ isReportsPage }) => {

    const [active, setActive] = React.useState<string | null>(null);

    const toggleActive = (id: string) => () => {
        setActive((activeId) => (activeId !== id ? id : null));
    };

    const actionListItems = [
        {
            content: "Summary",
            url: `/reports/summary`
        }
    ];

    return (
        <ButtonGroup variant="segmented">
            <Button size="large"
                url="/reports"
                icon={ChartVerticalFilledIcon}
                variant={isReportsPage ? "primary" : "secondary"}>
                Reports
            </Button>
            <Popover
                active={active === 'popover2'}
                preferredAlignment="right"
                activator={
                    <Button
                        size="large"
                        onClick={toggleActive('popover2')}
                        icon={ChevronDownIcon}
                        accessibilityLabel="Reports list"
                        variant={isReportsPage ? "primary" : "secondary"}
                    />
                }
                autofocusTarget="first-node"
                onClose={toggleActive('popover2')}
            >
                <ActionList
                    actionRole="menuitem"
                    items={actionListItems}
                />
            </Popover>
        </ButtonGroup>
    );
}

export default ReportsButton;