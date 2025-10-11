import { toast } from "react-toastify";

const notificationService = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message)
};

export default notificationService;