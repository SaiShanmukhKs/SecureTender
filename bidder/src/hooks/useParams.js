const useParams = () => {
  const location = window.location.pathname;
  const parts = location.split("/");
  const id = parts[parts.length - 1];
  return { id };
};

export default useParams;
