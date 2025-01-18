import { useState, useCallback, useRef, useEffect } from "react";
import style from "../scanner.module.css";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Camera, Flashlight, Scan, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { createLazyFileRoute, Link } from "@tanstack/react-router";
import BarcodeGenerator from "@/components/BarcodeGenerator";
import CodeList from "@/components/CodeList";
import { ScannedCode } from "@/interfaces/code.interface";
import { writeCode } from "@/firebase/config";
import { useScanner } from "@/hooks/useScanner";

export const Route = createLazyFileRoute("/")({
  component: ScannerApp,
});

function ScannerApp() {
  // const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentCode, setCurrentCode] = useState<string | null>(null);
  const { toast } = useToast();
  const [scannedCodes, setScannedCodes] = useState<ScannedCode[]>([]);
  const videoRef = useRef(null);
  const {
    scanning,
    setScanning,
    isFlashlightOn,
    setIsFlashlightOn,
    barcode,
    devices,
    setDeviceId,
  } = useScanner(videoRef);

  // const calculateEAN13Checksum = (eanArray: number[]) => {
  //   // Alternar sumando dígitos en posiciones impares y pares
  //   const sum = eanArray.reduce((acc, digit, index) => {
  //     return acc + digit * (index % 2 === 0 ? 1 : 3);
  //   }, 0);

  //   // El dígito de control es lo necesario para llegar al siguiente múltiplo de 10
  //   return (10 - (sum % 10)) % 10;
  // };
  // const generateEAN13 = () => {
  //   // Generar los primeros 12 dígitos aleatorios
  //   let ean = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));

  //   // Calcular el dígito de control
  //   const checksum = calculateEAN13Checksum(ean);

  //   // Añadir el dígito de control al final
  //   ean.push(checksum);

  //   // Devolver como string
  //   return ean.join("");
  // };

  const handleScan = useCallback(() => {
    setScanning(true);
    // Simulamos el escaneo de un código después de 2 segundos
    // setTimeout(() => {
    //   const newCode = generateEAN13();
    //   setCurrentCode(newCode);
    //   setScannedCodes((prevCodes) => [
    //     ...prevCodes,
    //     {
    //       id: Date.now().toString(),
    //       code: newCode,
    //       timestamp: new Date(),
    //       copied: false,
    //     },
    //   ]);
    //   setIsScanning(false);
    //   setShowModal(true);
    // }, 2000);
  }, []);

  useEffect(() => {
    if (barcode) {
      setCurrentCode(barcode);

      setScanning(false);
      setShowModal(true);
    }
  }, [barcode]);

  const handleConfirm = useCallback(() => {
    if (currentCode) {
      setScannedCodes((prevCodes) => [
        ...prevCodes,
        {
          id: Date.now().toString(),
          code: barcode,
          timestamp: new Date(),
          copied: false,
        },
      ]);
      setShowModal(false);
      writeCode(currentCode);
      setCurrentCode(null);

      toast({
        title: "Código escaneado",
        description: "El código ha sido agregado a la lista.",
      });
    }
  }, [currentCode, toast]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
    setCurrentCode(null);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {scanning ? (
        <div
          // className="fixed inset-0 z-40 h-screen w-full"
          className={style.video}
          ref={videoRef}
        >
          <div className="absolute top-4 right-4 z-50 flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
              // onClick={toggleCamera}
            >
              {/* <FlipCamera className="h-6 w-6" /> */}
            </Button>
            <Button
              // variant={isFlashlightOn ? "default" : "outline"}
              size="icon"
              className={`rounded-full backdrop-blur-md ${
                isFlashlightOn
                  ? "bg-yellow-500 text-yellow-900"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
              onClick={() => setIsFlashlightOn(!isFlashlightOn)}
            >
              <Flashlight className="h-6 w-6" />
            </Button>
          </div>
          <Button
            onClick={() => setScanning(false)}
            variant="outline"
            size="icon"
            className="absolute z-50 top-4 left-4 rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 left-4 z-50 flex flex-col gap-2">
            {devices.map((device) => (
              <Button
                className="rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
                variant="outline"
                size={"icon"}
                key={device.deviceId}
                onClick={() => setDeviceId(device.deviceId)}
              >
                {/* {device.label.split(":")[1]} */}
                <Camera className="h-6 w-6" />
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Escáner de Códigos</h1>
            <Link to="/codes" className="text-blue-500 hover:text-blue-700">
              Ver todos
            </Link>
          </header>
          <main className="flex-grow overflow-hidden">
            <CodeList scannedCodes={scannedCodes} limit={5} />
          </main>
          <footer className="bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
            <div className="max-w-md mx-auto px-4 py-3">
              <Button
                onClick={handleScan}
                disabled={scanning}
                className="w-full h-12 text-lg font-semibold"
              >
                {scanning ? "Escaneando..." : "Escanear Código"}
                <Scan className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </footer>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verificar Código</DialogTitle>
                <DialogDescription>
                  ¿El código fue escaneado correctamente?
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 flex justify-center">
                {currentCode && <BarcodeGenerator value={currentCode} />}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full"
                >
                  Cancelar
                </Button>
                <Button onClick={handleConfirm} className="w-full mb-1">
                  Confirmar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
