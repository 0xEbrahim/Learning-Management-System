export const generateEmailVerifyTemplate = (code: string, link: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            padding: 30px;
            text-align: center;
        }
        .email-container h2 {
            color: #333333;
        }
        .email-container p {
            color: #555555;
            font-size: 16px;
            margin: 20px 0;
        }
        .verification-token {
            display: inline-block;
            margin: 20px 0;
            padding: 15px 30px;
            background-color: #007BFF;
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            border-radius: 5px;
            letter-spacing: 2px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999999;
        }
        .verification-link {
            margin-top: 20px;
        }
        .verification-link a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Email Verification</h2>
        <p>Thank you for signing up. Please use the verification token below to verify your email address:</p>
        <div class="verification-token">${code}</div>
        <p>If you did not request this email, please ignore it.</p>
        <div class="verification-link">
            <a href=${link} data-method="PATCH">Verify Your Email</a>
        </div>
        <div class="footer">
            &copy; 2025 Your Company. All rights reserved.
        </div>
    </div>
</body>
</html>
`
}