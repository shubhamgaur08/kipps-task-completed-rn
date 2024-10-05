import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList, SafeAreaView } from 'react-native';
import axios from 'axios';

export default function App() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://events-backend-sage.vercel.app/events'); // Update with your server IP/URL
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  const formatTime = (dateTime, timeZone) => {
    const date = new Date(dateTime);
  
    // Convert to IST if the time zone is UTC
    let localDate;
    if (timeZone === 'UTC') {
      localDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5 hours 30 minutes for IST
    } else {
      localDate = date; // No conversion needed for IST or other valid time zones
    }
  
    // Use toLocaleString to format the time correctly with AM/PM
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Ensures 12-hour format with AM/PM
    };
  
    return localDate.toLocaleString('en-IN', options); // Format in Indian locale
  };
  
  

  const renderEvent = ({ item }) => (
    <View style={styles.event}>
      <Text style={styles.eventTitle}>{item.summary}</Text>
      <Text style={styles.eventTime}>
        {formatTime(item.start.dateTime, item.start.timeZone)} - {formatTime(item.end.dateTime, item.end.timeZone)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button title="Fetch Today's Events" onPress={fetchEvents} color="#1E90FF" />
        {events.length > 0 ? (
          <FlatList
            data={events}
            renderItem={renderEvent}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.eventList}
          />
        ) : (
          <Text style={styles.noEventsText}>No events for today</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
  },
  eventList: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  event: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 16,
    color: '#555',
  },
  noEventsText: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
});
