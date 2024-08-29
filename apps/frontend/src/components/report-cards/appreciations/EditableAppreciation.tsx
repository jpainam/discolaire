/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

import { Textarea } from "@repo/ui/textarea";

const EditableAppreciation = ({
  initialText,

  onSubmit,
}: {
  initialText: string;
  className?: string;
  onSubmit: (text: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const inputRef = useRef<any>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: any) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (initialText !== text) {
      onSubmit(text);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div className="w-full" onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <Textarea
          className="h-6 w-full"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          ref={inputRef}
        />
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
};

export { EditableAppreciation };
