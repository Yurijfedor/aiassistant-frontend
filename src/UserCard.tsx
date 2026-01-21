import { useState } from "react";

interface UserCardProps {
  name: string;
  method: number;
}

function UserCard({ name, method }: UserCardProps) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h2>{name}</h2>
      <p>{count}</p>
      <button
        onClick={() => setCount((prev) => (method > 0 ? prev + 1 : prev - 1))}
      >
        Click me
      </button>
    </div>
  );
}

export default UserCard;
