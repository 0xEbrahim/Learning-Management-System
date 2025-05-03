// backend/src/modules/Video/Video.swagger.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         title:
 *           type: string
 *           example: "Introduction to Node.js"
 *         videoUrl:
 *           type: string
 *           example: "https://res.cloudinary.com/.../video/upload/v1..."
 *         videoThumbnail:
 *           type: string
 *           example: "https://res.cloudinary.com/.../image/upload/v1..."
 *         videoLength:
 *           type: number
 *           example: 3600
 *         courseId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         sectionId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     VideoResponse:
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
 *             video:
 *               $ref: '#/components/schemas/Video'
 *
 *     VideosListResponse:
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
 *             videos:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *
 *     UploadVideoRequest:
 *       type: object
 *       required:
 *         - title
 *         - videoLength
 *         - sectionId
 *       properties:
 *         title:
 *           type: string
 *           minLength: 6
 *           maxLength: 300
 *           example: "Introduction to Node.js"
 *         videoLength:
 *           type: string
 *           example: "60"
 *         sectionId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *
 *     UpdateVideoRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 6
 *           maxLength: 300
 *           example: "Updated Video Title"
 *
 *     EditVideoRequest:
 *       type: object
 *       required:
 *         - videoLength
 *       properties:
 *         videoLength:
 *           type: string
 *           example: "60"
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
 *     videoIdParam:
 *       in: path
 *       name: videoId
 *       required: true
 *       schema:
 *         type: string
 *       description: The video ID
 */

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Video management endpoints
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/videos:
 *   post:
 *     summary: Upload a new video (Admin/Teacher only)
 *     tags: [Videos]
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
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Video thumbnail image
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file
 *               title:
 *                 type: string
 *                 example: "Introduction to Node.js"
 *               videoLength:
 *                 type: string
 *                 example: "60"
 *               sectionId:
 *                 type: string
 *                 example: "60f8d1f9a9b8c71f3c3e3e3e"
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoResponse'
 *       400:
 *         description: Missing thumbnail or video file
 *       401:
 *         description: Unauthorized or not owner
 *       403:
 *         description: Forbidden (not admin/teacher)
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/videos:
 *   get:
 *     summary: Get all videos for a course
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *     responses:
 *       200:
 *         description: List of videos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideosListResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/videos/{videoId}:
 *   get:
 *     summary: Get video by ID (Buyer only)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *       - $ref: '#/components/parameters/videoIdParam'
 *     responses:
 *       200:
 *         description: Video details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not buyer)
 *       404:
 *         description: Video not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/videos/{videoId}:
 *   patch:
 *     summary: Update video metadata (Admin/Teacher only)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *       - $ref: '#/components/parameters/videoIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVideoRequest'
 *     responses:
 *       200:
 *         description: Video updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized or not owner
 *       403:
 *         description: Forbidden (not admin/teacher)
 *       404:
 *         description: Video not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/videos/{videoId}:
 *   delete:
 *     summary: Delete a video (Admin/Teacher only)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *       - $ref: '#/components/parameters/videoIdParam'
 *     responses:
 *       200:
 *         description: Video deleted successfully
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
 *                   example: "Video deleted successfully"
 *       401:
 *         description: Unauthorized or not owner
 *       403:
 *         description: Forbidden (not admin/teacher)
 *       404:
 *         description: Video not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/videos/{videoId}/video:
 *   patch:
 *     summary: Update video file (Admin/Teacher only)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *       - $ref: '#/components/parameters/videoIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: New video file
 *               videoLength:
 *                 type: string
 *                 example: "60"
 *     responses:
 *       200:
 *         description: Video file updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoResponse'
 *       400:
 *         description: No video file provided
 *       401:
 *         description: Unauthorized or not owner
 *       403:
 *         description: Forbidden (not admin/teacher)
 *       404:
 *         description: Video not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/videos/{videoId}/thumbnail:
 *   patch:
 *     summary: Update video thumbnail (Admin/Teacher only)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *       - $ref: '#/components/parameters/videoIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New thumbnail image
 *     responses:
 *       200:
 *         description: Thumbnail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoResponse'
 *       400:
 *         description: No thumbnail image provided
 *       401:
 *         description: Unauthorized or not owner
 *       403:
 *         description: Forbidden (not admin/teacher)
 *       404:
 *         description: Video not found
 */
