import { useState } from "react"
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
