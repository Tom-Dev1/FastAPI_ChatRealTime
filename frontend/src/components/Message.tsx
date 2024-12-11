import React, { useEffect, useState } from "react";
import { getFromLocalStorage } from "../constants/LocalStorage";

interface MessageProps {
  name: string;
  time: string;
  text: string;
}

const Message: React.FC<MessageProps> = ({ time, name, text }) => {
  const [isDifferentUser, setIsDifferentUser] = useState<boolean>(false);
  console.log(isDifferentUser);

  useEffect(() => {
    const storedName = getFromLocalStorage("userName:");
    if (storedName && storedName !== name) {
      setIsDifferentUser(true);
    } else {
      setIsDifferentUser(false);
    }
  }, []);

  return (
    <div
      className={`flex p-3 mb-2 rounded-lg shadow-sm ${
        isDifferentUser ? "bg-gray-200" : "bg-blue-100"
      }`}
    >
      <div>
        <img 
          src={"https://www.svgrepo.com/show/395866/bear.svg"}
          alt="User Avatar"
          className="rounded-full w-9 h-9 mr-3"
        />
      </div>
      <div>
        <strong className="block text-sm text-gray-600">
          {name} - {time}
        </strong>
        <p className="text-gray-800">{text}</p>
      </div>
    </div>
  );
};

export default Message;
