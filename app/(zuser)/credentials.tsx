/* import { useState, use, useEffect } from "react";
import { Button, View } from "react-native";
import CrudTable from "@/components/CrudTable";
import { getCredentials,createCredentials,deleteCredentials,updateCredentials,loginGoogle } from "@/services/adminService";
import { router } from "expo-router";
// Ejemplo de uso del componente
const CredentialsPage = () => {
  const [credentials, setCredentials] = useState([
    { id: "1", platform: "YouTube", clientId: "abc123", clientSecret: "secret1", accessToken: "token1", refreshToken: "refresh1", expiresAt: "2023-12-31", pageId: "page1", channelId: "channel1", extraData: "extra1" },
    { id: "2", platform: "Facebook", clientId: "def456", clientSecret: "secret2", accessToken: "token2", refreshToken: "refresh2", expiresAt: "2023-12-31", pageId: "page2", channelId: "channel2", extraData: "extra2" },
    { id: "3", platform: "Twitter", clientId: "ghi789", clientSecret: "secret3", accessToken: "token3", refreshToken: "refresh3", expiresAt: "2023-12-31", pageId: "page3", channelId: "channel3", extraData: "extra3" },
  ]);

useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCredentials = await getCredentials();
        setCredentials(fetchedCredentials);
      } catch (error) {
        console.error("Error fetching credentials:", error);
      }
    };

    fetchData();
  }, []);

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

  const handleCreate = async (newCredential: any) => {
    const createdCredential = await createCredentials(newCredential);
    setCredentials((prevCredentials) => [...prevCredentials, createdCredential]);
  };

  const handleUpdate = async (id: string, updatedCredential: any) => {
    const updated = await updateCredentials(id, updatedCredential);
    setCredentials(
      credentials.map((credential) => (credential.id === id ? { ...updated, id } : credential))
    );
  };

  const handleDelete = async (id: string) => {
    await deleteCredentials(id);
    setCredentials(credentials.filter((credential) => credential.id !== id));
  };

  return (
    <View className="flex-1">
      <Button onPress={async () => { loginGoogle() }} title="Conectar con Google" />
      <CrudTable
        data={credentials}
        fields={userFields}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        searchableFields={["platform", "clientId", "clientSecret"]}
        title="Credenciales"
        itemsPerPage={5}
      />
    </View>
  );
};

export default CredentialsPage;
 */

"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, Switch, ActivityIndicator, Linking, Alert } from "react-native"

// Tipos
interface SocialAccount {
  id: string
  name: string
  username?: string
  isConnected: boolean
  icon: string
  color: string
  authUrl: string
}

// Iconos de redes sociales
const SocialIcon = ({ name, color }: { name: string; color: string }) => {
  const icons: { [key: string]: string } = {
    tiktok: "♪",
    instagram: "📷",
    youtube: "▶",
    facebook: "f",
    twitter: "🐦",
  }

  return (
    <View className={`w-10 h-10 rounded-full items-center justify-center`} style={{ backgroundColor: color }}>
      <Text className="text-white text-xl font-bold">{icons[name] || "?"}</Text>
    </View>
  )
}

