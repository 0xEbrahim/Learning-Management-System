export const generateAccountReactiveTemplate = (name: string) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Reactivation Notice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            margin: 20px auto;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            color: #333;
        }
        .content {
            text-align: center;
            color: #555;
            font-size: 16px;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            padding: 12px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="header">Your Account Has Been Reactivated</h2>
        <p class="content">Hello ${name},</p>
        <p class="content">We wanted to let you know that your account has been successfully reactivated. You can now log in and continue using our services.</p>
        <p class="content">If you did not request this reactivation, please contact our support team immediately.</p>
        <p class="footer">If you have any questions, feel free to contact our support team. <br> &copy; 2025 Your Company. All rights reserved.</p>
    </div>
</body>
</html>
`;
};
