import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function AppointmentsScreen() {
  const appointments = useSelector((state: RootState) => state.appointments.appointments);
  const hospitals = useSelector((state: RootState) => state.hospitals.hospitals);

  const getHospitalAndDoctor = (hospitalId: string, doctorId: string) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    const doctor = hospital?.doctors.find(d => d.id === doctorId);
    return { hospital, doctor };
  };

  const renderAppointment = ({ item }) => {
    const { hospital, doctor } = getHospitalAndDoctor(item.hospitalId, item.doctorId);
    
    return (
      <View style={styles.appointmentCard}>
        <View style={styles.header}>
          <Text style={styles.hospitalName}>{hospital?.name}</Text>
          <Text style={[styles.status, styles[item.status]]}>{item.status}</Text>
        </View>
        <Text style={styles.doctorName}>{doctor?.name}</Text>
        <Text style={styles.specialty}>{doctor?.specialization}</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.time}>{item.time}</Text>
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
          keyExtractor={(item) => item.id}
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
    borderRadius: 12,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hospitalName: {
    fontSize: 16,
    color: '#666',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
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