import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@nextui-org/react";
import {
  CalendarIcon,
  LogOutIcon,
  FileTextIcon,
  DownloadIcon,
} from "lucide-react";
import jsPDF from "jspdf";
// Importar la imagen local
import headerImage from "../../public/assets/img/fondo.jpg";

export function UserExpiration() {
  const [user, setUser] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setExpirationDate(parsedUser.accountExpires);
        setFullName(parsedUser.fullName);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/pazysalvo";
  };

  const generateCertificate = async () => {
    if (!fullName || !expirationDate) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Establecer márgenes
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Añadir marco del documento
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    // Añadir header desde imagen local
    try {
      const base64Image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg"));
        };
        img.onerror = reject;
        img.src = headerImage;
      });

      // Añadir la imagen al PDF
      doc.addImage(base64Image, "JPEG", pageWidth / 2 - 25, 25, 50, 20);
    } catch (error) {
      console.error("Error adding header image:", error);
      // Fallback text if image fails
      doc.text("Ministerio del Deporte", pageWidth / 2, 35, {
        align: "center",
      });
    }

    // Título del documento
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("CERTIFICADO DE FECHA DE EXPIRACIÓN", pageWidth / 2, 60, {
      align: "center",
    });

    // Información en formato centrado
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const today = new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const gridData = [
      { label: "Nombre Completo:", value: fullName },
      { label: "Fecha de Expiración:", value: expirationDate },
      { label: "Fecha de Emisión:", value: today },
    ];

    const startY = 90;
    const lineHeight = 10;

    gridData.forEach((item, index) => {
      const y = startY + index * lineHeight;

      doc.text(`${item.label} ${item.value}`, pageWidth / 2, y, {
        align: "center",
      });
    });

    // Texto explicativo justificado
    doc.setFont("helvetica", "normal");
    const textLines = [
      `El Grupo de Tecnología de la Información y las Comunicaciones (TIC) del Ministerio del Deporte le informa que a partir de la fecha de expiración se bloquearán todas sus cuentas de forma automática. Le recordamos que es obligatorio la entrega del backup de su correo a su supervisor.`,
    ];

    doc.text(
      textLines,
      pageWidth / 2,
      startY + gridData.length * lineHeight + 30,
      {
        align: "center",
        maxWidth: pageWidth - 2 * margin - 20,
      }
    );

    // Enlace con más espacio
    doc.setTextColor(0, 0, 255); // Azul para el enlace
    const linkText = "Puede encontrar el backup haciendo clic aquí";
    const linkUrl =
      "https://coldeportes-my.sharepoint.com/:b:/g/personal/soportetics_mindeporte_gov_co/Ea9JDoAlDBZBh2cwToI6frsBvUc-JoKXEDcK2Gd5ba4Gaw?e=IaPXO5";

    doc.textWithLink(
      linkText,
      pageWidth / 2 - doc.getTextWidth(linkText) / 2,
      startY + gridData.length * lineHeight + 50,
      { url: linkUrl }
    );

    // Añadir atentamente y firma con más espacio
    doc.setTextColor(0, 0, 0); // Volver al color negro
    doc.text(
      "Atentamente,\n\nSoporte TIC\nMinisterio del Deporte",
      pageWidth / 2,
      startY + gridData.length * lineHeight + 80,
      {
        align: "center",
      }
    );

    // Pie de página
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(
      "Documento oficial - Ministerio del Deporte",
      pageWidth / 2,
      pageHeight - margin - 10,
      {
        align: "center",
      }
    );

    // Generar PDF
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
    onOpen(); // Open the drawer
  };

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `Certificado_Expiracion_${fullName}.pdf`;
      link.click();
    }
  };

  if (!user || !expirationDate) {
    return null;
  }

  return (
    <div className=" flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Button
        isIconOnly
        color="danger"
        variant="light"
        className="absolute top-4 right-4"
        onClick={handleLogout}
      >
        <LogOutIcon className="w-6 h-6" />
      </Button>

      <div className="flex w-full max-w-4xl ">
        <Card className="w-full shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="flex justify-between items-center p-6 bg-blue-50">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <p className="text-lg font-semibold text-blue-800">
                Información de Cuenta
              </p>
            </div>
            <FileTextIcon
              className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
              onClick={generateCertificate}
            />
          </CardHeader>

          <CardBody className="p-6 space-y-4">
            {fullName && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Nombre:</p>
                <p className="text-xl font-bold text-blue-700">{fullName}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 mb-1">Su cuenta expira el:</p>
              <p className="text-xl font-bold text-red-600">{expirationDate}</p>
            </div>

            <Button
              color="primary"
              variant="solid"
              onClick={generateCertificate}
              className="w-full"
            >
              Generar Certificado
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* PDF Preview Drawer - Modificado para ser 5xl */}
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="right"
        size="5xl"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Vista Previa del Certificado
              </DrawerHeader>
              <DrawerBody className="flex items-center justify-center">
                {pdfUrl && (
                  <iframe
                    src={pdfUrl}
                    width="90%"
                    height="700px"
                    className="border rounded-lg shadow-2xl"
                  />
                )}
              </DrawerBody>
              <DrawerFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  onPress={handleDownloadPDF}
                  startContent={<DownloadIcon className="w-4 h-4" />}
                >
                  Descargar PDF
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <div className="absolute bottom-4 text-center w-full text-xs text-gray-500">
        Contacte a soportetics@mindeporte.gov.co si la fecha no es correcta
      </div>
    </div>
  );
}

export default UserExpiration;
