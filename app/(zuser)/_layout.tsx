import { Drawer } from "expo-router/drawer";
import React from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useAuth } from "@/contexts/AuthContext";

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const { logout } = useAuth();

  return (
    <>
    {/* <ProtectedRoute> */}
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerActiveTintColor: Colors[colorScheme ?? "light"].tint,
          drawerStyle: Platform.select({
            web: { width: 250 },
            default: {},
          }),
        }}
        drawerContent={(props) => (
          <DrawerContentScrollView {...props}>
            {/* Opciones normales */}
            <DrawerItemList {...props} />

            {/* Botón de Cerrar Sesión */}
            <View className="mt-6 px-4 bottom-0">
              <TouchableOpacity
                className="flex-row items-center py-3"
                onPress={logout}
              >
                <Ionicons name="log-out-outline" size={22} color="red" />
                <Text className="ml-3 text-red-600 font-bold text-base text-bottom">
                  Cerrar sesión
                </Text>
              </TouchableOpacity>
            </View>
          </DrawerContentScrollView>
        )}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Inicio",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="users"
          options={{
            title: "Usuarios",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="credentials"
          options={{
            title: "Credenciales",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="upload"
          options={{
            title: "Videos",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="videocam" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    {/* </ProtectedRoute> */}
    </>
  );
}
