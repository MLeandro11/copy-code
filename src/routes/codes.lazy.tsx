import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { database } from "@/firebase/config";
import { ScannedCode } from "@/interfaces/code.interface";
import { onChildAdded, onValue, ref } from "firebase/database";
import CodeList from "@/components/CodeList";

export const Route = createLazyFileRoute("/codes")({
  component: AllCodes,
});

function AllCodes() {
  const [codes, setCodes] = useState<ScannedCode[]>([]);
  useEffect(() => {
    const codeRef = ref(database, `/codes/`);
    onValue(codeRef, (snapshot) => {
      const data = snapshot.val();
      const codes: ScannedCode[] = [];
      for (const key in data) {
        codes.push({
          id: key,
          copied: false,
          ...data[key],
        });
      }
      setCodes(codes);

      return data;
    });
    // onChildAdded(codeRef, (snapshot) => {
    //   const data = snapshot.val();
    //   const code: ScannedCode = {
    //     id: snapshot.key,
    //     copied: false,
    //     ...data,
    //   };
    //   setCodes((prev) => [...prev, code]);
    // });
  }, []);
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4 flex items-center">
        <Link to="/" className="text-blue-500 hover:text-blue-700 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">Todos los Códigos</h1>
      </header>

      <main className="flex-grow overflow-hidden">
        <CodeList scannedCodes={codes} />
      </main>
    </div>
  );
}
