const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "TEMA", uid: "topic" },
  { name: "ACCIONES", uid: "actions" },
];

const statusOptions = ["Gesdoc", "Red", "Impresoras"];

const users = [
  { id: 1, topic: "Gesdoc" },
  { id: 2, topic: "Red" },
  { id: 3, topic: "Impresoras" },
  // Agrega más usuarios según sea necesario
];

export { columns, users, statusOptions };
