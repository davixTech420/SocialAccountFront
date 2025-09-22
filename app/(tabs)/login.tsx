import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useAuth } from "@/contexts/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const Login = () => {
  const {login} = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Recuperar contraseña", "Funcionalidad en desarrollo")
  }

  const handleSignUp = () => {
    Alert.alert("Registro", "Ir a pantalla de registro")
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <ThemedView className="flex-1 justify-center px-8 py-12">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-6">
              <Text className="text-white text-2xl font-bold">L</Text>
            </View>
            <ThemedText className="text-3xl font-bold mb-2">Bienvenido</ThemedText>
            <ThemedText className="text-center">Inicia sesión en tu cuenta</ThemedText>
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Email Input */}
            <View>
              <ThemedText className="text-sm font-medium mb-2">Email</ThemedText>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 text-base"
                placeholder="tu@email.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View>
              <ThemedText className="text-sm font-medium mb-2">Contraseña</ThemedText>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 text-base"
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} className="self-end">
              <Text className="text-blue-500 text-sm font-medium">¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              className={`w-full py-4 rounded-lg items-center ${isLoading ? "bg-blue-300" : "bg-blue-500"}`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white text-base font-semibold">
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">o</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Login
