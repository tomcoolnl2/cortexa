import { useDisclosure } from '@mantine/hooks';
import { Modal, Text, Button, ButtonProps } from '@mantine/core';


export interface ConfimationModalProps {
    modalHeader?: string;
    modalText: string;
    buttonText: string;
    buttonVariant?: ButtonProps['variant'];
    buttonIcon?: React.ReactNode;
    withCloseButton?: boolean;
    withCancelButton?: boolean;
    onConfirm: () => void;
}

export const ConfimationModal = ({ modalHeader, modalText, buttonText, withCloseButton = false, buttonIcon, buttonVariant = 'default', withCancelButton = true, onConfirm }: ConfimationModalProps) => {

    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>  
            <Modal title={modalHeader} opened={opened} onClose={close} withCloseButton={withCloseButton}>
                <Text>{modalText}</Text>
                <Button 
                    mt="md"
                    onClick={() => {
                        onConfirm();
                        close();
                    }}
                >
                    {buttonText}
                </Button>
                {withCancelButton && (
                    <Button variant="outline" onClick={close} ml="sm">
                       Cancel
                    </Button>
                )}
            </Modal>
            <Button variant={buttonVariant} onClick={open} leftSection={buttonIcon}>
                {buttonText}
            </Button>
        </>
    );
}