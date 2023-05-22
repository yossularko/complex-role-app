import { useCallback, useState } from "react";

const useDisclosure = (defVal?: boolean) => {
  const [isOpen, setIsOpen] = useState(defVal || false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);
  return { isOpen, onOpen, onClose, onToggle };
};

export default useDisclosure;
