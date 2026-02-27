import React, { useState, useEffect, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {
  getAllHomework,
  addHomework,
  updateHomework,
  toggleComplete,
  deleteHomework,
} from './src/database';
import {
  requestNotificationPermissions,
  scheduleReminder,
} from './src/notifications';

// ─── Color Palette (Blue Theme) ───
const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  primaryLight: '#3B82F6',
  accent: '#60A5FA',
  bgStart: '#EFF6FF',
  bgEnd: '#DBEAFE',
  white: '#FFFFFF',
  card: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#CBD5E1',
  success: '#22C55E',
  successBg: '#F0FDF4',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  warning: '#F59E0B',
  shadow: '#1E3A5F',
  overlay: 'rgba(15, 23, 42, 0.5)',
  priorityColors: ['#94A3B8', '#60A5FA', '#FBBF24', '#FB923C', '#EF4444'],
};

// ─── Priority Labels ───
const PRIORITY_LABELS = ['ต่ำมาก', 'ต่ำ', 'ปานกลาง', 'สูง', 'สูงมาก'];

// ─── Date Formatter ───
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear() + 543;
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${mins}`;
}

function isOverdue(dateStr) {
  return new Date(dateStr) < new Date();
}

function timeRemaining(dateStr) {
  const now = new Date();
  const due = new Date(dateStr);
  const diff = due - now;
  if (diff <= 0) return 'เลยกำหนดส่งแล้ว';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `เหลือ ${days} วัน ${hours} ชม.`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `เหลือ ${hours} ชม. ${mins} นาที`;
}

// ─── Native Date/Time Picker Component ───
function DateTimePicker({ value, onChange }) {
  const currentDate = value ? new Date(value) : new Date();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = new Date(currentDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      onChange(newDate.toISOString());
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(currentDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      onChange(newDate.toISOString());
    }
  };

  const displayDate = () => {
    const d = new Date(currentDate);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear() + 543;
    return `${day}/${month}/${year}`;
  };

  const displayTime = () => {
    const d = new Date(currentDate);
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins} น.`;
  };

  return (
    <View>
      <Text style={s.inputLabel}>วันที่และเวลาที่ต้องส่ง</Text>
      <View style={s.datePickerRow}>
        <TouchableOpacity
          style={s.datePickerButton}
          onPress={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}
        >
          <Text style={s.datePickerIcon}>📅</Text>
          <Text style={s.datePickerText}>{displayDate()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.datePickerButton}
          onPress={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}
        >
          <Text style={s.datePickerIcon}>🕐</Text>
          <Text style={s.datePickerText}>{displayTime()}</Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <RNDateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && (
        <RNDateTimePicker
          value={currentDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
          is24Hour={true}
        />
      )}
    </View>
  );
}