// Componente principal
export default function Credential() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: "tiktok",
      name: "TikTok",
      username: "",
      isConnected: false,
      icon: "tiktok",
      color: "#000000",
      authUrl: "https://api.example.com/auth/tiktok",
    },
    {
      id: "instagram",
      name: "Instagram",
      username: "",
      isConnected: false,
      icon: "instagram",
      color: "#E4405F",
      authUrl: "https://api.example.com/auth/instagram",
    },
    {
      id: "youtube",
      name: "YouTube",
      username: "",
      isConnected: false,
      icon: "youtube",
      color: "#FF0000",
      authUrl: "https://api.example.com/auth/youtube",
    },
    {
      id: "facebook",
      name: "Facebook",
      username: "",
      isConnected: false,
      icon: "facebook",
      color: "#1877F2",
      authUrl: "https://api.example.com/auth/facebook",
    },
    {
      id: "twitter",
      name: "Twitter",
      username: "",
      isConnected: false,
      icon: "twitter",
      color: "#1DA1F2",
      authUrl: "https://api.example.com/auth/twitter",
    },
  ])

  const [loading, setLoading] = useState(true)

  // Fetch del estado de las cuentas conectadas
  useEffect(() => {
    fetchConnectedAccounts()
  }, [])

  const fetchConnectedAccounts = async () => {
    try {
      setLoading(true)
      // Reemplaza con tu endpoint real
      const response = await fetch("https://api.example.com/user/connected-accounts", {
        headers: {
          Authorization: "Bearer YOUR_TOKEN_HERE",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Error al obtener cuentas conectadas")
      }

      const data = await response.json()

      // Actualizar el estado con los datos del servidor
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) => {
          const connectedAccount = data.accounts?.find((a: any) => a.platform === account.id)
          return {
            ...account,
            isConnected: connectedAccount?.isConnected || false,
            username: connectedAccount?.username || "",
          }
        }),
      )
    } catch (error) {
      console.error("Error fetching connected accounts:", error)
      Alert.alert("Error", "No se pudieron cargar las cuentas conectadas. Usando datos de ejemplo.")
    } finally {
      setLoading(false)
    }
  }

  // Manejar el toggle de conexión
  const handleToggle = async (accountId: string, currentValue: boolean) => {
    const account = accounts.find((a) => a.id === accountId)
    if (!account) return

    if (!currentValue) {
      // Conectar: redirigir a la URL de autenticación
      try {
        const canOpen = await Linking.canOpenURL(account.authUrl)
        if (canOpen) {
          await Linking.openURL(account.authUrl)
          // Después de que el usuario regrese, refrescar el estado
          setTimeout(() => {
            fetchConnectedAccounts()
          }, 2000)
        } else {
          Alert.alert("Error", "No se puede abrir la URL de autenticación")
        }
      } catch (error) {
        console.error("Error opening auth URL:", error)
        Alert.alert("Error", "No se pudo iniciar el proceso de autenticación")
      }
    } else {
      // Desconectar
      Alert.alert("Desconectar cuenta", `¿Estás seguro de que quieres desconectar tu cuenta de ${account.name}?`, [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Desconectar",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`https://api.example.com/user/disconnect/${accountId}`, {
                method: "POST",
                headers: {
                  Authorization: "Bearer YOUR_TOKEN_HERE",
                  "Content-Type": "application/json",
                },
              })

              if (response.ok) {
                setAccounts((prevAccounts) =>
                  prevAccounts.map((a) => (a.id === accountId ? { ...a, isConnected: false, username: "" } : a)),
                )
              } else {
                throw new Error("Error al desconectar")
              }
            } catch (error) {
              console.error("Error disconnecting account:", error)
              Alert.alert("Error", "No se pudo desconectar la cuenta")
            }
          },
        },
      ])
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-[#0a1628] items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-400 mt-4">Cargando cuentas...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-[#0a1628]">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-12 pb-6">
          <Text className="text-white text-2xl font-bold">Cuentas</Text>
        </View>

        {/* Título de sección */}
        <View className="px-6 pb-4">
          <Text className="text-white text-lg font-semibold">Cuentas conectadas</Text>
        </View>

        {/* Lista de cuentas */}
        <View className="px-6">
          {accounts.map((account, index) => (
            <View
              key={account.id}
              className={`flex-row items-center justify-between py-4 ${
                index !== accounts.length - 1 ? "border-b border-gray-800" : ""
              }`}
            >
              {/* Icono y nombre */}
              <View className="flex-row items-center flex-1">
                <SocialIcon name={account.icon} color={account.color} />
                <View className="ml-4 flex-1">
                  <Text className="text-white text-base font-medium">{account.name}</Text>
                  {account.isConnected && account.username && (
                    <Text className="text-gray-400 text-sm mt-1">@{account.username}</Text>
                  )}
                </View>
              </View>

              {/* Switch */}
              <Switch
                value={account.isConnected}
                onValueChange={(value) => handleToggle(account.id, account.isConnected)}
                trackColor={{ false: "#374151", true: "#3b82f6" }}
                thumbColor={account.isConnected ? "#ffffff" : "#9ca3af"}
                ios_backgroundColor="#374151"
              />
            </View>
          ))}
        </View>

        {/* Información adicional */}
        <View className="px-6 py-6">
          <Text className="text-gray-400 text-sm leading-5">
            Conecta tus cuentas de redes sociales para publicar contenido directamente desde la app.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
