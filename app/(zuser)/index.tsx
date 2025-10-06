import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"

// Icono de flecha hacia atrás
const BackIcon = () => (
  <View className="w-6 h-6 items-center justify-center">
    <Text className="text-white text-xl">←</Text>
  </View>
)

// Tipos de datos
type Tab = "resumen" | "contenido" | "publico" | "interacciones"

interface MetricCardProps {
  label: string
  value: string
}

interface PlatformMetricProps {
  platform: string
  views: string
  period: string
}

// Componente de tarjeta de métrica
const MetricCard = ({ label, value }: MetricCardProps) => (
  <View className="bg-slate-800/50 rounded-xl p-4 mb-3">
    <Text className="text-slate-400 text-sm mb-1">{label}</Text>
    <Text className="text-white text-3xl font-bold">{value}</Text>
  </View>
)

// Componente de métrica por plataforma
const PlatformMetric = ({ platform, views, period }: PlatformMetricProps) => (
  <View className="bg-slate-800/50 rounded-xl p-4 mb-3 flex-row justify-between items-center">
    <View>
      <Text className="text-slate-400 text-sm mb-1">{platform}</Text>
      <Text className="text-white text-2xl font-bold">{views}</Text>
    </View>
    <Text className="text-slate-500 text-sm">{period}</Text>
  </View>
)

export default function Analytics() {
  const [activeTab, setActiveTab] = useState<Tab>("resumen")
  const [timePeriod] = useState("Últimos 7 días")

  const tabs: { id: Tab; label: string }[] = [
    { id: "resumen", label: "Resumen" },
    { id: "contenido", label: "Contenido" },
    { id: "publico", label: "Público" },
    { id: "interacciones", label: "Interacciones" },
  ]

  // Datos de ejemplo
  const generalMetrics = [
    { label: "Total de vistas", value: "12.5K" },
    { label: "Nuevos suscriptores", value: "2.3K" },
    { label: "Tiempo de visualización", value: "567" },
  ]

  const platformMetrics = [
    { platform: "Vistas en TikTok", views: "8.2K", period: timePeriod },
    { platform: "Vistas en Instagram", views: "3.1K", period: timePeriod },
    { platform: "Vistas en YouTube", views: "1.2K", period: timePeriod },
  ]

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center border-b border-slate-800">
        <TouchableOpacity className="mr-3">
          <BackIcon />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Analíticas</Text>
      </View>

      {/* Tabs */}
      <View className="px-4 py-3 border-b border-slate-800">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`mr-6 pb-2 ${index === 0 ? "" : ""}`}
            >
              <Text className={`text-sm font-medium ${activeTab === tab.id ? "text-cyan-400" : "text-slate-400"}`}>
                {tab.label}
              </Text>
              {activeTab === tab.id && <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-6">
        {/* Rendimiento general */}
        <View className="mb-6">
          <Text className="text-white text-lg font-semibold mb-4">Rendimiento general</Text>
          {generalMetrics.map((metric, index) => (
            <MetricCard key={index} label={metric.label} value={metric.value} />
          ))}
        </View>

        {/* Rendimiento por plataforma */}
        <View>
          <Text className="text-white text-lg font-semibold mb-4">Rendimiento por plataforma</Text>
          {platformMetrics.map((metric, index) => (
            <PlatformMetric key={index} platform={metric.platform} views={metric.views} period={metric.period} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
