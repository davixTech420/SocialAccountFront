/* import { useState } from "react"
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native"
import { Video } from "expo-av"
import * as ImagePicker from "expo-image-picker"
import { uploadVideoToServer } from "@/services/adminService"

interface VideoUploaderProps {
  endpoint: string
  onUploadSuccess?: (response: any) => void
  onUploadError?: (error: string) => void
}

export default function VideoUploader({ endpoint, onUploadSuccess, onUploadError }: VideoUploaderProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const pickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Error", "Se necesitan permisos para acceder a la galería")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      })

      if (!result.canceled && result.assets[0]) {
        setSelectedVideo(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar el video")
    }
  }

  const recordVideo = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Error", "Se necesitan permisos para acceder a la cámara")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      })

      if (!result.canceled && result.assets[0]) {
        setSelectedVideo(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo grabar el video")
    }
  }

  const uploadVideo = async () => {
    if (!selectedVideo) {
      Alert.alert("Error", "Selecciona un video primero")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("video", {
        uri: selectedVideo,
        type: "video/mp4",
        name: "video.mp4",
      } as any)

      const response = await uploadVideoToServer(formData);

      if (response.ok) {
        const result = await response.json()
        Alert.alert("Éxito", "Video subido correctamente")
        onUploadSuccess?.(result)
        setSelectedVideo(null)
      } else {
        throw new Error("Error en la subida")
      }
    } catch (error) {
      const errorMessage = "Error al subir el video"
      Alert.alert("Error", errorMessage)
      onUploadError?.(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir Video</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickVideo}>
          <Text style={styles.buttonText}>Seleccionar de Galería</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={recordVideo}>
          <Text style={styles.buttonText}>Grabar Video</Text>
        </TouchableOpacity>
      </View>

      {selectedVideo && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Vista previa:</Text>
          <Video
            source={{ uri: selectedVideo }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
          />

          <TouchableOpacity
            style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
            onPress={uploadVideo}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.uploadButtonText}>Subir Video</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "600",
  },
  previewContainer: {
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  video: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  uploadButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  uploadButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  uploadButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
})
 */
"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Pressable } from "react-native"
import Animated, { FadeInDown, SlideInDown } from "react-native-reanimated"

const PlusIcon = () => (
  <View className="w-6 h-6 items-center justify-center">
    <View className="absolute w-4 h-0.5 bg-cyan-400" />
    <View className="absolute w-0.5 h-4 bg-cyan-400" />
  </View>
)

const CheckIcon = ({ checked }: { checked: boolean }) => (
  <View
    className={`w-6 h-6 rounded border-2 items-center justify-center ${
      checked ? "bg-cyan-500 border-cyan-500" : "border-gray-600"
    }`}
  >
    {checked && <Text className="text-white text-xs font-bold">✓</Text>}
  </View>
)

const InstagramIcon = () => (
  <View className="w-10 h-10 rounded-xl bg-pink-600 items-center justify-center">
    <View className="w-6 h-6 rounded-lg border-2 border-white" />
  </View>
)

const TikTokIcon = () => (
  <View className="w-10 h-10 rounded-xl bg-black items-center justify-center">
    <Text className="text-white font-bold text-lg">TT</Text>
  </View>
)

const YouTubeIcon = () => (
  <View className="w-10 h-10 rounded-xl bg-red-600 items-center justify-center">
    <Text className="text-white font-bold text-xl">▶</Text>
  </View>
)

const FacebookIcon = () => (
  <View className="w-10 h-10 rounded-xl bg-blue-600 items-center justify-center">
    <Text className="text-white font-bold text-2xl">f</Text>
  </View>
)

const TwitterIcon = () => (
  <View className="w-10 h-10 rounded-xl bg-sky-500 items-center justify-center">
    <Text className="text-white font-bold text-xl">𝕏</Text>
  </View>
)

// Tipos
interface Video {
  id: string
  title: string
  thumbnail: string
  author: string
}

interface SocialNetwork {
  id: string
  name: string
  icon: React.ReactNode
}

// Componente de Video Item
const VideoItem = ({ video, index }: { video: Video; index: number }) => (
  <Animated.View
    entering={FadeInDown.delay(index * 100).springify()}
    className="flex-row items-center p-4 mb-2 bg-slate-800/50 rounded-xl"
  >
    <Image source={{ uri: video.thumbnail }} className="w-16 h-16 rounded-lg" resizeMode="cover" />
    <View className="flex-1 ml-4">
      <Text className="text-white text-base font-medium">{video.title}</Text>
      <Text className="text-gray-400 text-sm mt-1">by {video.author}</Text>
    </View>
  </Animated.View>
)

