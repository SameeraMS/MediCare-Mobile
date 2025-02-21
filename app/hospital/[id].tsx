import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { bookAppointment } from '../../store/slices/appointmentsSlice';

export default function HospitalScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const hospital = useSelector((state: RootState) => 
    state.hospitals.hospitals.find(h => h.id === id)
  );

  if (!hospital) {
    return (
      <View style={styles.container}>
        <Text>Hospital not found</Text>
      </View>
    );
  }

  const handleBookAppointment = (doctorId: string, time: string) => {
    dispatch(bookAppointment({
      hospitalId: hospital.id,
      doctorId,
      patientName: 'John Doe', // In a real app, this would come from user profile
      date: new Date().toISOString().split('T')[0],
      time,
    }));
    router.push('/appointments');
  };

  const renderDoctor = ({ item: doctor }) => (
    <View style={styles.doctorCard}>
      <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialty}>{doctor.specialization}</Text>
        <Text style={styles.doctorStats}>
          {doctor.experience} years • ⭐ {doctor.rating}
        </Text>
        <View style={styles.slots}>
          {doctor.availableSlots.map((slot) => (
            <Pressable
              key={slot}
              style={styles.slotButton}
              onPress={() => handleBookAppointment(doctor.id, slot)}
            >
              <Text style={styles.slotText}>{slot}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: hospital.image }} style={styles.hospitalImage} />
      <View style={styles.content}>
        <Text style={styles.hospitalName}>{hospital.name}</Text>
        <Text style={styles.hospitalAddress}>{hospital.address}</Text>
        <Text style={styles.sectionTitle}>Available Doctors</Text>
        <FlatList
          data={hospital.doctors}
          renderItem={renderDoctor}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.doctorsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  hospitalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  hospitalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  hospitalAddress: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  doctorsList: {
    paddingBottom: 16,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  doctorStats: {
    fontSize: 14,
    color: '#0066cc',
    marginTop: 4,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  slotButton: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 8,
  },
  slotText: {
    color: '#0066cc',
    fontSize: 14,
  },
});