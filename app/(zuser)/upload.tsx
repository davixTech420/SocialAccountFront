"use client"

import { useState } from "react"
import { View } from "react-native"
import CrudTable from "@/components/CrudTable";

// Ejemplo de uso del componente
const ExampleUsage = () => {
  const [users, setUsers] = useState([
    { id: "1", name: "Juan Pérez", email: "juan@email.com", age: 25 },
    { id: "2", name: "María García", email: "maria@email.com", age: 30 },
    { id: "3", name: "Carlos López", email: "carlos@email.com", age: 28 },
  ])

  const userFields = [
    { key: "name", label: "Nombre", type: "text" as const, required: true },
    { key: "email", label: "Email", type: "email" as const, required: true },
    { key: "age", label: "Edad", type: "number" as const, required: true },
  ]

  const handleCreate = async (newUser: any) => {
    const id = Date.now().toString()
    setUsers([...users, { ...newUser, id }])
  }

  const handleUpdate = async (id: string, updatedUser: any) => {
    setUsers(users.map((user) => (user.id === id ? { ...updatedUser, id } : user)))
  }

  const handleDelete = async (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

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
  )
}

export default ExampleUsage
