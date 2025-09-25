import { create } from "zustand";
import {
  getGoals,
  addGoal,
  editGoal,
  deleteGoal,
  addGoalTransaction,
} from "@/apis/goal";

const useGoalStore = create((set) => ({
  goals: [],
  isLoading: true,

  fetchGoals: async (params) => {
    try {
      const response = await getGoals(params);
      set({ goals: response.data });
    } finally {
      set({ isLoading: false });
    }
  },

  addGoal: async (data = {}) => {
    const response = await addGoal(data);
    set((state) => ({ goals: [response.data, ...state.goals] }));
  },

  editGoal: async (id, data = {}) => {
    const response = await editGoal(id, data);
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal._id === id ? response.data : goal
      ),
    }));
  },

  deleteGoal: async (id) => {
    await deleteGoal(id);
    set((state) => ({
      goals: state.goals.filter((goal) => goal._id !== id),
    }));
  },

  addGoalTransaction: async (id, data = {}) => {
    const response = await addGoalTransaction(id, data);
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal._id === response.data._id ? response.data : goal
      ),
    }));
  },
}));

export default useGoalStore;
