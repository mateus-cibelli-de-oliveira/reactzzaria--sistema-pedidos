import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import * as routes from "@/routes";
import Header from "./header";

const ChoosePizzaSize = lazy(() => import("@/pages/choose-pizza-size"));
const ChoosePizzaFlavours = lazy(() => import("@/pages/choose-pizza-flavours"));
const ChoosePizzaQuantity = lazy(() => import("@/pages/choose-pizza-quantity"));
const Checkout = lazy(() => import("@/pages/checkout"));
const CheckoutConfirmation = lazy(
  () => import("@/pages/checkout-confirmation")
);
const CheckoutSuccess = lazy(
  () => import("@/pages/checkout-success")
);

const Main = () => (
  <>
    <Header />
    <Suspense fallback="Loading...">
      <Routes>
        <Route
          path={routes.HOME}
          element={<ChoosePizzaSize />}
        />
        <Route
          path={routes.CHOOSE_PIZZA_FLAVOURS}
          element={<ChoosePizzaFlavours />}
        />
        <Route
          path={routes.CHOOSE_PIZZA_QUANTITY}
          element={<ChoosePizzaQuantity />}
        />
        <Route
          path={routes.CHECKOUT}
          element={<Checkout />}
        />
        <Route
          path={routes.CHECKOUT_CONFIRMATION}
          element={<CheckoutConfirmation />}
        />
        <Route
          path={routes.CHECKOUT_SUCCESS}
          element={<CheckoutSuccess />}
        />
      </Routes>
    </Suspense>
  </>
);

export default Main;
