import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, CircularProgress } from "@nextui-org/react";
import { User, Mail, Search, FileUp, Paperclip } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TerceroAutocomplete from "./TerceroAutocomplete";
import SpecialistAutocomplete from "./SpecialistAutocomplete";

export function Nuevoticket() {
  const [descripcionValue, setDescripcionValue] = useState("");
  const [solucionValue, setSolucionValue] = useState("");
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedStatus] = useState({
    id: 1,
    name: "Creado",
  });
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);

  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/topics`
        );
        setTopics(topicsResponse.data.topics);

        const usuariosResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tercerosda`
        );

        if (!usuariosResponse.ok) {
          throw new Error("Error al obtener usuarios");
        }

        const data = await usuariosResponse.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar los datos. Por favor, recarga la página.");
      }
    };

    fetchData();
  }, []);

  // Handle file upload
  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            fileName: file.name,
            fileType: file.type,
            base64Content: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newFiles).then((processedFiles) => {
      setAttachments((prevAttachments) => [
        ...prevAttachments,
        ...processedFiles,
      ]);
    });
  };

  const handleSeleccionTercero = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  // Handle pasted images
  const handlePastedImage = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setAttachments((prevAttachments) => [
              ...prevAttachments,
              {
                fileName: `pasted-image-${new Date().toISOString()}.png`,
                fileType: file.type,
                base64Content: e.target.result,
              },
            ]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // Handle file drop
  const handleFileDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFileUpload(files);
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((_, i) => i !== index)
    );
  };

  // Submit handler with updated attachment logic
  const handleSubmit = async () => {
    try {
      if (!selectedTopic || !usuarioSeleccionado || !selectedUser) {
        toast.error("Por favor, selecciona todos los campos necesarios.");
        return;
      }

      setIsLoading(true);

      const ticketData = {
        fecha_creacion: new Date().toISOString(),
        tema: selectedTopic.name,
        estado: selectedStatus.name,
        tercero_nombre: usuarioSeleccionado.fullName,
        tercero_email: usuarioSeleccionado.email,
        especialista_nombre: selectedUser.fullName,
        especialista_email: selectedUser.email,
        descripcion_caso: descripcionValue,
        solucion_caso: solucionValue,
        attachments: attachments,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/register`,
        ticketData
      );

      if (response.status === 201) {
        toast.success("Ticket creado exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      toast.error("Error al crear el ticket. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render method for attachments
  const renderAttachments = () => {
    return attachments.map((attachment, index) => {
      const fileIcon = getFileIcon(attachment.fileType);
      return (
        <div
          key={index}
          className="flex items-center bg-gray-100 p-2 rounded-lg mb-2"
        >
          {fileIcon}
          <span className="ml-2 flex-grow truncate">{attachment.fileName}</span>
          <button
            onClick={() => removeAttachment(index)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      );
    });
  };

  // Helper function to get file icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/"))
      return <img src="/image-icon.svg" className="w-6 h-6" />;
    if (fileType === "application/pdf")
      return <img src="/pdf-icon.svg" className="w-6 h-6" />;
    if (
      fileType === "application/vnd.ms-powerpoint" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
      return <img src="/ppt-icon.svg" className="w-6 h-6" />;
    if (fileType.startsWith("video/"))
      return <img src="/video-icon.svg" className="w-6 h-6" />;
    return <Paperclip className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="bg-gray-50  flex items-center justify-center p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white shadow-2xl rounded-2xl w-5/6 p-8 ">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#4a53a0]">
            Crear Nuevo Ticket
          </h2>
          <p className="text-gray-500 mt-2">
            Complete todos los campos para registrar su ticket
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna Izquierda: Información Principal */}
          <div className="space-y-6">
            {/* Tema del Ticket */}
            <div>
              <label className="block text-[#4a53a0] font-semibold mb-2">
                Tema del Ticket
              </label>
              <select
                value={selectedTopic?.name || ""}
                onChange={(e) => {
                  const selected = topics.find(
                    (t) => t.name === e.target.value
                  );
                  setSelectedTopic(selected);
                }}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">Seleccionar Tema</option>
                {topics.map((topic) => (
                  <option key={topic.name} value={topic.name}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado del Ticket */}
            <div>
              <label className="block text-[#4a53a0] font-semibold mb-2">
                Estado del Ticket
              </label>
              <input
                type="text"
                value="Creado"
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700"
              />
            </div>

            {/* Tercero */}
            <div className="text-black">
              <label className="block text-[#4a53a0] font-semibold mb-2">
                Tercero
              </label>
              <TerceroAutocomplete
                usuarios={usuarios}
                onSelect={handleSeleccionTercero}
              />
            </div>

            {/* Detalles del Tercero */}
            {usuarioSeleccionado && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-black">
                <h3 className="text-lg font-bold text-blue-800 mb-3">
                  Detalles del Tercero
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="mr-3 text-blue-600" />
                    <span className="text-gray-700">
                      {usuarioSeleccionado.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-3 text-green-600" />
                    <span className="text-gray-700">
                      {usuarioSeleccionado.fullName}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Especialista */}
            <div className="text-black">
              <label className="block text-[#4a53a0] font-semibold mb-2">
                Especialista
              </label>
              <SpecialistAutocomplete
                onSelect={(specialist) => {
                  setSelectedUser(specialist);
                  setSelectedUserEmail(specialist.email);
                }}
              />
              {selectedUserEmail && (
                <p className="text-sm text-gray-500 mt-2">
                  Correo: {selectedUserEmail}
                </p>
              )}
            </div>
          </div>

          {/* Columna Derecha: Descripción y Solución */}
          <div className="md:col-span-2 space-y-6 text-black">
            {/* Descripción del Caso */}
            <div>
              <label className="block text-[#4a53a0] font-semibold mb-2">
                Descripción del Caso
              </label>
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4"
              >
                <textarea
                  className="w-full h-48 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={descripcionValue}
                  onChange={(e) => setDescripcionValue(e.target.value)}
                  onPaste={handlePastedImage}
                  placeholder="Describe el caso detalladamente... Puedes pegar imágenes directamente aquí."
                />

                {/* File Upload Section */}
                <div className="mt-4">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.ppt,.pptx,.mp4,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.docx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="flex items-center justify-center p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition"
                  >
                    <FileUp className="mr-2" />+ Añadir archivos
                  </label>

                  {/* Uploaded Files Preview */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">{renderAttachments()}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Botón de Crear Ticket */}
            <div className="mt-6">
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#4a53a0] text-white py-4 text-lg rounded-xl hover:bg-[#666eb5] transition duration-300 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress
                    size="sm"
                    color="current"
                    aria-label="Creando ticket..."
                  />
                ) : (
                  "Crear Ticket"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nuevoticket;
