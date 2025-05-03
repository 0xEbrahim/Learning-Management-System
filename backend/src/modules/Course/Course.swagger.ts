// backend/src/modules/Course/Course.swagger.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         publisherId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         name:
 *           type: string
 *           example: "Advanced JavaScript"
 *         price:
 *           type: number
 *           format: double
 *           example: 149.99
 *         description:
 *           type: string
 *           example: "Deep dive into JavaScript concepts"
 *         averageRatings:
 *           type: number
 *           format: double
 *           example: 4.5
 *         thumbnail:
 *           type: string
 *           example: "https://res.cloudinary.com/.../image/upload/v1..."
 *         purchased:
 *           type: integer
 *           example: 150
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         url:
 *           type: string
 *           example: "/courses/advanced-javascript"
 *         publisher:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "John Doe"
 *             avatar:
 *               type: string
 *               nullable: true
 *               example: "https://res.cloudinary.com/.../image/upload/v1..."
 *         categories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 example: "Programming"
 *
 *     CourseListResponse:
 *       type: object
 *       properties:
 *         courses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Course'
 *         size:
 *           type: integer
 *           example: 25
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
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The course ID
 *
 *     categoryIdParam:
 *       in: path
 *       name: categoryId
 *       schema:
 *         type: string
 *       description: The category ID (optional)
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
 *
 *     searchQuery:
 *       in: query
 *       name: q
 *       schema:
 *         type: string
 *       description: Search term
 *
 *     priceFilterQuery:
 *       in: query
 *       name: price
 *       schema:
 *         type: number
 *       description: Filter by maximum price
 *
 *     ratingsFilterQuery:
 *       in: query
 *       name: averageRatings
 *       schema:
 *         type: number
 *       description: Filter by minimum average ratings
 *
 *     purchasedFilterQuery:
 *       in: query
 *       name: purchased
 *       schema:
 *         type: integer
 *       description: Filter by minimum number of purchases
 */

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management endpoints
 */

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Create a new course (Teacher/Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - categories
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 25
 *                 example: "Advanced JavaScript"
 *               price:
 *                 type: string
 *                 example: "149.99"
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 example: "Deep dive into JavaScript concepts"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Programming", "Web Development"]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course created successfully
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
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not a teacher/admin)
 */

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Get all courses (paginated)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/paginationQuery'
 *       - $ref: '#/components/parameters/limitQuery'
 *       - $ref: '#/components/parameters/priceFilterQuery'
 *       - $ref: '#/components/parameters/ratingsFilterQuery'
 *       - $ref: '#/components/parameters/purchasedFilterQuery'
 *       - $ref: '#/components/parameters/categoryIdParam'
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseListResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/courses/search:
 *   get:
 *     summary: Search courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/searchQuery'
 *       - $ref: '#/components/parameters/priceFilterQuery'
 *       - $ref: '#/components/parameters/ratingsFilterQuery'
 *       - $ref: '#/components/parameters/purchasedFilterQuery'
 *     responses:
 *       200:
 *         description: List of matching courses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseListResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *       - $ref: '#/components/parameters/categoryIdParam'
 *     responses:
 *       200:
 *         description: Course details
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     summary: Delete a course (Teacher/Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *     responses:
 *       200:
 *         description: Course deleted successfully
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
 *                   example: "Course deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not owner/admin)
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   patch:
 *     summary: Update course details (Teacher/Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/courseIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 25
 *                 example: "Advanced JavaScript 2.0"
 *               price:
 *                 type: string
 *                 example: "199.99"
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 example: "Updated deep dive into JavaScript concepts"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Programming", "Web Development", "JavaScript"]
 *     responses:
 *       200:
 *         description: Course updated successfully
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not owner/admin)
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/v1/courses/{id}/thumbnail:
 *   patch:
 *     summary: Update course thumbnail (Teacher/Admin only)
 *     tags: [Courses]
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
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thumbnail updated successfully
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not owner/admin)
 *       404:
 *         description: Course not found
 */
