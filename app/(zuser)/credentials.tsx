import { useState, use, useEffect } from "react";
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