// ─── Priority Selector Component ───
function PrioritySelector({ value, onChange }) {
  return (
    <View>
      <Text style={s.inputLabel}>ระดับความสำคัญ</Text>
      <View style={s.priorityRow}>
        {[1, 2, 3, 4, 5].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => onChange(level)}
            style={[
              s.priorityBtn,
              {
                backgroundColor: value >= level ? COLORS.priorityColors[level - 1] : '#F1F5F9',
                borderColor: value >= level ? COLORS.priorityColors[level - 1] : COLORS.border,
              },
            ]}
          >
            <Text
              style={[
                s.priorityBtnText,
                { color: value >= level ? '#FFF' : COLORS.textSecondary },
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[s.priorityLabel, { color: COLORS.priorityColors[value - 1] }]}>
        {PRIORITY_LABELS[value - 1]}
      </Text>
    </View>
  );
}

// ─── Homework Card Component ───
function HomeworkCard({ item, onToggle, onEdit, onDelete }) {
  const overdue = !item.isCompleted && isOverdue(item.dueDate);
  const priorityColor = COLORS.priorityColors[item.priority - 1];

  return (
    <View
      style={[
        s.card,
        item.isCompleted && s.cardCompleted,
        overdue && s.cardOverdue,
      ]}
    >
      <View style={[s.cardPriorityBar, { backgroundColor: priorityColor }]} />
      <View style={s.cardContent}>
        <View style={s.cardHeader}>
          <View style={s.cardTitleRow}>
            <Text
              style={[s.cardSubject, item.isCompleted && s.cardSubjectDone]}
              numberOfLines={1}
            >
              {item.subject}
            </Text>
            <View style={[s.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
              <Text style={[s.priorityBadgeText, { color: priorityColor }]}>
                ★ {item.priority}
              </Text>
            </View>
          </View>
          {item.description ? (
            <Text style={s.cardDesc} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>

        <View style={s.cardMeta}>
          <Text style={[s.cardDate, overdue && s.cardDateOverdue]}>
            📅 {formatDate(item.dueDate)}
          </Text>
          {!item.isCompleted && (
            <Text style={[s.cardRemaining, overdue && s.cardDateOverdue]}>
              ⏰ {timeRemaining(item.dueDate)}
            </Text>
          )}
          {item.reminder ? (
            <Text style={s.cardReminder}>🔔 แจ้งเตือนล่วงหน้า 1 วัน</Text>
          ) : null}
        </View>

        <View style={s.cardActions}>
          <TouchableOpacity
            style={[s.actionBtn, item.isCompleted ? s.actionBtnUndo : s.actionBtnDone]}
            onPress={() => onToggle(item.id, !item.isCompleted)}
          >
            <Text style={s.actionBtnText}>
              {item.isCompleted ? '↩ ยกเลิก' : '✓ เสร็จแล้ว'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.actionBtn, s.actionBtnEdit]}
            onPress={() => onEdit(item)}
          >
            <Text style={s.actionBtnText}>✏ แก้ไข</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.actionBtn, s.actionBtnDelete]}
            onPress={() => onDelete(item.id)}
          >
            <Text style={s.actionBtnText}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ═══════════════════════════════════
// ─── Main App Component ───
// ═══════════════════════════════════
export default function App() {
  const [homeworkList, setHomeworkList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString());
  const [priority, setPriority] = useState(3);
  const [reminder, setReminder] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const data = await getAllHomework();
      setHomeworkList(data);
    } catch (e) {
      console.error('Failed to load homework:', e);
    }
  }, []);

  useEffect(() => {
    loadData();
    requestNotificationPermissions();
  }, [loadData]);

  const resetForm = () => {
    setSubject('');
    setDescription('');
    setDueDate(new Date().toISOString());
    setPriority(3);
    setReminder(false);
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setSubject(item.subject);
    setDescription(item.description);
    setDueDate(item.dueDate);
    setPriority(item.priority);
    setReminder(!!item.reminder);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!subject.trim()) {
      Alert.alert('⚠️ ข้อผิดพลาด', 'กรุณากรอกชื่อวิชา');
      return;
    }

    try {
      if (editingItem) {
        await updateHomework(
          editingItem.id,
          subject.trim(),
          description.trim(),
          dueDate,
          priority,
          reminder
        );
        if (reminder) {
          await scheduleReminder(editingItem.id, subject.trim(), dueDate);
        }
      } else {
        const newId = await addHomework(
          subject.trim(),
          description.trim(),
          dueDate,
          priority,
          reminder
        );
        if (reminder) {
          await scheduleReminder(newId, subject.trim(), dueDate);
        }
      }
      setModalVisible(false);
      resetForm();
      await loadData();
    } catch (e) {
      console.error('Save error:', e);
      Alert.alert('❌ เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      await toggleComplete(id, completed);
      await loadData();
    } catch (e) {
      console.error('Toggle error:', e);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('🗑 ลบงาน', 'คุณต้องการลบงานนี้หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteHomework(id);
            await loadData();
          } catch (e) {
            console.error('Delete error:', e);
          }
        },
      },
    ]);
  };

  // Stats
  const totalTasks = homeworkList.length;
  const completedTasks = homeworkList.filter((h) => h.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = homeworkList.filter(
    (h) => !h.isCompleted && isOverdue(h.dueDate)
  ).length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
        <View style={s.container}>
          {/* ─── Header ─── */}
          <View style={s.header}>
            <Text style={s.headerTitle}>📚 Smart Homework</Text>
            <Text style={s.headerSubtitle}>จัดการภาระงานอย่างชาญฉลาด</Text>
          </View>

          {/* ─── Add Button ─── */}
          <TouchableOpacity style={s.addButton} onPress={openAddModal} activeOpacity={0.8}>
            <Text style={s.addButtonText}>＋ เพิ่มงานใหม่</Text>
          </TouchableOpacity>

          {/* ─── Status Bar ─── */}
          <View style={s.statusContainer}>
            <View style={s.statusRow}>
              <View style={[s.statusItem, { backgroundColor: COLORS.primaryLight + '15' }]}>
                <Text style={s.statusNumber}>{totalTasks}</Text>
                <Text style={s.statusLabel}>ทั้งหมด</Text>
              </View>
              <View style={[s.statusItem, { backgroundColor: COLORS.warning + '15' }]}>
                <Text style={[s.statusNumber, { color: COLORS.warning }]}>{pendingTasks}</Text>
                <Text style={s.statusLabel}>ต้องทำ</Text>
              </View>
              <View style={[s.statusItem, { backgroundColor: COLORS.success + '15' }]}>
                <Text style={[s.statusNumber, { color: COLORS.success }]}>{completedTasks}</Text>
                <Text style={s.statusLabel}>เสร็จแล้ว</Text>
              </View>
              <View style={[s.statusItem, { backgroundColor: COLORS.danger + '15' }]}>
                <Text style={[s.statusNumber, { color: COLORS.danger }]}>{overdueTasks}</Text>
                <Text style={s.statusLabel}>เลยกำหนด</Text>
              </View>
            </View>
          </View>

          {/* ─── Task List ─── */}
          <ScrollView style={s.listContainer} contentContainerStyle={s.listContent}>
            {homeworkList.length === 0 ? (
              <View style={s.emptyState}>
                <Text style={s.emptyIcon}>📝</Text>
                <Text style={s.emptyText}>ยังไม่มีงานที่ต้องทำ</Text>
                <Text style={s.emptySubtext}>กดปุ่ม "เพิ่มงานใหม่" เพื่อเริ่มต้น</Text>
              </View>
            ) : (
              homeworkList.map((item) => (
                <HomeworkCard
                  key={item.id}
                  item={item}
                  onToggle={handleToggle}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))
            )}
            <View style={{ height: 30 }} />
          </ScrollView>

          {/* ─── Add/Edit Modal ─── */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={s.modalOverlay}
            >
              <View style={s.modalContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Modal Header */}
                  <View style={s.modalHeader}>
                    <Text style={s.modalTitle}>
                      {editingItem ? '✏️ แก้ไขงาน' : '📝 เพิ่มงานใหม่'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => { setModalVisible(false); resetForm(); }}
                      style={s.closeBtn}
                    >
                      <Text style={s.closeBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Subject */}
                  <Text style={s.inputLabel}>ชื่อวิชา *</Text>
                  <TextInput
                    style={s.input}
                    placeholder="เช่น คณิตศาสตร์, ภาษาอังกฤษ..."
                    placeholderTextColor={COLORS.textLight}
                    value={subject}
                    onChangeText={setSubject}
                  />

                  {/* Description */}
                  <Text style={s.inputLabel}>รายละเอียด</Text>
                  <TextInput
                    style={[s.input, s.inputMultiline]}
                    placeholder="รายละเอียดงานที่ต้องทำ..."
                    placeholderTextColor={COLORS.textLight}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />

                  {/* Date Time */}
                  <DateTimePicker value={dueDate} onChange={setDueDate} />

                  {/* Priority */}
                  <PrioritySelector value={priority} onChange={setPriority} />

                  {/* Reminder Toggle */}
                  <TouchableOpacity
                    style={[s.reminderToggle, reminder && s.reminderToggleActive]}
                    onPress={() => setReminder(!reminder)}
                  >
                    <Text style={s.reminderIcon}>{reminder ? '🔔' : '🔕'}</Text>
                    <View style={s.reminderTextContainer}>
                      <Text
                        style={[s.reminderText, reminder && s.reminderTextActive]}
                      >
                        แจ้งเตือนล่วงหน้า 1 วัน
                      </Text>
                      <Text style={s.reminderSubtext}>
                        {reminder ? 'เปิดการแจ้งเตือน' : 'ปิดการแจ้งเตือน'}
                      </Text>
                    </View>
                    <View
                      style={[s.toggleTrack, reminder && s.toggleTrackActive]}
                    >
                      <View
                        style={[s.toggleThumb, reminder && s.toggleThumbActive]}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Save Button */}
                  <TouchableOpacity
                    style={s.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.8}
                  >
                    <Text style={s.saveButtonText}>
                      {editingItem ? '💾 บันทึกการแก้ไข' : '💾 บันทึก'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ═══════════════════════════════════
// ─── Styles ───
// ═══════════════════════════════════
const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bgStart,
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.accent,
    textAlign: 'center',
    marginTop: 4,
  },

  // Add Button
  addButton: {
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },

  // Status
  statusContainer: {
    marginHorizontal: 20,
    marginTop: 14,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  statusNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statusLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },

  // List
  listContainer: {
    flex: 1,
    marginTop: 14,
  },
  listContent: {
    paddingHorizontal: 20,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 56,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 6,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCompleted: {
    opacity: 0.6,
    backgroundColor: COLORS.successBg,
  },
  cardOverdue: {
    borderWidth: 1,
    borderColor: COLORS.danger + '40',
    backgroundColor: COLORS.dangerBg,
  },
  cardPriorityBar: {
    width: 5,
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardSubject: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  cardSubjectDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 19,
  },
  cardMeta: {
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  cardDateOverdue: {
    color: COLORS.danger,
    fontWeight: '600',
  },
  cardRemaining: {
    fontSize: 12,
    color: COLORS.primaryLight,
    fontWeight: '500',
  },
  cardReminder: {
    fontSize: 11,
    color: COLORS.warning,
    marginTop: 3,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  actionBtnDone: {
    backgroundColor: COLORS.success + '18',
  },
  actionBtnUndo: {
    backgroundColor: COLORS.textLight + '20',
  },
  actionBtnEdit: {
    backgroundColor: COLORS.primaryLight + '18',
  },
  actionBtnDelete: {
    backgroundColor: COLORS.danger + '15',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 30,
    maxHeight: '92%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '50',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  // Input
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  inputMultiline: {
    minHeight: 80,
  },

  // Date Picker
  datePickerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  datePickerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  datePickerText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  // Priority
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  priorityBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  priorityLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },

  // Reminder
  reminderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 16,
  },
  reminderToggleActive: {
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.primaryLight + '08',
  },
  reminderIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  reminderTextContainer: {
    flex: 1,
  },
  reminderText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  reminderTextActive: {
    color: COLORS.primary,
  },
  reminderSubtext: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackActive: {
    backgroundColor: COLORS.primaryLight,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },

  // Save Button
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },
});
