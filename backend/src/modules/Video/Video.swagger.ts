// backend/src/modules/Video/Video.swagger.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       required:
 *         - title
 *         - videoUrl
 *         - videoThumbnail
 *         - videoLength
 *         - courseId
 *         - sectionId
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
 *           description: "Video length in seconds"
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
 *         message:
 *           type: string
 *           example: "Video updated successfully"
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
 *           description: "Video length in minutes"
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
 *           description: "Video length in minutes"
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
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *             required:
 *               - image
 *               - video
 *               - title
 *               - videoLength
 *               - sectionId
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Video thumbnail image (max 1 file)
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file (max 1 file)
 *               title:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 300
 *                 example: "Introduction to Node.js"
 *               videoLength:
 *                 type: string
 *                 description: "Video length in minutes"
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
 *         description: |
 *           Bad Request:
 *           - Missing thumbnail or video file
 *           - Invalid request body
 *           - Video title too short or too long
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User is not admin/teacher or not course author
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/videos:
 *   get:
 *     summary: Get all videos for a course
 *     description: Returns full video details for course owners, limited data for others
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
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/videos/{videoId}:
 *   get:
 *     summary: Get video by ID
 *     description: Returns full video details for course owners/buyers, limited data for others
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
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User doesn't have access to this video
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
 *         description: |
 *           Bad Request:
 *           - Invalid request body
 *           - Video title too short or too long
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User is not admin/teacher or not course author
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
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User is not admin/teacher or not course author
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
 *             required:
 *               - video
 *               - videoLength
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: New video file (max 1 file)
 *               videoLength:
 *                 type: string
 *                 description: "Video length in minutes"
 *                 example: "60"
 *     responses:
 *       200:
 *         description: Video file updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoResponse'
 *       400:
 *         description: |
 *           Bad Request:
 *           - No video file provided
 *           - Missing videoLength
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User is not admin/teacher or not course author
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
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New thumbnail image (max 1 file)
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
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User is not admin/teacher or not course author
 *       404:
 *         description: Video not found
 */
