import Quagga from "@ericblade/quagga2";
import { useEffect, useState } from "react";



export const useScanner = (element: any) => {
    // const scanning = useScanStore((state) => state.isScanning);
    // const setScanning = useScanStore((state) => state.setIsScanning);

    const [scanning, setScanning] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [deviceId, setDeviceId] = useState("");
    const [listCode, setListCode] = useState<string[]>([]);
    const [isFlashlightOn, setIsFlashlightOn] = useState(false);

    useEffect(() => {
        if (isFlashlightOn) {
            Quagga.CameraAccess.enableTorch();
        } else {
            Quagga.CameraAccess.disableTorch();
        }
    }, [isFlashlightOn]);

    useEffect(() => {
        Quagga.CameraAccess.enumerateVideoDevices().then((devices) => {
            console.log("Devices", devices);
            const backCameras = devices.filter(
                (device) =>
                    device.label.toLowerCase().includes("back") ||
                    device.label.toLowerCase().includes("rear")
            );
            setDevices(backCameras);
        });
    }, []);
    useEffect(() => {
        if (scanning) {
            Quagga.init(
                {
                    inputStream: {
                        name: "Live",
                        type: "LiveStream",
                        target: element.current!,
                        constraints: {
                            width: 640,
                            height: 480,
                            facingMode: "environment",
                            deviceId: deviceId ?? "",
                        },
                    },
                    locate: true,
                    numOfWorkers: navigator.hardwareConcurrency || 4,
                    frequency: 5,
                    locator: {
                        patchSize: "medium", // Tamaño de los parches para localizar códigos de barras
                        halfSample: true, // Reduce el tamaño de la imagen a la mitad antes de analizarla para mejorar el rendimiento
                    },

                    decoder: {
                        multiple: false,
                        readers: [
                            "ean_reader",
                            //   "code_128_reader",
                            // "ean_8_reader",
                            //   "code_39_reader",
                            //   "code_39_vin_reader",
                            //   "codabar_reader",
                            //   "upc_reader",
                            //   "upc_e_reader",
                            //     "i2of5_reader",
                            //   "2of5_reader",
                            //   "code_93_reader",
                        ],
                    },
                },
                (err) => {
                    if (err) {
                        console.error("hubo un error", err);
                        return;
                    }
                    Quagga.start();

                    console.log("Initialization finished. Ready to start");
                }
            );

            Quagga.onDetected((data) => {
                console.log(data);
                const code = data.codeResult.code!;
                setBarcode(code);
                setListCode([...listCode, code]);
                console.log("Barcode found", code);
                Quagga.stop();
                setScanning(false);
            });
        }

        return () => {
            Quagga.stop();
        };
    }, [scanning, deviceId, devices, setScanning, listCode, element]);

    return {
        scanning,
        setScanning,
        barcode,
        setBarcode,
        devices,
        setDevices,
        deviceId,
        setDeviceId,
        listCode,
        setListCode,
        isFlashlightOn,
        setIsFlashlightOn,
    };
};