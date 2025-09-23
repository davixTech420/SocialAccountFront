import { useState, useEffect } from "react";
import { View } from "react-native";
import CrudTable from "@/components/CrudTable";
import { getUsers, createUser,updateUser,deleteUser } from "@/services/adminService";

// Ejemplo de uso del componente
const ExampleUsage = () => {
  const [users, setUsers] = useState([
    // Datos por defecto (mientras carga la API)
    { id: "1", name: "Juan Pérez", email: "juan@email.com", age: 25 },
    { id: "2", name: "María García", email: "maria@email.com", age: 30 },
    { id: "3", name: "Carlos López", email: "carlos@email.com", age: 28 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers); // Sobrescribe con lo que venga del backend
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };

    fetchData();
  }, []);

  const userFields = [
    { key: "email", label: "Email", type: "email" as const, required: true },
    {
      key: "password",
      label: "Password",
      type: "text" as const,
      required: true,
    },
  ];

  const handleCreate = async (newUser: any) => {
    try {
      const createdUser = await createUser(newUser);

      setUsers((prevUsers) => [...prevUsers, createdUser]);
    } catch (error) {
      console.error("Error creando usuario:", error);
    }
  };

  const handleUpdate = async (id: string, updatedUser: any) => {
    await updateUser(id, updatedUser);
    setUsers(
      users.map((user) => (user.id === id ? { ...updatedUser, id } : user))
    );
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
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
        searchableFields={["email"]}
        title="Usuarios"
        itemsPerPage={5}
      />
    </View>
  );
};

export default ExampleUsage;
