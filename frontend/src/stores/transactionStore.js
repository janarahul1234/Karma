import { create } from "zustand";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "@/apis/transaction";

const useTransactionStore = create((set) => ({
  transactions: [],
  isLoading: true,

  fetchTransactions: async (params) => {
    try {
      const response = await getTransactions(params);
      set({ transactions: response.data });
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (data) => {
    const response = await addTransaction(data);
    set((state) => ({ transactions: [response.data, ...state.transactions] }));
  },

  deleteTransaction: async (id) => {
    await deleteTransaction(id);
    set((state) => ({
      transactions: state.transactions.filter(
        (transaction) => transaction._id !== id
      ),
    }));
  },
}));

export default useTransactionStore;
