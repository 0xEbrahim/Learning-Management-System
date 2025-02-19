export const generatePasswordResetTemplate = (link: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 30px 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            margin: 20px 0;
        }
        .reset-button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            padding: 15px 25px;
            border-radius: 5px;
            margin: 20px 0;
            font-size: 18px;
            transition: background-color 0.3s ease;
            border: none;
            cursor: pointer;
        }
        .reset-button:hover {
            background-color: #0056b3;
        }
        .footer {
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            background-color: #f4f4f4;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">Password Reset Request</div>
        <div class="content">
            <p>Hello,</p>
            <p>You recently requested to reset your password. Click the button below to proceed:</p>
            <form action=${link} method="POST">
                <input type="hidden" name="email" value="{{email}}">
                <button type="submit" class="reset-button">Reset Password</button>
            </form>
            <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">
            &copy; 2025 Your Company. All rights reserved.
        </div>
    </div>
</body>
</html>

`;
};
