// backend/src/modules/Order/Order.swagger.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         userId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         courseId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         course:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             price:
 *               type: number
 *
 *     OrderListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "Success"
 *         statusCode:
 *           type: integer
 *           example: 200
 *         size:
 *           type: integer
 *           example: 10
 *         data:
 *           type: object
 *           properties:
 *             orders:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *
 *     OrderResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "Success"
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             order:
 *               $ref: '#/components/schemas/Order'
 *
 *     CheckoutSessionRequest:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *
 *     CheckoutSessionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Redirecting"
 *         url:
 *           type: string
 *           example: "https://checkout.stripe.com/pay/cs_test_abc123..."
 *
 *     VerificationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Purchasing done successfully"
 *
 *   parameters:
 *     orderIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The order ID
 *
 *     userIdParam:
 *       in: path
 *       name: userId
 *       schema:
 *         type: string
 *       description: The user ID to filter orders (admin only)
 *
 *     paginationQuery:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       description: Page number
 *
 *     limitQuery:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 10
 *       description: Number of items per page
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and payment processing
 */

/**
 * @swagger
 * /api/v1/orders/create-checkout-session:
 *   post:
 *     summary: Create Stripe checkout session
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutSessionRequest'
 *     responses:
 *       303:
 *         description: Redirect to Stripe checkout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutSessionResponse'
 *       400:
 *         description: Already purchased this course
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/v1/orders/success:
 *   get:
 *     summary: Verify order completion status
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: boolean
 *         description: Payment completion status
 *     responses:
 *       200:
 *         description: Order verification status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationResponse'
 */

/**
 * @swagger
 * /api/v1/orders/webhook:
 *   post:
 *     summary: Stripe webhook endpoint (for internal use)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 *       400:
 *         description: Webhook verification failed
 */

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders (Admin only or user's own orders)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/paginationQuery'
 *       - $ref: '#/components/parameters/limitQuery'
 *       - $ref: '#/components/parameters/userIdParam'
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/orderIdParam'
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Unauthorized or not order owner
 *       404:
 *         description: Order not found
 */