const UploadModal = ({
  visible,
  onClose,
  videos,
  onConfirm,
}: {
  visible: boolean
  onClose: () => void
  videos: Video[]
  onConfirm: (videoId: string, networks: string[]) => void
}) => {
  const [step, setStep] = useState<"video" | "networks">("video")
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([])

  const socialNetworks: SocialNetwork[] = [
    { id: "instagram", name: "Instagram", icon: <InstagramIcon /> },
    { id: "tiktok", name: "TikTok", icon: <TikTokIcon /> },
    { id: "youtube", name: "YouTube", icon: <YouTubeIcon /> },
    { id: "facebook", name: "Facebook", icon: <FacebookIcon /> },
    { id: "twitter", name: "Twitter", icon: <TwitterIcon /> },
  ]

  const toggleNetwork = (id: string) => {
    setSelectedNetworks((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]))
  }

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  const handleContinue = () => {
    if (step === "video" && selectedVideo) {
      setStep("networks")
    }
  }

  const handleBack = () => {
    if (step === "networks") {
      setStep("video")
      setSelectedNetworks([])
    }
  }

  const handleConfirm = () => {
    if (selectedVideo && selectedNetworks.length > 0) {
      onConfirm(selectedVideo, selectedNetworks)
      // Reset state
      setStep("video")
      setSelectedVideo(null)
      setSelectedNetworks([])
      onClose()
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setStep("video")
    setSelectedVideo(null)
    setSelectedNetworks([])
    onClose()
  }

  const selectedVideoData = videos.find((v) => v.id === selectedVideo)

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View className="flex-1 bg-black/70 justify-end">
        <Pressable className="flex-1" onPress={handleClose} />
        <Animated.View entering={SlideInDown.springify()} className="bg-slate-900 rounded-t-3xl p-6 max-h-[80%]">
          <View className="w-12 h-1 bg-gray-600 rounded-full self-center mb-6" />

          {step === "video" ? (
            <>
              <Text className="text-white text-2xl font-bold mb-2">Selecciona un video</Text>
              <Text className="text-gray-400 text-base mb-6">Elige el video que quieres subir</Text>

              <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
                {videos.map((video, index) => (
                  <Animated.View key={video.id} entering={FadeInDown.delay(index * 50).springify()}>
                    <TouchableOpacity
                      className={`flex-row items-center p-4 mb-3 rounded-xl ${
                        selectedVideo === video.id ? "bg-cyan-500/20 border-2 border-cyan-500" : "bg-slate-800"
                      }`}
                      onPress={() => handleVideoSelect(video.id)}
                    >
                      <Image source={{ uri: video.thumbnail }} className="w-20 h-20 rounded-lg" resizeMode="cover" />
                      <View className="flex-1 ml-4">
                        <Text className="text-white text-lg font-medium">{video.title}</Text>
                        <Text className="text-gray-400 text-sm mt-1">by {video.author}</Text>
                      </View>
                      <CheckIcon checked={selectedVideo === video.id} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </ScrollView>

              <TouchableOpacity
                className={`p-4 rounded-xl mt-4 ${selectedVideo ? "bg-cyan-500 active:bg-cyan-600" : "bg-gray-700"}`}
                onPress={handleContinue}
                disabled={!selectedVideo}
              >
                <Text className="text-white text-center text-lg font-bold">Continuar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {selectedVideoData && (
                <View className="mb-4 p-4 bg-slate-800 rounded-xl flex-row items-center">
                  <Image
                    source={{ uri: selectedVideoData.thumbnail }}
                    className="w-16 h-16 rounded-lg"
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-4">
                    <Text className="text-white text-base font-medium">{selectedVideoData.title}</Text>
                    <Text className="text-gray-400 text-sm">by {selectedVideoData.author}</Text>
                  </View>
                </View>
              )}

              <Text className="text-white text-2xl font-bold mb-2">Selecciona las redes sociales</Text>
              <Text className="text-gray-400 text-base mb-6">Elige dónde quieres subir tu video</Text>

              <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
                {socialNetworks.map((network, index) => (
                  <Animated.View key={network.id} entering={FadeInDown.delay(index * 50).springify()}>
                    <TouchableOpacity
                      className="flex-row items-center p-4 mb-3 bg-slate-800 rounded-xl active:bg-slate-700"
                      onPress={() => toggleNetwork(network.id)}
                    >
                      {network.icon}
                      <Text className="text-white text-lg font-medium ml-4 flex-1">{network.name}</Text>
                      <CheckIcon checked={selectedNetworks.includes(network.id)} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </ScrollView>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-slate-700 p-4 rounded-xl active:bg-slate-600"
                  onPress={handleBack}
                >
                  <Text className="text-white text-center text-lg font-bold">Atrás</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-4 rounded-xl ${
                    selectedNetworks.length > 0 ? "bg-cyan-500 active:bg-cyan-600" : "bg-gray-700"
                  }`}
                  onPress={handleConfirm}
                  disabled={selectedNetworks.length === 0}
                >
                  <Text className="text-white text-center text-lg font-bold">
                    Subir a {selectedNetworks.length} red{selectedNetworks.length !== 1 ? "es" : ""}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}

// Componente Principal
export default function Upload() {
  const [modalVisible, setModalVisible] = useState(false)

  const videos: Video[] = [
    {
      id: "1",
      title: "Video de corre",
      thumbnail: "/person-running-park.png",
      author: "Krealo",
    },
    {
      id: "2",
      title: "Video de viaje",
      thumbnail: "/diverse-travelers-world-map.png",
      author: "Krealo",
    },
    {
      id: "3",
      title: "Video de ejercicio",
      thumbnail: "/diverse-group-exercising.png",
      author: "Krealo",
    },
    {
      id: "4",
      title: "Video de jiremia",
      thumbnail: "/giraffe-standing.png",
      author: "Krealo",
    },
  ]

  const handleUploadVideo = () => {
    setModalVisible(true)
  }

  const handleConfirmUpload = (videoId: string, selectedNetworks: string[]) => {
    const video = videos.find((v) => v.id === videoId)
    console.log("[v0] Subiendo video:", video?.title, "a:", selectedNetworks)
  }

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="pt-14 pb-4 px-6 flex-row items-center justify-between border-b border-slate-800">
        <Text className="text-white text-2xl font-bold">Sube Video</Text>
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center bg-cyan-500/20 rounded-full active:bg-cyan-500/30"
          onPress={handleUploadVideo}
        >
          <PlusIcon />
        </TouchableOpacity>
      </View>

      {/* Lista de Videos */}
      <ScrollView className="flex-1 px-4 pt-4">
        {videos.map((video, index) => (
          <VideoItem key={video.id} video={video} index={index} />
        ))}
      </ScrollView>

      <UploadModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        videos={videos}
        onConfirm={handleConfirmUpload}
      />
    </View>
  )
}
