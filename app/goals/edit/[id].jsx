import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Keyboard, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const EditGoal = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [priority, setPriority] = useState("low");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [loading, setLoading] = useState(true);

  const subjects = ["Math", "Science", "English", "Other"];
  const priorities = ["low", "medium", "high"];

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const docRef = doc(db, "goals", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setProgress(data.progress ?? 0);
          setPriority(data.priority || "low");

          if (subjects.includes(data.subject)) {
            setSubject(data.subject);
          } else {
            setSubject("Other");
            setCustomSubject(data.subject || "");
          }
        }
      } catch (error) {
        console.log("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "goals", id);
      const finalSubject = subject === "Other" ? customSubject.trim() || "Other" : subject;
      await updateDoc(docRef, {
        title,
        progress: Number(progress),
        priority,
        subject: finalSubject,
        completed: Number(progress) === 100,
      });
      Keyboard.dismiss();
      router.push("/goals");
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#563066" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Task</Text>

      {/* Task Title */}
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        placeholderTextColor="#7A5799"
        value={title}
        onChangeText={setTitle}
      />

      {/* Progress Section */}
      <View style={styles.card}>
        <Text style={styles.label}>Progress: {progress}%</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={progress}
          minimumTrackTintColor="#21cc8d"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#563066"
          onValueChange={(val) => setProgress(val)}
        />
      </View>

      {/* Subject Section */}
      <View style={styles.card}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.chipRow}>
          {subjects.map((subj) => (
            <Pressable
              key={subj}
              style={({ pressed }) => [
                styles.chip,
                subject === subj && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
              onPress={() => setSubject(subj)}
            >
              <Text style={[styles.chipText, subject === subj && styles.chipTextSelected]}>
                {subj}
              </Text>
            </Pressable>
          ))}
        </View>
        {subject === "Other" && (
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            placeholder="Enter custom category"
            placeholderTextColor="#7A5799"
            value={customSubject}
            onChangeText={setCustomSubject}
          />
        )}
      </View>

      {/* Priority Section */}
      <View style={styles.card}>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.chipRowStart}>
          {priorities.map((level) => (
            <Pressable
              key={level}
              style={({ pressed }) => [
                styles.priorityButton,
                priority === level && styles.prioritySelected,
                pressed && styles.priorityPressed,
              ]}
              onPress={() => setPriority(level)}
            >
              <Text style={[styles.priorityText, priority === level && styles.priorityTextSelected]}>
                {level}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Update Button */}
      <Pressable
        onPress={handleUpdate}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Update Task</Text>
      </Pressable>
    </ScrollView>
  );
};

export default EditGoal;

const styles = StyleSheet.create({
  container: { 
    padding: 20,
    alignItems: 'stretch',
    backgroundColor: '#F9E3D6',
    flex: 1,
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: '#563066', textAlign: 'center', marginTop: 40 },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    color: '#563066',
  },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#563066' },
  card: {
    width: '100%',
    backgroundColor: '#A385C0',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chipRowStart: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-start' },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#7A5799',
    marginBottom: 10,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chipSelected: { backgroundColor: '#563066', shadowOpacity: 0.15 },
  chipPressed: { opacity: 0.7 },
  chipText: { color: '#563066', textTransform: 'capitalize', fontWeight: '500' },
  chipTextSelected: { color: 'white', fontWeight: 'bold' },

  priorityButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 5,
    borderRadius: 25,
    borderColor: '#7A5799',
    marginBottom: 10,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,

  },

  prioritySelected: { backgroundColor: '#563066', shadowOpacity: 0.15 },
  priorityPressed: { opacity: 0.7 },
  priorityText: { color: '#563066', textTransform: 'capitalize', fontWeight: '500' },
  priorityTextSelected: { color: 'white', fontWeight: 'bold' },
  
  button: {
    width: '100%',
    padding: 18,
    backgroundColor: '#F4A9C7',
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: '#563066', fontWeight: 'bold', fontSize: 18 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
