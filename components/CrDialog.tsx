import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

interface CrDialogProps {
  isOpen: boolean;
  onModalClose: () => void;
  children: any;
}

const CrDialog = ({ isOpen, onModalClose, children }: CrDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

  useEffect(() => {
    setIsDialogOpen(isOpen);
  }, [isOpen]);

  const handleCloseModal = () => {
    setIsDialogOpen(false);
    onModalClose();
  };
  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleCloseModal}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-2">
        <Dialog.Panel className="bg-cr-modal p-10 rounded-lg">
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CrDialog;
