// backend/src/modules/Demo/Demo.swagger.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     Demo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         courseId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         url:
 *           type: string
 *           example: "https://res.cloudinary.com/.../video/upload/v1..."
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     DemoResponse:
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
 *             demo:
 *               $ref: '#/components/schemas/Demo'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "Error"
 *         statusCode:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: "Error message"
 *
 *   parameters:
 *     courseIdParam:
 *       in: path
 *       name: courseId
 *       required: true
 *       schema:
 *         type: string
 *       description: The course ID
 */

/**
 * @swagger
 * tags:
 *   name: Demo Videos
 *   description: Course demo video management endpoints
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/demo:
 *   post:
 *     summary: Upload a demo video for a course (Teacher/Admin only)
 *     tags: [Demo Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: The demo video file
 *     responses:
 *       201:
 *         description: Demo video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DemoResponse'
 *       400:
 *         description: Validation error or course doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not course author/admin)
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/demo:
 *   get:
 *     summary: Get demo video for a course
 *     tags: [Demo Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *     responses:
 *       200:
 *         description: Demo video details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DemoResponse'
 *       400:
 *         description: Course doesn't have a demo video
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/demo:
 *   delete:
 *     summary: Delete demo video for a course (Teacher/Admin only)
 *     tags: [Demo Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *     responses:
 *       200:
 *         description: Demo video deleted successfully
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
 *                   example: "Demo video deleted successfully"
 *       400:
 *         description: Course doesn't have a demo video
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not course author/admin)
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/demo:
 *   patch:
 *     summary: Update demo video for a course (Teacher/Admin only)
 *     tags: [Demo Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: The new demo video file
 *     responses:
 *       200:
 *         description: Demo video updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DemoResponse'
 *       400:
 *         description: Validation error or course doesn't have a demo video
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not course author/admin)
 *       404:
 *         description: Course not found
 */
