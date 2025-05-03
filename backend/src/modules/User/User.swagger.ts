// backend/src/modules/User/User.swagger.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         avatar:
 *           type: string
 *           example: "https://res.cloudinary.com/.../image/upload/v1..."
 *         role:
 *           type: string
 *           enum: ["STUDENT", "TEACHER", "ADMIN"]
 *           example: "STUDENT"
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         courses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               averageRatings:
 *                 type: number
 *         publishedCourses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Course'
 *
 *     UserResponse:
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
 *             user:
 *               $ref: '#/components/schemas/User'
 *
 *     UsersListResponse:
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
 *           example: 100
 *         data:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 *     UpdateUserRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 6
 *           maxLength: 20
 *           example: "Updated Name"
 *
 *     UpdateProfilePicRequest:
 *       type: object
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 *           description: Profile picture file
 *         remove:
 *           type: boolean
 *           description: Set to true to remove profile picture
 *
 *   parameters:
 *     userIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The user ID
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
 *     sortQuery:
 *       in: query
 *       name: sort
 *       schema:
 *         type: string
 *       description: Sort by field (prefix with - for descending)
 *
 *     fieldsQuery:
 *       in: query
 *       name: fields
 *       schema:
 *         type: string
 *       description: Comma-separated list of fields to return
 *
 *     searchQuery:
 *       in: query
 *       name: q
 *       schema:
 *         type: string
 *       description: Search term for user names
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/paginationQuery'
 *       - $ref: '#/components/parameters/limitQuery'
 *       - $ref: '#/components/parameters/sortQuery'
 *       - $ref: '#/components/parameters/fieldsQuery'
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/users/search:
 *   get:
 *     summary: Search users by name
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/searchQuery'
 *       - $ref: '#/components/parameters/paginationQuery'
 *       - $ref: '#/components/parameters/limitQuery'
 *     responses:
 *       200:
 *         description: List of matching users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/users/{id}/update:
 *   patch:
 *     summary: Update user profile (Owner only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized or not owner
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/users/{id}/update/pic:
 *   patch:
 *     summary: Update profile picture (Owner only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfilePicRequest'
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: No file provided or invalid request
 *       401:
 *         description: Unauthorized or not owner
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate account (Owner only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     responses:
 *       200:
 *         description: Account deactivated successfully
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
 *                   example: "Account deactivated successfully and will be deleted permanently after 30 days"
 *       401:
 *         description: Unauthorized or not owner
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/users/{userId}/orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *       - $ref: '#/components/parameters/paginationQuery'
 *       - $ref: '#/components/parameters/limitQuery'
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderListResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
