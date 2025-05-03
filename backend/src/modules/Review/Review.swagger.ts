// backend/src/modules/Review/Review.swagger.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
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
 *         rating:
 *           type: number
 *           format: float
 *           example: 4.5
 *         review:
 *           type: string
 *           example: "Great course with excellent content"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         author:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "John Doe"
 *             avatar:
 *               type: string
 *               example: "https://example.com/avatar.jpg"
 *
 *     ReviewResponse:
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
 *             review:
 *               $ref: '#/components/schemas/Review'
 *
 *     ReviewsListResponse:
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
 *             reviews:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *
 *     CreateReviewRequest:
 *       type: object
 *       required:
 *         - rating
 *         - review
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 4.5
 *         review:
 *           type: string
 *           example: "Great course with excellent content"
 *
 *     UpdateReviewRequest:
 *       type: object
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 4.5
 *           nullable: true
 *         review:
 *           type: string
 *           example: "Updated review content"
 *           nullable: true
 *
 *   parameters:
 *     courseIdParam:
 *       in: path
 *       name: courseId
 *       required: true
 *       schema:
 *         type: string
 *       description: The course ID
 *
 *     reviewIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The review ID
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
 *   name: Reviews
 *   description: Course review management
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/reviews:
 *   post:
 *     summary: Create a new review (Buyer only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         description: Validation error or invalid rating
 *       401:
 *         description: Unauthorized or not a buyer
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/reviews:
 *   get:
 *     summary: Get all reviews for a course
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *       - $ref: '#/components/parameters/paginationQuery'
 *       - $ref: '#/components/parameters/limitQuery'
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewsListResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/reviews/{id}:
 *   get:
 *     summary: Get a specific review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *       - $ref: '#/components/parameters/reviewIdParam'
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course or review not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/reviews/{id}:
 *   patch:
 *     summary: Update a review (Review owner only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *       - $ref: '#/components/parameters/reviewIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewRequest'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized or not review owner
 *       404:
 *         description: Course or review not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/reviews/{id}:
 *   delete:
 *     summary: Delete a review (Review owner only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *       - $ref: '#/components/parameters/reviewIdParam'
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Review deleted successfully"
 *       401:
 *         description: Unauthorized or not review owner
 *       404:
 *         description: Course or review not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/reviews/{id}/replies:
 *   post:
 *     summary: Reply to a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *       - $ref: '#/components/parameters/reviewIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Thank you for your feedback!"
 *     responses:
 *       201:
 *         description: Reply created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     reply:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         comment:
 *                           type: string
 *                         userId:
 *                           type: string
 *                         reviewId:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course or review not found
 */
