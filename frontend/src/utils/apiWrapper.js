export default function apiWrapper(queryFn) {
  return async (...args) => {
    try {
      const { data } = await queryFn(...args);
      return data;
    } catch (error) {
      console.error("Api error:", error);
      throw error;
    }
  };
}
