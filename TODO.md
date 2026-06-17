# TODO - PureCoco Fixes

- [x] Gather relevant repo files for scroll, hero, payment, reviews
- [x] Fix blog/whole site scroll bar missing (global overflow + scrollbar styles)

- [x] Verify hero shade overlay removal (Home.jsx)

- [x] Fix review module not working (find failing API wiring + patch)

- [ ] Make payment module fully working in realtime
  - [x] Use Stripe PaymentIntent + clientSecret (real-time)


  - [x] Wire StripePaymentForm into Checkout.jsx for card mode




  - [ ] Call createPaymentIntent for Stripe mode
  - [ ] Confirm payment via clientSecret
  - [ ] Rely on backend webhook to mark order paid
  - [ ] Add frontend realtime polling for order payment/order status on tracking
- [ ] Ensure navigate between routes scrolls to top (validate ScrollToTop works)
- [ ] Test end-to-end: checkout card → webhook → order tracking update

