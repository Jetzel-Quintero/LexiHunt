import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 40, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 20 },
  text: { marginTop: 10, color: '#475569' },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#334155' },
  backButton: { marginBottom: 15 },
  backButtonText: { fontSize: 16, color: '#4f46e5', fontWeight: '600' },
  wordCard: { backgroundColor: '#ffffff', padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#4f46e5', elevation: 2 },
  wordText: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  wordTranslation: { color: '#64748b', fontWeight: 'normal' },
  exampleText: { fontSize: 13, color: '#64748b', fontStyle: 'italic', marginTop: 4 },

  gridContainer: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    margin: 1,
    borderRadius: 4,
  },
  cellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  wordChip: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
    height: 40,
  },
  chipText: {
    color: '#4f46e5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  gridCellSelected: {
    backgroundColor: '#4f46e5',
    borderColor: '#4338ca',
  },
  cellTextSelected: {
    color: '#ffffff',
  },
  wordChipFound: {
    backgroundColor: '#d1fae5',
  },
  chipTextFound: {
    color: '#065f46',
    textDecorationLine: 'line-through',
  },
  gridCellFound: {
    backgroundColor: '#10b981', // Verde esmeralda para aciertos
    borderColor: '#059669',
  },
  cellTextFoundText: {
    color: '#ffffff',
  },
});