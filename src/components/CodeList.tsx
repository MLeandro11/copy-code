import { ScrollArea } from "@/components/ui/scroll-area";
import { database } from "@/firebase/config";

import { useToast } from "@/hooks/use-toast";
import { ScannedCode } from "@/interfaces/code.interface";
import { CodeItem } from "./CodeItem";
import { ref, remove, update } from "firebase/database";

interface CodeListProps {
  limit?: number;
  scannedCodes: ScannedCode[];
}

export default function CodeList({ limit, scannedCodes }: CodeListProps) {
  const { toast } = useToast();

  const displayedCodes = limit ? scannedCodes.slice(0, limit) : scannedCodes;

  const handleCopy = (id: string, code: string) => {
    // const codeRef = ref(database, `/codes/${id}`);

    console.log(id);
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Código copiado",
        description: "El código ha sido copiado al portapapeles.",
      });
    });

    return update(ref(database, `/codes/${id}`), {
      copied: true,
    });
  };

  const deleteCode = (id: string) => {
    const codeRef = ref(database, `/codes/${id}`);
    return remove(codeRef);
  };
  return (
    <ScrollArea className="h-full px-4 py-6">
      {displayedCodes.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay códigos escaneados aún.
        </p>
      ) : (
        <ul className="space-y-3">
          {displayedCodes.map((item) => (
            <CodeItem
              key={item.id}
              item={item}
              handleCopy={handleCopy}
              deleteCode={deleteCode}
            />
          ))}
        </ul>
      )}
    </ScrollArea>
  );
}
