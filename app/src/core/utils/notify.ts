import { dispatch } from "store/store";
import { notify as appNotify } from "store/internal/reducers/notifyReducer";

const success = (message: string, description?: string) => {
  dispatch(
    appNotify({
      title: message,
      description,
      type: "success"
    })
  );
};

const error = (message: string, description?: string) => {
  dispatch(
    appNotify({
      title: message,
      description,
      type: "error"
    })
  );
};

const warning = (message: string, description?: string) => {
  dispatch(
    appNotify({
      title: message,
      description,
      type: "warning"
    })
  );
};

const info = (message: string, description?: string) => {
  dispatch(
    appNotify({
      title: message,
      description,
      type: "info"
    })
  );
};

export const notify = {
  success,
  error,
  warning,
  info
};