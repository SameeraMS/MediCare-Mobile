import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getHospitals, getDocHospitals, getDoctors, bookAppointment } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


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
  const [hospital, setHospital] = useState(null);
  const [docHospital, setDocHospital] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const handleDateConfirm = (date) => {
    setBookingData({ ...bookingData, date: date.toISOString().split('T')[0] });
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBookingData({ ...bookingData, time: formattedTime });
    setTimePickerVisibility(false);
  };

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const hospitalsData = await getHospitals();
        const docHospital = await getDocHospitals();
        const doctors = await getDoctors();
        const hospitalDetails = hospitalsData.find(hospital => hospital._id === id);
        setHospital(hospitalDetails);
        setDocHospital(docHospital.filter(doc => doc.hospitalId._id === id)); // Filter doctors for the selected hospital
        setDoctors(doctors); // Set available doctors list
      } catch (error) {
        console.error('Failed to fetch hospital data:', error);
      }
    };
    fetchHospitalData();
  }, [id]);

  if (!hospital) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Hospital not found</Text>
      </SafeAreaView>
    );
  }

  const filteredDoctors = docHospital.filter(
    (docHospitalEntry) =>
      !selectedCategory || docHospitalEntry.category === selectedCategory
  );

  const handleBooking = async () => {
    if (!selectedDoctor || !bookingData.name || !bookingData.email || !bookingData.date || !bookingData.time) {
      alert('Please fill in all fields before booking.');
      return;
    }

    const appointmentData = {
      userId: await AsyncStorage.getItem('userId'),
      docId: selectedDoctor._id,
      hospitalId: hospital._id,
      date: bookingData.date,
      time: bookingData.time,
      fee: selectedDoctor.fee || 1500, // Ensure dynamic fee handling
    };

    console.log('Booking Data:', appointmentData);

    await bookAppointment(appointmentData);
    router.push('/appointments');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: hospital.image }} style={styles.hospitalImage} />
        <View style={styles.content}>
          <Text style={styles.hospitalName}>{hospital.name}</Text>
          <Text style={styles.hospitalAddress}>{hospital.location}</Text>

          <Text style={styles.sectionTitle}>Specializations</Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.categoryButton, selectedCategory === item && styles.selectedCategory]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[styles.categoryText, selectedCategory === item && styles.selectedCategoryText]}>
                  {item}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <Text style={styles.sectionTitle}>Available Doctors</Text>
          <FlatList
            data={filteredDoctors}
            renderItem={({ item: docHospitalEntry }) => (
              <Pressable
                style={[styles.doctorCard, selectedDoctor?._id === docHospitalEntry.docId._id && styles.selectedDoctorCard]}
                onPress={() => {
                  setSelectedDoctor(docHospitalEntry.docId);
                  setShowForm(true);
                }}
              >
                <Image source={{ uri: docHospitalEntry.docId.image }} style={styles.doctorImage} />
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{docHospitalEntry.docId.name}</Text>
                  <Text style={styles.doctorSpecialty}>{docHospitalEntry.category}</Text>
                  <Text style={styles.doctorStats}>{docHospitalEntry.docId.experience} years • ⭐ {docHospitalEntry.docId.rating}</Text>
                  <Text style={styles.doctorSpecialty}>LKR {docHospitalEntry.fee}</Text>
                </View>
              </Pressable>
            )}
            keyExtractor={(item) => item._id}
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
              <Pressable onPress={() => setDatePickerVisibility(true)}>
                <TextInput
                  style={styles.input}
                  placeholder="Date (YYYY-MM-DD)"
                  value={bookingData.date}
                  editable={false}
                />
              </Pressable>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisibility(false)}
              />

              <Pressable onPress={() => setTimePickerVisibility(true)}>
                <TextInput
                  style={styles.input}
                  placeholder="Time (HH:MM AM/PM)"
                  value={bookingData.time}
                  editable={false}
                />
              </Pressable>

              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={() => setTimePickerVisibility(false)}
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
