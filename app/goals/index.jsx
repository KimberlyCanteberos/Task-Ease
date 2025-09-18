import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Animated, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'goals'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(list);
    });

    return unsubscribe;
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const docRef = doc(db, 'goals', id);
              await deleteDoc(docRef);
              console.log('Task deleted:', id);
            } catch (error) {
              console.log('Error deleting task:', error);
            }
          },
        },
      ]
    );
  };

  const handleComplete = async (id, currentProgress) => {
    try {
      const docRef = doc(db, 'goals', id);
      await updateDoc(docRef, {
        previousProgress: currentProgress ?? 0,
        progress: 100,
        completed: true,
      });
    } catch (error) {
      console.log('Error marking complete:', error);
    }
  };

  const handleUndo = async (id, previousProgress) => {
    try {
      const docRef = doc(db, 'goals', id);
      await updateDoc(docRef, {
        progress: previousProgress ?? 0,
        completed: false,
        previousProgress: null,
      });
    } catch (error) {
      console.log('Error undoing task:', error);
    }
  };

  const getSubjectSummary = () => {
    const summary = {};
    goals.forEach((goal) => {
      const subject = goal.subject || 'Other';
      summary[subject] = (summary[subject] || 0) + 1;
    });
    return summary;
  };

  const ProgressBar = ({ progress }) => {
    const widthAnim = new Animated.Value(0);

    useEffect(() => {
      Animated.timing(widthAnim, {
        toValue: progress,
        duration: 700,
        useNativeDriver: false,
      }).start();
    }, [progress]);

    const barColor =
      progress >= 75 ? '#F4A9C7' :
      progress >= 50 ? '#A385C0' :
      progress >= 25 ? '#7A5799' :
      '#563066';

    return (
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, { width: `${widthAnim}%`, backgroundColor: barColor }]} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Tasks</Text>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Category Summary</Text>
        <View style={styles.chipSummaryRow}>
          {Object.entries(getSubjectSummary()).map(([subject, count]) => (
            <View key={subject} style={styles.chipSummary}>
              <Text style={styles.chipSummaryText}>{subject} ({count})</Text>
            </View>
          ))}
        </View>
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.goalItem,
              item.completed && { opacity: 0.7 },
            ]}
          >
            {/* Header: Title + Priority + Menu */}
            <View style={styles.goalHeader}>
              <Text style={[styles.goalText, item.completed && { textDecorationLine: 'line-through', color: 'gray' }]}>
                {item.completed ? `✅ ${item.title}` : item.title || 'Untitled Task'}
              </Text>
              <View style={[styles.priorityBadge, 
                item.priority === 'high' && { backgroundColor: '#FF4D4D' },
                item.priority === 'medium' && { backgroundColor: '#FFA500' },
                item.priority === 'low' && { backgroundColor: '#21CC8D' },
              ]}>
                <Text style={styles.priorityBadgeText}>{item.priority}</Text>
              </View>

              <Pressable onPress={() => setMenuVisibleId(menuVisibleId === item.id ? null : item.id)}>
                <Ionicons name="ellipsis-vertical" size={22} color="#563066" />
              </Pressable>
            </View>

            {/* Three-dot Menu */}
            {menuVisibleId === item.id && (
              <View style={styles.menuDropdown}>
                <Pressable style={styles.menuItem} onPress={() => { setMenuVisibleId(null); router.push(`/goals/edit/${item.id}`); }}>
                  <Ionicons name="pencil-outline" size={16} color="#563066" style={{ marginRight: 6 }} />
                  <Text style={styles.menuItemText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.menuItem} onPress={() => { setMenuVisibleId(null); handleDelete(item.id); }}>
                  <Ionicons name="trash-outline" size={16} color="#FF4D4D" style={{ marginRight: 6 }} />
                  <Text style={[styles.menuItemText, { color: '#FF4D4D' }]}>Delete</Text>
                </Pressable>
              </View>
            )}

            {/* Progress */}
            <Text style={styles.progressText}>
              Progress: {item.progress ?? 0}%
            </Text>
            <ProgressBar progress={item.progress ?? 0} />

            {/* Complete/Undo Button */}
            <Pressable style={[styles.completeButton, { backgroundColor: item.completed ? '#7A5799' : '#F4A9C7' }]}
              onPress={() => item.completed ? handleUndo(item.id, item.previousProgress) : handleComplete(item.id, item.progress)}
            >
              <Ionicons name={item.completed ? "refresh-outline" : "checkmark-circle-outline"} size={18} color={item.completed ? '#F9E3D6' : '#563066'} style={{ marginRight: 6 }} />
              <Text style={[styles.completeButtonText, { color: item.completed ? '#F9E3D6' : '#563066' }]}>
                {item.completed ? 'Undo' : 'Complete'}
              </Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
        }
      />

      <Pressable style={[styles.logoutButton]} onPress={() => signOut(auth)}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9E3D6',
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#563066',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#A385C0',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#F9E3D6',
  },
  chipSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipSummary: {
    backgroundColor: '#563066',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginBottom: 6,
  },
  chipSummaryText: { color: '#F9E3D6', fontSize: 14 },
  goalItem: {
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    backgroundColor: '#EDE0F3',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  goalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#563066',
    flex: 1,
  },
  progressText: {
    fontSize: 16,
    color: '#7A5799',
    marginTop: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityBadgeText: {
    color: '#F9E3D6',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  completeButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 20,
  marginTop: 12,
  justifyContent: 'center',
  shadowColor: '#563066', 
  shadowOpacity: 0.25, 
  shadowRadius: 4,
  elevation: 2,
  },
  completeButtonText: {
    fontWeight: 'bold',
  },
  menuDropdown: {
    position: 'absolute',
    top: 36,
    right: 16,
    backgroundColor: '#F9E3D6',
    borderRadius: 12,
    paddingVertical: 4,
    width: 120,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: '#563066',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#7A5799',
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  logoutButton: {
    backgroundColor: '#FF4D4D',
    margin: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});
