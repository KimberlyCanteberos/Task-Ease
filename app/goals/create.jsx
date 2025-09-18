import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGoals } from '../../hooks/useGoals'
import { useRouter } from 'expo-router'
import { auth } from '../../firebaseConfig'

const Create = () => {
  const [goal, setGoal] = useState('')
  const [priority, setPriority] = useState('low')
  const [subject, setSubject] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const { createGoal } = useGoals()
  const router = useRouter();

  const handleSubmit = async () => {
    if (!goal.trim()) return;

    const finalSubject =
      subject === 'Other'
        ? customSubject.trim() || 'Other'
        : subject || 'Other'

    await createGoal({
      title: goal,
      subject: finalSubject,
      progress: 0,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      priority: priority,
    })

    setGoal('')
    setPriority('low')
    setSubject('')
    setCustomSubject('')
    Keyboard.dismiss()
    router.push('/goals')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Create a New Task</Text>

        <TextInput
          style={styles.input}
          placeholder="What task do you want to do?"
          placeholderTextColor="#7A5799"
          value={goal}
          onChangeText={setGoal}
        />

        {/* Category Section */}
        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.chipRow}>
            {['Math', 'Science', 'English', 'Other'].map((subj) => (
              <Pressable
                key={subj}
                style={({ pressed }) => [
                  styles.chip,
                  subject === subj && styles.chipSelected,
                  pressed && styles.chipPressed,
                ]}
                onPress={() => setSubject(subj)}
              >
                <Text style={[
                  styles.chipText,
                  subject === subj && styles.chipTextSelected,
                ]}>{subj}</Text>
              </Pressable>
            ))}
          </View>
          {subject === 'Other' && (
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
          <View style={styles.chipRow}>
            {['low', 'medium', 'high'].map((level) => (
              <Pressable
                key={level}
                style={({ pressed }) => [
                  styles.priorityButton,
                  priority === level && styles.prioritySelected,
                  pressed && styles.priorityPressed,
                ]}
                onPress={() => setPriority(level)}
              >
                <Text style={[
                  styles.priorityText,
                  priority === level && styles.priorityTextSelected,
                ]}>{level}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Add New Task</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9E3D6' },
  scroll: { padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 25, color: '#563066' },
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
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
    paddingHorizontal: 23,
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
    elevation: 6,
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: '#563066', fontWeight: 'bold', fontSize: 18 },
})
