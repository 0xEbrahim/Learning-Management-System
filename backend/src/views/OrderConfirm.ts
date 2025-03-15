export const generateOrderConfirmTemplate = (
  customer: any,
  image: any,
  id: any,
  orderName: any,
  orderPrice: any,
  orderDate: any
) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background: #007bff;
            color: white;
            padding: 15px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .order-details {
            text-align: left;
            margin-top: 20px;
        }
        .order-image {
            text-align: center;
            margin-top: 20px;
        }
        .order-image img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #555;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            color: white;
            background: #28a745;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Order Confirmation</h2>
        </div>
        <div class="content">
            <p>Dear ${customer},</p>
            <p>Thank you for your order! Your order has been successfully created.</p>
            <div class="order-details">
                <p><strong>Order ID:</strong> ${id}</p>
                <p><strong>Order Name:</strong> ${orderName}</p>
                <p><strong>Date:</strong> ${orderDate}</p>
                <p><strong>Total:</strong> ${orderPrice}$</p>
            </div>
            <div class="order-image">
                <img src=${image} alt="Order Image">
            </div>
        </div>
        <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
            <p>&copy; 2025 Your Company Name</p>
        </div>
    </div>
</body>
</html>`;
};
