import { useState } from "react";
import { View } from "react-native";
import CrudTable from "@/components/CrudTable";

// Ejemplo de uso del componente
const ExampleUsage = () => {
  const [users, setUsers] = useState([
    { id: "1", name: "Juan Pérez", email: "juan@email.com", age: 25 },
    { id: "2", name: "María García", email: "maria@email.com", age: 30 },
    { id: "3", name: "Carlos López", email: "carlos@email.com", age: 28 },
  ]);

  const userFields = [
    {
      key: "platform",
      label: "Plataforma",
      type: "text" as const,
      required: true,
    },
    {
      key: "clientId",
      label: "Client ID",
      type: "text" as const,
      required: false,
    },
    {
      key: "clientSecret",
      label: "Client Secret",
      type: "text" as const,
      required: false,
    },
    {
      key: "accessToken",
      label: "Access Token",
      type: "text" as const,
      required: false,
    },
    {
      key: "refreshToken",
      label: "Refresh Token",
      type: "text" as const,
      required: false,
    },
    {
      key: "expiresAt",
      label: "Expires At",
      type: "text" as const,
      required: false,
    },
    { key: "pageId", label: "Page ID", type: "text" as const, required: false },
    {
      key: "channelId",
      label: "Channel ID",
      type: "text" as const,
      required: false,
    },
    {
      key: "extraData",
      label: "Extra data",
      type: "text" as const,
      required: true,
    },
  ];

  const handleCreate = async (newUser: any) => {
    const id = Date.now().toString();
    setUsers([...users, { ...newUser, id }]);
  };

  const handleUpdate = async (id: string, updatedUser: any) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...updatedUser, id } : user))
    );
  };

  const handleDelete = async (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <View className="flex-1">
      <CrudTable
        data={users}
        fields={userFields}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        searchableFields={["name", "email"]}
        title="Usuarios"
        itemsPerPage={5}
      />
    </View>
  );
};

export default ExampleUsage;
