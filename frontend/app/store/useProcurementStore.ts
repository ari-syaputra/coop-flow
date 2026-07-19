import { create } from 'zustand';

interface ProcurementState {
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
}

export const useProcurementStore = create<ProcurementState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));