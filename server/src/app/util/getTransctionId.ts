const getTransactionId = () => {
  return `odyssey_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export default getTransactionId;
