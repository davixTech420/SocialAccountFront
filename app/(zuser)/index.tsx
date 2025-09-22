import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Modal, 
  FlatList, 
  StatusBar,
  SafeAreaView,
  Dimensions 
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const {logout } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [isNotificationModalVisible, setNotificationModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  // Datos de ejemplo
  const statsData = [
    { id: '1', title: 'Ventas Hoy', value: '$2,450', change: '+12%', icon: '💰', color: '#10B981' },
    { id: '2', title: 'Usuarios', value: '1,234', change: '+8%', icon: '👥', color: '#3B82F6' },
    { id: '3', title: 'Pedidos', value: '89', change: '-3%', icon: '📦', color: '#F59E0B' },
    { id: '4', title: 'Tasa Conversión', value: '24%', change: '+4%', icon: '📊', color: '#8B5CF6' },
  ];

  const recentActivities = [
    { id: '1', user: 'Juan Pérez', action: 'Realizó una compra', time: 'Hace 2 min', amount: '$150' },
    { id: '2', user: 'María García', action: 'Completó registro', time: 'Hace 15 min', amount: '' },
    { id: '3', user: 'Carlos López', action: 'Dejó una reseña', time: 'Hace 30 min', amount: '' },
    { id: '4', user: 'Ana Martínez', action: 'Realizó una compra', time: 'Hace 45 min', amount: '$89' },
  ];

  const notifications = [
    { id: '1', title: 'Nuevo pedido', message: 'Tienes un nuevo pedido #1234', time: '2 min ago' },
    { id: '2', title: 'Pago recibido', message: 'Pago de $150 confirmado', time: '15 min ago' },
    { id: '3', title: 'Actualización', message: 'Sistema actualizado correctamente', time: '1 hora ago' },
  ];

  const renderStatsCard = (item) => (
    <View key={item.id} style={{
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      width: (width - 48) / 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 24 }}>{item.icon}</Text>
        <Text style={{ 
          color: item.change.includes('+') ? '#10B981' : '#EF4444',
          fontSize: 12,
          fontWeight: '600'
        }}>
          {item.change}
        </Text>
      </View>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 4 }}>
        {item.value}
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280' }}>
        {item.title}
      </Text>
    </View>
  );

  const renderActivityItem = ({ item }) => (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
      }}>
        <Text style={{ fontSize: 20 }}>👤</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937' }}>
          {item.user}
        </Text>
        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
          {item.action} {item.amount && `• ${item.amount}`}
        </Text>
      </View>
      <Text style={{ fontSize: 10, color: '#9CA3AF' }}>
        {item.time}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={{
        backgroundColor: '#fff',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#1F2937' }}>
              Dashboard
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
              Bienvenido de nuevo, Admin
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity 
              onPress={() => setNotificationModalVisible(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}
            >
              <Text style={{ fontSize: 20 }}>🔔</Text>
              <View style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#EF4444'
              }} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setProfileModalVisible(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#E5E7EB',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ fontSize: 20 }}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Search Bar */}
        <View style={{
          backgroundColor: '#F3F4F6',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginTop: 16,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>🔍</Text>
          <TextInput
            placeholder="Buscar..."
            value={searchText}
            onChangeText={setSearchText}
            style={{ flex: 1, fontSize: 16, color: '#1F2937' }}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Stats Grid */}
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 16 }}>
          Resumen General
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {statsData.map(renderStatsCard)}
        </View>

        {/* Recent Activities */}
        <View style={{ marginTop: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937' }}>
              Actividad Reciente
            </Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 14, color: '#3B82F6', fontWeight: '500' }}>
                Ver todo
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={recentActivities}
            renderItem={renderActivityItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Notification Modal */}
      <Modal
        visible={isNotificationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ 
            backgroundColor: '#fff', 
            borderTopLeftRadius: 20, 
            borderTopRightRadius: 20, 
            padding: 24,
            maxHeight: '80%'
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937' }}>
                Notificaciones
              </Text>
              <TouchableOpacity onPress={() => setNotificationModalVisible(false)}>
                <Text style={{ fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={notifications}
              renderItem={({ item }) => (
                <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>{item.title}</Text>
                  <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{item.message}</Text>
                  <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>{item.time}</Text>
                </View>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal
        visible={isProfileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ 
            backgroundColor: '#fff', 
            borderTopLeftRadius: 20, 
            borderTopRightRadius: 20, 
            padding: 24
          }}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#E5E7EB',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <Text style={{ fontSize: 36 }}>👤</Text>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937' }}>Admin User</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>admin@example.com</Text>
            </View>

            <TouchableOpacity style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
              <Text style={{ fontSize: 16, color: '#1F2937' }}>📱 Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
              <Text style={{ fontSize: 16, color: '#1F2937' }}>⚙️ Configuración</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
              <Text style={{ fontSize: 16, color: '#1F2937' }}>❓ Ayuda</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => logout()} style={{ padding: 16 }}>
              <Text style={{ fontSize: 16, color: '#EF4444' }}>🚪 Cerrar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setProfileModalVisible(false)}
              style={{ marginTop: 24, alignItems: 'center' }}
            >
              <Text style={{ color: '#3B82F6' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Dashboard;