import React, { useState } from "react";
import Modal from "react-modal";

// Props interface for the modal
interface UserNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const ModalComponent: React.FC<UserNameModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState<string>("");

  const handleSubmit = (): void => {
    if (name.trim() !== "") {
      onSubmit(name);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Enter Name"
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 "
    >
      <div className="min-w-[400px] p-6 border rounded-lg bg-white">
        <h2>Please enter your name</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-3 p-3 w-full mb-4 border rounded-lg"
          placeholder="Enter your name..."
        />
        <button
          onClick={handleSubmit}
          className="px-[10px] py-[15px] bg-blue-500 border-none rounded-sm cursor-pointer text-[16px] w-full text-white"
        >
          Join Chat
        </button>
      </div>
    </Modal>
  );
};

export default ModalComponent;
