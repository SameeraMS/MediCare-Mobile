import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { getDocHospitals, getDoctors, getHospitals } from '@/utils/api';

export default function HomeScreen() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const hospitalsData = await getHospitals();
        const docHosData = await getDocHospitals();
        const doctorsData = await getDoctors();

        // Count doctors per hospital
        const hospitalDoctorCounts = docHosData.reduce((acc, entry) => {
          const hospitalId = entry.hospitalId._id;
          if (!acc[hospitalId]) {
            acc[hospitalId] = 0;
          }
          acc[hospitalId] += 1;
          return acc;
        }, {});

        // Merge hospital data with doctor count
        const updatedHospitals = hospitalsData.map((hospital) => ({
          ...hospital,
          doctorCount: hospitalDoctorCounts[hospital._id] || 0,
        }));

        setHospitals(updatedHospitals);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchHospitals();
  }, []);

  const renderHospital = ({ item }) => (
    <Link href={`/hospital/${item._id}`} asChild>
      <Pressable style={styles.hospitalCard}>
        <Image source={{ uri: item.image }} style={styles.hospitalImage} />
        <View style={styles.hospitalInfo}>
          <Text style={styles.hospitalName}>{item.name}</Text>
          <Text style={styles.hospitalAddress}>{item.location}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>{item.doctorCount} Doctors</Text>
            <Text style={styles.statsText}>⭐ {item.rating}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find and Book</Text>
        <Text style={styles.subtitle}>Your Medical Appointment</Text>
      </View>
      <FlatList
        data={hospitals}
        renderItem={renderHospital}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  list: {
    padding: 16,
  },
  hospitalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  hospitalImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  hospitalInfo: {
    padding: 16,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#0066cc',
  },
});