import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function HomeScreen() {
  const hospitals = useSelector((state: RootState) => state.hospitals.hospitals);

  const renderHospital = ({ item }) => (
    <Link href={`/hospital/${item.id}`} asChild>
      <Pressable style={styles.hospitalCard}>
        <Image source={{ uri: item.image }} style={styles.hospitalImage} />
        <View style={styles.hospitalInfo}>
          <Text style={styles.hospitalName}>{item.name}</Text>
          <Text style={styles.hospitalAddress}>{item.address}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>{item.doctorsCount} Doctors</Text>
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
        keyExtractor={(item) => item.id}
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