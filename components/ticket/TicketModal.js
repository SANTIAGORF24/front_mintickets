import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Button,
} from "@nextui-org/react";
import { Download } from "react-feather"; // Asegúrate de tener importados los íconos necesarios

export function TicketModal({
  isOpen,
  onClose,
  description,
  descriptionAttachments = [],
  downloadAttachment,
}) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="5xl" // Puedes ajustar el tamaño a lo que necesites
      placement="right" // Colocarlo a la derecha
      isDismissable={true}
      isKeyboardDismissDisabled={false}
      backdrop="blur"
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1 text-[#4a53a0]">
          Descripción del Ticket
        </DrawerHeader>
        <DrawerBody>
          <p className="text-black whitespace-pre-wrap break-words">
            {description}
          </p>

          {/* Archivos adjuntos de la descripción */}
          {Array.isArray(descriptionAttachments) &&
            descriptionAttachments.length > 0 && (
              <div className="mt-4">
                <h3 className="text-[#4a53a0] font-medium text-lg">
                  Archivos adjuntos:
                </h3>
                <div className="mt-2">
                  {descriptionAttachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-2"
                    >
                      <span className="text-sm text-gray-700 truncate">
                        {attachment.file_name}
                      </span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onClick={() => downloadAttachment(attachment.id, true)}
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </DrawerBody>
        <DrawerFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            Cerrar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
