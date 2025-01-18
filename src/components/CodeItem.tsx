import { ScannedCode } from "@/interfaces/code.interface";
import { Button } from "@/components/ui/button";
import { Copy, Check, Trash2 } from "lucide-react";
interface CodeItemProps {
  item: ScannedCode;
  handleCopy: (id: string, code: string) => void;
  deleteCode: (id: string) => void;
}

export const CodeItem = ({ item, handleCopy, deleteCode }: CodeItemProps) => {
  return (
    <li
      key={item.id}
      className={`bg-white p-4 rounded-lg shadow-sm ${
        item.copied ? "border-l-4 border-green-500" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{item.code}</span>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCopy(item.id, item.code)}
          >
            {item.copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteCode(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <span className="text-sm text-gray-500 block mt-1">
        {item.timestamp.toLocaleString()}
      </span>
    </li>
  );
};
