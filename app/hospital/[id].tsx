import { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { bookAppointment } from '../../store/slices/appointmentsSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'General Medicine'
];

export default function HospitalScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
  });
  const [showForm, setShowForm] = useState(false);

  const hospital = useSelector((state: RootState) =>
    state.hospitals.hospitals.find(h => h.id === id)
  );

  if (!hospital) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Hospital not found</Text>
      </SafeAreaView>
    );
  }

  const filteredDoctors = hospital.doctors.filter(
    doctor => !selectedCategory || doctor.specialization === selectedCategory
  );

  const handleBooking = async () => {
    try {
      const appointmentData = {
        userId: 'U49979', // This should come from auth state in real app
        docId: selectedDoctor.id,
        hospitalId: hospital.id,
        date: bookingData.date,
        time: bookingData.time,
        fee: 1500, // This should be dynamic based on doctor's fee
      };

      await bookAppointment(appointmentData);
      router.push('/appointments');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const renderCategory = ({ item }) => (
    <Pressable
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item && styles.selectedCategoryText
      ]}>
        {item}
      </Text>
    </Pressable>
  );

  const renderDoctor = ({ item: doctor }) => (
    <Pressable
      style={[
        styles.doctorCard,
        selectedDoctor?.id === doctor.id && styles.selectedDoctorCard
      ]}
      onPress={() => {
        setSelectedDoctor(doctor);
        setShowForm(true);
      }}
    >
      <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialty}>{doctor.specialization}</Text>
        <Text style={styles.doctorStats}>
          {doctor.experience} years • ⭐ {doctor.rating}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: hospital.image }} style={styles.hospitalImage} />
        <View style={styles.content}>
          <Text style={styles.hospitalName}>{hospital.name}</Text>
          <Text style={styles.hospitalAddress}>{hospital.address}</Text>

          <Text style={styles.sectionTitle}>Specializations</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
          />

          <Text style={styles.sectionTitle}>Available Doctors</Text>
          <FlatList
            data={filteredDoctors}
            renderItem={renderDoctor}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />

          {showForm && selectedDoctor && (
            <View style={styles.bookingForm}>
              <Text style={styles.formTitle}>Book Appointment</Text>

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={bookingData.name}
                onChangeText={(text) => setBookingData({ ...bookingData, name: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={bookingData.email}
                onChangeText={(text) => setBookingData({ ...bookingData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Date (YYYY-MM-DD)"
                value={bookingData.date}
                onChangeText={(text) => setBookingData({ ...bookingData, date: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Time (HH:MM AM/PM)"
                value={bookingData.time}
                onChangeText={(text) => setBookingData({ ...bookingData, time: text })}
              />

              <Pressable style={styles.bookButton} onPress={handleBooking}>
                <Text style={styles.bookButtonText}>Book Appointment</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
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
    marginTop: 16,
    marginBottom: 12,
  },
  categoryList: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#0066cc',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
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
  selectedDoctorCard: {
    borderColor: '#0066cc',
    borderWidth: 2,
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
  bookingForm: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});