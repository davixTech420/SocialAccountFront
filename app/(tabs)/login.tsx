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
import { login } from "@/services/authService";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    setIsLoading(true)

    await login(email, password)
      .then(() => {
        Alert.alert("Éxito", "Has iniciado sesión correctamente")
      })
      .catch((error) => {
        Alert.alert("Error", error.message || "Error al iniciar sesión")
      })
      .finally(() => {
        setIsLoading(false)
      })
    
  }

  const handleForgotPassword = () => {
    Alert.alert("Recuperar contraseña", "Funcionalidad en desarrollo")
  }

  const handleSignUp = () => {
    Alert.alert("Registro", "Ir a pantalla de registro")
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-8 py-12">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-6">
              <Text className="text-white text-2xl font-bold">L</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-2">Bienvenido</Text>
            <Text className="text-gray-600 text-center">Inicia sesión en tu cuenta</Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Email Input */}
            <View>
              <Text className="text-gray-700 text-sm font-medium mb-2">Email</Text>
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
              <Text className="text-gray-700 text-sm font-medium mb-2">Contraseña</Text>
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

          {/* Social Login Buttons */}
          <View className="space-y-3">
            <TouchableOpacity className="w-full py-3 border border-gray-300 rounded-lg items-center flex-row justify-center">
              <Text className="text-gray-700 text-base font-medium ml-2">Continuar con Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-full py-3 border border-gray-300 rounded-lg items-center flex-row justify-center">
              <Text className="text-gray-700 text-base font-medium ml-2">Continuar con Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600 text-base">¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text className="text-blue-500 text-base font-medium">Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Login
