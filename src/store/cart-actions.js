import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";
import keys from '../config/keys.json'

export const fetchCardData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        keys.dataBaseURL,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const responseData = await response.json();

      console.log("dara", responseData);
      return responseData;
    };

    try {
      const cart = await fetchData();
      dispatch(cartActions.fetchedFromDataBase({
          items : cart.items || [],
          totalQuantity : cart.totalQuantity
      }));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Can not fetch Data",
        })
      );
    }
  };
};

export const sendCardData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending",
        message: "Sending Cart Data!",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        keys.dataBaseURL,
        {
          method: "PUT",
          body: JSON.stringify({
              items: cart.items,
              totalQuantity : cart.totalQuantity
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Sending card data failed");
      }
    };

    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success",
          message: "Sending Cart Data successfully!",
        })
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Sending Cart Data failed!",
        })
      );
    }
  };
};
