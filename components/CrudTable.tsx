"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, FadeIn } from "react-native-reanimated"

interface CrudField {
  key: string
  label: string
  type: "text" | "number" | "email"
  required?: boolean
  editable?: boolean
}

interface CrudTableProps {
  data: any[]
  fields: CrudField[]
  onCreate: (item: any) => Promise<void>
  onUpdate: (id: string, item: any) => Promise<void>
  onDelete: (id: string) => Promise<void>
  itemsPerPage?: number
  searchableFields?: string[]
  title?: string
  idField?: string
}

const CrudTable: React.FC<CrudTableProps> = ({
  data,
  fields,
  onCreate,
  onUpdate,
  onDelete,
  itemsPerPage = 10,
  searchableFields = [],
  title = "Datos",
  idField = "id",
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [loading, setLoading] = useState(false)

  // Animaciones
  const modalScale = useSharedValue(0)
  const buttonScale = useSharedValue(1)

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
  }))

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  // Filtrar datos por búsqueda
  const filteredData = useMemo(() => {
    if (!searchQuery) return data

    return data.filter((item) =>
      searchableFields.some((field) => item[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }, [data, searchQuery, searchableFields])

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const openModal = (item?: any) => {
    setEditingItem(item)
    setFormData(item ? { ...item } : {})
    setModalVisible(true)
    modalScale.value = withSpring(1)
  }

  const closeModal = () => {
    modalScale.value = withTiming(0, { duration: 200 })
    setTimeout(() => {
      setModalVisible(false)
      setEditingItem(null)
      setFormData({})
    }, 200)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (editingItem) {
        await onUpdate(editingItem[idField], formData)
      } else {
        await onCreate(formData)
      }
      closeModal()
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al guardar")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (item: any) => {
    Alert.alert("Confirmar eliminación", "¿Estás seguro de que deseas eliminar este elemento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          try {
            await onDelete(item[idField])
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el elemento")
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  const animateButton = () => {
    buttonScale.value = withSpring(0.95, { duration: 100 }, () => {
      buttonScale.value = withSpring(1)
    })
  }

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "administrador":
        return "bg-blue-100 text-blue-700"
      case "moderador":
        return "bg-blue-100 text-blue-700"
      case "usuario":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 py-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-gray-900 text-2xl font-semibold">{title}</Text>

          <TouchableOpacity
            className="bg-gray-900 rounded-lg px-4 py-2.5 flex-row items-center"
            onPress={() => {
              animateButton()
              openModal()
            }}
          >
            <Ionicons name="add" size={18} color="white" />
            <Text className="text-white font-medium ml-2">Crear Nuevo</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Buscar..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View className="flex-1 px-6">
        <View className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Header de la tabla */}
          <View className="bg-gray-50 border-b border-gray-200">
            <View className="flex-row px-6 py-4">
              {fields.map((field, index) => (
                <View key={field.key} className={`${index === 0 ? "flex-1" : "w-32"} ${index !== 0 ? "ml-4" : ""}`}>
                  <Text className="text-gray-700 font-medium text-sm">{field.label}</Text>
                </View>
              ))}
              <View className="w-24 ml-4">
                <Text className="text-gray-700 font-medium text-sm">Acciones</Text>
              </View>
            </View>
          </View>

          {/* Filas de datos */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {paginatedData.map((item, index) => (
              <Animated.View
                key={item[idField]}
                entering={FadeIn.delay(index * 50)}
                className="border-b border-gray-100 last:border-b-0"
              >
                <View className="flex-row px-6 py-4 items-center">
                  {fields.map((field, fieldIndex) => (
                    <View
                      key={field.key}
                      className={`${fieldIndex === 0 ? "flex-1" : "w-32"} ${fieldIndex !== 0 ? "ml-4" : ""}`}
                    >
                      {field.key === "rol" || field.key === "role" ? (
                        <View className={`px-2 py-1 rounded-md self-start ${getRoleColor(item[field.key])}`}>
                          <Text className="text-xs font-medium">{item[field.key] || "-"}</Text>
                        </View>
                      ) : (
                        <Text className="text-gray-900 text-sm" numberOfLines={1}>
                          {item[field.key] || "-"}
                        </Text>
                      )}
                    </View>
                  ))}

                  {/* Acciones */}
                  <View className="w-24 ml-4 flex-row">
                    <TouchableOpacity className="p-2 mr-2" onPress={() => openModal(item)}>
                      <Ionicons name="create-outline" size={16} color="#6B7280" />
                    </TouchableOpacity>

                    <TouchableOpacity className="p-2" onPress={() => handleDelete(item)}>
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      </View>

      {totalPages > 1 && (
        <View className="px-6 py-4 border-t border-gray-200">
          <View className="flex-row justify-center items-center">
            <TouchableOpacity
              className={`px-3 py-2 rounded-lg mr-2 ${currentPage === 1 ? "bg-gray-100" : "bg-gray-900"}`}
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(currentPage - 1)}
            >
              <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? "#9CA3AF" : "white"} />
            </TouchableOpacity>

            <Text className="text-gray-700 mx-4">
              Página {currentPage} de {totalPages}
            </Text>

            <TouchableOpacity
              className={`px-3 py-2 rounded-lg ml-2 ${currentPage === totalPages ? "bg-gray-100" : "bg-gray-900"}`}
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage(currentPage + 1)}
            >
              <Ionicons name="chevron-forward" size={16} color={currentPage === totalPages ? "#9CA3AF" : "white"} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <Animated.View style={[animatedModalStyle]} className="bg-white rounded-lg w-full max-w-md">
            <View className="px-6 py-4 border-b border-gray-200">
              <Text className="text-gray-900 text-lg font-semibold">{editingItem ? "Editar" : "Crear"} elemento</Text>
            </View>

            <ScrollView className="px-6 py-4 max-h-96" showsVerticalScrollIndicator={false}>
              {fields.map((field, index) => (
                <View key={field.key} className={index !== fields.length - 1 ? "mb-4" : ""}>
                  <Text className="text-gray-700 font-medium mb-2">
                    {field.label} {field.required && <Text className="text-red-500">*</Text>}
                  </Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                    placeholder={`Ingresa ${field.label.toLowerCase()}`}
                    placeholderTextColor="#9CA3AF"
                    value={formData[field.key]?.toString() || ""}
                    onChangeText={(text) => setFormData({ ...formData, [field.key]: text })}
                    keyboardType={
                      field.type === "number" ? "numeric" : field.type === "email" ? "email-address" : "default"
                    }
                    editable={field.editable !== false}
                  />
                </View>
              ))}
            </ScrollView>

            <View className="px-6 py-4 border-t border-gray-200 flex-row justify-end">
              <TouchableOpacity className="bg-gray-100 rounded-lg px-4 py-2 mr-3" onPress={closeModal}>
                <Text className="text-gray-700 font-medium">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-gray-900 rounded-lg px-4 py-2 flex-row items-center"
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-medium">Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {loading && (
        <View className="absolute inset-0 bg-black/20 justify-center items-center">
          <View className="bg-white rounded-3xl p-8 items-center shadow-lg">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-700 mt-4 font-medium text-base">Procesando...</Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default CrudTable
