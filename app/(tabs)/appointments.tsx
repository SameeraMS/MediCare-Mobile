import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { getAppointments } from '@/utils/api';

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments when the component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };
    fetchAppointments();
  }, []); // Empty dependency array to run only once on mount

  // Render each appointment card
  const renderAppointment = ({ item }) => {
    const { userId, docId, hospitalId, date, time, status, fee } = item;

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.header}>
          <Image source={{ uri: docId.image }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{docId.name}</Text>
            <Text style={styles.specialty}>{docId.specialty}</Text>
          </View>
          <Text style={styles.status}>{status}</Text>
        </View>
        <View style={styles.hospitalInfo}>
          <Text style={styles.hospitalName}>{hospitalId.name}</Text>
          <Text style={styles.hospitalLocation}>{hospitalId.location}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.date}>{new Date(date).toLocaleDateString()}</Text>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.fee}>LKR {fee}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Appointments</Text>
      {appointments.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No appointments scheduled</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  specialty: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    textTransform: 'capitalize',
  },
  pending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  confirmed: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  completed: {
    backgroundColor: '#cce5ff',
    color: '#004085',
  },
  cancelled: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  hospitalInfo: {
    marginBottom: 12,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  hospitalLocation: {
    fontSize: 14,
    color: '#666',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  date: {
    fontSize: 14,
    color: '#0066cc',
    marginRight: 16,
  },
  time: {
    fontSize: 14,
    color: '#0066cc',
  },
  fee: {
    fontSize: 14,
    color: '#6e4303',
    position: 'absolute',
    right: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});