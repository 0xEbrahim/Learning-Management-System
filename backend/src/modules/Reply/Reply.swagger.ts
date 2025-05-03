/**
 * @swagger
 * components:
 *   schemas:
 *     Reply:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         comment:
 *           type: string
 *           example: "Thank you for your feedback!"
 *         userId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         reviewId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ReplyResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "Success"
 *         statusCode:
 *           type: integer
 *           example: 201
 *         data:
 *           type: object
 *           properties:
 *             reply:
 *               $ref: '#/components/schemas/Reply'
 */
