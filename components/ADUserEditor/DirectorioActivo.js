import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Users, UserPlus, Edit } from "lucide-react";
import ADUserEditor from "./ADUserEditor";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@nextui-org/react";

const DirectorioActivo = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-6">
          <Users className="h-16 w-16 text-blue-600" />

          <h1 className="text-3xl font-bold text-gray-800">
            Directorio Activo
          </h1>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Button
              variant="bordered"
              className="w-full gap-2 text-lg py-6 border-gray-300 text-gray-800"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Edit className="h-5 w-5" />
              Editar Usuarios
            </Button>

            <Button className="w-full gap-2 text-lg py-6">
              <UserPlus className="h-5 w-5" />
              Crear Usuario
            </Button>
          </div>
        </div>
      </div>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        size="5xl"
        placement="right"
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        backdrop="blur"
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1 text-[#4a53a0]">
            Detalles del Usuario
          </DrawerHeader>
          <DrawerBody>
            <ADUserEditor
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button
              color="primary"
              variant="light"
              onPress={() => setIsDrawerOpen(false)}
            >
              Cerrar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DirectorioActivo;
